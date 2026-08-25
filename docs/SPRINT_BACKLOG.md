# Sprint Backlog — Amwal V.1 (Revisi Putaran 6 — Single Source of Truth)

**Tim:** Bara (Wakaf + OAuth), Awan (Zakat + Gold Price API), Naufal (Qurban + Auth Foundation)  
**Target:** Staging Deployment dalam 14 hari (7 Micro-Sprint × 2 hari)  
**Status Prasyarat:** Sprint 1 (Auth/RBAC foundation) CLOSED  

---

## ⚠️ Perubahan Scope Putaran 6 — Baca Dulu

- **DIKELUARKAN dari staging**: Dashboard Analitik RFMD/Segmentasi Donatur/Prediksi Churn — JANGAN dibangun sebagian pun, meski muncul di mockup UI Admin. Ini murni riset lanjutan pasca-MVP.
- **DITUNDA**: Modul Infaq/Sedekah — meski sudah ada mockup UI, TIDAK ADA task Infaq di backlog ini.
- **DITAMBAHKAN**: OAuth Google (bukan NextAuth/Supabase Auth — implementasi manual, tukar Google ID token dengan JWT+Refresh Token sistem kita sendiri), harga emas live API + fallback, akad wakalah digital Qurban, field anonim ("Hamba Allah"), detail `HewanBatch`, `admin_notes` di approval flow, GPS+video di laporan distribusi Qurban.

---

# MICRO-SPRINT 1 (Hari 1-2) — Fondasi (Auth / RBAC Baseline & Schema Sync)

> **Status:** CLOSED (Baseline Fondasi Terpasang)

## 🟢 Bara & 🔵 Naufal — Modul Auth & RBAC Foundation

### Task 1.1 — Fix Bug Kritis Auth/RBAC Foundation
**Scope Utama:** [Backend Auth & Middleware]  
**Endpoint:** Internal Auth Utility & Middleware (`proxy.ts`, `lib/tokens.ts`)  
**Target Database:** `User`, `RefreshToken`  
**RBAC & Middleware Guard:** 4 Role Final (`WAKIF`, `NADZIR`, `PETUGAS_LAPANGAN`, `ADMIN`)  
**Detail Alur Logic:**  
- Implementasi sistem token JWT internal (`lib/tokens.ts`) dengan short-lived Access Token (15m/7d) dan Refresh Token cookie `HttpOnly`.
- Refaktor proxy middleware (`proxy.ts`) untuk memeriksa role-based access control pada protected routes (`/dashboard/*`, `/api/admin/*`, `/api/mustahik/*`, `/api/muzaki/*`, `/api/donation/*`).
- Penyesuaian `role` enum di Prisma schema dengan default `WAKIF`.  
**Acceptance Criteria (DoD):**  
- [ ] RBAC 4 role teruji, access token + refresh token cookie `HttpOnly` berfungsi tanpa leakage di client side.

---

## 🔵 Naufal — Modul Auth & Token Rotation

### Task 1.2 — Extend Auth: RefreshToken Table & Token Rotation Flow
**Scope Utama:** [Backend Auth Engine]  
**Endpoint:** `POST /api/auth/refresh`, `POST /api/auth/logout`  
**Target Database:** `RefreshToken` (relasi `User`, `tokenHash`, `expiresAt`, `isRevoked`)  
**RBAC & Middleware Guard:** Publik (refresh) / Authenticated (logout)  
**Detail Alur Logic:**  
- Pada `POST /api/auth/refresh`: verifikasi refresh token dari cookie `amwal_refresh`, periksa apakah `isRevoked === false` dan belum expired. Terbitkan access token & refresh token baru, tandai token lama `isRevoked: true` (Refresh Token Rotation).
- Pada `POST /api/auth/logout`: tandai refresh token di DB sebagai `isRevoked: true`, dan bersihkan cookie `amwal_token` serta `amwal_refresh` (set `Max-Age=0`).  
**Acceptance Criteria (DoD):**  
- [ ] Token rotation teruji; refresh token lama yang sudah di-rotate/revoked ditolak otomatis.

---

## 🟢 Bara — Modul Database Baseline & Schema Sync

### Task 1.3 — Migrasi Full DBML → `schema.prisma` & Seed Dasar
**Scope Utama:** [Database Schema & Seed]  
**Endpoint:** Prisma Engine & CLI (`prisma db seed`)  
**Target Database:** 33 Tabel & 27 Enums  
**RBAC & Middleware Guard:** Internal Engine / CLI  
**Detail Alur Logic:**  
- Melakukan sinkronisasi schema Prisma ke PostgreSQL Supabase.
- Konfigurasi adapter `@prisma/adapter-pg` untuk connection pooling.
- Menyiapkan script seed (`prisma/seed.ts`) untuk mengisi data awal: `ZakatFitrahConfig`, 4 `FundPool` (`ZAKAT_MAAL`, `ZAKAT_FITRAH`, `INFAK`, `SEDEKAH`), dan `ZakatGoldPriceHistory` baseline.  
**Acceptance Criteria (DoD):**  
- [ ] `npx prisma db seed` berjalan lancar; schema ter-sync 100% tanpa migration drift.

---

## 🟡 Awan — Modul Infrastruktur & Storage

### Task 1.4 — Supabase Storage Setup & Dokumentasi Baseline
**Scope Utama:** [Infrastructure & Docs]  
**Endpoint:** Supabase Storage API Client  
**Target Database:** Supabase Storage Buckets (`nadzir-docs`, `proof-photos`, `distribution-videos`)  
**RBAC & Middleware Guard:** RLS Bucket Policies  
**Detail Alur Logic:**  
- Membuat storage bucket di Supabase dengan RLS policies yang sesuai untuk dokumen privat vs media publik.
- Menyusun draft dokumentasi arsitektur (`DOMAIN_GLOSSARY.md`, `DECISION_LOG.md`).  
**DoD:** Upload file dari backend API ke Supabase Storage terverifikasi sukses. — **DONE** (lihat `lib/storage.ts`)


# MICRO-SPRINT 2 (Hari 3-4) — Skeleton API Digital

## 🟢 Bara — Modul Wakaf & OAuth Google

