// Scratch test Task 3.3 & 3.4 (Sprint 3) — jalankan: npx tsx scripts/zakat-s3-scratch.ts
// Menguji: entri offline (FundPool increment), webhook signature, atomic $transaction, idempotensi.
import 'dotenv/config';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { NextRequest } from 'next/server';
import { prisma } from '../lib/prisma';
import { Prisma } from '../app/generated/prisma/client';
import { POST as offlinePOST } from '../app/api/admin/zakat/orders/route';
import { POST as webhookPOST } from '../app/api/webhooks/payment/zakat/route';
import { verifyWebhookSignature } from '../lib/webhook-signature';

const prevSecret = process.env.PAYMENT_WEBHOOK_SECRET;
process.env.PAYMENT_WEBHOOK_SECRET = 'scratch_test_secret';

const SAMPLE_SIGNATURE = (raw: string) =>
  createHmac('sha256', 'scratch_test_secret').update(raw).digest('hex');

const createdUserIds: string[] = [];

async function makeUser(role: 'ADMIN' | 'PETUGAS_LAPANGAN' | 'WAKIF') {
  const user = await prisma.user.create({
    data: { name: 'Scratch Petugas', role, email: `scratch-${role}-${Date.now()}@test.dev` },
  });
  createdUserIds.push(user.id);
  return user;
}

