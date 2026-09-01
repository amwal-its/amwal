/**
 * WhatsApp Notification Service (Client Layer for standalone Baileys microservice)
 *
 * Requirements:
 * - Best-effort HTTP client communicating with `amwal-baileys-service`
 * - Short timeout (5s) so it never hangs payment webhooks
 * - Resilient: Failures are caught and logged; returns boolean without throwing
 * - Normalizes Indonesian phone numbers (08xxx / +628xxx -> 628xxx)
 */

export interface SendWhatsAppOptions {
  timeoutMs?: number;
  priority?: 'high' | 'normal' | 'low';
}

/**
 * Normalizes phone number into international WhatsApp JID format (e.g. 628123456789)
 */
export function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '628' + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Dispatches a WhatsApp text message via the standalone Baileys engine service.
 * Never throws an error — returns `true` on success and `false` on failure.
 */
export async function sendWhatsAppNotification(
  phoneNumber: string,
  message: string,
  options: SendWhatsAppOptions = {}
): Promise<boolean> {
  if (!phoneNumber || !message) {
    console.warn('[WhatsApp Service] Empty phone number or message provided');
    return false;
  }

  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  if (!normalizedPhone || normalizedPhone.length < 8) {
    console.warn('[WhatsApp Service] Invalid normalized phone number:', phoneNumber);
    return false;
  }

  const baseUrl = (
    process.env.BAILEYS_SERVICE_URL ||
    process.env.WHATSAPP_SERVICE_URL ||
    'http://localhost:4001'
  ).replace(/\/+$/, '');

  const secret =
    process.env.BAILEYS_INTERNAL_SECRET ||
    process.env.INTERNAL_SERVICE_SECRET ||
    process.env.WHATSAPP_SERVICE_SECRET ||
    'amwal-secret-key';

  const timeoutMs = options.timeoutMs ?? 5000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': secret,
      },
      body: JSON.stringify({
        phoneNumber: normalizedPhone,
        phone: normalizedPhone,
        message,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.warn(
        `[WhatsApp Service] Baileys service returned HTTP ${response.status}: ${errorText}`
      );
      return false;
    }

    return true;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`[WhatsApp Service] Request timed out after ${timeoutMs}ms to ${baseUrl}`);
    } else {
      console.warn('[WhatsApp Service] Failed to send WhatsApp notification:', error);
    }
    return false;
  }
}
