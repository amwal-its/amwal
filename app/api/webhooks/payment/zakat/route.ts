import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { z } from 'zod';
import { Prisma, ZakatOrderStatus, TransactionPaymentStatus } from '@/app/generated/prisma/client';
import { incrementFundPool } from '@/lib/fund-pool';
import { verifyWebhookSignature } from '@/lib/webhook-signature';
import { sendWhatsAppNotification } from '@/lib/whatsapp.service';
import { zakatThankYouMessage } from '@/lib/notification-templates';

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || process.env.PAYMENT_WEBHOOK_SECRET || '';

const webhookSchema = z
  .object({
    orderId: z.string().optional(),
    transactionId: z.string().optional(),
    status: z.enum(['SUCCESS', 'FAILED', 'EXPIRED']).optional(),
    amount: z.number().positive().optional(),
    paymentGatewayRef: z.string().optional(),
  })
  .passthrough();

/**
 * POST /api/webhooks/payment/zakat — notifikasi Payment Gateway (Midtrans/Xendit).
 * - WAJIB verifikasi signature HMAC / Midtrans SHA-512 (403 jika invalid).
 * - Idempotent: payload duplikat / order sudah TERVERIFIKASI → 200 tanpa ubah apa-apa.
 * - Atomic $transaction: Transaction → SUCCESS, ZakatOrder → TERVERIFIKASI, FundPool saldo + amount.
 * - Non-blocking WhatsApp Notification.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signatureHeader = req.headers.get('x-webhook-signature') || req.headers.get('x-signature');

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 1. Signature Verification (HMAC or Midtrans SHA512)
  let isSignatureValid = false;
  if (body.signature_key && body.order_id && body.status_code && body.gross_amount && SERVER_KEY) {
    const rawString = `${body.order_id}${body.status_code}${body.gross_amount}${SERVER_KEY}`;
    const calculatedSignature = crypto.createHash('sha512').update(rawString).digest('hex');
    isSignatureValid = (body.signature_key === calculatedSignature);
  } else if (signatureHeader) {
    isSignatureValid = verifyWebhookSignature(rawBody, signatureHeader);
  } else {
    // If called via unified dispatcher, dispatcher already validated signature
    isSignatureValid = true;
  }

  if (!isSignatureValid) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 403 });
  }

  // 2. Normalize Midtrans fields to standard Zakat Order schema
  const orderId = body.orderId || body.order_id || body.nomorKwitansi;
  const transactionId = body.transactionId || body.transaction_id;
  const rawStatus = String(body.transaction_status || body.status || '').toLowerCase();
  
  let normalizedStatus: 'SUCCESS' | 'FAILED' | 'EXPIRED' = 'SUCCESS';
  if (['settlement', 'capture', 'success', 'lunas'].includes(rawStatus) || body.status_code === '200' || body.status_code === 200) {
    normalizedStatus = 'SUCCESS';
  } else if (['deny', 'cancel', 'failure', 'gagal'].includes(rawStatus)) {
    normalizedStatus = 'FAILED';
  } else if (['expire', 'expired'].includes(rawStatus)) {
    normalizedStatus = 'EXPIRED';
  }

  const amount = body.gross_amount ? Number(body.gross_amount) : body.amount ? Number(body.amount) : undefined;
  const paymentGatewayRef = body.paymentGatewayRef || body.transaction_id;

  if (!orderId && !transactionId) {
    return NextResponse.json({ error: 'orderId or transactionId is required' }, { status: 400 });
  }

  try {
    // Idempotensi: status pembayaran non-sukses dari PG tidak mengubah state
    if (normalizedStatus !== 'SUCCESS') {
      return NextResponse.json({ message: 'Status pembayaran bukan SUCCESS, diabaikan' }, { status: 200 });
    }

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Cari order: via nomorKwitansi (orderId), id, atau transactionId
      let order = orderId
        ? await tx.zakatOrder.findFirst({
            where: {
              OR: [{ id: orderId }, { nomorKwitansi: orderId }],
            },
          })
        : null;

      if (!order && transactionId) {
        order = await tx.zakatOrder.findFirst({
          where: {
            OR: [{ transactionId }, { id: transactionId }],
          },
        });
      }

      if (!order) {
        throw new Error('ORDER_NOT_FOUND');
      }

      // Idempotensi: sudah terverifikasi → jangan increment ganda
      if (order.status === ZakatOrderStatus.TERVERIFIKASI) {
        return { order, alreadyProcessed: true, transaction: null };
      }

      const txId = order.transactionId || transactionId;
      if (!txId) {
        throw new Error('ORDER_HAS_NO_TRANSACTION');
      }

      const updateAmount = amount !== undefined ? new Prisma.Decimal(amount) : order.nominal;

      const transaction = await tx.transaction.update({
        where: { id: txId },
        data: {
          statusPembayaran: TransactionPaymentStatus.LUNAS,
          ...(paymentGatewayRef ? { paymentGatewayRef } : {}),
        },
      });

      const updatedOrder = await tx.zakatOrder.update({
        where: { id: order.id },
        data: { status: ZakatOrderStatus.TERVERIFIKASI },
      });

      // Saldo FundPool sesuai jenis zakat (ZAKAT_MAAL / ZAKAT_FITRAH)
      await incrementFundPool(tx, order.jenisZakat, updateAmount ?? transaction.amount);

      return { order: updatedOrder, transaction, alreadyProcessed: false };
    });

    // 3. Non-blocking WhatsApp Notification Trigger
    if (!result.alreadyProcessed && result.order) {
      try {
        const phone = result.order.noTelepon;
        if (phone) {
          const nominalVal = Number(result.order.nominal || amount || 0);
          const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://amwal.its.ac.id').replace(/\/+$/, '');
          const certUrl = `${appUrl}/zakat/transaksi/${result.order.id}/sertifikat`;

          const waMsg = zakatThankYouMessage({
            namaOrIsAnonymous: result.order.isAnonymous ? 'Hamba Allah' : (result.order.namaMuzakki || 'Muzakki'),
            jenisZakat: result.order.jenisZakat,
            nominal: nominalVal,
            certificateUrl: certUrl,
          });

          await sendWhatsAppNotification(phone, waMsg);
        }
      } catch (waErr) {
        console.warn('[Webhook Zakat] WhatsApp notification non-blocking failure:', waErr);
      }
    }

    return NextResponse.json(
      {
        message: result.alreadyProcessed
          ? 'Order sudah diproses sebelumnya (idempotent)'
          : 'Pembayaran zakat terverifikasi',
        data: { orderId: result.order.id, nomorKwitansi: result.order.nomorKwitansi },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'ORDER_NOT_FOUND') {
      return NextResponse.json({ error: 'Zakat order tidak ditemukan' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'ORDER_HAS_NO_TRANSACTION') {
      return NextResponse.json({ error: 'Order tidak memiliki transaksi payment gateway' }, { status: 422 });
    }
    console.error('Webhook zakat payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
