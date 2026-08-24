import { createHmac, timingSafeEqual } from 'crypto';

// HMAC-SHA256 signature webhook Payment Gateway (mirip Xendit callback token).
// Secret wajib diset di env `PAYMENT_WEBHOOK_SECRET`. Signature dikirim
// sebagai header `x-webhook-signature` (hex HMAC-SHA256 dari raw body).
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) {
    console.error('PAYMENT_WEBHOOK_SECRET belum diset di environment');
    return false;
  }
  if (!signatureHeader) return false;

  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(signatureHeader);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
