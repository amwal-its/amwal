import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'PETUGAS_LAPANGAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const petugasProfile = await prisma.petugasLapanganProfile.findUnique({
      where: { userId: session.userId }
    });

    if (!petugasProfile) {
      return NextResponse.json({ error: 'Profil petugas tidak ditemukan' }, { status: 404 });
    }

    // Get all cash orders entered by this petugas
    const orders = await prisma.qurbanOrder.findMany({
      where: {
        enteredByPetugasId: petugasProfile.id,
        metodePembayaran: 'TUNAI',
      },
      include: {
        setoranQurbanOrderLinks: true,
      }
    });

    let totalDiterima = 0;
    let totalDisetor = 0;
    let sisaDiTangan = 0;
    const daftarOrderBelumDisetor: any[] = [];

    for (const order of orders) {
      const nominal = Number(order.nominalDibayar || 0);
      totalDiterima += nominal;

      // If it has at least one setoran link, it means it has been deposited (pending or verified)
      if (order.setoranQurbanOrderLinks.length > 0) {
        totalDisetor += nominal;
      } else {
        sisaDiTangan += nominal;
        daftarOrderBelumDisetor.push(order);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalDiterima,
        totalDisetor,
        sisaDiTangan,
        daftarOrderBelumDisetor,
      }
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
