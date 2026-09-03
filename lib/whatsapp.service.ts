/**
 * WhatsApp Notification Service via Standalone Baileys Microservice
 * 
 * Communicates with the external Baileys daemon (port 4001) using internal secret authentication.
 * Non-blocking: errors or timeouts are safely handled and return false without throwing.
 */

export async function sendWhatsAppNotification(phone: string, message: string): Promise<boolean> {
  try {
    const baseUrl = (process.env.BAILEYS_SERVICE_URL || 'http://localhost:4001').replace(/\/+$/, '');
    const internalSecret = process.env.INTERNAL_SECRET || 'amwal_internal_secret_key_2026';

    if (!phone || !message) {
      console.warn('[WhatsAppService] Missing phone or message, skipping notification');
      return false;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseUrl}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': internalSecret,
      },
      body: JSON.stringify({ phone, message }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok || response.status !== 200) {
      const errorText = await response.text().catch(() => '');
      console.warn(`[WhatsAppService] Failed to send message to ${phone}: HTTP ${response.status} - ${errorText}`);
      return false;
    }

    const data = await response.json().catch(() => null);
    if (!data || data.success !== true) {
      console.warn(`[WhatsAppService] Baileys response indicated failure for ${phone}:`, data);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('[WhatsAppService] Error or timeout sending WhatsApp notification:', error);
    return false;
  }
}
