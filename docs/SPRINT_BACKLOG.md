# Sprint Backlog — Amwal V.1 (Revisi Putaran 6)

**Tim:** Bara (Wakaf + OAuth), Awan (Zakat + Gold Price API), Naufal (Qurban + Auth Foundation)
**Target:** Staging Deployment dalam 14 hari (7 Micro-Sprint × 2 hari)
**Status Prasyarat:** Sprint 1 (Auth/RBAC foundation) CLOSED

## ⚠️ Perubahan Scope Putaran 6 — Baca Dulu

- **DIKELUARKAN dari staging**: Dashboard Analitik RFMD/Segmentasi Donatur/Prediksi Churn — JANGAN dibangun sebagian pun, meski muncul di mockup UI Admin. Ini murni riset lanjutan pasca-MVP.
- **DITUNDA**: Modul Infaq/Sedekah — meski sudah ada mockup UI, TIDAK ADA task Infaq di backlog ini.
- **DITAMBAHKAN**: OAuth Google (bukan NextAuth/Supabase Auth — implementasi manual, tukar Google ID token dengan JWT+Refresh Token sistem kita sendiri), harga emas live API + fallback, akad wakalah digital Qurban, field anonim ("Hamba Allah"), detail `HewanBatch`, `admin_notes` di approval flow, GPS+video di laporan distribusi Qurban.

---

# MICRO-SPRINT 2 (Hari 3-4) — Skeleton API Digital

## 🟢 Bara — Modul Wakaf + OAuth Google

### Task 2.1 — CRUD `WaqfProgram`
*(Tidak berubah dari versi sebelumnya)*

**Scope Utama:** [Backend API Handler]
**Endpoint:** `POST /api/wakaf/programs`, `GET /api/wakaf/programs`, `GET /api/wakaf/programs/[id]`, `PATCH /api/wakaf/programs/[id]`
**Target Database:** `WaqfProgram`, relasi `NadzirProfile`
**RBAC:** `POST`/`PATCH` → `NADZIR` (verified); `GET` → publik
**Alur Logic:** Create program + `WaqfPrincipalLedger` dalam satu `$transaction`; `PATCH jenisWakaf` ditolak jika `status !== 'DRAFT'`
**DoD:** tsc bersih; ledger otomatis tercipta; lock `jenisWakaf` teruji; filter `kategori`/`search` bekerja

---

### Task 2.2 — Submit `NadzirProfile` + `NadzirDocument` + OCR PoC
*(Tidak berubah — lihat detail alur OCR Google Vision + fallback mock parser dari revisi sebelumnya)*

**Scope Utama:** [Backend API Handler] + [Integrasi Eksternal: OCR]
**Endpoint:** `POST /api/nadzir/profile`, `POST /api/nadzir/documents`
**Target Database:** `NadzirProfile`, `NadzirDocument`
**RBAC:** role `NADZIR`
**DoD:** file ter-upload Supabase Storage; NIK terenkripsi AES-256; OCR gagal tidak menyebabkan 500

---

### Task 2.7 — OAuth Google Login (BARU, Putaran 6)

**Scope Utama:** [Backend API Handler] + [Integrasi Eksternal: Google OAuth2]

**Detail Endpoint & HTTP Method:**
- `GET /api/auth/google` — redirect ke Google OAuth consent screen
- `GET /api/auth/google/callback` — terima authorization code dari Google

**Target Database:** `User` (create jika belum ada, atau match existing by `email`)

**RBAC & Middleware Guard:** Publik (ini adalah endpoint login)

**Detail Alur Logic & Input/Output:**
```
GET /api/auth/google
```
- Redirect ke `https://accounts.google.com/o/oauth2/v2/auth` dengan `client_id`, `redirect_uri`, `scope=openid email profile`, `response_type=code`

