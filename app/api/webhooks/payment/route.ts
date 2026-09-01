import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { POST as handleWakafWebhook } from './wakaf/route';
import { POST as handleZakatWebhook } from './zakat/route';
import { POST as handleQurbanWebhook } from './qurban/route';
import { prisma } from '@/lib/prisma';

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || process.env.PAYMENT_WEBHOOK_SECRET || '';

function verifyMidtransSignature(req: NextRequest, body: any): boolean {
  // 1. Direct header verification (X-Callback-Token / Authorization)
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

  // 2. Real Midtrans SHA-512 signature_key verification:
  // Format: SHA512(order_id + status_code + gross_amount + ServerKey)
  if (body && body.signature_key && body.order_id && body.status_code && body.gross_amount) {
    if (!SERVER_KEY) {
      console.warn('[Webhook] MIDTRANS_SERVER_KEY not configured in environment');
      return false;
    }
    const rawString = `${body.order_id}${body.status_code}${body.gross_amount}${SERVER_KEY}`;
    const calculatedSignature = crypto.createHash('sha512').update(rawString).digest('hex');
    return body.signature_key === calculatedSignature;
  }

  // 3. Fallback for body signature field
  if (body && body.signature && SERVER_KEY && body.signature === SERVER_KEY) {
    return true;
  }

  return false;
}

/**
 * Unified Payment Gateway Webhook Entry Point: POST /api/webhooks/payment
 * Compatible with Single Callback URL setting in Midtrans / Xendit dashboard.
 * Verifies real SHA-512 signature and dispatches to specific domain handler (Wakaf, Zakat, or Qurban).
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

    // Midtrans Real Signature Verification
    if (body.signature_key || body.signature || req.headers.get('x-callback-token')) {
      const isValid = verifyMidtransSignature(req, body);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Forbidden: Invalid Midtrans signature_key or callback token' },
          { status: 403 }
        );
      }
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

    if (orderId.startsWith('QRB-') || body.qurbanOrderId) {
      const clonedReq = new NextRequest(req.url, {
        method: 'POST',
        headers: req.headers,
        body: rawBody,
      });
      return handleQurbanWebhook(clonedReq);
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

      const qurbanOrder = await prisma.qurbanOrder.findFirst({
        where: {
          OR: [{ id: orderId }, { transactionId: orderId }],
        },
      });

      if (qurbanOrder) {
        const clonedReq = new NextRequest(req.url, {
          method: 'POST',
          headers: req.headers,
          body: rawBody,
        });
        return handleQurbanWebhook(clonedReq);
      }
    }

    // Default: Forward to wakaf handler for domain processing
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
