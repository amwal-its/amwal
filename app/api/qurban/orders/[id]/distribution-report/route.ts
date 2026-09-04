import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || (session.role !== 'PETUGAS_LAPANGAN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { buktiFotoUrl, videoUrl, lokasiPenyaluran, lokasiLat, lokasiLng, jumlahPenerima } = body;

    if (!buktiFotoUrl) {
      return NextResponse.json({ error: 'buktiFotoUrl wajib diisi' }, { status: 400 });
    }

    if (!jumlahPenerima || Number(jumlahPenerima) <= 0) {
      return NextResponse.json({ error: 'jumlahPenerima wajib diisi angka > 0' }, { status: 400 });
    }

    const order = await prisma.qurbanOrder.findUnique({
      where: { id }
    });

    if (!order) {
      return NextResponse.json({ error: 'Qurban order tidak ditemukan' }, { status: 404 });
    }

    const report = await prisma.qurbanDistributionReport.create({
      data: {
        qurbanOrderId: id,
        buktiFotoUrl,
        videoUrl: videoUrl || null,
        lokasiPenyaluran: lokasiPenyaluran || null,
        lokasiLat: lokasiLat ? Number(lokasiLat) : null,
        lokasiLng: lokasiLng ? Number(lokasiLng) : null,
        jumlahPenerima: Number(jumlahPenerima),
      }
    });

    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
