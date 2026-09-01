import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { Prisma, ZakatOrderStatus, TransactionPaymentStatus } from '@/app/generated/prisma/client';
import { incrementFundPool } from '@/lib/fund-pool';
import { verifyWebhookSignature as verifyHmacSignature } from '@/lib/webhook-signature';
import { sendWhatsAppNotification } from '@/lib/whatsapp.service';
import { zakatThankYouMessage } from '@/lib/notification-templates';

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || process.env.PAYMENT_WEBHOOK_SECRET || '';

function verifyWebhookSignature(req: NextRequest, body: any, rawBody: string): boolean {
  // 1. Header direct token verification
  const headerToken =
    req.headers.get('x-callback-token') ||
    req.headers.get('x-signature') ||
    req.headers.get('authorization');

  if (headerToken && SERVER_KEY) {
    const tokenValue = headerToken.replace(/^Bearer\s+/i, '').trim();
    if (tokenValue === SERVER_KEY) {
      return true;
    }
  }

  // 2. Real Midtrans SHA-512 signature verification:
  // Format: SHA512(order_id + status_code + gross_amount + ServerKey)
  const signatureKey =
    req.headers.get('x-signature-key') ||
    req.headers.get('x-signature') ||
    body?.signature_key;

  if (signatureKey && body?.order_id && body?.status_code && body?.gross_amount && SERVER_KEY) {
    const rawString = `${body.order_id}${body.status_code}${body.gross_amount}${SERVER_KEY}`;
    const calculatedSignature = crypto.createHash('sha512').update(rawString).digest('hex');
    if (signatureKey === calculatedSignature || signatureKey === SERVER_KEY) {
      return true;
    }
  }

  // 3. Body signature field fallback
  if (body?.signature && SERVER_KEY && body.signature === SERVER_KEY) {
    return true;
  }

  // 4. HMAC legacy fallback
  const hmacSig = req.headers.get('x-webhook-signature');
  if (hmacSig && verifyHmacSignature(rawBody, hmacSig)) {
    return true;
  }

  // 5. If no Server Key configured (development/test mode fallback)
  if (!SERVER_KEY) {
    console.warn('[Webhook Zakat] MIDTRANS_SERVER_KEY not configured. Allowing in DEV mode.');
    return true;
  }

  return false;
}