```
GET /api/auth/google/callback?code=...
```
1. Tukar `code` dengan access token via `POST https://oauth2.googleapis.com/token`
2. Ambil profil user (`email`, `name`, `sub` sebagai `oauthId`) dari Google
3. **Cari user existing** by `email`:
   - Jika ADA dan `passwordHash` terisi (akun email/password lama) → **JANGAN otomatis link** tanpa konfirmasi (risiko account takeover jika email dipalsukan) — untuk V.1, cukup balas error "Email sudah terdaftar, silakan login dengan password" (linking akun manual jadi item Post-Staging)
   - Jika ADA dan `oauthProvider='GOOGLE'` cocok → lanjut ke langkah 4 (login)
   - Jika TIDAK ADA → create `User` baru: `passwordHash: null`, `oauthProvider: 'GOOGLE'`, `oauthId: sub`, `role: 'WAKIF'` (default, sama seperti register biasa)
4. Terbitkan Access Token + Refresh Token **PAKAI SISTEM KITA SENDIRI** (`lib/tokens.ts` — fungsi yang SAMA dipakai `login/route.ts`, JANGAN buat sistem token terpisah)
5. Set cookie `amwal_token`+`amwal_refresh` (sama seperti login biasa)
6. Redirect ke halaman utama (`/`) — BUKAN mengembalikan JSON (ini full-page redirect flow, beda dari API JSON biasa)

**Acceptance Criteria (DoD):**
- [ ] Login Google baru → `User` tercipta dengan `passwordHash: null`, cookie ter-set, RBAC berfungsi normal setelahnya (test akses endpoint terproteksi)
- [ ] Login Google dengan email yang SUDAH ada sebagai akun password → ditolak dengan pesan jelas, TIDAK auto-link
- [ ] Login Google kedua kalinya (user sama) → match by `oauthProvider`+`oauthId`, TIDAK membuat `User` duplikat
- [ ] `login/route.ts` existing: tambahkan guard `if (!user.passwordHash) return 401 "Akun ini terdaftar via Google"` SEBELUM `bcrypt.compare()`

---

## 🟡 Awan — Modul Zakat + Harga Emas Live API

### Task 2.8 — `zakat_fitrah_config` CRUD (BARU, Putaran 6 — Prasyarat Task 2.3)

**Scope Utama:** [Backend API Handler]

**Detail Endpoint & HTTP Method:**
- `POST /api/admin/zakat-fitrah-config` — Admin tambah/update varian beras
- `GET /api/zakat-fitrah-config?active=true` — publik, dipakai kalkulator

**Target Database:** `ZakatFitrahConfig`

**RBAC & Middleware Guard:** `POST` → `ADMIN`; `GET` → publik

**Detail Alur Logic & Input/Output:**
```
Body: { jenisBeras: string, konversiHargaPerJiwa: number, 
        referensiSk?: string, tahunBerlaku?: string }
```
- `isActive: true` default. Kalau Admin buat config baru untuk `jenisBeras` yang sama, config lama sebaiknya di-set `isActive: false` (bukan dihapus, untuk histori)

**Acceptance Criteria (DoD):**
- [ ] Minimal 3 varian seed (Standar/Premium/Organik) dengan harga berbeda
- [ ] Kalkulator FITRAH (Task 2.3) WAJIB ambil `konversiHargaPerJiwa` dari sini, BUKAN hardcode/input bebas dari client

---

### Task 2.3 — Kalkulator Zakat (Preview, Belum Bayar) — Update Putaran 6

**Scope Utama:** [Backend API Handler]

**Detail Endpoint & HTTP Method:** `POST /api/zakat/calculate`

**Target Database:** `ZakatCalculation` (create), `ZakatFitrahConfig` (read, untuk FITRAH), `ZakatGoldPriceHistory` (read, untuk EMAS/MAAL_PENGHASILAN/PERUSAHAAN)

**RBAC & Middleware Guard:** Authenticated, role apapun

