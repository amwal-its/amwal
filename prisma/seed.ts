import 'dotenv/config';
import { prisma } from '../lib/prisma';
import {
  Prisma,
  Role,
  NadzirKategori,
  VerificationStatus,
  WaqfType,
  WaqfStatus,
  BentukWakaf,
  MetodeBayar,
  WaqfOrderStatus,
} from '../app/generated/prisma/client';
import bcrypt from 'bcryptjs';

// 1. Varian beras zakat fitrah
const VARIAN = [
  { jenisBeras: 'Standar', konversiHargaPerJiwa: '45000', referensiSk: 'SK BAZNAS 2026' },
  { jenisBeras: 'Premium', konversiHargaPerJiwa: '55000', referensiSk: 'SK BAZNAS 2026' },
  { jenisBeras: 'Organik', konversiHargaPerJiwa: '65000', referensiSk: 'SK BAZNAS 2026' },
];

// 2. FundPool baseline
const FUND_POOLS = [
  { kode: 'ZAKAT_MAAL', nama: 'Zakat Maal' },
  { kode: 'ZAKAT_FITRAH', nama: 'Zakat Fitrah' },
  { kode: 'INFAK', nama: 'Infaq' },
  { kode: 'SEDEKAH', nama: 'Sedekah' },
];

// 3. Program Wakaf YMI ITS
const WAQF_PROGRAMS = [
  {
    judul: 'Wakaf Sumur Bor Bojonegoro',
    kategori: 'Infrastruktur & Sosial',
    jenisWakaf: WaqfType.HABIS_PAKAI,
    targetDana: 75000000,
    pokokDanaTerkumpul: 48500000,
    totalHasilAvailable: 0,
    hasilInvestasiTersalurkan: 0,
    durasiHari: 60,
    status: WaqfStatus.LIVE,
    donorCount: 142,
    bannerUrl: '/assets/images/wakaf/wakaf-air-bersih-desa-nurul-amanah.png',
    deskripsi:
      'Penyediaan akses air bersih dan sumur bor produktif untuk masyarakat dan pesantren di wilayah Bojonegoro guna menunjang kebutuhan air bersih, sanitasi, dan pertanian warga.',
    namaLembaga: 'Yayasan Manarul Ilmi ITS (YMI ITS)',
  },
  {
    judul: 'Wakaf Produktif Pisang Cavendish',
    kategori: 'Wakaf Produktif & Agrobisnis',
    jenisWakaf: WaqfType.PRODUKTIF_KEKAL,
    targetDana: 150000000,
    pokokDanaTerkumpul: 92000000,
    totalHasilAvailable: 4500000,
    hasilInvestasiTersalurkan: 12000000,
    durasiHari: 90,
    status: WaqfStatus.LIVE,
    donorCount: 89,
    bannerUrl: '/assets/images/wakaf/wakaf-dana-abadi-untuk-pendidikan-agama-islam.png',
    deskripsi:
      'Pengelolaan kebun pisang cavendish berbasis wakaf produktif untuk hasil pemberdayaan ekonomi umat & beasiswa mahasiswa berprestasi ITS.',
    namaLembaga: 'YMI ITS Agrobisnis',
  },
  {
    judul: "Wakaf Development Rumah Tahfidz Qur'an YMI ITS",
    kategori: 'Pendidikan & Dakwah',
    jenisWakaf: WaqfType.HABIS_PAKAI,
    targetDana: 300000000,
    pokokDanaTerkumpul: 210000000,
    totalHasilAvailable: 0,
    hasilInvestasiTersalurkan: 0,
    durasiHari: 45,
    status: WaqfStatus.LIVE,
    donorCount: 310,
    bannerUrl: '/assets/images/wakaf/wakaf-pembangunan-masjid-al-furqon.png',
    deskripsi:
      "Pembangunan dan pengembangan fasilitas Rumah Tahfidz Qur'an bagi mahasiswa ITS dan santri binaan YMI ITS sebagai sarana pencetak generasi qurani yang unggul di bidang sains dan teknologi.",
    namaLembaga: 'YMI ITS Surabaya',
  },
  {
    judul: 'Wakaf Asrama Mahasiswa Rantau ITS',
    kategori: 'Sosial & Pendidikan',
    jenisWakaf: WaqfType.HABIS_PAKAI,
    targetDana: 500000000,
    pokokDanaTerkumpul: 340000000,
    totalHasilAvailable: 0,
    hasilInvestasiTersalurkan: 0,
    durasiHari: 60,
    status: WaqfStatus.LIVE,
    donorCount: 520,
    bannerUrl: '/assets/images/wakaf/wakaf-perbaikan-jalan-aspal-untuk-akses-pendidikan.png',
    deskripsi:
      'Penyediaan hunian/asrama gratis berbasis wakaf untuk mahasiswa rantau ITS yang berprestasi dan kurang mampu agar dapat fokus menyelesaikan studi tanpa kendala tempat tinggal.',
    namaLembaga: 'YMI ITS Surabaya',
  },
];

