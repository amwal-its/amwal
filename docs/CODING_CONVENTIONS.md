# Konvensi Kode — Amwal

## 1. Struktur Folder

```
app/
  api/
    auth/{login,register,logout,refresh}/route.ts
    wakaf/...
    zakat/...
    qurban/...
    admin/...
  generated/prisma/        <- output Prisma, JANGAN diedit manual
lib/
  prisma.ts                <- Prisma Client singleton, JANGAN diduplikasi
  session.ts                <- helper baca session dari cookie
  {domain}.service.ts       <- business logic murni (pure function bila mungkin)
components/
  ui/                        <- komponen dasar reusable
prisma/
  schema.prisma
  seed.ts
```

Path alias: `@/*` → root project (sudah dikonfigurasi di `tsconfig.json`,
jangan diubah).

## 2. Pola API Route Handler (Ikuti Persis Pola Existing)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const somethingSchema = z.object({
  field: z.string().min(1, 'Pesan error Bahasa Indonesia'),
});

export async function POST(req: NextRequest) {
  try {
    // Auth: baca identitas dari header yg diisi proxy.ts
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = somethingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    // ... logic ...

    return NextResponse.json({ message: 'Sukses', data: {} }, { status: 200 });
  } catch (error) {
    console.error('Deskripsi error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## 3. Aturan Wajib

- **Validasi**: Zod schema WAJIB inline di file route (bukan di folder
  terpusat) — pola ini sudah konsisten di baseline.
- **Response sukses**: `{ message: string, data?: T }`, status 200/201.
- **Response error**: `{ error: string, details?: object }`, status non-200.
- **Catch block**: `catch (error)` TANPA anotasi `: any` — gunakan
  `error instanceof Error` jika perlu akses `.message`.
- **Auth check**: baca `x-user-id`/`x-user-role` dari header (diisi
  `proxy.ts`), JANGAN verifikasi ulang JWT di dalam Route Handler kecuali
  benar-benar perlu detail payload tambahan.
- **Decimal/uang**: gunakan tipe `Decimal` Prisma (`@db.Decimal(18,2)`),
  JANGAN `Float` untuk nilai uang.
- **Enum**: gunakan Prisma enum, JANGAN string bebas untuk field
  status/kategori yang sudah didefinisikan di DBML.

## 4. Naming Convention

- Database: `snake_case` (kolom & tabel)
- Prisma Client / TypeScript: `camelCase` (otomatis via `@map`/`@@map` saat
  konversi DBML → schema.prisma)
- File: `kebab-case.ts` untuk service, `route.ts` untuk API handler (fixed
  oleh Next.js convention)