**Detail Alur Logic & Input/Output:** *(formula per jenis tetap sama seperti versi sebelumnya)*, TAPI:
- `goldPricePerGram` **TIDAK LAGI** input manual dari client untuk kalkulasi resmi — ambil dari `zakat_gold_price_history` (row terbaru). Client BOLEH kirim untuk simulasi/preview cepat, tapi hasil FINAL yang disimpan ke `ZakatCalculation.nisabDigunakan` harus pakai harga acuan sistem
- `hargaBerasPerKg` untuk FITRAH: ambil dari `ZakatFitrahConfig` sesuai `jenisBeras` yang dipilih user, bukan input bebas

**Acceptance Criteria (DoD):**
- [ ] Semua kriteria versi sebelumnya (unit test per jenis, `PERUSAHAAN` tidak pakai `revenue`)
- [ ] Konsistensi: 2 user hitung `EMAS` di waktu berdekatan → `nisabDigunakan` SAMA (bukti keduanya ambil dari sumber harga yang sama, bukan input manual masing-masing)

---

### Task 2.9 — Harga Emas Live API + Fallback (BARU, Putaran 6)

**Scope Utama:** [Backend API Handler] + [Integrasi Eksternal: Gold Price API]

**Detail Endpoint & HTTP Method:**
- `GET /api/zakat/gold-price/live` — endpoint utama, dipanggil Task 2.3
- `PATCH /api/admin/zakat/gold-price` — Admin override manual (fallback kedua jika API mati lama)

**Target Database:** `ZakatGoldPriceHistory` (create tiap fetch sukses/manual)

**RBAC & Middleware Guard:** `GET /live` → authenticated (dipanggil internal oleh kalkulator); `PATCH` → `ADMIN`

**Detail Alur Logic & Input/Output:**
```
GET /api/zakat/gold-price/live
```
1. Cek row `ZakatGoldPriceHistory` terbaru (`ORDER BY fetchedAt DESC LIMIT 1`)
2. **Jika ada dan `fetchedAt` < 6 jam lalu** → return langsung dari cache, JANGAN fetch API eksternal (hemat rate-limit/biaya)
3. **Jika cache basi/kosong** → panggil provider harga emas eksternal (pilih provider yang tim sepakati — rekomendasi: cari provider yang langsung quote IDR/gram supaya tidak perlu konversi troy-ounce+kurs USD-IDR tambahan; jika tidak ada, siapkan 2 langkah fetch: harga USD/troy-ounce + kurs USD-IDR, lalu `hargaPerGram = (hargaUSD / 31.1035) * kurs`)
4. **Jika fetch sukses**: simpan row baru `source: 'LIVE_API'`, return harga baru
5. **Jika fetch GAGAL** (timeout/API down/rate limit): return row cache TERAKHIR yang ada (berapapun umurnya) dengan flag tambahan di response `{ isStale: true, fetchedAt: ... }` — **JANGAN** biarkan kalkulator zakat gagal total hanya karena API eksternal down
6. **Jika TIDAK ADA cache sama sekali** (hari pertama, belum pernah fetch) DAN API juga gagal → response 503 dengan pesan jelas "Harga emas belum tersedia, hubungi Admin untuk input manual"

```
PATCH /api/admin/zakat/gold-price
Body: { pricePerGram: number }
```
- Insert row baru `source: 'MANUAL_FALLBACK'` — jadi cache aktif berikutnya

**Acceptance Criteria (DoD):**
- [ ] Simulasi API eksternal down (matikan sementara/mock error) → endpoint tetap return harga (dari cache), tidak 500
- [ ] Cache < 6 jam → dibuktikan TIDAK ada network call baru ke provider eksternal (cek log/network tab)
- [ ] Admin manual override → langsung jadi harga aktif berikutnya sampai live fetch berikutnya berhasil

---

### Task 2.4 — `ZakatOrder` Creation (Flow Digital)
*(Tidak berubah — tambahkan field `isAnonymous: boolean` opsional ke body, default `false`)*

