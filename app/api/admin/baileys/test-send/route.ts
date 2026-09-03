import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { sendWhatsAppNotification } from '@/lib/whatsapp.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
    }

    const body = await req.json();
    const { phone, message } = body;

    if (!phone || !message) {
      return NextResponse.json(
        { error: 'Nomor HP dan pesan wajib diisi' },
        { status: 400 }
      );
    }

    const sent = await sendWhatsAppNotification(phone, message);

    if (!sent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gagal mengirim pesan WhatsApp. Pastikan Baileys service aktif dan WhatsApp terhubung.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Pesan uji coba berhasil dikirim ke ${phone}`,
    });
  } catch (error: any) {
    console.error('Error in POST /api/admin/baileys/test-send:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
