# Checklist Keamanan — Non-Negotiable

Setiap poin di sini WAJIB dipatuhi. Kalau kode yang dihasilkan (manusia
maupun AI agent) melanggar salah satu poin, itu adalah BUG KRITIS, bukan
"nice to have".

## 🔴 Bug Aktif yang Wajib Diperbaiki Sprint 1

- [ ] **Cookie `amwal_token` tidak pernah di-set oleh `login/route.ts`** —
      saat ini token cuma dikembalikan di body JSON, client simpan ke
      `localStorage`. `proxy.ts` mengecek cookie yang TIDAK PERNAH ADA.
      Akibatnya seluruh RBAC saat ini **tidak berfungsi** (secara diam-diam
      selalu deny, atau — jika ada endpoint publik yang seharusnya
      terproteksi tapi belum masuk daftar `proxy.ts` — bisa diakses bebas).
- [ ] `localStorage.setItem("token", ...)` di `auth-flow.tsx` WAJIB dihapus.
- [ ] `login/route.ts` WAJIB set cookie httpOnly `amwal_token` via
      `response.cookies.set()`, TIDAK mengembalikan token di body.
- [ ] JWT payload WAJIB menyertakan `role` — butuh migrasi `User.role`
      dulu (lihat `DATABASE_SCHEMA.md`).
- [ ] `proxy.ts` `PROTECTED_ROUTES` WAJIB direvisi total ke role/path baru
      (`WAKIF`/`NADZIR`/`ADMIN`/`PETUGAS_LAPANGAN`, path `/api/wakaf`,
      `/api/zakat`, `/api/qurban`, `/api/admin`, dst.) — daftar lama
      (`MUSTAHIK`/`MUZAKI`/`/api/donation`) sisa proyek sebelumnya.

## Auth & Session

- [ ] Access Token: JWT httpOnly cookie, masa hidup pendek (15-30 menit)
- [ ] Refresh Token: httpOnly cookie terpisah, **hash** (bukan plaintext)
      disimpan di tabel `refresh_tokens`
- [ ] Refresh Token bersifat **rotating**: setiap dipakai, token lama
      `revoked_at` diisi, token baru diterbitkan
- [ ] Reuse token yang sudah `revoked_at` terisi → revoke SEMUA refresh
      token milik user tersebut (mitigasi token theft)
- [ ] RBAC ditegakkan di `proxy.ts` (server-side), TIDAK BOLEH hanya
      dicek di UI/client component

## Data Sensitif

- [ ] `nadzir_documents.ocr_extracted_nik` WAJIB terenkripsi AES-256 at-rest
- [ ] `nadzir_documents.file_url` (foto KTP mentah) WAJIB dihapus otomatis
      via scheduled job **30 hari** setelah `nadzir_profiles.status_verifikasi`
      berubah menjadi `VERIFIED`/`REJECTED` — `file_deleted_at` diisi saat
      job berjalan
- [ ] Akses raw dokumen (`nadzir_documents.file_url` sebelum terhapus)
      dibatasi HANYA role `ADMIN`

## Finansial (Non-Custodial)

- [ ] SETIAP row `transactions` wajib mengisi `disbursement_destination`
      — TIDAK BOLEH kosong
- [ ] Payment Gateway (Midtrans/Xendit) WAJIB dikonfigurasi skema
      split/disbursement ke rekening Nadzir/mitra, BUKAN rekening Amwal
- [ ] `waqf_principal_ledgers.pokok_dana_terkumpul` untuk program
      `jenis_wakaf = PRODUKTIF_KEKAL` TIDAK BOLEH berkurang lewat endpoint
      manapun — hanya `hasil_investasi_tersalurkan` yang boleh dicairkan
- [ ] `fund_withdrawal_requests` TIDAK BOLEH auto-approve — wajib
      `approved_by_id` (Admin) terisi manual

## Concurrency (Qurban)

- [ ] Reservasi `qurban_animal_slots` WAJIB dibungkus
      `SELECT ... FOR UPDATE` di dalam `prisma.$transaction`
- [ ] Constraint `UNIQUE (hewan_batch_id, nomor_slot)` WAJIB ada di
      database sebagai last-line-of-defense, TIDAK BOLEH hanya divalidasi
      di application layer

## Environment & Secrets

- [ ] `JWT_SECRET` di production/staging WAJIB diganti dari fallback
      default (`fallback_secret_please_change_in_production`) yang masih
      ada di kode saat ini
- [ ] Kredensial Midtrans/Xendit/Google Vision WAJIB di `.env`, TIDAK
      PERNAH hardcode di kode
