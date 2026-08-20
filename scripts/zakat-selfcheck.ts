// Self-check pure logic kalkulator zakat (Task 2.3). Jalankan: npx tsx scripts/zakat-selfcheck.ts
import assert from 'node:assert/strict';
import { Prisma } from '../app/generated/prisma/client';
import { calculateZakat, BERAS_PER_JIWA_KG, NISAB_EMAS_GRAM } from '../lib/zakat.service';

const D = (s: string | number) => new Prisma.Decimal(s);
const refs = {
  goldPricePerGram: D(1_200_000),
  fitrahPricePerJiwa: D(45_000),
  hargaBerasPerKg: D(45_000).dividedBy(BERAS_PER_JIWA_KG),
};

function checkHasil(r: { hasilKewajiban: Prisma.Decimal }, expected: string) {
  assert.ok(r.hasilKewajiban.equals(D(expected)), `expected ${expected}, got ${r.hasilKewajiban}`);
}

// FITRAH: jiwa * harga per jiwa
let r = calculateZakat({ jenisZakat: 'FITRAH', jumlahJiwa: 4 }, refs);
checkHasil(r, '180000');
assert.equal(r.mencapaiNisab, true);
assert.ok(r.nisabDigunakan?.equals(D(45000)));

// EMAS di bawah nisab (84 gram) -> 0
r = calculateZakat({ jenisZakat: 'EMAS', beratEmasGram: 84 }, refs);
checkHasil(r, '0');
assert.equal(r.mencapaiNisab, false);
assert.ok(r.nisabDigunakan?.equals(NISAB_EMAS_GRAM.times(refs.goldPricePerGram)));

// EMAS di atas nisab (100 gram): 100 * 1.2jt * 2.5% = 3jt
r = calculateZakat({ jenisZakat: 'EMAS', beratEmasGram: 100 }, refs);
checkHasil(r, '3000000');
assert.equal(r.mencapaiNisab, true);

// MAAL_PENGHASILAN di bawah nisab tahunan -> 0
r = calculateZakat({ jenisZakat: 'MAAL_PENGHASILAN', penghasilanPerBulan: 8_000_000 }, refs);
checkHasil(r, '0');
assert.equal(r.mencapaiNisab, false);

// MAAL_PENGHASILAN di atas nisab: 10jt/bulan * 2.5% = 250rb
r = calculateZakat({ jenisZakat: 'MAAL_PENGHASILAN', penghasilanPerBulan: 10_000_000 }, refs);
checkHasil(r, '250000');
assert.equal(r.mencapaiNisab, true);

// PERUSAHAAN: net = aktiva - pasiva, TIDAK pakai revenue
r = calculateZakat(
  { jenisZakat: 'PERUSAHAAN', aktivaLancar: 200_000_000, pasivaLancar: 50_000_000 },
  refs
);
checkHasil(r, '3750000'); // 150jt * 2.5%

// PERTANIAN irigasi 1000 kg: 1000 * 5% = 50
r = calculateZakat({ jenisZakat: 'PERTANIAN', hasilPanenKg: 1000, sistemIrigasi: 'IRIGASI' }, refs);
checkHasil(r, '50');
assert.equal(r.nisabDigunakan, null);

// PERTANIAN tadah hujan 700 kg: 700 * 10% = 70
r = calculateZakat({ jenisZakat: 'PERTANIAN', hasilPanenKg: 700, sistemIrigasi: 'TADAH_HUJAN' }, refs);
checkHasil(r, '70');

// PERTANIAN di bawah nisab (600 kg) -> 0
r = calculateZakat({ jenisZakat: 'PERTANIAN', hasilPanenKg: 600, sistemIrigasi: 'IRIGASI' }, refs);
checkHasil(r, '0');

// FIDYAH: 30 hari * harga per kg (18.000/kg dari config fitrah 45rb/2.5kg)
r = calculateZakat({ jenisZakat: 'FIDYAH', jumlahHari: 30 }, refs);
checkHasil(r, '540000'); // 30 * 18.000/kg

// KAFARAT jumlah hari
r = calculateZakat({ jenisZakat: 'KAFARAT', jumlahHari: 2 }, refs);
checkHasil(r, '36000');

// Referensi harga wajib: EMAS tanpa goldPricePerGram harus error
assert.throws(
  () => calculateZakat({ jenisZakat: 'EMAS', beratEmasGram: 100 }, {}),
  /Referensi harga tidak tersedia: goldPricePerGram/
);

console.log('All zakat calculator self-checks passed.');
