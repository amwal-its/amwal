import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_please_change_in_production';

async function main() {
  console.log('=== STARTING WAKAF OFFLINE ORDER TESTS ===\n');

  // 1. Setup Data: User Admin & WaqfProgram
  let adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: `admin_test_${Date.now()}@example.com`,
        name: 'Admin Test Scratch',
        role: 'ADMIN',
      },
    });
    console.log('Created test Admin user:', adminUser.id);
  } else {
    console.log('Using existing Admin user:', adminUser.id);
  }

  // Create JWT token cookie for admin
  const token = jwt.sign(
    {
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Cookie: `amwal_token=${token}`,
    'x-user-id': adminUser.id,
    'x-user-role': adminUser.role,
  };

  // Setup Nadzir & Program
  let nadzirUser = await prisma.user.findFirst({
    where: { role: 'NADZIR' },
  });
  if (!nadzirUser) {
    nadzirUser = await prisma.user.create({
      data: {
        email: `nadzir_test_${Date.now()}@example.com`,
        name: 'Nadzir Test',
        role: 'NADZIR',
      },
    });
  }

  let nadzirProfile = await prisma.nadzirProfile.findFirst({
    where: { userId: nadzirUser.id },
  });
  if (!nadzirProfile) {
    nadzirProfile = await prisma.nadzirProfile.create({
      data: {
        userId: nadzirUser.id,
        kategori: 'PERSEORANGAN',
        statusVerifikasi: 'VERIFIED',
      },
    });
  }

  let waqfProgram = await prisma.waqfProgram.findFirst({
    where: { nadzirProfileId: nadzirProfile.id },
  });
  if (!waqfProgram) {
    waqfProgram = await prisma.waqfProgram.create({
      data: {
        nadzirProfileId: nadzirProfile.id,
        judul: 'Program Wakaf Masjid Manarul Ilmi',
        targetDana: 100000000,
        jenisWakaf: 'PRODUKTIF_KEKAL',
        status: 'LIVE',
      },
    });
  }
  console.log('Using WaqfProgram ID:', waqfProgram.id);

  // --- TEST CASE 1: Entri Wakaf UANG Tunai (isAnonymous: false) ---
  console.log('\n--- TEST CASE 1: Entri Wakaf UANG Tunai ---');
  const res1 = await fetch(`${BASE_URL}/api/admin/wakaf/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      waqfProgramId: waqfProgram.id,
      namaWakif: 'Hj. Ahmad Dahlan',
      teleponWakif: '081234567890',
      alamat: 'Jl. Teknik Kimia ITS',
      isAnonymous: false,
      bentukWakafEnum: 'UANG',
      nominal: 500000,
      metodePembayaran: 'TUNAI',
    }),
  });

  const body1 = await res1.json();
  console.log('Status HTTP:', res1.status);
  console.log('Response:', JSON.stringify(body1, null, 2));

  if (res1.status !== 201 || !body1.data?.nomorKwitansi) {
    throw new Error(`TEST CASE 1 FAILED: ${JSON.stringify(body1)}`);
  }
  if (body1.data.status !== 'TERVERIFIKASI') {
    throw new Error(`Expected status TERVERIFIKASI for TUNAI, got ${body1.data.status}`);
  }
  console.log('✓ TEST CASE 1 PASSED: Order UANG Tunai created with Kwitansi:', body1.data.nomorKwitansi);

  // --- TEST CASE 2: Entri Wakaf UANG (isAnonymous: true) ---
  console.log('\n--- TEST CASE 2: Entri Wakaf UANG (isAnonymous: true) ---');
  const res2 = await fetch(`${BASE_URL}/api/admin/wakaf/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      waqfProgramId: waqfProgram.id,
      namaWakif: 'Dra. Siti Walidah',
      isAnonymous: true,
      bentukWakafEnum: 'UANG',
      nominal: 1000000,
      metodePembayaran: 'TUNAI',
    }),
  });

  const body2 = await res2.json();
  console.log('Status HTTP:', res2.status);
  console.log('Response:', JSON.stringify(body2, null, 2));

  if (res2.status !== 201) throw new Error(`TEST CASE 2 FAILED: ${JSON.stringify(body2)}`);
  if (body2.data.isAnonymous !== true) throw new Error('Expected isAnonymous to be true');
  if (body2.data.namaWakif !== 'Dra. Siti Walidah') {
    throw new Error('Expected namaWakif to still be saved in DB for administrative records');
  }
  console.log('✓ TEST CASE 2 PASSED: isAnonymous: true saved while retaining admin name record.');

  // --- TEST CASE 3: Entri Wakaf BARANG (Lengkap AIW) ---
  console.log('\n--- TEST CASE 3: Entri Wakaf BARANG (Lengkap AIW) ---');
  const res3 = await fetch(`${BASE_URL}/api/admin/wakaf/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      waqfProgramId: waqfProgram.id,
      namaWakif: 'H. Abdul Muis',
      isAnonymous: false,
      bentukWakafEnum: 'BARANG',
      deskripsiBarang: 'Tanah Ruko 2 Lantai untuk Usaha Produk Masjid',
      estimasiNilaiBarang: 250000000,
      nomorAIW: 'BWI/AIW/2026/08/001',
      dokumenAiwUrl: 'https://storage.supabase.co/docs/aiw-001.pdf',
      metodePembayaran: 'TUNAI',
    }),
  });

  const body3 = await res3.json();
  console.log('Status HTTP:', res3.status);
  console.log('Response:', JSON.stringify(body3, null, 2));

  if (res3.status !== 201) throw new Error(`TEST CASE 3 FAILED: ${JSON.stringify(body3)}`);
  if (body3.data.namaBarang !== 'Tanah Ruko 2 Lantai untuk Usaha Produk Masjid') {
    throw new Error('Expected namaBarang to match deskripsiBarang');
  }
  if (body3.data.nomorIkrarWakaf !== 'BWI/AIW/2026/08/001') {
    throw new Error('Expected nomorIkrarWakaf to match nomorAIW');
  }
  console.log('✓ TEST CASE 3 PASSED: Wakaf BARANG with AIW created successfully.');

  // --- TEST CASE 4: Validasi Gagal Wakaf BARANG Tanpa Nomor AIW ---
  console.log('\n--- TEST CASE 4: Validasi Gagal Wakaf BARANG Tanpa AIW ---');
  const res4 = await fetch(`${BASE_URL}/api/admin/wakaf/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      waqfProgramId: waqfProgram.id,
      namaWakif: 'H. Abdul Muis',
      bentukWakafEnum: 'BARANG',
      deskripsiBarang: 'Karpet Masjid',
      estimasiNilaiBarang: 5000000,
      // nomorAIW sengaja dikosongkan
      metodePembayaran: 'TUNAI',
    }),
  });

  const body4 = await res4.json();
  console.log('Status HTTP:', res4.status);
  console.log('Response:', JSON.stringify(body4, null, 2));

  if (res4.status !== 400) {
    throw new Error(`Expected HTTP 400 Bad Request for missing AIW, got ${res4.status}`);
  }
  console.log('✓ TEST CASE 4 PASSED: HTTP 400 Bad Request returned when AIW is missing for BARANG.');

  // --- TEST CASE 5: Validasi Gagal Wakaf UANG Tanpa Nominal ---
  console.log('\n--- TEST CASE 5: Validasi Gagal Wakaf UANG Tanpa Nominal ---');
  const res5 = await fetch(`${BASE_URL}/api/admin/wakaf/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      waqfProgramId: waqfProgram.id,
      namaWakif: 'Seseorang',
      bentukWakafEnum: 'UANG',
      nominal: 0,
      metodePembayaran: 'TUNAI',
    }),
  });

  const body5 = await res5.json();
  console.log('Status HTTP:', res5.status);
  console.log('Response:', JSON.stringify(body5, null, 2));

  if (res5.status !== 400) {
    throw new Error(`Expected HTTP 400 Bad Request for invalid nominal, got ${res5.status}`);
  }
  console.log('✓ TEST CASE 5 PASSED: HTTP 400 Bad Request returned when nominal <= 0 for UANG.');

  // --- TEST CASE 6: Transfer Manual Order (Status MENUNGGU_VERIFIKASI) ---
  console.log('\n--- TEST CASE 6: Entri Transfer Manual ---');
  const res6 = await fetch(`${BASE_URL}/api/admin/wakaf/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      waqfProgramId: waqfProgram.id,
      namaWakif: 'Budi Santoso',
      bentukWakafEnum: 'UANG',
      nominal: 250000,
      metodePembayaran: 'TRANSFER_MANUAL',
    }),
  });

  const body6 = await res6.json();
  console.log('Status HTTP:', res6.status);
  console.log('Response:', JSON.stringify(body6, null, 2));

  if (res6.status !== 201) throw new Error(`TEST CASE 6 FAILED: ${JSON.stringify(body6)}`);
  if (body6.data.status !== 'MENUNGGU_VERIFIKASI') {
    throw new Error(`Expected status MENUNGGU_VERIFIKASI for TRANSFER_MANUAL, got ${body6.data.status}`);
  }
  console.log('✓ TEST CASE 6 PASSED: TRANSFER_MANUAL created with status MENUNGGU_VERIFIKASI.');

  console.log('\n=== ALL WAKAF OFFLINE ORDER TESTS PASSED SUCCESSFULLY! ===');
}

main().catch((err) => {
  console.error('\n❌ TEST RUN ERROR:', err);
  process.exit(1);
});
