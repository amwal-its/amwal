import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { Prisma } from '../app/generated/prisma/client';

// Varian beras zakat fitrah (Task 2.8 DoD: minimal 3 varian, harga berbeda)
const VARIAN = [
  { jenisBeras: 'Standar', konversiHargaPerJiwa: '45000', referensiSk: 'SK BAZNAS 2026' },
  { jenisBeras: 'Premium', konversiHargaPerJiwa: '55000', referensiSk: 'SK BAZNAS 2026' },
  { jenisBeras: 'Organik', konversiHargaPerJiwa: '65000', referensiSk: 'SK BAZNAS 2026' },
];

// 4 FundPool baseline (Task 1.3)
const FUND_POOLS = [
  { kode: 'ZAKAT_MAAL', nama: 'Zakat Maal' },
  { kode: 'ZAKAT_FITRAH', nama: 'Zakat Fitrah' },
  { kode: 'INFAK', nama: 'Infaq' },
  { kode: 'SEDEKAH', nama: 'Sedekah' },
];

async function main() {
  for (const variant of VARIAN) {
    const existing = await prisma.zakatFitrahConfig.findFirst({
      where: { jenisBeras: variant.jenisBeras, isActive: true },
    });

    if (existing) {
      await prisma.zakatFitrahConfig.update({
        where: { id: existing.id },
        data: {
          konversiHargaPerJiwa: new Prisma.Decimal(variant.konversiHargaPerJiwa),
          referensiSk: variant.referensiSk,
        },
      });
      console.log(`Seeded (updated): ${variant.jenisBeras}`);
      continue;
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.zakatFitrahConfig.updateMany({
        where: { jenisBeras: variant.jenisBeras, isActive: true },
        data: { isActive: false },
      });
      await tx.zakatFitrahConfig.create({
        data: {
          jenisBeras: variant.jenisBeras,
          konversiHargaPerJiwa: new Prisma.Decimal(variant.konversiHargaPerJiwa),
          referensiSk: variant.referensiSk,
        },
      });
    });
    console.log(`Seeded (created): ${variant.jenisBeras}`);
  }

  for (const pool of FUND_POOLS) {
    await prisma.fundPool.upsert({
      where: { kode: pool.kode },
      update: {},
      create: { kode: pool.kode, nama: pool.nama },
    });
    console.log(`Seeded FundPool: ${pool.kode}`);
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