### Task 2.1 — CRUD `WaqfProgram`
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/wakaf/programs`, `GET /api/wakaf/programs`, `GET /api/wakaf/programs/[id]`, `PATCH /api/wakaf/programs/[id]`  
**Target Database:** `WaqfProgram`, `NadzirProfile`, `WaqfPrincipalLedger`  
**RBAC & Middleware Guard:** `POST`/`PATCH` → `NADZIR` (verified); `GET` → publik  
**Detail Alur Logic:**  
- Create program + `WaqfPrincipalLedger` (balance = 0, totalPokok = 0, totalHasil = 0) dalam satu `$transaction`.
- `PATCH jenisWakaf` ditolak jika status program `!== 'DRAFT'`.
- Supports filter `kategori`, `kategoriWakafEnum`, dan query `search` pada `GET /api/wakaf/programs`.  
**Acceptance Criteria (DoD):**  
- [ ] `tsc` bersih tanpa error.
- [ ] `WaqfPrincipalLedger` otomatis tercipta bersamaan dengan pembuatan `WaqfProgram`.
- [ ] Penguncian `jenisWakaf` saat status program terpublikasi/LIVE teruji.
- [ ] Filter `kategori` dan `search` berfungsi dengan benar.

---

### Task 2.2 — Submit `NadzirProfile` + `NadzirDocument` + OCR PoC
**Scope Utama:** [Backend API Handler] + [Integrasi Eksternal: OCR]  
**Endpoint:** `POST /api/nadzir/profile`, `POST /api/nadzir/documents`  
**Target Database:** `NadzirProfile`, `NadzirDocument`  
**RBAC & Middleware Guard:** role `NADZIR`  
**Detail Alur Logic:**  
- Submit data profil Nadzir (kategori individu/organisasi, alamat, rekening bank).
- Upload dokumen legalitas (KTP/Sertifikat BWI) ke Supabase Storage bucket `nadzir-docs`.
- Integrasi OCR Google Vision (dengan fallback mock parser jika OCR timeout/gagal) untuk mengekstrak NIK/Nomor BWI.
- NIK wajib dienkripsi menggunakan AES-256 sebelum disimpan ke DB.  
**Acceptance Criteria (DoD):**  
- [ ] File berhasil ter-upload ke Supabase Storage.
- [ ] NIK tersimpan dalam kondisi terenkripsi AES-256.
- [ ] Kegagalan service OCR tidak menyebabkan HTTP 500 (graceful fallback).

---

### Task 2.7 — OAuth Google Login (BARU, Putaran 6)
**Scope Utama:** [Backend API Handler] + [Integrasi Eksternal: Google OAuth2]  
**Endpoint:**  
- `GET /api/auth/google` — redirect ke Google OAuth consent screen
- `GET /api/auth/google/callback` — terima authorization code dari Google  
**Target Database:** `User`  
**RBAC & Middleware Guard:** Publik  
**Detail Alur Logic:**  
```text
GET /api/auth/google
```
- Redirect ke `https://accounts.google.com/o/oauth2/v2/auth` dengan `client_id`, `redirect_uri`, `scope=openid email profile`, `response_type=code`.

```text
GET /api/auth/google/callback?code=...
```
1. Tukar `code` dengan access token via `POST https://oauth2.googleapis.com/token`.
2. Ambil profil user (`email`, `name`, `sub` sebagai `oauthId`) dari Google API.
3. **Cari user existing** by `email`:
   - Jika ADA dan `passwordHash` terisi (akun email/password lama) → **JANGAN otomatis link** tanpa konfirmasi (risiko account takeover). Balas error "Email sudah terdaftar, silakan login dengan password".
   - Jika ADA dan `oauthProvider='GOOGLE'` cocok → lanjut ke langkah 4 (login).
   - Jika TIDAK ADA → create `User` baru: `passwordHash: null`, `oauthProvider: 'GOOGLE'`, `oauthId: sub`, `role: 'WAKIF'` (default).
4. Terbitkan Access Token + Refresh Token menggunakan sistem token internal (`lib/tokens.ts`).
5. Set cookie `amwal_token` dan `amwal_refresh`.
6. Redirect ke halaman utama (`/`).  
**Acceptance Criteria (DoD):**  
- [ ] Login Google baru → `User` tercipta dengan `passwordHash: null`, cookie ter-set, RBAC berfungsi normal.
- [ ] Login Google dengan email yang SUDAH terdaftar via password → ditolak dengan pesan jelas, TIDAK auto-link.
- [ ] Login Google kedua kali (user sama) → match by `oauthProvider`+`oauthId`, TIDAK membuat `User` duplikat.
- [ ] `login/route.ts` existing: tambahkan guard `if (!user.passwordHash) return 401 "Akun ini terdaftar via Google"` SEBELUM `bcrypt.compare()`.

---

## 🟡 Awan — Modul Zakat & Harga Emas Live API

### Task 2.8 — `zakat_fitrah_config` CRUD (BARU, Putaran 6 — Prasyarat Task 2.3)
**Scope Utama:** [Backend API Handler]  
**Endpoint:**  
- `POST /api/admin/zakat-fitrah-config` — Admin tambah/update varian beras
- `GET /api/zakat-fitrah-config?active=true` — publik, dipakai kalkulator  
**Target Database:** `ZakatFitrahConfig`  
**RBAC & Middleware Guard:** `POST` → `ADMIN`; `GET` → publik  
**Detail Alur Logic:**  
```json
Body: { "jenisBeras": "string", "konversiHargaPerJiwa": 45000, "referensiSk": "SK BAZNAS 2026", "tahunBerlaku": "2026" }
```
- `isActive: true` default. Jika Admin membuat config baru untuk `jenisBeras` yang sama, config lama di-set `isActive: false` (tetap tersimpan untuk histori).  
**Acceptance Criteria (DoD):**  
- [x] Minimal 3 varian seed (Standar/Premium/Organik) dengan harga berbeda.
- [x] Kalkulator FITRAH (Task 2.3) WAJIB mengambil `konversiHargaPerJiwa` dari tabel ini, BUKAN hardcode/input bebas dari client.

---