**DoD tambahan:** [ ] `isAnonymous: true` tersimpan benar, tidak mempengaruhi field lain

---

## 🔵 Naufal — Modul Qurban

### Task 2.5 — `HewanBatch` + `QurbanAnimalSlot` dengan Row-Lock — Update Putaran 6

**Scope Utama:** [Backend API Handler]

**Detail Endpoint & HTTP Method:** `POST /api/admin/qurban/hewan-batches`, `GET /api/qurban/hewan-batches`, fungsi internal `reserveSlot()`

**Target Database:** `HewanBatch`, `QurbanAnimalSlot`

**RBAC & Middleware Guard:** `POST` → `ADMIN`; `GET` → publik

**Detail Alur Logic & Input/Output — Payload Diperluas (Putaran 6):**
```
Body: {
  jenisHewan: 'SAPI'|'KAMBING', totalSlot: number, hargaPerSlot: number,
  ras?: string, kelasGrade?: string, estimasiBeratKg?: number,
  jenisKelamin?: string, wilayahPenyaluran?: string,
  targetPenerimaManfaat?: number, tanggalPenyembelihanEstimasi?: string,
  galeriFotoUrls?: string[]
}
```
Logic row-lock `reserveSlot()` **TIDAK BERUBAH** dari versi sebelumnya — tetap wajib `SELECT ... FOR UPDATE` + unique constraint.

**Acceptance Criteria (DoD):** *(sama seperti sebelumnya, DITAMBAH)*:
- [ ] Field detail baru (ras, kelas, dst.) tersimpan & muncul di `GET` list/detail untuk konsumsi UI katalog

---

### Task 2.6 — `QurbanOrder` Creation (Flow Digital) — Update Putaran 6: Wajib Akad Wakalah

**Scope Utama:** [Backend API Handler]

**Detail Endpoint & HTTP Method:** `POST /api/qurban/orders`

**Target Database:** `QurbanOrder`, panggil `reserveSlot()`

**RBAC & Middleware Guard:** role `WAKIF`

**Detail Alur Logic & Input/Output:**
```
Body: {
  hewanBatchId, jenisHewan, tipeKepemilikan, jumlahSlotDiminta, opsiPesan,
  namaPengqurban, teleponPengqurban, alamatPengqurban,
  akadWakalahAccepted: boolean   // BARU — WAJIB true
}
```
- **VALIDASI BARU**: jika `akadWakalahAccepted !== true` → 400 "Akad wakalah wajib disetujui sebelum melanjutkan pembayaran", JANGAN panggil `reserveSlot()` sama sekali (fail fast sebelum reservasi slot)
- Jika diterima: simpan `akadWakalahText` (teks akad standar, bisa konstanta di kode: *"Saya [nama] dengan ini mewakilkan kepada panitia Qurban Amwal untuk menyembelihkan hewan qurban atas nama saya sesuai syariat Islam"*), `akadWakalahAcceptedAt: now()`

**Acceptance Criteria (DoD):** *(sama seperti sebelumnya, DITAMBAH)*:
- [ ] `akadWakalahAccepted: false` atau tidak dikirim → 400, TIDAK ADA slot ter-reservasi (cek `QurbanAnimalSlot` tidak berubah status)

---

# MICRO-SPRINT 3 (Hari 5-6) — Offline Flow + Payment Gateway

*(Task 3.1-3.6 tidak berubah struktur dari versi sebelumnya, dengan 2 penyesuaian kecil berikut)*

## 🟢 Bara — Task 3.1 Update: Tambah `isAnonymous`

`POST /api/admin/wakaf/orders` — tambahkan `isAnonymous: boolean` (default `false`) ke body & field DB. **DoD tambahan:** [ ] checkbox "Hamba Allah" tersimpan benar, `namaWakif` tetap wajib diisi di backend meski anonim (anonim hanya soal tampilan, bukan soal data kosong)

