import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma, ZakatOrderStatus, TransactionPaymentStatus } from '@/app/generated/prisma/client';
import { incrementFundPool } from '@/lib/fund-pool';
import { verifyWebhookSignature } from '@/lib/webhook-signature';

const webhookSchema = z
  .object({
    // Wajib: salah satu dari orderId (nomorKwitansi) / transactionId
    orderId: z.string().optional(),
    transactionId: z.string().optional(),
    status: z.enum(['SUCCESS', 'FAILED', 'EXPIRED']),
    amount: z.number().positive().optional(),
    paymentGatewayRef: z.string().optional(),
  })
  .refine((d) => d.orderId || d.transactionId, {
    message: 'orderId atau transactionId wajib diisi',
    path: ['orderId'],
  });

/**
 * POST /api/webhooks/payment/zakat — notifikasi Payment Gateway (Midtrans/Xendit).
 * - WAJIB verifikasi signature HMAC (403 jika invalid).
 * - Idempotent: payload duplikat / order sudah TERVERIFIKASI → 200 tanpa ubah apa-apa.
 * - Atomic $transaction: Transaction → SUCCESS, ZakatOrder → TERVERIFIKASI,
 *   FundPool saldo + amount.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-webhook-signature');

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = webhookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
  }

  const { orderId, transactionId, status, amount, paymentGatewayRef } = parsed.data;

  try {
    // Idempotensi: status pembayaran non-sukses dari PG tidak mengubah state
    if (status !== 'SUCCESS') {
      return NextResponse.json({ message: 'Status pembayaran bukan SUCCESS, diabaikan' }, { status: 200 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Cari order: via nomorKwitansi (orderId) atau transactionId
      let order = orderId
        ? await tx.zakatOrder.findUnique({ where: { nomorKwitansi: orderId } })
        : null;
      if (!order && transactionId) {
        order = await tx.zakatOrder.findUnique({ where: { transactionId } });
      }

      if (!order) {
        throw new Error('ORDER_NOT_FOUND');
      }

      // Idempotensi: sudah terverifikasi → jangan increment ganda
      if (order.status === ZakatOrderStatus.TERVERIFIKASI) {
        return { order, alreadyProcessed: true };
      }

      if (!order.transactionId) {
        throw new Error('ORDER_HAS_NO_TRANSACTION');
      }

      const updateAmount = amount !== undefined ? new Prisma.Decimal(amount) : order.nominal;

      const transaction = await tx.transaction.update({
        where: { id: order.transactionId },
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