### Task 2.3 — Kalkulator Zakat (Preview, Belum Bayar) — Update Putaran 6
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/zakat/calculate`  
**Target Database:** `ZakatCalculation` (create), `ZakatFitrahConfig` (read, untuk FITRAH), `ZakatGoldPriceHistory` (read, untuk EMAS/MAAL_PENGHASILAN/PERUSAHAAN)  
**RBAC & Middleware Guard:** Authenticated (semua role)  
**Detail Alur Logic:**  
- Mendukung jenis zakat: FITRAH, MAAL_TABUNGAN, MAAL_EMAS, MAAL_PENGHASILAN, MAAL_PERUSAHAAN.
- Formula PERUSAHAAN: `(aktivaLancar - hutangJangkaPendek) * 2.5%` (TANPA variabel `revenue`).
- `goldPricePerGram` **TIDAK LAGI** di-input manual dari client untuk kalkulasi resmi — wajib mengambil data terbaru dari `ZakatGoldPriceHistory`.
- `hargaBerasPerKg` untuk FITRAH wajib mengambil dari `ZakatFitrahConfig` sesuai `jenisBeras` pilihan user.  
**Acceptance Criteria (DoD):**  
- [x] Unit test per jenis zakat lolos.
- [x] `nisabDigunakan` tersimpan konsisten sesuai acuan sistem.

---

### Task 2.9 — Harga Emas Live API + Fallback (BARU, Putaran 6)
**Scope Utama:** [Backend API Handler] + [Integrasi Eksternal: Gold Price API]  
**Endpoint:**  
- `GET /api/zakat/gold-price/live` — endpoint utama, dipanggil Task 2.3
- `PATCH /api/admin/zakat/gold-price` — Admin override manual (fallback kedua)  
**Target Database:** `ZakatGoldPriceHistory`  
**RBAC & Middleware Guard:** `GET /live` → authenticated; `PATCH` → `ADMIN`  
**Detail Alur Logic:**  
```text
GET /api/zakat/gold-price/live
```
1. Cek record `ZakatGoldPriceHistory` terbaru (`ORDER BY fetchedAt DESC LIMIT 1`).
2. **Jika ada & `fetchedAt` < 6 jam lalu** → return langsung dari cache DB (efisiensi rate-limit).
3. **Jika cache basi/kosong** → panggil API provider harga emas eksternal (convert USD/troy-ounce ke IDR/gram jika diperlukan).
4. **Jika fetch sukses**: simpan record baru `source: 'LIVE_API'`, return harga baru.
5. **Jika fetch GAGAL** (timeout/API down): return record cache TERAKHIR dengan flag `{ isStale: true, fetchedAt: ... }`.
6. **Jika TIDAK ADA cache sama sekali & API gagal** → response HTTP 503 "Harga emas belum tersedia, hubungi Admin".

```text
PATCH /api/admin/zakat/gold-price
Body: { "pricePerGram": 1350000 }
```
- Insert record baru `source: 'MANUAL_FALLBACK'` yang otomatis menjadi cache aktif.  
**Acceptance Criteria (DoD):**  
- [x] Simulasi API down → endpoint tetap mengembalikan harga dari cache, tidak HTTP 500.
- [x] Cache < 6 jam → dibuktikan TIDAK melakukan network call baru ke provider eksternal.
- [x] Admin manual override → langsung menjadi harga aktif berikutnya.

---

### Task 2.4 — `ZakatOrder` Creation (Flow Digital) — Update Putaran 6
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/zakat/orders`  
**Target Database:** `ZakatOrder`, `Transaction`  
**RBAC & Middleware Guard:** `WAKIF` / Authenticated  
**Detail Alur Logic:**  
- Menerima payload pesanan zakat digital.
- **Tambahan Putaran 6**: Menerima field opsional `isAnonymous: boolean` (default `false`).
- Generate `nomorKwitansi` (`ZKT-YYYY-XXXX`).
- Jika metode pembayaran digital → integrasikan pembuatan invoice Midtrans/Xendit.  
**Acceptance Criteria (DoD):**  
- [x] `isAnonymous: true` tersimpan dengan benar di DB.
- [x] Order tersimpan dengan status `MENUNGGU_PEMBAYARAN`.

---

## 🔵 Naufal — Modul Qurban

### Task 2.5 — `HewanBatch` + `QurbanAnimalSlot` dengan Row-Lock — Update Putaran 6
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/admin/qurban/hewan-batches`, `GET /api/qurban/hewan-batches`, fungsi internal `reserveSlot()`  
**Target Database:** `HewanBatch`, `QurbanAnimalSlot`  
**RBAC & Middleware Guard:** `POST` → `ADMIN`; `GET` → publik  
**Detail Alur Logic:**  
```json
Body: {
  "jenisHewan": "SAPI", "totalSlot": 7, "hargaPerSlot": 3500000,
  "ras": "Limosin", "kelasGrade": "A", "estimasiBeratKg": 350,
  "jenisKelamin": "JANTAN", "wilayahPenyaluran": "Kab. Bogor",
  "targetPenerimaManfaat": 150, "tanggalPenyembelihanEstimasi": "2026-06-17",
  "galeriFotoUrls": ["https://..."]
}
```
- Fungsi internal `reserveSlot()` wajib menggunakan `SELECT ... FOR UPDATE` dalam transaksi DB untuk mencegah race condition / double-booking slot.  
**Acceptance Criteria (DoD):**  
- [ ] Field detail baru (`ras`, `kelasGrade`, dst.) tersimpan dan muncul di `GET` list/detail.
- [ ] Concurrency test: 10 request simultan tidak menyebabkan slot ter-booking melebihi `totalSlot`.

---

### Task 2.6 — `QurbanOrder` Creation (Flow Digital) — Update Putaran 6: Wajib Akad Wakalah
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/qurban/orders`  
**Target Database:** `QurbanOrder`, `QurbanAnimalSlot` (panggil `reserveSlot()`)  
**RBAC & Middleware Guard:** role `WAKIF`  
**Detail Alur Logic:**  
```json
Body: {
  "hewanBatchId": "uuid", "jenisHewan": "SAPI", "tipeKepemilikan": "PATUNGAN",
  "jumlahSlotDiminta": 1, "opsiPesan": "PASRAH_PANITIA",
  "namaPengqurban": "Fulan", "teleponPengqurban": "08123456789",
  "akadWakalahAccepted": true
}
```
- **VALIDASI WAJIB**: Jika `akadWakalahAccepted !== true` → return HTTP 400 "Akad wakalah wajib disetujui sebelum melanjutkan pembayaran". JANGAN panggil `reserveSlot()` sama sekali.
- Simpan `akadWakalahText` (teks standar syariat) dan `akadWakalahAcceptedAt: now()`.  
**Acceptance Criteria (DoD):**  
- [ ] `akadWakalahAccepted: false` atau tidak dikirim → HTTP 400, slot `QurbanAnimalSlot` TIDAK ter-reservasi.

---

# MICRO-SPRINT 3 (Hari 5-6) — Offline Flow + Payment Gateway

## 🟢 Bara — Modul Offline Wakaf & Webhook

