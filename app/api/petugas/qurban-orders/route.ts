import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { reserveSlot } from '@/lib/qurban';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'PETUGAS_LAPANGAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      hewanBatchId, jenisHewan, tipeKepemilikan, jumlahSlotDiminta, opsiPesan,
      namaPengqurban, teleponPengqurban, alamatPengqurban, nominalDibayar
    } = body;

    if (!hewanBatchId || !jumlahSlotDiminta || !namaPengqurban || !tipeKepemilikan || nominalDibayar === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get PetugasProfile
    const petugasProfile = await prisma.petugasLapanganProfile.findUnique({
      where: { userId: session.userId }
    });

    if (!petugasProfile) {
      return NextResponse.json({ error: 'Profil petugas tidak ditemukan' }, { status: 404 });
    }

    const order = await prisma.$transaction(async (tx) => {
      const batch = await tx.hewanBatch.findUnique({
        where: { id: hewanBatchId }
      });

      if (!batch) throw new Error('Hewan batch not found');
      if (batch.status !== 'TERSEDIA') throw new Error('Hewan batch tidak tersedia atau penuh');

      const totalHarga = Number(batch.hargaPerSlot) * Number(jumlahSlotDiminta);
      const sisaTagihan = totalHarga - Number(nominalDibayar);
      
      let statusPembayaran = 'BELUM_BAYAR';
      if (sisaTagihan <= 0) {
        statusPembayaran = 'LUNAS';
      } else if (Number(nominalDibayar) > 0) {
        statusPembayaran = 'DP';
      }

      const newOrder = await tx.qurbanOrder.create({
        data: {
          wakifId: null, // Input offline, user might not have an account
          namaPengqurban,
          teleponPengqurban,
          alamatPengqurban,
          jenisHewan: jenisHewan || batch.jenisHewan,
          tipeKepemilikan,
          opsiPesan: opsiPesan || 'PASRAH',
          metodePembayaran: 'TUNAI',
          statusPembayaran: statusPembayaran as any,
          totalHarga,
          nominalDibayar: Number(nominalDibayar),
          sisaTagihan,
          enteredByPetugasId: petugasProfile.id,
          akadWakalahText: `Saya ${namaPengqurban} dengan ini mewakilkan kepada panitia Qurban Amwal untuk menyembelihkan hewan qurban atas nama saya sesuai syariat Islam`,
          akadWakalahAcceptedAt: new Date(),
        }
      });

      // Call internal reserveSlot function
      await reserveSlot(tx, hewanBatchId, Number(jumlahSlotDiminta), newOrder.id);

      return newOrder;
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error(error);
    const isClientError = error.message.includes('Slot tidak mencukupi') || error.message.includes('Hewan batch');
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: isClientError ? 400 : 500 });
  }
}