## 🟡 Awan — Task 3.3 Update: Tambah `isAnonymous`

Sama seperti Task 3.1, untuk `POST /api/admin/zakat/orders`.

## 🔵 Naufal — Task 3.5, 3.6: Tidak ada perubahan dari versi sebelumnya.

---

# MICRO-SPRINT 4 (Hari 7-8) — Approval & Distribusi

## 🟢 Bara — Task 4.1 Update: `admin_notes` Wajib Saat Reject

**Perubahan dari versi sebelumnya:**
```
PATCH /api/admin/withdrawal-requests/[id]
Body: { status: 'APPROVED'|'REJECTED', adminNotes?: string }
```
- **VALIDASI BARU**: jika `status: 'REJECTED'` DAN `adminNotes` kosong/tidak dikirim → 400 "Alasan penolakan wajib diisi"
- `adminNotes` opsional untuk `APPROVED` (boleh kosong)

**DoD tambahan:** [ ] Reject tanpa `adminNotes` → 400; Approve tanpa `adminNotes` → tetap 200 (tidak wajib)

## Task 4.2 — Tidak berubah.

## 🟡 Awan — Task 4.3, 4.4 — Tidak berubah.

## 🔵 Naufal — Task 4.5 Update: `admin_notes` untuk Permohonan Institusional

```
PATCH /api/admin/permohonan-institusional/[id]
Body: { status: 'DISETUJUI'|'DITOLAK', adminNotes?: string }
```
Validasi sama seperti Task 4.1: `DITOLAK` wajib disertai `adminNotes`.

## Task 4.6 — Tidak berubah.

---

# MICRO-SPRINT 5 (Hari 9-10) — Frontend per Modul

## 🟢 Bara — Frontend Wakaf

### Task 5.1 — Halaman Eksplorasi & Detail Program *(tidak berubah)*

### Task 5.2 — Form Donasi Wakaf & Dashboard Nadzir — Update: Checkbox Anonim + OAuth

**Tambahan dari versi sebelumnya:**
- Form donasi: tambahkan checkbox "Sembunyikan nama saya (Hamba Allah)" → kirim `isAnonymous` ke `POST /api/wakaf/orders`
- Halaman `/login` & `/register`: tambahkan tombol "Masuk dengan Google" yang redirect ke `/api/auth/google` (Task 2.7)

**DoD tambahan:** [ ] Tombol Google berfungsi end-to-end (redirect → consent → callback → landing di halaman utama dengan sesi aktif)

---

## 🟡 Awan — Frontend Zakat

### Task 5.3 — UI Kalkulator Zakat — Update: Sumber Harga Emas

**Tambahan:** Tampilkan label kecil di hasil kalkulasi: "Harga emas acuan: Rp X/gram (update: [tanggal])" — ambil dari response `GET /api/zakat/gold-price/live` yang dipanggil kalkulator, supaya user tahu ini bukan angka sembarangan. Jika `isStale: true`, tampilkan badge kecil "Harga belum ter-update hari ini" (bukan error, cukup info).

### Task 5.4 — Form Bayar & Form Entri Amil — Update: Checkbox Anonim

Sama seperti Task 5.2, tambahkan checkbox anonim di kedua form.

---

## 🔵 Naufal — Frontend Qurban + **4 Screen Petugas Lapangan (BARU, Detail Putaran 6)**

### Task 5.5 — Katalog Hewan & Slot Picker — Update: Field Detail Baru

Tambahkan tampilan `ras`, `kelasGrade`, `estimasiBeratKg`, `wilayahPenyaluran`, galeri foto (carousel dari `galeriFotoUrls`) di card katalog & detail.

### Task 5.6 — Form Order Digital — Update: Modal Akad Wakalah