### Task 3.1 — `WaqfOrder` Entri Offline (Amil/Admin) + Field AIW + `isAnonymous`
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/admin/wakaf/orders`  
**Target Database:** `WaqfOrder`, `WaqfOrderUnit`, `Transaction`  
**RBAC & Middleware Guard:** `ADMIN` / `PETUGAS_LAPANGAN` (Amil)  
**Detail Alur Logic:**  
- Input transaksi wakaf offline (tunai/barang) oleh petugas/admin.
- Body input: `waqfProgramId`, `nominal`, `metodePembayaran` (`TUNAI`/`TRANSFER_MANUAL`), `namaWakif`, `teleponWakif`, `isAnonymous: boolean` (default `false`), `bentukWakafEnum` (`UANG`/`BARANG`).
- Jika `bentukWakafEnum === 'BARANG'`: wajib menyertakan `deskripsiBarang`, `estimasiNilaiBarang`, dan `nomorAIW` (Akta Ikrar Wakaf BWI).
- Status transaksi langsung diset ke `TERVERIFIKASI` (jika `TUNAI`) atau `MENUNGGU_VERIFIKASI`. Auto-generate `nomorKwitansi` (`WKF-OFF-YYYY-XXXX`).  
**Acceptance Criteria (DoD):**  
- [ ] `isAnonymous: true` tersimpan dengan benar di DB.
- [ ] `namaWakif` tetap wajib diisi di backend untuk pencatatan administratif meskipun `isAnonymous: true`.
- [ ] Entri wakaf barang wajib memvalidasi `nomorAIW`.
- [ ] Kwitansi offline berhasil di-generate.

---

### Task 3.2 — Webhook Payment Gateway Wakaf (Midtrans/Xendit)
**Scope Utama:** [Backend API Handler / Webhook]  
**Endpoint:** `POST /api/webhooks/payment/wakaf` (atau unified `/api/webhooks/payment`)  
**Target Database:** `Transaction`, `WaqfOrder`, `WaqfPrincipalLedger`  
**RBAC & Middleware Guard:** Signature Verified (bukan JWT)  
**Detail Alur Logic:**  
- Verifikasi signature HTTP request dari Payment Gateway (misal Midtrans SHA512 atau header token).
- Mengambil `orderId` / `transactionId`.
- Update `Transaction.statusPembayaran` → `LUNAS`.
- Update `WaqfOrder.status` → `TERVERIFIKASI`.
- Increment `WaqfPrincipalLedger.totalPokok` sesuai nominal dalam `$transaction`.
- Idempotency guard: jika order sudah `TERVERIFIKASI`, kembalikan HTTP 200 tanpa increment ganda.  
**Acceptance Criteria (DoD):**  
- [ ] Webhook notification sukses mengubah status order & ledger pokok secara atomic.
- [ ] Request dengan signature invalid ditolak (HTTP 403 Forbidden).

---

## 🟡 Awan — Modul Offline Zakat & Webhook

### Task 3.3 — `ZakatOrder` Entri Offline (Amil/Admin) + `isAnonymous`
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/admin/zakat/orders`  
**Target Database:** `ZakatOrder`, `Transaction`  
**RBAC & Middleware Guard:** `ADMIN` / `PETUGAS_LAPANGAN` (Amil)  
**Detail Alur Logic:**  
- Entri zakat offline (tunai/beras) oleh petugas amil.
- Body input: `jenisZakatEnum`, `namaMuzaki`, `teleponMuzaki`, `isAnonymous: boolean` (default `false`), `bentukZakatEnum` (`UANG`/`BERAS`).
- Jika `UANG` → input `nominalRp`. Jika `BERAS` → input `jumlahBerasKg` dan `konversiHargaPerKg` (dari `ZakatFitrahConfig`).
- Auto-generate `nomorKwitansi` (`ZKT-OFF-YYYY-XXXX`) dan set status `TERVERIFIKASI`.  
**Acceptance Criteria (DoD):**  
- [x] Mendukung zakat beras dan zakat uang.
- [x] `isAnonymous: true` tersimpan dengan benar.
- [x] Saldo `FundPool` terkait ter-increment otomatis.

---

### Task 3.4 — Webhook Payment Gateway Zakat
**Scope Utama:** [Backend API Handler / Webhook]  
**Endpoint:** `POST /api/webhooks/payment/zakat` (atau unified `/api/webhooks/payment`)  
**Target Database:** `Transaction`, `ZakatOrder`, `FundPool`  
**RBAC & Middleware Guard:** Signature Verified  
**Detail Alur Logic:**  
- Verifikasi signature webhook PG.
- Update `Transaction.statusPembayaran` → `SUCCESS` (`LUNAS`).
- Update `ZakatOrder.status` → `TERVERIFIKASI`.
- Tambahkan saldo `FundPool` sesuai `jenisZakat` (`ZAKAT_MAAL`, `ZAKAT_FITRAH`, dll) secara atomic `$transaction`.  
**Acceptance Criteria (DoD):**  
- [x] Webhook bersifat idempotent (duplicate payload diabaikan dengan HTTP 200).
- [x] Saldo `FundPool` ter-increment dengan tepat.

---

## 🔵 Naufal — Modul Offline Qurban, Setoran Petugas Lapangan & Webhook

### Task 3.5 — `QurbanOrder` Entri Offline Petugas Lapangan & Management Setoran
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/petugas/qurban-orders`, `POST /api/petugas/setoran`, `PATCH /api/admin/setoran/[id]/verify`  
**Target Database:** `QurbanOrder`, `SetoranPetugasLapangan`, `SetoranQurbanOrderLink`, `QurbanAnimalSlot`  
**RBAC & Middleware Guard:** `PETUGAS_LAPANGAN` (entri & setoran); `ADMIN` (verifikasi setoran)  
**Detail Alur Logic:**  
1. **Entri Offline**: Petugas menginput transaksi tunai (`metodePembayaran: TUNAI`), memanggil `reserveSlot()`, mencatat `nominalDibayar`, `sisaTagihan`, dan status pembayaran (`SEBAGIAN`/`LUNAS`).
2. **Pengajuan Setoran**: Petugas mengelompokkan beberapa order tunai yang belum disetor menjadi satu berkas setoran (`POST /api/petugas/setoran`) dengan melampirkan `jumlahSetor`, `buktiSetorUrl`, dan `qurbanOrderIds`.
3. **Verifikasi Admin**: Admin meninjau berkas setoran (`PATCH /api/admin/setoran/[id]/verify`). Jika disetujui (`status: VERIFIED`), seluruh `QurbanOrder` terkait otomatis berstatus `TERVERIFIKASI`.  
**Acceptance Criteria (DoD):**  
- [ ] Multi-order setoran link berfungsi dengan benar.
- [ ] Verifikasi Admin mengunci status order dan setoran secara permanen.
- [ ] Sisa cash di tangan petugas terhitung presisi.

---

### Task 3.6 — Webhook Payment Gateway Qurban (Logic DP & Pelunasan)
**Scope Utama:** [Backend API Handler / Webhook]  
**Endpoint:** `POST /api/webhooks/payment/qurban` (atau unified `/api/webhooks/payment`)  
**Target Database:** `Transaction`, `QurbanOrder`, `QurbanAnimalSlot`  
**RBAC & Middleware Guard:** Signature Verified  
**Detail Alur Logic:**  
- Mengolah notifikasi pembayaran PG untuk transaksi DP atau Pelunasan.
- Jika pembayaran DP: update `Transaction.status` → `SUCCESS`, update `QurbanOrder.nominalDibayar`, `sisaTagihan`, set `statusPembayaran: DP_LUNAS`.
- Jika Pelunasan: set `statusPembayaran: LUNAS`, update `QurbanAnimalSlot.status` → `TERJUAL`.
- Jika transaksi expired/gagal: rilis kembali `QurbanAnimalSlot` menjadi `AVAILABLE`.  
**Acceptance Criteria (DoD):**  
- [ ] Penanganan status DP vs Pelunasan teruji.
- [ ] Order expired otomatis melepaskan slot (`RELEASED`) kembali ke katalog.

---

# MICRO-SPRINT 4 (Hari 7-8) — Approval & Distribusi

## 🟢 Bara — Modul Approval Penarikan & Penyaluran Wakaf

### Task 4.1 — `FundWithdrawalRequest` Flow & Ledger Verification (`admin_notes` Wajib saat Reject)
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/wakaf/programs/[id]/withdrawal-requests`, `PATCH /api/admin/withdrawal-requests/[id]`  
**Target Database:** `FundWithdrawalRequest`, `WaqfPrincipalLedger`, `WaqfProgram`  
**RBAC & Middleware Guard:** `POST` → `NADZIR` (owner program); `PATCH` → `ADMIN`  
**Detail Alur Logic:**  
- Nadzir mengajukan penarikan hasil wakaf (`nominal`, `peruntukan`, `rekeningTujuan`).
- Admin meninjau pengajuan (`PATCH`):
  - Jika `status === 'APPROVED'`: validasi server bahwa `nominal <= WaqfPrincipalLedger.totalHasilAvailable`. Kurangi `totalHasilAvailable` dan tambah `totalHasilDisalurkan` dalam `$transaction`. `adminNotes` opsional.
  - Jika `status === 'REJECTED'`: **VALIDASI WAJIB**: `adminNotes` wajib diisi (jika kosong/undefined → return HTTP 400 "Alasan penolakan wajib diisi").  
