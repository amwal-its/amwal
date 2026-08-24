import { NextRequest, NextResponse } from 'next/server';
import { POST as handleWakafWebhook } from './wakaf/route';
import { POST as handleZakatWebhook } from './zakat/route';
import { prisma } from '@/lib/prisma';

/**
 * Unified Payment Gateway Webhook Entry Point: POST /api/webhooks/payment
 * Compatible with Single Callback URL setting in Midtrans / Xendit dashboard.
 * Inspects payload and dispatches to specific domain handler (Wakaf, Zakat, or Qurban).
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let body: any = {};
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const orderId = String(body.order_id || body.orderId || body.transactionId || body.id || '');

    // 1. Dispatch by Order Identifier Prefix
    if (orderId.startsWith('WKF-') || body.waqfOrderId || body.waqfProgramId) {
      const clonedReq = new NextRequest(req.url, {
        method: 'POST',
        headers: req.headers,
        body: rawBody,
      });
      return handleWakafWebhook(clonedReq);
    }

    if (orderId.startsWith('ZKT-') || body.zakatOrderId) {
      const clonedReq = new NextRequest(req.url, {
        method: 'POST',
        headers: req.headers,
        body: rawBody,
      });
      return handleZakatWebhook(clonedReq);
    }

    // 2. Fallback: Database lookup by transactionId or orderId
    if (orderId) {
      const waqfOrder = await prisma.waqfOrder.findFirst({
        where: {
          OR: [{ id: orderId }, { nomorKwitansi: orderId }, { transactionId: orderId }],
        },
      });

      if (waqfOrder) {
        const clonedReq = new NextRequest(req.url, {
          method: 'POST',
          headers: req.headers,
          body: rawBody,
        });
        return handleWakafWebhook(clonedReq);
      }

      const zakatOrder = await prisma.zakatOrder.findFirst({
        where: {
          OR: [{ id: orderId }, { nomorKwitansi: orderId }, { transactionId: orderId }],
        },
      });

      if (zakatOrder) {
        const clonedReq = new NextRequest(req.url, {
          method: 'POST',
          headers: req.headers,
          body: rawBody,
        });
        return handleZakatWebhook(clonedReq);
      }
    }

    // Default: Forward to wakaf handler for signature and format verification
    const clonedReq = new NextRequest(req.url, {
      method: 'POST',
      headers: req.headers,
      body: rawBody,
    });
    return handleWakafWebhook(clonedReq);
  } catch (error) {
    console.error('Error in unified payment webhook:', error);
    return NextResponse.json({ error: 'Internal server error in webhook dispatcher' }, { status: 500 });
  }
}