async function main() {
  console.log('--- Starting Seed Amwal HETI (YMI ITS Context) ---');

  // 1. Seed Zakat Fitrah
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
      console.log(`Seeded (updated) Zakat Fitrah: ${variant.jenisBeras}`);
      continue;
    }

    await prisma.zakatFitrahConfig.create({
      data: {
        jenisBeras: variant.jenisBeras,
        konversiHargaPerJiwa: new Prisma.Decimal(variant.konversiHargaPerJiwa),
        referensiSk: variant.referensiSk,
      },
    });
    console.log(`Seeded (created) Zakat Fitrah: ${variant.jenisBeras}`);
  }

  // 2. Seed FundPool
  for (const pool of FUND_POOLS) {
    await prisma.fundPool.upsert({
      where: { kode: pool.kode },
      update: {},
      create: { kode: pool.kode, nama: pool.nama },
    });
    console.log(`Seeded FundPool: ${pool.kode}`);
  }

  // 3. Seed Nadzir User & NadzirProfile YMI ITS
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const nadzirUser = await prisma.user.upsert({
    where: { email: 'nadzir@ymi-its.org' },
    update: {
      name: 'Yayasan Manarul Ilmi ITS',
      role: Role.NADZIR,
    },
    create: {
      email: 'nadzir@ymi-its.org',
      phone: '081234567890',
      name: 'Yayasan Manarul Ilmi ITS',
      role: Role.NADZIR,
      passwordHash,
    },
  });

  const nadzirProfile = await prisma.nadzirProfile.upsert({
    where: { userId: nadzirUser.id },
    update: {
      namaLembaga: 'Yayasan Manarul Ilmi ITS (YMI ITS)',
      kategori: NadzirKategori.ORGANISASI,
      statusVerifikasi: VerificationStatus.VERIFIED,
    },
    create: {
      userId: nadzirUser.id,
      namaLembaga: 'Yayasan Manarul Ilmi ITS (YMI ITS)',
      kategori: NadzirKategori.ORGANISASI,
      statusVerifikasi: VerificationStatus.VERIFIED,
      namaBank: 'Bank Syariah Indonesia (BSI)',
      nomorRekeningBank: '7112233445',
    },
  });
  console.log(`Seeded NadzirProfile: ${nadzirProfile.namaLembaga}`);

  // 3b. Seed Single Shared Anonymous User (System)
  const SYSTEM_ANONYMOUS_USER_ID = '00000000-0000-0000-0000-000000000001';
  await prisma.user.upsert({
    where: { id: SYSTEM_ANONYMOUS_USER_ID },
    update: {
      name: 'Hamba Allah (Sistem)',
      email: 'hamba.allah@amwal.internal',
      role: Role.WAKIF,
    },
    create: {
      id: SYSTEM_ANONYMOUS_USER_ID,
      email: 'hamba.allah@amwal.internal',
      name: 'Hamba Allah (Sistem)',
      role: Role.WAKIF,
    },
  });
  console.log('Seeded Single Shared Anonymous User (Hamba Allah)');

  // 4. Seed Waqf Programs & Ledgers
  for (let i = 0; i < WAQF_PROGRAMS.length; i++) {
    const progData = WAQF_PROGRAMS[i];

    // Find existing program by title
    const existingProg = await prisma.waqfProgram.findFirst({
      where: { judul: progData.judul },
    });

    let programId = existingProg?.id;

    if (existingProg) {
      const updated = await prisma.waqfProgram.update({
        where: { id: existingProg.id },
        data: {
          kategori: progData.kategori,
          jenisWakaf: progData.jenisWakaf,
          targetDana: new Prisma.Decimal(progData.targetDana),
          durasiHari: progData.durasiHari,
          status: progData.status,
          bannerUrl: progData.bannerUrl,
          deskripsi: progData.deskripsi,
          nadzirProfileId: nadzirProfile.id,
        },
      });
      programId = updated.id;
      console.log(`Updated Waqf Program: ${progData.judul}`);
    } else {
      const created = await prisma.waqfProgram.create({
        data: {
          nadzirProfileId: nadzirProfile.id,
          judul: progData.judul,
          kategori: progData.kategori,
          jenisWakaf: progData.jenisWakaf,
          targetDana: new Prisma.Decimal(progData.targetDana),
          durasiHari: progData.durasiHari,
          status: progData.status,
          bannerUrl: progData.bannerUrl,
          deskripsi: progData.deskripsi,
          rabDocumentUrl: 'https://ymi-its.org/documents/rab-program.pdf',
          dokumenLegalitasUrl: 'https://ymi-its.org/documents/sk-kemenag.pdf',
        },
      });
      programId = created.id;
      console.log(`Created Waqf Program: ${progData.judul}`);
    }

    if (programId) {
      // Upsert WaqfPrincipalLedger
      await prisma.waqfPrincipalLedger.upsert({
        where: { waqfProgramId: programId },
        update: {
          pokokDanaTerkumpul: new Prisma.Decimal(progData.pokokDanaTerkumpul),
          totalHasilAvailable: new Prisma.Decimal(progData.totalHasilAvailable),
          hasilInvestasiTersalurkan: new Prisma.Decimal(progData.hasilInvestasiTersalurkan),
        },
        create: {
          waqfProgramId: programId,
          pokokDanaTerkumpul: new Prisma.Decimal(progData.pokokDanaTerkumpul),
          totalHasilAvailable: new Prisma.Decimal(progData.totalHasilAvailable),
          hasilInvestasiTersalurkan: new Prisma.Decimal(progData.hasilInvestasiTersalurkan),
        },
      });

      // Ensure donor count is populated in WaqfOrder
      const currentOrdersCount = await prisma.waqfOrder.count({
        where: { waqfProgramId: programId, status: WaqfOrderStatus.TERVERIFIKASI },
      });

      const ordersNeeded = progData.donorCount - currentOrdersCount;
      if (ordersNeeded > 0) {
        const batchSize = Math.min(ordersNeeded, 20); // Seed sample orders for realistic counts
        for (let j = 1; j <= batchSize; j++) {
          const kwitansi = `SEED-WKF-${i + 1}-${Date.now().toString().slice(-6)}-${j}`;
          await prisma.waqfOrder.create({
            data: {
              nomorKwitansi: kwitansi,
              waqfProgramId: programId,
              namaWakif: j % 3 === 0 ? 'Hamba Allah' : `Wakif Dermawan ${j}`,
              isAnonymous: j % 3 === 0,
              bentukWakaf: BentukWakaf.UANG,
              nominal: new Prisma.Decimal(100000),
              metodePembayaran: MetodeBayar.QRIS,
              status: WaqfOrderStatus.TERVERIFIKASI,
            },
          });
        }
      }
    }
  }

  console.log('--- All Seedings for YMI ITS Completed Successfully ---');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