**Acceptance Criteria (DoD):**  
- [ ] Penolakan (Reject) tanpa `adminNotes` → HTTP 400.
- [ ] Persetujuan (Approve) dengan saldo hasil cukup → HTTP 200 & ledger ter-update.
- [ ] Penarikan melebihi saldo hasil available → HTTP 400 Bad Request.

---

### Task 4.2 — Penyaluran Hasil Wakaf (`MauqufAlaihDistribution`)
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/admin/wakaf/programs/[id]/mauquf-alaih`  
**Target Database:** `MauqufAlaihDistribution`, `WaqfProgram`  
**RBAC & Middleware Guard:** `ADMIN` / `NADZIR`  
**Detail Alur Logic:**  
- Catat realisasi penyaluran dana hasil wakaf ke penerima manfaat (`mauquf_alaih`).
- Input body: `namaPenerima`, `kategoriPenerima`, `nominal`, `buktiPenyaluranUrl`, `deskripsiKegiatan`, link `withdrawalRequestId`.  
**Acceptance Criteria (DoD):**  
- [ ] Record `MauqufAlaihDistribution` ter-create.
- [ ] Relasi link ke `FundWithdrawalRequest` valid.

---

## 🟡 Awan — Modul Mustahik & Distribusi Zakat

### Task 4.3 — Management `MustahikProfile` & Verifikasi Asnaf
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/admin/mustahiq`, `GET /api/admin/mustahiq`, `PATCH /api/admin/mustahiq/[id]/verify`  
**Target Database:** `MustahikProfile`  
**RBAC & Middleware Guard:** `ADMIN` / `PETUGAS_LAPANGAN` (Amil)  
**Detail Alur Logic:**  
- Registrasi dan verifikasi data mustahik.
- Input body: `namaLengkap`, `nik`, `kategoriAsnafEnum` (8 Asnaf: FAKIR, MISKIN, AMIL, MUALLAF, RIQAB, GHARIMIN, FISABILILLAH, IBNU_SABIL), `alamat`, `noHp`, `statusVerifikasi` (`PENDING`/`VERIFIED`/`REJECTED`).
- NIK wajib dienkripsi AES-256.  
**Acceptance Criteria (DoD):**  
- [x] Enkripsi NIK AES-256 teruji.
- [x] 8 Kategori Asnaf ter-validate.

---

### Task 4.4 — Pencatatan Distribusi Zakat (`ZakatDistribution`)
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/admin/zakat/distributions`  
**Target Database:** `ZakatDistribution`, `MustahikProfile`, `FundPool`  
**RBAC & Middleware Guard:** `ADMIN`  
**Detail Alur Logic:**  
- Penyaluran dana zakat dari `FundPool` (`ZAKAT_MAAL` / `ZAKAT_FITRAH`) ke `MustahikProfile`.
- Validasi `nominal <= FundPool.balance`.
- Potong `FundPool.balance` dan tambah `FundPool.totalDistributed` dalam `$transaction`.
- Simpan `kategoriAsnaf`, `bentukBantuan` (`UANG`/`BERAS`), `buktiFotoUrl`.  
**Acceptance Criteria (DoD):**  
- [x] Saldo `FundPool` berkurang secara atomic.
- [x] Return HTTP 400 jika saldo pool tidak mencukupi.

---

## 🔵 Naufal — Modul Permohonan Institusional & Alokasi Qurban

### Task 4.5 — Permohonan Penyaluran Institusional Qurban (`admin_notes` Wajib saat Ditolak)
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/admin/permohonan-institusional`, `PATCH /api/admin/permohonan-institusional/[id]`  
**Target Database:** `PermohonanPenyaluranInstitusional`  
**RBAC & Middleware Guard:** `POST` → Publik / Admin entri manual; `PATCH` → `ADMIN`  
**Detail Alur Logic:**  
- Pengajuan alokasi daging qurban oleh lembaga/masjid eksternal.
- Admin meninjau permohonan (`PATCH`):
  - Jika `status === 'DITOLAK'`: **VALIDASI WAJIB**: `adminNotes` wajib diisi (jika kosong → return HTTP 400 "Alasan penolakan wajib diisi").
  - Jika `status === 'DISETUJUI'`: `adminNotes` opsional, set `alokasiDagingDisetujuiKg`.  
**Acceptance Criteria (DoD):**  
- [ ] Ditolak tanpa `adminNotes` → HTTP 400.
- [ ] Disetujui → HTTP 200 & alokasi kg tercatat.

---

### Task 4.6 — Alokasi & Distribusi Daging Qurban (`QurbanDistributionAllocation`)
**Scope Utama:** [Backend API Handler]  
**Endpoint:** `POST /api/admin/qurban/distribution-allocations`  
**Target Database:** `QurbanDistributionAllocation`, `PermohonanPenyaluranInstitusional`, `HewanBatch`  
**RBAC & Middleware Guard:** `ADMIN`  
**Detail Alur Logic:**  
- Mengalokasikan paket/kg daging dari `HewanBatch` ke permohonan institusional yang telah disetujui atau penerima individu.
- Validasi total alokasi daging tidak melebihi kapasitas estimasi `HewanBatch`.  
**Acceptance Criteria (DoD):**  
- [ ] Total alokasi <= kapasitas estimasi daging batch.
- [ ] Status distribusi ter-update.

---

# MICRO-SPRINT 5 (Hari 9-10) — Frontend per Modul & Screen Petugas Lapangan

## 🟢 Bara — Frontend Wakaf

### Task 5.1 — Halaman Eksplorasi & Detail Program
**Scope Utama:** [Frontend UI/Page]  
**Target Route:** `/wakaf`, `/wakaf/[id]`  
**Target Database:** `WaqfProgram`, `WaqfPrincipalLedger` (via GET API)  
**RBAC & Middleware Guard:** Publik  
**Detail Alur Logic:**  
- Halaman katalog program wakaf dengan filter kategori (Uang, Produksi, Sertifikasi), search bar, progress bar pengumpulan dana.
- Detail program menampilkan transparansi `WaqfPrincipalLedger` (pokok vs hasil).  
**Acceptance Criteria (DoD):**  
- [ ] Layout responsive.
- [ ] Integration data dari `GET /api/wakaf/programs` ter-render sempurna.

---

