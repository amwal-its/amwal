import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'PETUGAS_LAPANGAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { jumlahSetor, buktiSetorUrl, qurbanOrderIds, keterangan, tanggal } = body;

    if (!jumlahSetor || !buktiSetorUrl || !qurbanOrderIds || !Array.isArray(qurbanOrderIds) || qurbanOrderIds.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const petugasProfile = await prisma.petugasLapanganProfile.findUnique({
      where: { userId: session.userId }
    });

    if (!petugasProfile) {
      return NextResponse.json({ error: 'Profil petugas tidak ditemukan' }, { status: 404 });
    }

    const setoran = await prisma.$transaction(async (tx) => {
      // Create Setoran
      const newSetoran = await tx.setoranPetugasLapangan.create({
        data: {
          petugasId: petugasProfile.id,
          tanggal: tanggal ? new Date(tanggal) : new Date(),
          jumlahSetor: Number(jumlahSetor),
          keterangan,
        }
      });

      // Create links for each order
      const links = qurbanOrderIds.map(orderId => ({
        setoranId: newSetoran.id,
        qurbanOrderId: orderId
      }));

      await tx.setoranQurbanOrderLink.createMany({
        data: links
      });

      return newSetoran;
    });

    return NextResponse.json({ success: true, data: setoran });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
