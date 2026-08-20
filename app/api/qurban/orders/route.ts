import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { reserveSlot } from '@/lib/qurban';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'WAKIF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      hewanBatchId, jenisHewan, tipeKepemilikan, jumlahSlotDiminta, opsiPesan,
      namaPengqurban, teleponPengqurban, alamatPengqurban,
      akadWakalahAccepted
    } = body;

    if (akadWakalahAccepted !== true) {
      return NextResponse.json({ error: 'Akad wakalah wajib disetujui sebelum melanjutkan pembayaran' }, { status: 400 });
    }

    if (!hewanBatchId || !jumlahSlotDiminta || !namaPengqurban || !tipeKepemilikan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const order = await prisma.$transaction(async (tx) => {
      // Get the batch to calculate total price
      const batch = await tx.hewanBatch.findUnique({
        where: { id: hewanBatchId }
      });

      if (!batch) {
        throw new Error('Hewan batch not found');
      }

      if (batch.status !== 'TERSEDIA') {
        throw new Error('Hewan batch tidak tersedia atau penuh');
      }

      const totalHarga = Number(batch.hargaPerSlot) * Number(jumlahSlotDiminta);

      // Create QurbanOrder
      const newOrder = await tx.qurbanOrder.create({
        data: {
          wakifId: session.userId,
          namaPengqurban,
          teleponPengqurban,
          alamatPengqurban,
          jenisHewan: jenisHewan || batch.jenisHewan,
          tipeKepemilikan,
          opsiPesan: opsiPesan || 'PASRAH',
          metodePembayaran: 'TRANSFER', // digital flow default
          statusPembayaran: 'BELUM_BAYAR',
          totalHarga,
          sisaTagihan: totalHarga,
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
