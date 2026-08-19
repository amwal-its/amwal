import { Prisma } from '../app/generated/prisma/client';

export async function reserveSlot(
  tx: Prisma.TransactionClient,
  hewanBatchId: string,
  jumlahSlotDiminta: number,
  qurbanOrderId: string
) {
  // Row-level lock slots that are available
  const availableSlots = await tx.$queryRaw<{id: string, nomorSlot: number}[]>`
    SELECT id, "nomor_slot" as "nomorSlot" FROM qurban_animal_slots
    WHERE hewan_batch_id = ${hewanBatchId} AND status = 'TERSEDIA'
    ORDER BY "nomor_slot" ASC
    LIMIT ${jumlahSlotDiminta}
    FOR UPDATE SKIP LOCKED
  `;

  if (availableSlots.length < jumlahSlotDiminta) {
    throw new Error('Slot tidak mencukupi atau sudah dipesan orang lain');
  }

  const slotIds = availableSlots.map(s => s.id);

  await tx.qurbanAnimalSlot.updateMany({
    where: {
      id: { in: slotIds }
    },
    data: {
      status: 'TERISI',
      qurbanOrderId: qurbanOrderId
    }
  });

  // Check if batch is full
  const remainingSlots = await tx.qurbanAnimalSlot.count({
    where: {
      hewanBatchId: hewanBatchId,
      status: 'TERSEDIA'
    }
  });

  if (remainingSlots === 0) {
    await tx.hewanBatch.update({
      where: { id: hewanBatchId },
      data: { status: 'PENUH' }
    });
  }

  return availableSlots;
}
