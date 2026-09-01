import { prisma } from '../lib/prisma';
import crypto from 'crypto';
import { normalizePhoneNumber, sendWhatsAppNotification } from '../lib/whatsapp.service';
import {
  zakatThankYouMessage,
  waqfThankYouMessage,
  qurbanThankYouMessage,
} from '../lib/notification-templates';
import { POST as handleZakatWebhook } from '../app/api/webhooks/payment/zakat/route';
import { GET as getZakatOrders } from '../app/api/admin/zakat/orders/route';
import { POST as postDistribution, GET as getDistributions } from '../app/api/admin/zakat/distributions/route';
import { GET as getZakatSummary } from '../app/api/admin/zakat/summary/route';
import { NextRequest } from 'next/server';
import { Asnaf, VerificationStatus } from '../app/generated/prisma/client';
import { encryptAES256 } from '../lib/crypto';

async function runSelfCheck() {
  console.log('========================================================');
  console.log('🧪 MICRO-SPRINT 9 (AWAN) SELF-CHECK & AUTOMATED TESTING');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${msg}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST 1: Phone Normalization & WhatsApp Resiliency
  // -------------------------------------------------------------
  console.log('\n--- 1. Testing WhatsApp Service & Normalization ---');
  assert(normalizePhoneNumber('08123456789') === '628123456789', 'Normalize leading 0 -> 62');
  assert(normalizePhoneNumber('+62 812-3456-789') === '628123456789', 'Normalize +62 with spaces and dashes');
  assert(normalizePhoneNumber('8123456789') === '628123456789', 'Normalize leading 8 -> 628');

  // Test that sendWhatsAppNotification returns false without throwing when port 4001 is offline
  const waResult = await sendWhatsAppNotification('08123456789', 'Test message', { timeoutMs: 1000 });
  assert(typeof waResult === 'boolean', 'sendWhatsAppNotification returns boolean without throwing');

  // -------------------------------------------------------------
  // TEST 2: Notification Message Templates
  // -------------------------------------------------------------
  console.log('\n--- 2. Testing Notification Templates ---');
  const zakatMsg = zakatThankYouMessage({
    namaOrIsAnonymous: 'Bapak Ahmad',
    jenisZakat: 'MAAL_PENGHASILAN',
    nominal: 500000,
    nomorKwitansi: 'ZKT-2026-TEST-001',
    certificateUrl: 'https://amwal.its.ac.id/zakat/transaksi/test/sertifikat',
  });
  assert(zakatMsg.includes('Bapak Ahmad'), 'Zakat message includes donor name');
  assert(zakatMsg.includes('ZKT-2026-TEST-001'), 'Zakat message includes nomor kwitansi');
  assert(zakatMsg.includes('Rp\u00a0500.000') || zakatMsg.includes('500.000'), 'Zakat message includes formatted nominal');
  assert(zakatMsg.includes('sertifikat'), 'Zakat message includes certificate URL');

  // -------------------------------------------------------------
  // TEST 3: Midtrans Real SHA-512 Signature & Webhook Processing
  // -------------------------------------------------------------
  console.log('\n--- 3. Testing Zakat Webhook Hardening & Idempotency ---');
  const testServerKey = process.env.MIDTRANS_SERVER_KEY || 'test_server_key_123';
  process.env.MIDTRANS_SERVER_KEY = testServerKey;

  // Create test user and order
  const testUser = await prisma.user.upsert({
    where: { email: 'muzakki_test@amwal.its.ac.id' },
    update: {},
    create: {
      name: 'Muzakki Test',
      email: 'muzakki_test@amwal.its.ac.id',
      phone: '081299998888',
      role: 'WAKIF',
    },
  });

  const testTx = await prisma.transaction.create({
    data: {
      wakifId: testUser.id,
      jenisTransaksi: 'ZAKAT',
      amount: 250000,
      statusPembayaran: 'PENDING',
      disbursementDestination: 'KAS_ZAKAT',
    },
  });

  const testKwitansi = `ZKT-TEST-${Date.now()}`;
  const testOrder = await prisma.zakatOrder.create({
    data: {
      nomorKwitansi: testKwitansi,
      muzakkiId: testUser.id,
      namaMuzakki: 'Muzakki Test',
      jenisZakat: 'FITRAH',
      metodePembayaran: 'TRANSFER',
      nominal: 250000,
      status: 'MENUNGGU_VERIFIKASI',
      transactionId: testTx.id,
    },
  });

  // Calculate real SHA-512 signature: SHA512(order_id + status_code + gross_amount + ServerKey)
  const grossAmount = '250000.00';
  const statusCode = '200';
  const rawSigString = `${testKwitansi}${statusCode}${grossAmount}${testServerKey}`;
  const validSignature = crypto.createHash('sha512').update(rawSigString).digest('hex');

  // 3a. Invalid signature check
  const badReq = new NextRequest('http://localhost:3000/api/webhooks/payment/zakat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: testKwitansi,
      status_code: statusCode,
      gross_amount: grossAmount,
      transaction_status: 'settlement',
      signature_key: 'invalid_sha512_hash',
    }),
  });
  const badRes = await handleZakatWebhook(badReq);
  assert(badRes.status === 403, 'Invalid signature correctly returns 403 Forbidden');

  // 3b. Valid signature settlement check
  const goodReq = new NextRequest('http://localhost:3000/api/webhooks/payment/zakat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: testKwitansi,
      status_code: statusCode,
      gross_amount: grossAmount,
      transaction_status: 'settlement',
      signature_key: validSignature,
    }),
  });
  const goodRes = await handleZakatWebhook(goodReq);
  assert(goodRes.status === 200, 'Valid Midtrans webhook returns 200 OK');

  // Check DB state
  const updatedOrder = await prisma.zakatOrder.findUnique({ where: { id: testOrder.id } });
  const updatedTx = await prisma.transaction.findUnique({ where: { id: testTx.id } });
  const fitrahPool = await prisma.fundPool.findUnique({ where: { kode: 'ZAKAT_FITRAH' } });

  assert(updatedOrder?.status === 'TERVERIFIKASI', 'ZakatOrder status changed to TERVERIFIKASI');
  assert(updatedTx?.statusPembayaran === 'LUNAS', 'Transaction status changed to LUNAS');
  assert(Number(fitrahPool?.balance || 0) >= 250000, 'FundPool ZAKAT_FITRAH balance incremented');

  // 3c. Idempotency check: repeat same valid webhook
  const initialPoolBal = Number(fitrahPool?.balance || 0);
  const dupReq = new NextRequest('http://localhost:3000/api/webhooks/payment/zakat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: testKwitansi,
      status_code: statusCode,
      gross_amount: grossAmount,
      transaction_status: 'settlement',
      signature_key: validSignature,
    }),
  });
  const dupRes = await handleZakatWebhook(dupReq);
  assert(dupRes.status === 200, 'Duplicate webhook returns 200 OK (Idempotent)');

  const poolAfterDup = await prisma.fundPool.findUnique({ where: { kode: 'ZAKAT_FITRAH' } });
  assert(Number(poolAfterDup?.balance || 0) === initialPoolBal, 'Duplicate webhook did NOT double-increment FundPool');

  // -------------------------------------------------------------
  // TEST 4: Admin Zakat Endpoints & 8 Asnaf Distribution
  // -------------------------------------------------------------
  console.log('\n--- 4. Testing Admin Zakat API Endpoints ---');

  // 4a. GET /api/admin/zakat/orders
  const getOrdersReq = new NextRequest('http://localhost:3000/api/admin/zakat/orders?search=' + testKwitansi, {
    headers: {
      'x-user-id': testUser.id,
      'x-user-role': 'ADMIN',
    },
  });
  const getOrdersRes = await getZakatOrders(getOrdersReq);
  assert(getOrdersRes.status === 200, 'GET /api/admin/zakat/orders returns 200 OK for ADMIN');
  const getOrdersJson = await getOrdersRes.json();
  assert(getOrdersJson.data?.length >= 1, 'GET /api/admin/zakat/orders found test order');

  // 4b. Create Mustahiq & Allocate Zakat
  const testMustahiq = await prisma.mustahiqProfile.create({
    data: {
      namaMustahiq: 'Bapak Subur (Fakir Test)',
      nik: encryptAES256('3578010101900001'),
      kategoriAsnaf: Asnaf.FAKIR,
      alamat: 'Keputih Sukolilo Surabaya',
      noTelepon: '081333444555',
      statusVerifikasi: VerificationStatus.VERIFIED,
    },
  });

  const distributeReq = new NextRequest('http://localhost:3000/api/admin/zakat/distributions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': testUser.id,
      'x-user-role': 'ADMIN',
    },
    body: JSON.stringify({
      mustahiqId: testMustahiq.id,
      jenisZakat: 'FITRAH',
      bentukBantuan: 'UANG',
      nominalRp: 100000,
      notes: 'Bantuan santunan fakir Ramadhan',
    }),
  });

  const distRes = await postDistribution(distributeReq);
  assert(distRes.status === 201, 'POST /api/admin/zakat/distributions allocated funds successfully (201 Created)');

  // 4c. GET /api/admin/zakat/distributions
  const getDistReq = new NextRequest('http://localhost:3000/api/admin/zakat/distributions?mustahiqId=' + testMustahiq.id, {
    headers: {
      'x-user-role': 'ADMIN',
    },
  });
  const getDistRes = await getDistributions(getDistReq);
  assert(getDistRes.status === 200, 'GET /api/admin/zakat/distributions returns 200 OK');
  const getDistJson = await getDistRes.json();
  assert(getDistJson.data?.length === 1, 'Distribution log correctly recorded for mustahiq');

  // 4d. GET /api/admin/zakat/summary
  const summaryReq = new NextRequest('http://localhost:3000/api/admin/zakat/summary', {
    headers: {
      'x-user-role': 'ADMIN',
    },
  });
  const summaryRes = await getZakatSummary(summaryReq);
  assert(summaryRes.status === 200, 'GET /api/admin/zakat/summary returns 200 OK');
  const summaryJson = await summaryRes.json();
  assert(summaryJson.data?.fundPools?.fitrah !== undefined, 'Summary returns fund pools stats');
  assert(summaryJson.data?.mustahiq?.asnafBreakdown?.FAKIR !== undefined, 'Summary returns 8 Asnaf breakdown stats');

  // Cleanup test records
  console.log('\n--- Cleaning up test artifacts ---');
  await prisma.zakatDistribution.deleteMany({ where: { mustahiqId: testMustahiq.id } });
  await prisma.mustahiqProfile.delete({ where: { id: testMustahiq.id } });
  await prisma.zakatOrder.delete({ where: { id: testOrder.id } });
  await prisma.transaction.delete({ where: { id: testTx.id } });
  console.log('🧹 Cleanup complete.');

  console.log('\n========================================================');
  console.log(`📊 RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSelfCheck()
  .catch((e) => {
    console.error('Fatal testing error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