### Task 5.2 — Form Donasi Wakaf & Dashboard Nadzir — Update: Checkbox Anonim + OAuth
**Scope Utama:** [Frontend UI/Page]  
**Target Route:** `/wakaf/[id]/donate`, `/nadzir/dashboard`, `/login`, `/register`  
**Target Database:** `WaqfOrder`, `WaqfProgram` (via POST/GET API)  
**RBAC & Middleware Guard:** Authenticated (`WAKIF` / `NADZIR`)  
**Detail Alur Logic:**  
- Form donasi wakaf menyertakan checkbox "Sembunyikan nama saya (Hamba Allah)" → menyertakan `isAnonymous: true` pada payload `POST /api/wakaf/orders`.
- Halaman `/login` dan `/register` menyertakan tombol "Masuk dengan Google" yang mengarah ke `/api/auth/google`.
- Dashboard Nadzir untuk mengelola program & pengajuan penarikan dana.  
**Acceptance Criteria (DoD):**  
- [ ] Checkbox anonim berfungsi di form donasi.
- [ ] Tombol Google OAuth berfungsi end-to-end (redirect → consent → callback → login).

---

### Task 5.2b — UI Pencatatan & Riwayat Hasil Investasi (`WaqfYieldEntry`) — BARU
**Scope Utama:** [Frontend UI/Page] + [Backend API Handler — GET endpoint baru, belum ada sebelumnya]  
**Target Route / Endpoint:** `POST /api/admin/wakaf/programs/[id]/yield-entries`, `GET /api/wakaf/programs/[id]/yield-entries`, Dashboard `/nadzir/dashboard` & `/admin/wakaf`  
**Target Database:** `WaqfYieldEntry` (read untuk GET), `WaqfPrincipalLedger` (read, untuk breakdown saldo)  
**RBAC & Middleware Guard:**
- `POST` → `ADMIN` (sudah ada)
- `GET` (list riwayat) → `ADMIN` atau `NADZIR` (owner program) — **bukan publik**, karena `sourceDescription` bisa berisi detail operasional sensitif (mis. nama penyewa, rincian usaha). Transparansi publik cukup lewat angka agregat di halaman detail program (Task 5.1), bukan rincian per-entry.

**Detail Alur Logic & Input/Output:**

```
GET /api/wakaf/programs/[id]/yield-entries
```
- Response: `{ data: WaqfYieldEntry[], ledgerSummary: { pokokDanaTerkumpul, totalHasilAvailable, hasilInvestasiTersalurkan } }`
- Urut terbaru dulu (`recordedAt DESC`)

**UI — Dashboard Nadzir/Admin, halaman detail program:**

1. **Tampilkan section "Ledger Wakaf Produktif" HANYA jika `jenisWakaf === 'PRODUKTIF_KEKAL'`** — untuk `HABIS_PAKAI`, section ini disembunyikan total (bukan disabled, disembunyikan) karena konsep ini tidak berlaku sama sekali di tipe itu.
2. Breakdown 3 angka berdampingan (bukan lagi satu angka "dana terkumpul" generik seperti Task 5.1 versi awal):
   - **Pokok Dana (Kekal)**: `pokokDanaTerkumpul` — beri label kecil "Tidak pernah berkurang" sebagai penegasan visual prinsip fiqih ke Nadzir/Admin
   - **Hasil Tersedia**: `totalHasilAvailable`
   - **Hasil Tersalurkan**: `hasilInvestasiTersalurkan`
3. Tombol **"Catat Hasil Investasi"** (hanya muncul untuk role `ADMIN`, **tidak muncul** untuk `NADZIR` — sesuai keputusan kontrol internal FIX 1, pencatatan resmi hanya lewat Admin) → buka modal form:
   - Input `amount` (pakai komponen `AmountInput` dari Design System)
   - Input `sourceDescription` (textarea, placeholder: *"mis. Bagi hasil sewa toko kuartal 1"*)
   - **Modal konfirmasi** sebelum submit (reuse `ConfirmationModal`, pola sama seperti entri offline Wakaf/Zakat/Qurban) — tampilkan ringkasan sebelum benar-benar submit, karena ini langsung menambah saldo yang bisa dicairkan
4. **Riwayat Hasil Investasi**: list card di bawah breakdown, tiap card menampilkan `amount`, `sourceDescription`, `recordedAt`, dan nama Admin pencatat (`recordedByAdminId` di-resolve ke nama)
5. Jika `NADZIR` yang membuka halaman ini (bukan Admin): tampilkan breakdown & riwayat sebagai **read-only**, tanpa tombol "Catat Hasil Investasi" — Nadzir bisa lihat transparansi tapi tidak bisa input sendiri.

**Acceptance Criteria (DoD):**
- [ ] Section ledger sama sekali tidak render untuk program `HABIS_PAKAI` (cek dengan inspect element, bukan cuma visual disembunyikan CSS)
- [ ] Tombol "Catat Hasil Investasi" tidak muncul sama sekali untuk role `NADZIR` (bukan cuma disabled)
- [ ] Modal konfirmasi wajib muncul sebelum submit — tidak bisa submit langsung dari form
- [ ] Setelah submit sukses, breakdown 3 angka dan list riwayat ter-refresh otomatis tanpa perlu reload manual
- [ ] Label "Tidak pernah berkurang" pada Pokok Dana terlihat jelas, tidak tersamar di antara elemen lain.

---

## 🟡 Awan — Frontend Zakat

### Task 5.3 — UI Kalkulator Zakat — Update: Sumber Harga Emas
**Scope Utama:** [Frontend UI/Page]  
**Target Route:** `/zakat/kalkulator`  
**Target Database:** `ZakatGoldPriceHistory`, `ZakatFitrahConfig` (via API)  
**RBAC & Middleware Guard:** Authenticated (semua role)  
**Detail Alur Logic:**  
- UI Tab Kalkulator per jenis zakat.
- Tampilkan label info acuan harga emas: "Harga emas acuan: Rp X/gram (update: [tanggal])" dari response `GET /api/zakat/gold-price/live`.
- Jika `isStale: true`, tampilkan badge "Harga belum ter-update hari ini".  
**Acceptance Criteria (DoD):**  
- [x] Kalkulasi real-time bekerja akurat.
- [x] Label harga emas ter-render dinamis dari API.

---

### Task 5.4 — Form Bayar & Form Entri Amil — Update: Checkbox Anonim
**Scope Utama:** [Frontend UI/Page]  
**Target Route:** `/zakat/bayar`, `/amil/zakat-entri`  
**Target Database:** `ZakatOrder` (via POST API)  
**RBAC & Middleware Guard:** `WAKIF` (form bayar) / `ADMIN` & `PETUGAS_LAPANGAN` (entri amil)  
**Detail Alur Logic:**  
- Form bayar zakat digital (muzaki) & form entri offline (amil).
- Pilihan bentuk zakat (Uang/Beras), checkbox "Hamba Allah" (`isAnonymous: true`).
- Modal konfirmasi ringkasan transaksi sebelum submit entri amil.  
**Acceptance Criteria (DoD):**  
- [x] Form terintegrasi dengan API order digital & offline.
- [x] Modal konfirmasi entri amil bekerja.

