import { prisma } from '../lib/prisma';
import { reserveSlot } from '../lib/qurban';

async function main() {
  console.log('=== STARTING 10-REQUEST PARALLEL CONCURRENCY TEST FOR TASK 2.5 ===\n');

  // 1. Setup a test HewanBatch with totalSlot = 5
  const batch = await prisma.hewanBatch.create({
    data: {
      jenisHewan: 'SAPI',
      totalSlot: 5,
      hargaPerSlot: 3500000,
      ras: 'Limosin Concurrency Test',
      kelasGrade: 'A',
      estimasiBeratKg: 350,
      status: 'TERSEDIA',
    },
  });

  // Create 5 slots
  for (let i = 1; i <= 5; i++) {
    await prisma.qurbanAnimalSlot.create({
      data: {
        hewanBatchId: batch.id,
        nomorSlot: i,
        status: 'TERSEDIA',
      },
    });
  }

  console.log(`Created test HewanBatch ID: ${batch.id} with 5 slots (Slot 1 - 5).`);
  console.log('Launching 10 SIMULTANEOUS PARALLEL requests asking for 1 slot each...\n');

  // 2. Launch 10 simultaneous parallel requests
  const requests = Array.from({ length: 10 }).map(async (_, idx) => {
    const requestId = `REQ-${idx + 1}`;
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Create dummy qurban order id
        const dummyOrder = await tx.qurbanOrder.create({
          data: {
            namaPengqurban: `Pengqurban ${requestId}`,
            teleponPengqurban: '08123456789',
            jenisHewan: 'SAPI',
            tipeKepemilikan: 'KOLEKTIF',
            metodePembayaran: 'TUNAI',
            totalHarga: 3500000,
            sisaTagihan: 3500000,
          },
        });

        const slots = await reserveSlot(tx, batch.id, 1, dummyOrder.id);
        return { success: true, slotNumber: slots[0].nomorSlot, orderId: dummyOrder.id };
      });
      return { requestId, status: 'SUCCESS', result };
    } catch (err: any) {
      return { requestId, status: 'FAILED', error: err.message };
    }
  });

  const results = await Promise.all(requests);

  console.log('=== CONCURRENCY TEST RESULTS PER REQUEST ===');
  results.forEach((r) => {
    if (r.status === 'SUCCESS') {
      console.log(`[${r.requestId}] SUCCESS -> Assigned Slot #${r.result?.slotNumber} (Order ID: ${r.result?.orderId})`);
    } else {
      console.log(`[${r.requestId}] FAILED  -> Error: ${r.error}`);
    }
  });

  // 3. Inspect final state of QurbanAnimalSlot in DB
  const finalSlots = await prisma.qurbanAnimalSlot.findMany({
    where: { hewanBatchId: batch.id },
    orderBy: { nomorSlot: 'asc' },
  });

  const finalBatch = await prisma.hewanBatch.findUnique({
    where: { id: batch.id },
  });

  console.log('\n=== FINAL STATE OF QURBAN ANIMAL SLOTS ===');
  console.log('HewanBatch Status:', finalBatch?.status);
  console.log('Slot Count Breakdown:');
  finalSlots.forEach((s) => {
    console.log(`- Slot #${s.nomorSlot}: ID=${s.id}, Status=${s.status}, OrderID=${s.qurbanOrderId}`);
  });

  const filledCount = finalSlots.filter((s) => s.status === 'TERISI').length;
  console.log(`\nTotal Slots Filled: ${filledCount} / ${batch.totalSlot}`);

  if (filledCount === 5 && results.filter((r) => r.status === 'SUCCESS').length === 5) {
    console.log('✓ CONCURRENCY TEST PASSED: Exactly 5 requests succeeded and 5 requests failed gracefully due to lock protection!');
  } else {
    console.error('❌ CONCURRENCY TEST FAILED: Overbooking or inconsistent slot counts!');
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
