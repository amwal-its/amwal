// Self-check Sprint 4 (Awan): NIK AES-256 + distribusi zakat atomic FundPool.
// Jalankan: npx tsx scripts/sprint4-selfcheck.ts
import 'dotenv/config';
import assert from 'node:assert/strict';
import { prisma } from '../lib/prisma';
import { Prisma } from '../app/generated/prisma/client';
import { encryptAES256, decryptAES256 } from '../lib/crypto';
import { fundPoolKodeByZakat } from '../lib/fund-pool';

const D = (v: string | number) => new Prisma.Decimal(v);

async function main() {
  const cleanups: Array<() => Promise<unknown>> = [];
  try {
    // --- 4.3: NIK tersimpan terenkripsi, decrypt roundtrip benar ---
    const nikPlain = '3201010101010001';
    const nikEnc = encryptAES256(nikPlain);
    assert.notEqual(nikEnc, nikPlain, 'NIK harus tersimpan terenkripsi');
    assert.ok(nikEnc.includes(':'), 'Format enkripsi harus iv:encrypted');
    assert.equal(decryptAES256(nikEnc), nikPlain, 'Decrypt harus mengembalikan NIK asli');

    const mustahiq = await prisma.mustahiqProfile.create({
      data: {
        namaMustahiq: 'Selfcheck Mustahik',
        nik: nikEnc,
        kategoriAsnaf: 'FAKIR',
        noTelepon: '081234567890',
        statusVerifikasi: 'PENDING',
      },
    });
    cleanups.push(() => prisma.mustahiqProfile.delete({ where: { id: mustahiq.id } }));

    const stored = await prisma.mustahiqProfile.findUniqueOrThrow({ where: { id: mustahiq.id } });
    assert.ok(!stored.nik!.includes(nikPlain), 'NIK tidak boleh tersimpan plaintext');
    assert.equal(decryptAES256(stored.nik!), nikPlain, 'NIK di DB harus terdecrypt ke nilai asli');

    // --- 4.4: potong balance + tambah totalDistributed secara atomic ---
    await prisma.fundPool.upsert({
      where: { kode: 'ZAKAT_MAAL' },
      update: { balance: D(1000000), totalDistributed: D(0) },
      create: { kode: 'ZAKAT_MAAL', nama: 'Zakat Maal', balance: D(1000000), totalDistributed: D(0) },
    });

    const poolKode = fundPoolKodeByZakat('MAAL_PENGHASILAN');
    assert.equal(poolKode, 'ZAKAT_MAAL');

    // Cukup saldo: guard update harus sukses (count 1)
    const nominal = D(100000);
    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) =>
      tx.fundPool.updateMany({
        where: { kode: poolKode, balance: { gte: nominal } },
        data: { balance: { decrement: nominal }, totalDistributed: { increment: nominal } },
      })
    );
    assert.equal(updated.count, 1, 'Distribusi dengan saldo cukup harus berhasil');

    const pool = await prisma.fundPool.findUniqueOrThrow({ where: { kode: poolKode } });
    assert.ok(pool.balance.equals(D(900000)), `balance harus 900000, got ${pool.balance}`);
    assert.ok(pool.totalDistributed.equals(D(100000)), `totalDistributed harus 100000, got ${pool.totalDistributed}`);

    // Saldo tidak cukup: guard update harus count 0 (route → HTTP 400)
    const tooBig = D(999999999);
    const blocked = await prisma.$transaction(async (tx: Prisma.TransactionClient) =>
      tx.fundPool.updateMany({
        where: { kode: poolKode, balance: { gte: tooBig } },
        data: { balance: { decrement: tooBig }, totalDistributed: { increment: tooBig } },
      })
    );
    assert.equal(blocked.count, 0, 'Saldo tidak cukup harus ditolak');

    console.log('sprint4-selfcheck: PASS (NIK AES-256 + distribusi atomic)');
  } finally {
    await prisma.fundPool.update({ where: { kode: 'ZAKAT_MAAL' }, data: { balance: D(0), totalDistributed: D(0) } }).catch(() => {});
    for (const c of cleanups.reverse()) await c().catch(() => {});
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