---

## 🔵 Naufal — Frontend Qurban & 4 Screen Petugas Lapangan

### Task 5.5 — Katalog Hewan & Slot Picker — Update: Field Detail Baru
**Scope Utama:** [Frontend UI/Page]  
**Target Route:** `/qurban`, `/qurban/[batchId]`  
**Target Database:** `HewanBatch`, `QurbanAnimalSlot` (via GET API)  
**RBAC & Middleware Guard:** Publik  
**Detail Alur Logic:**  
- Display card katalog hewan qurban dengan detail baru: `ras`, `kelasGrade`, `estimasiBeratKg`, `wilayahPenyaluran`, `tanggalPenyembelihanEstimasi`, galeri foto (carousel `galeriFotoUrls`).
- Slot picker visual (slot 1/7 sapi atau 1/1 kambing).  
**Acceptance Criteria (DoD):**  
- [ ] Detail ras, grade, & foto carousel ter-render.
- [ ] Slot picker disable otomatis jika slot habis.

---

### Task 5.6 — Form Order Digital — Update: Modal Akad Wakalah
**Scope Utama:** [Frontend UI/Page]  
**Target Route:** `/qurban/order`  
**Target Database:** `QurbanOrder`, `QurbanAnimalSlot` (via POST API)  
**RBAC & Middleware Guard:** `WAKIF`  
**Detail Alur Logic:**  
- Form pemesanan qurban digital.
- **Modal konfirmasi Akad Wakalah** muncul sebelum lanjut ke Payment Gateway: menampilkan teks akad resmi & checkbox "Saya menyetujui akad wakalah ini". Tombol bayar disabled sampai checkbox di-centang.
- Kirim `akadWakalahAccepted: true` ke `POST /api/qurban/orders`.  
**Acceptance Criteria (DoD):**  
- [ ] Modal akad wakalah tidak bisa di-bypass.
- [ ] Payload `akadWakalahAccepted: true` terkirim.

---

### Task 5.7 — Dashboard Rekap Cash Petugas Lapangan (BARU)
**Scope Utama:** [Frontend UI/Page] + [Backend API Handler]  
**Endpoint:** `GET /api/petugas/rekap-cash`  
**Target Route:** `/petugas/dashboard`, `/petugas/rekap-cash`  
**Target Database:** `QurbanOrder`, `SetoranPetugasLapangan`, `SetoranQurbanOrderLink`  
**RBAC & Middleware Guard:** role `PETUGAS_LAPANGAN` (`enteredByPetugasId = x-user-id`)  
**Detail Alur Logic:**  
- Response: `{ data: { totalDiterima: number, totalDisetor: number, sisaDiTangan: number, daftarOrderBelumDisetor: [...] } }`.
- Frontend: Card ringkas angka besar "Rp X di tangan Anda" + list order yang belum masuk setoran manapun.  
**Acceptance Criteria (DoD):**  
- [ ] Angka `sisaDiTangan` cocok dengan kalkulasi manual.
- [ ] Order yang sudah masuk setoran (meski pending verifikasi) tidak terhitung ganda.

---

### Task 5.8 — Form Entri Transaksi Offline (BARU — Frontend untuk Task 3.5)
**Scope Utama:** [Frontend UI/Page]  
**Endpoint:** Konsumsi `POST /api/petugas/qurban-orders`  
**Target Route:** `/petugas/entri-qurban`  
**Target Database:** `QurbanOrder`, `QurbanAnimalSlot`  
**RBAC & Middleware Guard:** role `PETUGAS_LAPANGAN`  
**Detail Alur Logic:**  
- Form: Nama, No. HP, pilih Batch/Slot, Jenis Akad, Nominal Dibayar, **upload foto bukti cash** (`buktiCashUrl`).
- **Modal konfirmasi sebelum submit**: ringkasan data yang diinput, tombol "Periksa Lagi" vs "Konfirmasi & Simpan".
- Auto-calculation real-time `sisaTagihan`.  
**Acceptance Criteria (DoD):**  
- [ ] Modal konfirmasi WAJIB muncul sebelum data tersimpan ke server.
- [ ] `sisaTagihan` auto-terhitung real-time saat nominal diketik.

---

### Task 5.9 — Form Setoran ke Admin (BARU — Frontend untuk Task 3.5 Setoran)
**Scope Utama:** [Frontend UI/Page]  
**Endpoint:** `POST /api/petugas/setoran`  
**Target Route:** `/petugas/setoran`  
**Target Database:** `SetoranPetugasLapangan`, `SetoranQurbanOrderLink`  
**RBAC & Middleware Guard:** role `PETUGAS_LAPANGAN`  
**Detail Alur Logic:**  
- Form: pilih tanggal, multi-select `QurbanOrder` tunai yang belum disetor, input `jumlahSetor`, **upload bukti transfer/serah terima** (`buktiSetorUrl`).
- Tampilkan otomatis SUM nominal order yang dipilih, bandingkan dengan `jumlahSetor` yang diinput.  
**Acceptance Criteria (DoD):**  
- [ ] Multi-select order hanya menampilkan order milik petugas login yang belum disetor.
- [ ] Upload bukti setoran wajib sebelum submit.

---

### Task 5.10 — Form Verifikasi Penyaluran (BARU — Frontend untuk `QurbanDistributionReport`)
**Scope Utama:** [Frontend UI/Page] + [Backend API Handler]  
**Endpoint:** `POST /api/qurban/orders/[id]/distribution-report`  
**Target Route:** `/petugas/laporan-penyaluran`  
**Target Database:** `QurbanDistributionReport`  
**RBAC & Middleware Guard:** role `PETUGAS_LAPANGAN` atau `ADMIN`  
**Detail Alur Logic:**  
```json
Body: { "buktiFotoUrl": "string", "videoUrl": "string", "lokasiPenyaluran": "string", "lokasiLat": -6.2, "lokasiLng": 106.8, "jumlahPenerima": 100 }
```
- Frontend: gunakan Geolocation API browser (`navigator.geolocation.getCurrentPosition`) untuk auto-fill `lokasiLat`/`lokasiLng`, dengan fallback input manual jika izin ditolak.
- Upload foto WAJIB, video opsional.  
**Acceptance Criteria (DoD):**  
- [ ] Browser Geolocation auto-fill koordinat teruji.
- [ ] Fallback manual input koordinat berfungsi jika izin ditolak.
- [ ] `jumlahPenerima` wajib diisi angka > 0.

---

# MICRO-SPRINT 6 (Hari 11-12) — Cross-Cutting

## 🟢 Bara — Modul Sertifikat Digital

