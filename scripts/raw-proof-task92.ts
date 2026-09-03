import 'dotenv/config';
import { sendWhatsAppNotification } from '../lib/whatsapp.service';

async function main() {
  console.log('=== RAW PROOF TASK 9.2: BAILEYS WA NOTIFICATION VIA RAILWAY ===');
  console.log('Target Service URL:', process.env.BAILEYS_SERVICE_URL || 'https://amwal-baileys-service-production.up.railway.app');

  const testPhone = '081234567890';
  const testMessage = "Assalamu'alaikum, ini adalah verifikasi koneksi live Baileys Engine di Railway (Sprint 9 Audit Amwal HETI).";

  const startTime = Date.now();
  const result = await sendWhatsAppNotification(testPhone, testMessage);
  const duration = Date.now() - startTime;

  console.log('Execution Duration:', `${duration}ms`);
  console.log('sendWhatsAppNotification returned:', result);
  console.log('Graceful Non-Blocking Execution: SUCCESS (No unhandled exception thrown).');
}

main().catch(console.error);