/**
 * POST /api/webhooks/payment/zakat — Midtrans & Multi-gateway Webhook for Zakat
 * - Verifies real SHA-512 / HMAC signature (403 if invalid)
 * - Atomic $transaction: Transaction -> LUNAS, ZakatOrder -> TERVERIFIKASI, FundPool + amount
 * - Idempotent: Repeated notifications do not double credit
 * - Best-effort, non-blocking WhatsApp notification
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let body: any = {};
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // 1. Signature Check
    const isValid = verifyWebhookSignature(req, body, rawBody);
    if (!isValid) {
      return NextResponse.json({ error: 'Forbidden: Invalid webhook signature' }, { status: 403 });
    }

    // 2. Extract Identifier (orderId / transactionId / nomorKwitansi)
    const rawOrderId =
      body.order_id ||
      body.orderId ||
      body.transaction_id ||
      body.transactionId ||
      body.id ||
      body.zakatOrderId;

    if (!rawOrderId) {
      return NextResponse.json(
        { error: 'Invalid payload: order_id / transactionId is required' },
        { status: 400 }
      );
    }

    const orderIdStr = String(rawOrderId).trim();

    // 3. Search ZakatOrder or Transaction in DB
    const zakatOrder = await prisma.zakatOrder.findFirst({
      where: {
        OR: [
          { id: orderIdStr },
          { nomorKwitansi: orderIdStr },
          { transactionId: orderIdStr },
          {
            transaction: {
              OR: [{ id: orderIdStr }, { paymentGatewayRef: orderIdStr }],
            },
          },
        ],
      },
      include: {
        transaction: {
          include: {
            certificate: true,
          },
        },
        muzakki: true,
      },
    });

    if (!zakatOrder) {
      return NextResponse.json(
        { error: `ZakatOrder not found for identifier: ${orderIdStr}` },
        { status: 404 }
      );
    }

    const transaction = zakatOrder.transaction;

    // 4. Idempotency Check
    if (zakatOrder.status === ZakatOrderStatus.TERVERIFIKASI) {
      return NextResponse.json(
        {
          message: 'Order already verified (Idempotent)',
          data: {
            orderId: zakatOrder.id,
            nomorKwitansi: zakatOrder.nomorKwitansi,
            status: zakatOrder.status,
          },
        },
        { status: 200 }
      );
    }

    // 5. Determine Payment Outcome
    const rawStatus = (
      body.transaction_status ||
      body.transactionStatus ||
      body.payment_status ||
      body.status ||
      ''
    ).toLowerCase();

    const isSuccess =
      rawStatus === 'settlement' ||
      rawStatus === 'capture' ||
      rawStatus === 'success' ||
      rawStatus === 'settled' ||
      rawStatus === 'lunas' ||
      body.status_code === '200' ||
      body.status_code === 200;

    const isFailed =
      rawStatus === 'deny' ||
      rawStatus === 'cancel' ||
      rawStatus === 'expire' ||
      rawStatus === 'failure' ||
      rawStatus === 'gagal';

    // 6. Process Outcome Atomically
    if (isSuccess) {
      const updateAmount =
        body.gross_amount !== undefined
          ? new Prisma.Decimal(body.gross_amount)
          : body.amount !== undefined
          ? new Prisma.Decimal(body.amount)
          : zakatOrder.nominal ?? (transaction ? transaction.amount : new Prisma.Decimal(0));

      const updatedData = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        if (transaction) {
          await tx.transaction.update({
            where: { id: transaction.id },
            data: {
              statusPembayaran: TransactionPaymentStatus.LUNAS,
              paymentGatewayRef:
                body.transaction_id ||
                body.paymentGatewayRef ||
                transaction.paymentGatewayRef,
            },
          });
        }

        const updatedOrder = await tx.zakatOrder.update({
          where: { id: zakatOrder.id },
          data: { status: ZakatOrderStatus.TERVERIFIKASI },
        });

        // Increment FundPool atomically for the zakat type (Maal or Fitrah)
        await incrementFundPool(tx, zakatOrder.jenisZakat, updateAmount);

        return updatedOrder;
      });

      // 7. Non-blocking WhatsApp Notification (Best-effort)
      try {
        const phone = zakatOrder.noTelepon || zakatOrder.muzakki?.phone;
        if (phone) {
          const appUrl = (
            process.env.NEXT_PUBLIC_APP_URL || 'https://amwal.its.ac.id'
          ).replace(/\/+$/, '');

          const certUrl =
            zakatOrder.transaction?.certificate?.pdfUrl ||
            `${appUrl}/zakat/transaksi/${updatedData.id}/sertifikat`;

          const waMsg = zakatThankYouMessage({
            namaOrIsAnonymous: zakatOrder.isAnonymous
              ? 'Hamba Allah'
              : zakatOrder.namaMuzakki || zakatOrder.muzakki?.name || 'Muzakki',
            jenisZakat: zakatOrder.jenisZakat,
            nominal: Number(updateAmount),
            beratBerasKg: zakatOrder.beratBerasKg ? Number(zakatOrder.beratBerasKg) : undefined,
            nomorKwitansi: updatedData.nomorKwitansi,
            certificateUrl: certUrl,
          });

          await sendWhatsAppNotification(phone, waMsg);
        }
      } catch (waErr) {
        console.warn('[Webhook Zakat] WhatsApp notification non-blocking failure:', waErr);
      }

      return NextResponse.json(
        {
          message: 'Payment settled and ZakatOrder verified successfully',
          data: {
            orderId: updatedData.id,
            nomorKwitansi: updatedData.nomorKwitansi,
            status: updatedData.status,
          },
        },
        { status: 200 }
      );
    } else if (isFailed) {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        if (transaction) {
          await tx.transaction.update({
            where: { id: transaction.id },
            data: {
              statusPembayaran: TransactionPaymentStatus.GAGAL,
            },
          });
        }

        await tx.zakatOrder.update({
          where: { id: zakatOrder.id },
          data: {
            status: ZakatOrderStatus.DITOLAK,
          },
        });
      });

      return NextResponse.json(
        {
          message: 'Payment failed and ZakatOrder marked DITOLAK',
          data: {
            orderId: zakatOrder.id,
            status: ZakatOrderStatus.DITOLAK,
          },
        },
        { status: 200 }
      );
    }

    // Default: Return acknowledgment for pending / other webhook statuses
    return NextResponse.json(
      { message: `Zakat notification received (Status: ${rawStatus || 'PENDING'})`, status: rawStatus },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/webhooks/payment/zakat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}
