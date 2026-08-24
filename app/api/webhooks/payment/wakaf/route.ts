import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { TransactionPaymentStatus, WaqfOrderStatus, Prisma } from '@/app/generated/prisma/client';

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || process.env.PAYMENT_WEBHOOK_SECRET || 'secret_webhook_key_123';

function verifyWebhookSignature(req: NextRequest, body: any): boolean {
  // 1. Header verification (X-Callback-Token, X-Signature, Authorization)
  const headerToken =
    req.headers.get('x-callback-token') ||
    req.headers.get('x-signature') ||
    req.headers.get('authorization');

  if (headerToken) {
    const tokenValue = headerToken.replace(/^Bearer\s+/i, '').trim();
    if (tokenValue === SERVER_KEY) {
      return true;
    }
  }

  // 2. Midtrans SHA512 signature_key verification
  // Format Midtrans: SHA512(order_id + status_code + gross_amount + ServerKey)
  if (body && body.signature_key && body.order_id && body.status_code && body.gross_amount) {
    const rawString = `${body.order_id}${body.status_code}${body.gross_amount}${SERVER_KEY}`;
    const calculatedSignature = crypto.createHash('sha512').update(rawString).digest('hex');
    if (body.signature_key === calculatedSignature) {
      return true;
    }
  }

  // 3. Body signature field fallback
  if (body && body.signature && body.signature === SERVER_KEY) {
    return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Signature & Security Guard Check
    const isValid = verifyWebhookSignature(req, body);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Forbidden: Invalid signature or authorization token' },
        { status: 403 }
      );
    }

    // 2. Extract Identifier (orderId / transactionId / nomorKwitansi)
    const rawOrderId = body.order_id || body.orderId || body.transaction_id || body.transactionId;
    if (!rawOrderId) {
      return NextResponse.json(
        { error: 'Invalid payload: order_id / transaction_id is required' },
        { status: 400 }
      );
    }

    const orderIdStr = String(rawOrderId).trim();

    // 3. Search WaqfOrder or Transaction in DB
    let waqfOrder = await prisma.waqfOrder.findFirst({
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
        transaction: true,
      },
    });

    const transaction = waqfOrder?.transaction || null;

    if (!waqfOrder) {
      return NextResponse.json(
        { error: `WaqfOrder not found for identifier: ${orderIdStr}` },
        { status: 404 }
      );
    }

    // 4. Resilience & Idempotency Check
    // If order is already settled/verified, return 200 OK without re-incrementing ledger
    if (waqfOrder.status === WaqfOrderStatus.TERVERIFIKASI) {
      return NextResponse.json(
        {
          message: 'Webhook processed (Idempotent: Order is already TERVERIFIKASI)',
          data: {
            orderId: waqfOrder.id,
            nomorKwitansi: waqfOrder.nomorKwitansi,
            status: waqfOrder.status,
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

    // 6. Execute Atomic Updates inside $transaction
    if (isSuccess) {
      const updatedData = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Update Transaction if linked
        if (transaction) {
          await tx.transaction.update({
            where: { id: transaction.id },
            data: {
              statusPembayaran: TransactionPaymentStatus.LUNAS,
              paymentGatewayRef: body.transaction_id || body.paymentGatewayRef || transaction.paymentGatewayRef,
            },
          });
        }

        // Update WaqfOrder status to TERVERIFIKASI
        const updatedOrder = await tx.waqfOrder.update({
          where: { id: waqfOrder.id },
          data: {
            status: WaqfOrderStatus.TERVERIFIKASI,
          },
        });

        // Determine nominal to increment in WaqfPrincipalLedger
        const nominalVal = waqfOrder.nominal
          ? Number(waqfOrder.nominal)
          : waqfOrder.nilaiTaksiranRupiah
          ? Number(waqfOrder.nilaiTaksiranRupiah)
          : transaction
          ? Number(transaction.amount)
          : Number(body.gross_amount || body.amount || 0);

        // Atomic Increment on WaqfPrincipalLedger
        await tx.waqfPrincipalLedger.upsert({
          where: { waqfProgramId: waqfOrder.waqfProgramId },
          create: {
            waqfProgramId: waqfOrder.waqfProgramId,
            pokokDanaTerkumpul: nominalVal,
            hasilInvestasiTersalurkan: 0,
          },
          update: {
            pokokDanaTerkumpul: { increment: nominalVal },
          },
        });

        return updatedOrder;
      });

      return NextResponse.json(
        {
          message: 'Payment settled and WaqfOrder verified successfully',
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

        await tx.waqfOrder.update({
          where: { id: waqfOrder.id },
          data: {
            status: WaqfOrderStatus.DITOLAK,
          },
        });
      });

      return NextResponse.json(
        {
          message: 'Payment failed and WaqfOrder marked DITOLAK',
          data: {
            orderId: waqfOrder.id,
            status: WaqfOrderStatus.DITOLAK,
          },
        },
        { status: 200 }
      );
    }

    // Default / Pending notification acknowledgment
    return NextResponse.json(
      { message: `Notification received (Status: ${rawStatus})`, status: rawStatus },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/webhooks/payment/wakaf:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
