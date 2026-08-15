# Arsitektur Sistem — Amwal V.1

## 1. Stack Teknologi (Terkunci)

| Layer | Teknologi | Status di Codebase |
|---|---|---|
| Frontend | Next.js 16.2.6 (App Router), React 19.2, Tailwind CSS v4 | ✅ Sudah jalan |
| Backend | API Route Next.js (`app/api/.../route.ts`), monolithic | ✅ Pola sudah ada (auth) |
| Database | PostgreSQL via Supabase | ✅ Terkoneksi (`DATABASE_URL`, `DIRECT_URL`) |
| ORM | Prisma 7.8 (`@prisma/adapter-pg`) | ✅ Sudah jalan, baru 1 model (`User`) |
| Auth | JWT + Rotating Refresh Token | ⚠️ Access token ada, refresh token BELUM ada |
| RBAC | `proxy.ts` (Next.js 16 proxy convention, bukan `middleware.ts`) | ⚠️ Ada tapi rusak (lihat Security.md) & pakai role lama |
| Payment Gateway | Midtrans / Xendit (skema disbursement) | ❌ Belum terpasang sama sekali |
| File Storage | Supabase Storage | ❌ Belum terpasang sama sekali |
| OCR | Google Cloud Vision API | ❌ Belum terpasang, perlu PoC |
| Notifikasi | Firebase Cloud Messaging | ❌ Belum terpasang |

## 2. Pola Prisma Client (Sudah Berjalan — Jangan Diubah)

```typescript
// lib/prisma.ts (existing, PERTAHANKAN pola ini)
import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

Generator schema tetap pakai `provider = "prisma-client"` dengan
`output = "../app/generated/prisma"` — JANGAN diganti ke `prisma-client-js`.

## 3. Arsitektur Auth (Target — Bagian Akan Direvisi Sprint 1)

```
Login → verify password (bcrypt) → sign Access Token (JWT, expiry pendek,
        payload wajib berisi { userId, role })
      → sign Refresh Token (random string, HASH disimpan di tabel RefreshToken)
      → SET KEDUANYA sebagai httpOnly cookie (amwal_token, amwal_refresh)
      → response body HANYA berisi { message, user } — TIDAK ADA token di body

Refresh → baca amwal_refresh cookie → cocokkan hash di DB →
        → jika valid & belum revoked: revoke token lama, terbitkan pasangan baru
        → jika sudah revoked & dicoba lagi: revoke SEMUA refresh token user ini
          (indikasi token dicuri/replay)

Setiap request ke route terproteksi → proxy.ts verify amwal_token (jose,
Edge-compatible) → teruskan x-user-id & x-user-role via header ke Route Handler
```

## 4. Arsitektur Modul Transaksi (Pola Hybrid — Berlaku utk Wakaf/Zakat/Qurban)

Setiap modul transaksi punya struktur simetris:

```
{modul}_orders          <- anchor utama modul (offline ATAU online)
  ├─ transaction_id?    <- NULL jika offline (tunai/beras), terisi jika digital
  └─ entered_by_*_id?   <- terisi jika dientri Admin/Petugas (offline)

transactions             <- HANYA log Payment Gateway digital (anchor generik)
  └─ dipakai bareng oleh waqf_orders / zakat_orders / qurban_orders
```

Alur digital: `{modul}_orders` dibuat status `MENUNGGU` → Payment Gateway
checkout → webhook konfirmasi → `transactions.status_pembayaran = LUNAS` →
update `{modul}_orders.status` mengikuti.

Alur offline: Admin/Petugas Lapangan input `{modul}_orders` langsung dengan
`metode_pembayaran = TUNAI/BERAS`, `transaction_id = NULL`.

## 5. Arsitektur Payment Gateway (Non-Custodial — Wajib)

Provider (Midtrans/Xendit) HARUS dikonfigurasi dengan skema
**split settlement/disbursement** — dana dari Wakif/Muzaki masuk LANGSUNG ke
rekening Nadzir/lembaga mitra, TIDAK PERNAH transit di rekening Amwal.
Setiap `transactions` row wajib mengisi `disbursement_destination` sebagai
bukti audit.

## 6. Arsitektur File Storage

Supabase Storage, dengan bucket terpisah minimal:
- `nadzir-documents` (KTP, Sertifikat BWI) — akses terbatas role `ADMIN`, retensi 30 hari untuk file KTP mentah
- `program-banners` (banner program wakaf) — publik
- `receipts` (kuitansi, bukti transfer, bukti distribusi) — akses `ADMIN`/`NADZIR`/`PETUGAS_LAPANGAN`