function offlineReq(userId: string, role: string, body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest('http://localhost/api/admin/zakat/orders', {
    method: 'POST',
    headers: { 'x-user-id': userId, 'x-user-role': role, 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

async function poolBalance(kode: string) {
  const p = await prisma.fundPool.findUnique({ where: { kode } });
  return p?.balance ?? new Prisma.Decimal(0);
}

async function main() {
  const admin = await makeUser('ADMIN');
  const petugas = await makeUser('PETUGAS_LAPANGAN');

  // ---- Task 3.3: entri offline UANG, ADMIN ----
  const uangBefore = await poolBalance('ZAKAT_MAAL');
  const resUang = await offlinePOST(offlineReq(admin.id, 'ADMIN', {
    jenisZakat: 'MAAL_PENGHASILAN',
    namaMuzakki: 'Fulan Bin Fulan',
    isAnonymous: true,
    bentukZakat: 'UANG',
    nominalRp: 250000,
  }));
  assert.equal(resUang.status, 201, 'offline UANG harus 201');
  const uangData = await resUang.json();
  assert.ok(uangData.data.nomorKwitansi.startsWith(`ZKT-OFF-${new Date().getFullYear()}-`), 'format kwitansi ZKT-OFF-YYYY-XXXX');
  assert.equal(uangData.data.status, 'TERVERIFIKASI');
  assert.equal(uangData.data.isAnonymous, true);
  assert.equal(uangData.data.nominal, '250000');
  const uangAfter = await poolBalance('ZAKAT_MAAL');
  assert.ok(uangAfter.minus(uangBefore).equals(250000), 'FundPool ZAKAT_MAAL +250000');

  // ---- Task 3.3: entri offline BERAS, PETUGAS_LAPANGAN (harga dari config aktif) ----
  const fitrahBefore = await poolBalance('ZAKAT_FITRAH');
  const resBeras = await offlinePOST(offlineReq(petugas.id, 'PETUGAS_LAPANGAN', {
    jenisZakat: 'FITRAH',
    namaMuzakki: 'Aisyah',
    bentukZakat: 'BERAS',
    jumlahBerasKg: 10,
    jenisBeras: 'Standar',
  }));
  assert.equal(resBeras.status, 201, 'offline BERAS harus 201');
  const berasData = await resBeras.json();
  assert.equal(berasData.data.jenisZakat, 'FITRAH');
  assert.equal(berasData.data.beratBerasKg, '10');
  // harga dari config Standar (45rb/jiwa / 2.5kg = 18rb/kg) → 10kg * 18rb = 180.000
  assert.equal(berasData.data.nominal, '180000');
  const fitrahAfter = await poolBalance('ZAKAT_FITRAH');
  assert.ok(fitrahAfter.minus(fitrahBefore).equals(180000), 'FundPool ZAKAT_FITRAH +180000');

  // ---- Task 3.3: RBAC — role WAKIF harus 403 ----
  const wakif = await makeUser('WAKIF');
  const resWakif = await offlinePOST(offlineReq(wakif.id, 'WAKIF', {
    jenisZakat: 'FITRAH', namaMuzakki: 'X', bentukZakat: 'UANG', nominalRp: 1000,
  }));
  assert.equal(resWakif.status, 403, 'role WAKIF harus 403');

  // ---- Task 3.4: signature check ----
  assert.equal(verifyWebhookSignature('{"a":1}', null), false, 'tanpa header signature → false');
  assert.equal(verifyWebhookSignature('{"a":1}', 'bogus'), false, 'signature salah → false');
  assert.equal(verifyWebhookSignature('{"a":1}', SAMPLE_SIGNATURE('{"a":1}')), true, 'signature benar → true');

  // ---- Task 3.4: webhook sukses atomic ----
  const order = await prisma.zakatOrder.create({
    data: {
      nomorKwitansi: `ZKT-DIG-${Date.now()}`,
      jenisZakat: 'MAAL_PENGHASILAN',
      metodePembayaran: 'TRANSFER',
      namaMuzakki: 'Digital Muzakki',
      nominal: 500000,
      status: 'MENUNGGU_VERIFIKASI',
    },
  });
  const tx = await prisma.transaction.create({
    data: {
      wakifId: admin.id,
      jenisTransaksi: 'ZAKAT',
      amount: 500000,
      paymentMethod: 'TRANSFER',
      statusPembayaran: 'PENDING',
      disbursementDestination: 'bank_nadzir_mitra',
    },
  });
  await prisma.zakatOrder.update({ where: { id: order.id }, data: { transactionId: tx.id } });

  const maalBefore = await poolBalance('ZAKAT_MAAL');
  const payload = { orderId: order.nomorKwitansi, transactionId: tx.id, status: 'SUCCESS', amount: 500000 };
  const rawPayload = JSON.stringify(payload);
  const webhookRes = await webhookPOST(new NextRequest('http://localhost/api/webhooks/payment/zakat', {
    method: 'POST',
    headers: { 'x-webhook-signature': SAMPLE_SIGNATURE(rawPayload), 'content-type': 'application/json' },
    body: rawPayload,
  }));
  assert.equal(webhookRes.status, 200, 'webhook sukses harus 200');
  const webhookData = await webhookRes.json();
  assert.equal(webhookData.data.orderId, order.id);

  const txAfter = await prisma.transaction.findUnique({ where: { id: tx.id } });
  assert.equal(txAfter?.statusPembayaran, 'LUNAS', 'Transaction → LUNAS');
  const orderAfter = await prisma.zakatOrder.findUnique({ where: { id: order.id } });
  assert.equal(orderAfter?.status, 'TERVERIFIKASI', 'ZakatOrder → TERVERIFIKASI');
  const maalAfter = await poolBalance('ZAKAT_MAAL');
  assert.ok(maalAfter.minus(maalBefore).equals(500000), 'FundPool +500000 dari webhook');

  // ---- Task 3.4: idempotensi — payload duplikat → 200, TANPA increment ganda ----
  const dupRes = await webhookPOST(new NextRequest('http://localhost/api/webhooks/payment/zakat', {
    method: 'POST',
    headers: { 'x-webhook-signature': SAMPLE_SIGNATURE(rawPayload), 'content-type': 'application/json' },
    body: rawPayload,
  }));
  assert.equal(dupRes.status, 200, 'duplikat harus 200');
  const dupData = await dupRes.json();
  assert.ok(dupData.message.includes('idempotent'), 'pesan idempotent');
  const maalAfterDup = await poolBalance('ZAKAT_MAAL');
  assert.ok(maalAfterDup.equals(maalAfter), 'tidak ada increment ganda pada duplikat');

  // ---- Task 3.4: signature invalid → 403 ----
  const badSigRes = await webhookPOST(new NextRequest('http://localhost/api/webhooks/payment/zakat', {
    method: 'POST',
    headers: { 'x-webhook-signature': 'tampered', 'content-type': 'application/json' },
    body: rawPayload,
  }));
  assert.equal(badSigRes.status, 403, 'signature invalid → 403');

  // ---- Task 3.4: status non-SUCCESS → diabaikan (200) ----
  const failedPayload = { orderId: order.nomorKwitansi, status: 'EXPIRED' };
  const rawFailed = JSON.stringify(failedPayload);
  const failedRes = await webhookPOST(new NextRequest('http://localhost/api/webhooks/payment/zakat', {
    method: 'POST',
    headers: { 'x-webhook-signature': SAMPLE_SIGNATURE(rawFailed), 'content-type': 'application/json' },
    body: rawFailed,
  }));
  assert.equal(failedRes.status, 200, 'status EXPIRED → 200 diabaikan');
  const txAfterFailed = await prisma.transaction.findUnique({ where: { id: tx.id } });
  assert.equal(txAfterFailed?.statusPembayaran, 'LUNAS', 'status EXPIRED tidak mengubah transaction');

  // ---- cleanup ----
  await prisma.zakatOrder.deleteMany({ where: { id: { in: [order.id] } } });
  await prisma.transaction.deleteMany({ where: { id: { in: [tx.id] } } });
  await prisma.zakatOrder.deleteMany({ where: { nomorKwitansi: { startsWith: `ZKT-OFF-${new Date().getFullYear()}-` } } });
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  await prisma.fundPool.update({ where: { kode: 'ZAKAT_MAAL' }, data: { balance: 0 } });
  await prisma.fundPool.update({ where: { kode: 'ZAKAT_FITRAH' }, data: { balance: 0 } });

  console.log('ALL Task 3.3 & 3.4 scratch checks PASSED.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (prevSecret === undefined) delete process.env.PAYMENT_WEBHOOK_SECRET;
    else process.env.PAYMENT_WEBHOOK_SECRET = prevSecret;
    await prisma.$disconnect();
  });