**Scope Utama:** [Frontend UI/Page]
Tambahkan **modal konfirmasi** sebelum lanjut ke Payment Gateway: tampilkan teks akad wakalah (dari Task 2.6), checkbox "Saya menyetujui akad wakalah ini", tombol "Lanjutkan Pembayaran" disabled sampai checkbox dicentang. Kirim `akadWakalahAccepted: true` ke `POST /api/qurban/orders`.

### Task 5.7 — Dashboard Rekap Cash Petugas Lapangan (BARU)

**Scope Utama:** [Frontend UI/Page] + [Backend API Handler]

**Detail Endpoint & HTTP Method:** `GET /api/petugas/rekap-cash` — total nominal `QurbanOrder` yang dientri petugas login dengan `metodePembayaran: TUNAI` dikurangi total yang sudah masuk `SetoranPetugasLapangan` terverifikasi (= cash yang masih "di tangan" petugas)

**Target Database:** Aggregate query `QurbanOrder` + `SetoranPetugasLapangan` + `SetoranQurbanOrderLink`

**RBAC & Middleware Guard:** role `PETUGAS_LAPANGAN`, filter otomatis by `enteredByPetugasId = x-user-id`

**Detail Alur Logic & Input/Output:**
- Response: `{ data: { totalDiterima: number, totalDisetor: number, sisaDiTangan: number, daftarOrderBelumDisetor: [...] } }`
- Frontend: card ringkas angka besar "Rp X di tangan Anda" + list order yang belum masuk setoran manapun

**Acceptance Criteria (DoD):**
- [ ] Angka `sisaDiTangan` cocok dengan hitungan manual (total tunai - total setoran terverifikasi)
- [ ] Order yang statusnya sudah masuk setoran (meski belum diverifikasi Admin) tidak dobel dihitung sebagai "belum disetor"

---

### Task 5.8 — Form Entri Transaksi Offline (BARU — Frontend untuk Task 3.5)

**Scope Utama:** [Frontend UI/Page]

**Detail Endpoint & HTTP Method:** Konsumsi `POST /api/petugas/qurban-orders` (Task 3.5)

**RBAC & Middleware Guard:** role `PETUGAS_LAPANGAN`

**Detail Alur Logic & Input/Output:**
- Form: Nama, No. HP, pilih Batch/Slot (reuse komponen `SlotPicker`), Jenis Akad (opsi pesan Pasrah/Ambil Sendiri), Nominal Dibayar, **upload foto bukti cash** (opsional tapi direkomendasikan untuk akuntabilitas — field `buktiCashUrl` BARU, tambahkan ke `QurbanOrder` jika tim setuju, atau simpan sebagai lampiran terpisah)
- **Modal konfirmasi sebelum submit**: ringkasan data yang diinput, tombol "Periksa Lagi" vs "Konfirmasi & Simpan" (mengatasi Gap "konfirmasi entri offline" dari review UI sebelumnya)

**Acceptance Criteria (DoD):**
- [ ] Modal konfirmasi WAJIB muncul sebelum data benar-benar tersimpan ke server
- [ ] `sisaTagihan` auto-terhitung & ditampilkan real-time saat nominal diketik

> **Catatan untuk Bara/Awan**: pola "modal konfirmasi sebelum submit entri offline" ini sebaiknya juga diterapkan di form entri offline Wakaf (Task 5.2) dan Zakat (Task 5.4) — reuse komponen modal yang sama, jangan bangun 3x terpisah.

---

### Task 5.9 — Form Setoran ke Admin (BARU — Frontend untuk fungsi Task 3.5 bagian setoran)

**Scope Utama:** [Frontend UI/Page]

**Detail Endpoint & HTTP Method:** `POST /api/petugas/setoran`

**RBAC & Middleware Guard:** role `PETUGAS_LAPANGAN`

**Detail Alur Logic & Input/Output:**
- Form: pilih tanggal, multi-select `QurbanOrder` tunai yang belum disetor (dari Task 5.7 data), input `jumlahSetor`, **upload bukti transfer/serah terima** (field `buktiSetorUrl` — sudah ditambahkan ke `SetoranPetugasLapangan` di `DATABASE_SCHEMA.md` Putaran 6)
- Tampilkan otomatis SUM nominal order yang dipilih, bandingkan dengan `jumlahSetor` yang diinput (peringatan visual jika beda, tidak block)

