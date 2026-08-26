# Runbook — Setup, Development, & Deployment

## 1. Prasyarat

- Node.js 20+
- pnpm (sesuai `pnpm-lock.yaml` project)
- Akses ke project Supabase (staging)
- Kredensial sandbox: Midtrans/Xendit, Google Cloud Vision

## 2. Environment Variables (`.env`)

```bash
# Database (Supabase)
DATABASE_URL=          # connection string dengan pgbouncer (pooling)
DIRECT_URL=            # connection string langsung, untuk migrasi

# Auth
JWT_SECRET=            # WAJIB unik & kuat, generate: openssl rand -base64 32

# Payment Gateway (pilih salah satu sesuai keputusan final, atau keduanya utk testing)
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
XENDIT_SECRET_KEY=

# OCR
GOOGLE_CLOUD_VISION_CREDENTIALS_JSON=   # service account JSON (base64 atau path)

# Supabase Storage
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Notifikasi
FCM_SERVER_KEY=
FCM_PROJECT_ID=

# OAuth Testing (SECURITY POLICY - LOCAL ONLY)
# HANYA set 'true' di local dev testing jika tanpa akun Google asli.
# JANGAN PERNAH di-set di Vercel / Staging / Production!
ALLOW_OAUTH_MOCK=false

NODE_ENV=development
```

## 3. Setup Lokal Pertama Kali

```bash
pnpm install
cp .env.example .env         # isi sesuai kredensial masing-masing
npx prisma migrate dev       # jalankan seluruh migrasi
npx prisma db seed           # seed data awal (role dummy, hewan_batches, dsb.)
pnpm dev
```

## 4. Menjalankan Migrasi Baru

```bash
# Setelah edit prisma/schema.prisma:
npx prisma migrate dev --name <nama_deskriptif>
npx prisma generate          # regenerate Prisma Client jika perlu
```

## 5. Testing Manual Auth (Setelah Fix Bug Sprint 1)

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"WAKIF"}'

# Login (cek Set-Cookie di response header)
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","password":"password123"}'
```

## 6. Deploy ke Staging & Production Hardening

### Environment Variables Checklist (Vercel / Supabase Dashboard)
| Key | Mandatory | Description / Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Connection string dengan PgBouncer transaction pooling |
| `DIRECT_URL` | Yes | Direct connection string untuk migrasi database |
| `JWT_SECRET` | Yes | Secret key min 32 kar, generate: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Yes | OAuth Client ID dari Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Yes | OAuth Client Secret |
| `GOLD_PRICE_API_KEY` | Optional | API key provider harga emas acuan |
| `MIDTRANS_SERVER_KEY` | Yes | Midtrans Server Key (Sandbox / Production) |
| `MIDTRANS_CLIENT_KEY` | Yes | Midtrans Client Key |
| `SUPABASE_URL` | Yes | Supabase Storage URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase Storage Service Role Key |
| `ALLOW_OAUTH_MOCK` | **FALSE** | **WAJIB `false` / tidak di-set di Staging & Prod** |

### Staging Deployment Steps:
1. Hubungkan repository GitHub ke project Vercel.
2. Konfigurasi seluruh Environment Variables di Vercel Dashboard (**Settings > Environment Variables**).
3. Daftarkan URL callback staging (mis. `https://amwal-staging.vercel.app/api/auth/google/callback`) pada Google Cloud Console Authorized Redirect URIs.
4. Jalankan `npx prisma db push` atau `npx prisma migrate deploy` pada database staging Supabase.
5. Trigger Vercel Deployment via git push / Vercel CLI.

## 7. Smoke Testing Protocol (4 Role Verification)

| Role | Test Scenario | Expected Result |
|---|---|---|
| `WAKIF` | Login Google / Email → Akses `/zakat/kalkulator` → Donasi Zakat / Wakaf Anonim (`isAnonymous: true`) | Kwitansi digital ter-generate & status `MENUNGGU_VERIFIKASI` / PG redirect |
| `NADZIR` | Submit Profil & Dokumen → Ajukan Penarikan (`FundWithdrawalRequest`) | Status withdrawal `PENDING` & terhubung ke program wakaf |
| `PETUGAS_LAPANGAN` | Entri Transaksi Offline → Submit Setoran ke Admin → Laporan Penyaluran GPS | Modal konfirmasi muncul unbypassable & setoran berstatus pending verifikasi |
| `ADMIN` | Override Harga Emas → Verifikasi Setoran Petugas → Review Withdrawal (Rejection dengan `adminNotes`) | Notification terkirim ke user target & saldo ledger update atomic |

## 8. Troubleshooting & Maintenance

| Gejala | Kemungkinan Sebab | Solusi |
|---|---|---|
| Route terproteksi dapat diakses tanpa auth | `proxy.ts` matcher belum mencakup route | Periksa `export const config` pada `proxy.ts` |
| Login sukses tapi request berikutnya 401 | Cookie `amwal_token` tidak ter-set | Pastikan `SameSite=Lax` dan header `credentials: 'include'` pada fetch |
| Build Vercel error `prisma client not found` | Postinstall step belum re-generate client | Pastikan script `build` menjalankan `prisma generate && next build` |
| Warning OAuth Mock Active | Variable `ALLOW_OAUTH_MOCK` ter-set `true` | Hapus / set `ALLOW_OAUTH_MOCK=false` pada environment variables |
