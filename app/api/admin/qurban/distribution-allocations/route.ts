import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      hewanBatchId, 
      permohonanId, 
      qurbanOrderId, 
      jumlahBagian, // Ini bisa dalam Kg
      tanggalSalur, 
      buktiFotoUrl 
    } = body;

    if (!hewanBatchId || !jumlahBagian) {
      return NextResponse.json({ error: 'hewanBatchId dan jumlahBagian wajib diisi' }, { status: 400 });
    }

    if (!permohonanId && !qurbanOrderId) {
      return NextResponse.json({ error: 'Harus menyertakan permohonanId atau qurbanOrderId' }, { status: 400 });
    }

    const allocation = await prisma.$transaction(async (tx) => {
      // 1. Get the HewanBatch and lock it if possible (though for sum we just do sum)
      // Actually we don't strictly need FOR UPDATE on hewanBatch if we sum allocations, 
      // but to be safe against race conditions we can lock the batch row.
      const batches = await tx.$queryRaw<any[]>`
        SELECT id, estimasi_berat_kg as "estimasiBeratKg" 
        FROM hewan_batches 
        WHERE id = ${hewanBatchId} 
        FOR UPDATE
      `;

      if (batches.length === 0) {
        throw new Error('Hewan batch tidak ditemukan');
      }

      const batch = batches[0];
      const maxKapasitas = Number(batch.estimasiBeratKg) || 0;

      // 2. Sum existing allocations
      const aggregations = await tx.qurbanDistributionAllocation.aggregate({
        where: { hewanBatchId },
        _sum: { jumlahBagian: true }
      });

      const currentTotal = Number(aggregations._sum.jumlahBagian || 0);
      const requested = Number(jumlahBagian);

      // 3. Validation
      if (currentTotal + requested > maxKapasitas) {
        throw new Error(`Total alokasi daging melebihi kapasitas estimasi HewanBatch. Kapasitas tersisa: ${maxKapasitas - currentTotal} kg`);
      }

      // 4. If allocating for permohonan, check if it's approved
      if (permohonanId) {
        const permohonan = await tx.permohonanPenyaluranInstitusional.findUnique({
          where: { id: permohonanId }
        });
        if (!permohonan || permohonan.status !== 'DISETUJUI') {
          throw new Error('Permohonan institusional belum disetujui');
        }
      }

      // 5. Create allocation
      const newAllocation = await tx.qurbanDistributionAllocation.create({
        data: {
          hewanBatchId,
          permohonanId: permohonanId || null,
          qurbanOrderId: qurbanOrderId || null,
          jumlahBagian: requested,
          tanggalSalur: tanggalSalur ? new Date(tanggalSalur) : new Date(),
          buktiFotoUrl: buktiFotoUrl || null
        }
      });

      return newAllocation;
    });

    return NextResponse.json({ success: true, data: allocation });
  } catch (error: any) {
    console.error(error);
    const isClientError = error.message.includes('melebihi kapasitas') || error.message.includes('belum disetujui');
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: isClientError ? 400 : 500 });
  }
}