### Task 6.1 — Generator Sertifikat Digital Lintas Modul + Input Nomor BWI Admin
**Scope Utama:** [Backend Utility / Service] + [API Handler] + [Frontend UI]  
**Endpoint:** `GET /api/certificates/[transactionId]`, `PATCH /api/admin/certificates/[id]/bwi-number`  
**Target Database:** `Certificate`  
**RBAC & Middleware Guard:** Owner / `ADMIN`  
**Detail Alur Logic:**  
- Auto-generate PDF/Image sertifikat digital untuk transaksi Wakaf, Zakat, & Qurban yang berstatus `TERVERIFIKASI`.
- Untuk Wakaf: Admin dapat mengisi nomor registrasi BWI secara manual (`bwiRegistrationNumber`) yang kemudian ter-render pada sertifikat.  
**Acceptance Criteria (DoD):**  
- [ ] PDF sertifikat ter-generate rapi dengan QR Code / ID Transaksi.
- [ ] Input nomor BWI Admin ter-render pada sertifikat Wakaf.

---

## 🟡 Awan — Modul Notifikasi Real-Time

### Task 6.2 — System Notifikasi Real-time & Event FCM
**Scope Utama:** [Backend Integration: FCM / Email]  
**Endpoint:** `GET /api/notifications`, `PATCH /api/notifications/[id]/read`  
**Target Database:** `Notification`  
**RBAC & Middleware Guard:** Authenticated  
**Detail Alur Logic:**  
- Trigger notifikasi otomatis saat event kunci:
  - Status pembayaran PG updated (`SETTLED` / `EXPIRED`).
  - Verifikasi setoran tunai petugas oleh Admin (`VERIFIED` / `REJECTED`).
  - Laporan penyaluran qurban/zakat diterbitkan.
  - Status pengajuan Nadzir / withdrawal disetujui atau ditolak.  
**Acceptance Criteria (DoD):**  
- [x] Record notifikasi ter-create otomatis di DB.
- [x] User login dapat membaca dan menandai notifikasi as read.

---

## 🔵 Naufal — Modul Dashboard Admin Overview

### Task 6.3 — Dashboard Admin Overview Operasional Ringkas
**Scope Utama:** [Frontend UI/Page] + [Backend API Handler]  
**Endpoint:** `GET /api/admin/overview` (atau konsumsi API internal)  
**Target Route:** `/admin/dashboard`  
**Target Database:** `WaqfOrder`, `ZakatOrder`, `QurbanOrder`, `NadzirProfile`, `FundWithdrawalRequest`  
**RBAC & Middleware Guard:** `ADMIN`  
**Detail Alur Logic:**  
- Dashboard ringkasan operasional Admin lintas 3 modul: total pengumpulan dana Wakaf, Zakat, & Qurban; counter pending verifikasi Nadzir, setoran petugas, & withdrawal request.
- **CATATAN KETAT**: HANYA ringkasan operasional — **BUKAN** dashboard analitik RFMD (RFMD ditunda pasca-MVP).  
**Acceptance Criteria (DoD):**  
- [ ] Card metric operasional ter-render akurat.
- [ ] Link shortcut ke halaman pending approval berfungsi.
- [ ] TIDAK ada elemen UI/fitur analitik RFMD.

---

## 🟢 🟡 🔵 Bersama — Cross-Cutting & Integration Testing

### Task 6.4 — Integration Testing & End-to-End Flow Verification
**Scope Utama:** [Quality Assurance & E2E Testing]  
**Endpoint:** Cross-Module API Suite  
**Target Database:** Full DB Schema  
**RBAC & Middleware Guard:** All Roles (`WAKIF`, `NADZIR`, `PETUGAS_LAPANGAN`, `ADMIN`)  
**Detail Alur Logic:**  
- Pengujian E2E alur lengkap lintas modul:
  1. Auth → OAuth Google & Email/Password → Session cookie.
  2. Wakaf digital & offline → PG Webhook → Ledger update → Sertifikat.
  3. Zakat calculate → Live Gold Price → Order → Payment → Mustahik distribution.
  4. Qurban Batch → Slot Row-Lock → Akad Wakalah → Petugas Entri Tunai → Setoran → Admin Verify → Distribution Report + GPS.  
**Acceptance Criteria (DoD):**  
- [ ] E2E flow 3 modul berjalan tanpa blocker crash.
- [ ] Format error & response API konsisten sesuai `CODING_CONVENTIONS.md`.

---

# MICRO-SPRINT 7 (Hari 13-14) — Hardening & Staging Deploy

## 🟢 🟡 🔵 Bersama — Audit Security & Fiqih

### Task 7.1 — Bug Bash & Security / Fiqih Audit Final (Hari 13)
**Scope Utama:** [Audit & Quality Hardening]  
**Endpoint:** All Protected Endpoints  
**Target Database:** Full DB Schema  
**RBAC & Middleware Guard:** All Roles  
**Detail Alur Logic:**  
- **Security Audit**: Enkripsi NIK AES-256 terverifikasi di DB; Cookie `HttpOnly` `amwal_token` & `amwal_refresh` ter-set dengan flag `SameSite=Lax`; CORS & rate-limiting di API handler.
- **Fiqih Audit**: Validasi Akad Wakalah Qurban; Pemisahan Ledger Pokok vs Hasil Wakaf; 8 Asnaf Zakat; Nisab Zakat Emas 85 gram.
- **Scope Verification**: Verifikasi ulang TIDAK ada elemen UI/route yang secara tidak sengaja mengekspos fitur RFMD Analytics atau Infaq (di-hide/tidak ter-render).  
**Acceptance Criteria (DoD):**  
- [ ] Zero critical security/fiqih vulnerabilities.
- [ ] Scope Putaran 6 dipatuhi 100%.

---

## 🟢 🟡 🔵 Bersama — Hardening & Staging Deployment

### Task 7.2 — Staging Deployment & Environment Hardening (Hari 14)
**Scope Utama:** [DevOps & Deployment]  
**Target Platform:** Vercel Staging + Supabase Staging Database  
**Target Database:** Supabase Staging PostgreSQL  
**RBAC & Middleware Guard:** All Roles  
**Detail Alur Logic:**  
- Deployment ke environment Staging.
- Konfigurasi Environment Variables di Vercel & Supabase (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOLD_PRICE_API_KEY`, `MIDTRANS_SERVER_KEY`).
- Update Google Cloud Console Authorized Redirect URIs untuk domain staging.
- Smoke Test 4 Role: Verify login & akses RBAC untuk `WAKIF`, `NADZIR`, `PETUGAS_LAPANGAN`, dan `ADMIN` di staging environment.
- Update `RUNBOOK.md` dengan instruksi deployment & maintenance final.  
**Acceptance Criteria (DoD):**  
- [ ] Staging deployment sukses & dapat diakses publik.
- [ ] Smoke test 4 role PASS.
- [ ] `RUNBOOK.md` updated.

---

## Eksplisit DI LUAR Scope 14 Hari Ini

- [ ] ~~Gamifikasi~~ — ditunda
- [ ] ~~Edukasi & Kuis~~ — ditunda
- [ ] ~~AI Chatbot~~ — ditunda (schema siap termasuk `userFeedback`)
- [ ] ~~Infaq/Sedekah~~ — ditunda (Putaran 6)
- [ ] ~~Dashboard Analitik RFMD~~ — ditunda (Putaran 6, riset terpisah)
- [ ] ~~Facebook OAuth~~ — ditunda (Putaran 6, hanya Google masuk scope)