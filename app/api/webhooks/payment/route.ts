import { NextRequest } from 'next/server';
import { POST as handleWakafWebhook } from './wakaf/route';

export async function POST(req: NextRequest) {
  // Unified Webhook Handler: forwards to Wakaf webhook handler
  return handleWakafWebhook(req);
}
