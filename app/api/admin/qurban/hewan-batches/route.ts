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
      jenisHewan, totalSlot, hargaPerSlot,
      ras, kelasGrade, estimasiBeratKg,
      jenisKelamin, wilayahPenyaluran,
      targetPenerimaManfaat, tanggalPenyembelihanEstimasi,
      galeriFotoUrls
    } = body;

    if (!jenisHewan || !totalSlot || !hargaPerSlot) {
      return NextResponse.json({ error: 'jenisHewan, totalSlot, and hargaPerSlot are required' }, { status: 400 });
    }

    const hewanBatch = await prisma.$transaction(async (tx) => {
      const batch = await tx.hewanBatch.create({
        data: {
          jenisHewan,
          totalSlot: parseInt(totalSlot),
          hargaPerSlot: parseFloat(hargaPerSlot),
          ras,
          kelasGrade,
          estimasiBeratKg: estimasiBeratKg ? parseFloat(estimasiBeratKg) : null,
          jenisKelamin,
          wilayahPenyaluran,
          targetPenerimaManfaat: targetPenerimaManfaat ? parseInt(targetPenerimaManfaat) : null,
          tanggalPenyembelihanEstimasi: tanggalPenyembelihanEstimasi ? new Date(tanggalPenyembelihanEstimasi) : null,
          galeriFotoUrls: galeriFotoUrls || []
        }
      });

      // Create QurbanAnimalSlots
      const slots = [];
      for (let i = 1; i <= parseInt(totalSlot); i++) {
        slots.push({
          hewanBatchId: batch.id,
          nomorSlot: i,
          status: 'TERSEDIA' as const
        });
      }

      await tx.qurbanAnimalSlot.createMany({
        data: slots
      });

      return batch;
    });

    return NextResponse.json({ success: true, data: hewanBatch });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