**Acceptance Criteria (DoD):**
- [ ] Multi-select order berfungsi, hanya menampilkan order milik petugas login yang belum masuk setoran manapun
- [ ] Upload bukti setoran wajib sebelum submit (validasi client-side)

---

### Task 5.10 — Form Verifikasi Penyaluran (BARU — Frontend untuk `QurbanDistributionReport`)

**Scope Utama:** [Frontend UI/Page] + [Backend API Handler — endpoint ini belum ada di Sprint sebelumnya, tambahkan sekarang]

**Detail Endpoint & HTTP Method:** `POST /api/qurban/orders/[id]/distribution-report`

**Target Database:** `QurbanDistributionReport`

**RBAC & Middleware Guard:** role `PETUGAS_LAPANGAN` atau `ADMIN`

**Detail Alur Logic & Input/Output:**
```
Body: { buktiFotoUrl: string, videoUrl?: string, lokasiPenyaluran: string,
        lokasiLat?: number, lokasiLng?: number, jumlahPenerima: number }
```
- Frontend: gunakan Geolocation API browser (`navigator.geolocation.getCurrentPosition`) untuk auto-isi `lokasiLat`/`lokasiLng`, dengan fallback input manual jika user menolak izin lokasi
- Upload foto WAJIB, video opsional (ukuran file besar — beri batas maks, mis. 50MB, kompresi sisi client jika memungkinkan)

**Acceptance Criteria (DoD):**
- [ ] Geolocation browser berhasil auto-isi koordinat (test di browser dengan izin lokasi diberikan)
- [ ] Fallback manual input koordinat berfungsi jika izin ditolak
- [ ] `jumlahPenerima` wajib diisi angka > 0

---

# MICRO-SPRINT 6 (Hari 11-12) — Cross-Cutting

*(Task 6.1-6.4 TIDAK BERUBAH dari versi sebelumnya — Certificate generation, Notifikasi FCM, Dashboard Admin Overview, Integration Testing.)*

**Catatan tambahan untuk Task 6.3 (Dashboard Admin Overview, Naufal):** dashboard ini HANYA operasional ringkas (jumlah pending verifikasi, total dana per modul) — **BUKAN** dashboard analitik RFMD yang muncul di mockup UI. Jangan bangun elemen segmentasi/prediksi apapun, sesuai keputusan Putaran 6.

---

# MICRO-SPRINT 7 (Hari 13-14) — Hardening & Staging Deploy

*(Tidak berubah dari versi sebelumnya)*

**Tambahan checklist Hari 13:**
- [ ] Verifikasi ulang: TIDAK ada elemen UI/route yang secara tidak sengaja mengekspos fitur RFMD Analytics atau Infaq (kalau tim UI/UX terlanjur push komponen terkait ke branch, pastikan di-hide/tidak ter-render)
- [ ] Verifikasi OAuth Google berfungsi di environment staging (redirect URI Google Console harus didaftarkan untuk domain staging, BEDA dari `localhost` — jangan lupa update Google Cloud Console authorized redirect URIs)

## Eksplisit DI LUAR Scope 14 Hari Ini

- [ ] ~~Gamifikasi~~ — ditunda
- [ ] ~~Edukasi & Kuis~~ — ditunda
- [ ] ~~AI Chatbot~~ — ditunda (schema siap termasuk `userFeedback`)
- [ ] ~~Infaq/Sedekah~~ — ditunda (Putaran 6)
- [ ] ~~Dashboard Analitik RFMD~~ — ditunda (Putaran 6, riset terpisah)
- [ ] ~~Facebook OAuth~~ — ditunda (Putaran 6, hanya Google masuk scope)