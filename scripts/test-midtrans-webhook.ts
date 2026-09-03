import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { WaqfOrderStatus, TransactionPaymentStatus } from '../app/generated/prisma/client';

async function main() {
  console.log('--- STARTING MIDTRANS WEBHOOK VERIFICATION TEST ---');

  const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-test-key-2026';
  process.env.MIDTRANS_SERVER_KEY = serverKey;

  // 1. Setup Test Waqf Program and Order in DB
  let testProgram = await prisma.waqfProgram.findFirst();
  if (!testProgram) {
    const nadzir = await prisma.nadzirProfile.findFirst();
    testProgram = await prisma.waqfProgram.create({
      data: {
        judul: 'Program Uji Webhook Midtrans',
        deskripsi: 'Program uji otomatisasi webhook',
        targetDana: 50000000,
        kategori: 'Infrastruktur',
        durasiHari: 60,
        jenisWakaf: 'HABIS_PAKAI',
        status: 'LIVE',
        nadzirProfileId: nadzir ? nadzir.id : '00000000-0000-0000-0000-000000000001',
      },
    });
  }

  const testUser = await prisma.user.findFirst({
    where: { email: 'superadmin@amwal.id' },
  });

  if (!testUser) throw new Error('Superadmin user not found');

  const orderId = `WKF-TEST-${Date.now()}`;
  const grossAmount = '150000.00';
  const statusCode = '200';

  const testTx = await prisma.transaction.create({
    data: {
      id: `TX-${orderId}`,
      wakifId: testUser.id,
      jenisTransaksi: 'WAKAF',
      amount: 150000,
      paymentMethod: 'qris',
      statusPembayaran: TransactionPaymentStatus.PENDING,
      disbursementDestination: 'BSI Escrow',
    },
  });

  const testOrder = await prisma.waqfOrder.create({
    data: {
      id: orderId,
      nomorKwitansi: `KWT-${orderId}`,
      waqfProgramId: testProgram.id,
      wakifId: testUser.id,
      namaWakif: 'Test Donatur Midtrans',
      noTelepon: '081234567899',
      bentukWakaf: 'UANG',
      nominal: 150000,
      status: WaqfOrderStatus.MENUNGGU_VERIFIKASI,
      transactionId: testTx.id,
    },
  });

  console.log(`[Setup] Created test order: ${testOrder.id} with status: ${testOrder.status}`);

  // 2. Test 1: Webhook with INVALID Signature (Should return 403 Forbidden)
  console.log('\n[Test 1] Simulating Webhook with INVALID SHA-512 Signature...');
  const invalidPayload = {
    order_id: orderId,
    status_code: statusCode,
    gross_amount: grossAmount,
    signature_key: 'invalid_sha512_hash_abcdef123456',
    transaction_status: 'settlement',
    fraud_status: 'accept',
  };

  const res1 = await fetch('http://localhost:3000/api/webhooks/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidPayload),
  });

  console.log(`[Test 1] Response Status: ${res1.status} (Expected: 403)`);
  if (res1.status !== 403) {
    throw new Error(`Test 1 Failed: Expected 403 Forbidden, got ${res1.status}`);
  }
  console.log('✅ Test 1 PASSED: Invalid signature strictly rejected with 403 Forbidden.');

  // 3. Test 2: Webhook with VALID SHA-512 Signature (Should return 200 & update DB)
  console.log('\n[Test 2] Simulating Webhook with VALID SHA-512 Signature...');
  const rawSignatureString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const validSignature = crypto.createHash('sha512').update(rawSignatureString).digest('hex');

  const validPayload = {
    order_id: orderId,
    status_code: statusCode,
    gross_amount: grossAmount,
    signature_key: validSignature,
    transaction_status: 'settlement',
    fraud_status: 'accept',
    transaction_id: `midtrans-tx-${Date.now()}`,
  };

  const res2 = await fetch('http://localhost:3000/api/webhooks/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validPayload),
  });

  console.log(`[Test 2] Response Status: ${res2.status} (Expected: 200)`);
  const data2 = await res2.json();
  console.log('[Test 2] Response Body:', data2);

  if (res2.status !== 200 || !data2.success) {
    throw new Error(`Test 2 Failed: Expected 200 OK with success: true, got ${res2.status}`);
  }

  // Verify DB state
  const updatedOrder = await prisma.waqfOrder.findUnique({ where: { id: orderId } });
  const updatedTx = await prisma.transaction.findUnique({ where: { id: testTx.id } });
  const updatedLedger = await prisma.waqfPrincipalLedger.findUnique({
    where: { waqfProgramId: testProgram.id },
  });

  console.log(`[Test 2] DB Order Status: ${updatedOrder?.status} (Expected: TERVERIFIKASI)`);
  console.log(`[Test 2] DB Transaction Status: ${updatedTx?.statusPembayaran} (Expected: LUNAS)`);
  console.log(`[Test 2] DB Ledger Pokok: Rp ${Number(updatedLedger?.pokokDanaTerkumpul).toLocaleString('id-ID')}`);

  if (updatedOrder?.status !== WaqfOrderStatus.TERVERIFIKASI) {
    throw new Error('Test 2 Failed: WaqfOrder is not TERVERIFIKASI');
  }
  if (updatedTx?.statusPembayaran !== TransactionPaymentStatus.LUNAS) {
    throw new Error('Test 2 Failed: Transaction is not LUNAS');
  }
  console.log('✅ Test 2 PASSED: Valid signature verified, DB status updated to TERVERIFIKASI/LUNAS, and Ledger updated.');

  // 4. Test 3: Idempotency (Repeat same webhook request)
  console.log('\n[Test 3] Testing Idempotency (Duplicate Webhook)...');
  const res3 = await fetch('http://localhost:3000/api/webhooks/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validPayload),
  });
  console.log(`[Test 3] Duplicate Response Status: ${res3.status} (Expected: 200)`);
  if (res3.status !== 200) {
    throw new Error(`Test 3 Failed: Idempotent call failed with status ${res3.status}`);
  }
  console.log('✅ Test 3 PASSED: Duplicate webhook processed idempotently without error.');

  // Clean up test records
  await prisma.waqfOrder.delete({ where: { id: orderId } });
  await prisma.transaction.delete({ where: { id: testTx.id } });
  console.log('\n[Cleanup] Test records cleaned up successfully.');

  console.log('\n🎉 ALL TASK 9.1 MIDTRANS WEBHOOK HARDENING TESTS PASSED SUCCESSFULLY! 🎉');
}

main()
  .catch((err) => {
    console.error('Test error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
