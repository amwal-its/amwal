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

## 6. Deploy ke Staging

- Platform: Vercel (project sudah terhubung, url existing: cek dashboard Vercel)
- Environment variables staging di-set via Vercel Dashboard (Settings > Environment Variables), BUKAN commit `.env` ke repo
- Database: Supabase project staging terpisah dari production (kalau belum ada, buat baru sebelum Micro-Sprint 7)
- Deploy otomatis dari branch yang ditentukan tim (rekomendasi: `staging` branch terpisah dari `main`)

## 7. Troubleshooting Umum

| Gejala | Kemungkinan Sebab |
|---|---|
| Route yang harusnya terproteksi bisa diakses bebas | `proxy.ts` matcher belum mencakup path tsb, cek `export const config` |
| Login sukses tapi request berikutnya 401 | Cookie tidak ter-set (cek `Set-Cookie` header) atau `credentials: 'include'` belum ada di fetch client |
| Build gagal "Module not found: jose" | `pnpm install jose` belum dijalankan |
| Warning "middleware file convention deprecated" | File harus bernama `proxy.ts` bukan `middleware.ts`, fungsi di-export bernama `proxy` |
