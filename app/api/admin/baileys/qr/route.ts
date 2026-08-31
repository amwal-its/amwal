import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
    }

    const baseUrl = (process.env.BAILEYS_SERVICE_URL || 'http://localhost:4001').replace(/\/+$/, '');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch(`${baseUrl}/qr`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json({
          qrCodeBase64: null,
          status: 'OFFLINE',
          error: `Service returned HTTP ${response.status}`,
        });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      return NextResponse.json({
        qrCodeBase64: null,
        status: 'OFFLINE',
        error: 'Baileys microservice is unreachable on port 4001',
      });
    }
  } catch (error) {
    console.error('Error in GET /api/admin/baileys/qr:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
