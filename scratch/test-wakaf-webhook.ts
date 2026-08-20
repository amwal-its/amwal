import { prisma } from '../lib/prisma';
import crypto from 'crypto';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || process.env.PAYMENT_WEBHOOK_SECRET || 'secret_webhook_key_123';

async function main() {
  console.log('=== STARTING WAKAF WEBHOOK PAYMENT TESTS ===\n');

  // Setup test data
  let nadzirUser = await prisma.user.findFirst({ where: { role: 'NADZIR' } });
  if (!nadzirUser) {
    nadzirUser = await prisma.user.create({
      data: {
        email: `nadzir_webhook_${Date.now()}@example.com`,
        name: 'Nadzir Webhook',
        role: 'NADZIR',
      },
    });
  }

  let nadzirProfile = await prisma.nadzirProfile.findFirst({ where: { userId: nadzirUser.id } });
  if (!nadzirProfile) {
    nadzirProfile = await prisma.nadzirProfile.create({
      data: { userId: nadzirUser.id, kategori: 'PERSEORANGAN', statusVerifikasi: 'VERIFIED' },
    });
  }

  let waqfProgram = await prisma.waqfProgram.findFirst({ where: { nadzirProfileId: nadzirProfile.id } });
  if (!waqfProgram) {
    waqfProgram = await prisma.waqfProgram.create({
      data: {
        nadzirProfileId: nadzirProfile.id,
        judul: 'Program Wakaf Digital Test',
        targetDana: 50000000,
        jenisWakaf: 'PRODUKTIF_KEKAL',
        status: 'LIVE',
      },
    });
  }

  let wakifUser = await prisma.user.findFirst({ where: { role: 'WAKIF' } });
  if (!wakifUser) {
    wakifUser = await prisma.user.create({
      data: {
        email: `wakif_webhook_${Date.now()}@example.com`,
        name: 'Wakif Digital',
        role: 'WAKIF',
      },
    });
  }

  // --- TEST CASE 1: Invalid Signature Test ---
  console.log('--- TEST CASE 1: Invalid Signature Check ---');
  const res1 = await fetch(`${BASE_URL}/api/webhooks/payment/wakaf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Callback-Token': 'wrong_secret_token_abc',
    },
    body: JSON.stringify({
      order_id: 'some_order_id',
      transaction_status: 'settlement',
      gross_amount: 100000,
    }),
  });

  const body1 = await res1.json();
  console.log('Status HTTP:', res1.status);
  console.log('Response:', JSON.stringify(body1, null, 2));

  if (res1.status !== 403) {
    throw new Error(`Expected HTTP 403 Forbidden for invalid signature, got ${res1.status}`);
  }
  console.log('✓ TEST CASE 1 PASSED: Invalid signature rejected with HTTP 403 Forbidden.');

  // --- TEST CASE 2: Midtrans SHA512 Signature & Atomic Update ---
  console.log('\n--- TEST CASE 2: Valid Midtrans SHA512 Signature & Atomic Update ---');

  // Create Transaction & WaqfOrder in DB
  const transaction2 = await prisma.transaction.create({
    data: {
      wakifId: wakifUser.id,
      jenisTransaksi: 'WAKAF',
      amount: 1000000,
      paymentMethod: 'QRIS',
      statusPembayaran: 'PENDING',
      disbursementDestination: 'Nadzir Account',
    },
  });

  const order2 = await prisma.waqfOrder.create({
    data: {
      nomorKwitansi: `WKF-DIG-${Date.now()}-001`,
      waqfProgramId: waqfProgram.id,
      wakifId: wakifUser.id,
      namaWakif: 'Wakif Digital 1',
      bentukWakaf: 'UANG',
      nominal: 1000000,
      metodePembayaran: 'QRIS',
      status: 'MENUNGGU_VERIFIKASI',
      transactionId: transaction2.id,
    },
  });

  // Calculate Midtrans SHA512 Signature: SHA512(order_id + status_code + gross_amount + ServerKey)
  const orderId2 = order2.id;
  const statusCode2 = '200';
  const grossAmount2 = '1000000.00';
  const rawSig2 = `${orderId2}${statusCode2}${grossAmount2}${SERVER_KEY}`;
  const validSignature2 = crypto.createHash('sha512').update(rawSig2).digest('hex');

  // Initial ledger value
  const initialLedger = await prisma.waqfPrincipalLedger.findUnique({
    where: { waqfProgramId: waqfProgram.id },
  });
  const initialPokok = Number(initialLedger?.pokokDanaTerkumpul || 0);

  const res2 = await fetch(`${BASE_URL}/api/webhooks/payment/wakaf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: orderId2,
      status_code: statusCode2,
      gross_amount: grossAmount2,
      signature_key: validSignature2,
      transaction_status: 'settlement',
      transaction_id: `PG-REF-${Date.now()}`,
    }),
  });

  const body2 = await res2.json();
  console.log('Status HTTP:', res2.status);
  console.log('Response:', JSON.stringify(body2, null, 2));

  if (res2.status !== 200) throw new Error(`TEST CASE 2 FAILED: ${JSON.stringify(body2)}`);

  // Verify DB updates
  const updatedTx2 = await prisma.transaction.findUnique({ where: { id: transaction2.id } });
  const updatedOrder2 = await prisma.waqfOrder.findUnique({ where: { id: order2.id } });
  const updatedLedger2 = await prisma.waqfPrincipalLedger.findUnique({
    where: { waqfProgramId: waqfProgram.id },
  });

  if (updatedTx2?.statusPembayaran !== 'LUNAS') {
    throw new Error(`Expected Transaction statusPembayaran LUNAS, got ${updatedTx2?.statusPembayaran}`);
  }
  if (updatedOrder2?.status !== 'TERVERIFIKASI') {
    throw new Error(`Expected WaqfOrder status TERVERIFIKASI, got ${updatedOrder2?.status}`);
  }
  const newPokok2 = Number(updatedLedger2?.pokokDanaTerkumpul || 0);
  if (newPokok2 !== initialPokok + 1000000) {
    throw new Error(`Expected ledger pokok to increment by 1000000 (from ${initialPokok} to ${initialPokok + 1000000}), got ${newPokok2}`);
  }
  console.log('✓ TEST CASE 2 PASSED: Valid Midtrans SHA512 signature verified, Order TERVERIFIKASI, Ledger +1,000,000.');

  // --- TEST CASE 3: Idempotency Test (Duplicate Payload) ---
  console.log('\n--- TEST CASE 3: Idempotency Check (Duplicate Webhook Payload) ---');
  const res3 = await fetch(`${BASE_URL}/api/webhooks/payment/wakaf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: orderId2,
      status_code: statusCode2,
      gross_amount: grossAmount2,
      signature_key: validSignature2,
      transaction_status: 'settlement',
    }),
  });

  const body3 = await res3.json();
  console.log('Status HTTP:', res3.status);
  console.log('Response:', JSON.stringify(body3, null, 2));

  if (res3.status !== 200) throw new Error(`TEST CASE 3 FAILED: ${JSON.stringify(body3)}`);

  const ledgerAfterDuplicate = await prisma.waqfPrincipalLedger.findUnique({
    where: { waqfProgramId: waqfProgram.id },
  });
  const pokokAfterDuplicate = Number(ledgerAfterDuplicate?.pokokDanaTerkumpul || 0);

  if (pokokAfterDuplicate !== newPokok2) {
    throw new Error(`Idempotency FAILED! Ledger was double incremented from ${newPokok2} to ${pokokAfterDuplicate}`);
  }
  console.log('✓ TEST CASE 3 PASSED: Duplicate webhook returned HTTP 200 without double-incrementing ledger.');

  // --- TEST CASE 4: Header Signature (X-Callback-Token) Test ---
  console.log('\n--- TEST CASE 4: Header Signature (X-Callback-Token) Test ---');
  const order4 = await prisma.waqfOrder.create({
    data: {
      nomorKwitansi: `WKF-DIG-${Date.now()}-002`,
      waqfProgramId: waqfProgram.id,
      wakifId: wakifUser.id,
      namaWakif: 'Wakif Digital 2',
      bentukWakaf: 'UANG',
      nominal: 750000,
      metodePembayaran: 'VA',
      status: 'MENUNGGU_VERIFIKASI',
    },
  });

  const res4 = await fetch(`${BASE_URL}/api/webhooks/payment/wakaf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Callback-Token': SERVER_KEY,
    },
    body: JSON.stringify({
      order_id: order4.id,
      transaction_status: 'settlement',
      gross_amount: 750000,
    }),
  });

  const body4 = await res4.json();
  console.log('Status HTTP:', res4.status);
  console.log('Response:', JSON.stringify(body4, null, 2));

  if (res4.status !== 200) throw new Error(`TEST CASE 4 FAILED: ${JSON.stringify(body4)}`);

  const updatedOrder4 = await prisma.waqfOrder.findUnique({ where: { id: order4.id } });
  if (updatedOrder4?.status !== 'TERVERIFIKASI') {
    throw new Error(`Expected WaqfOrder status TERVERIFIKASI, got ${updatedOrder4?.status}`);
  }
  console.log('✓ TEST CASE 4 PASSED: X-Callback-Token header verified & order verified.');

  console.log('\n=== ALL WAKAF WEBHOOK TESTS PASSED SUCCESSFULLY! ===');
}

main().catch((err) => {
  console.error('\n❌ TEST RUN ERROR:', err);
  process.exit(1);
});
