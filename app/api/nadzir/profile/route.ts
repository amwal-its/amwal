import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NadzirKategori } from '@/app/generated/prisma/client';
import { z } from 'zod';

const nadzirProfileSchema = z.object({
  kategori: z.nativeEnum(NadzirKategori),
  namaLembaga: z.string().optional(),
  nomorRekeningBank: z.string().optional(),
  namaBank: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (userRole !== 'NADZIR') {
      return NextResponse.json({ error: 'Akses ditolak. Peran NADZIR diperlukan.' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = nadzirProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { kategori, namaLembaga, nomorRekeningBank, namaBank } = parsed.data;

    // Upsert NadzirProfile for the authenticated Nadzir user
    const profile = await prisma.nadzirProfile.upsert({
      where: { userId },
      create: {
        userId,
        kategori,
        namaLembaga: namaLembaga || null,
        nomorRekeningBank: nomorRekeningBank || null,
        namaBank: namaBank || null,
      },
      update: {
        kategori,
        namaLembaga: namaLembaga || null,
        nomorRekeningBank: nomorRekeningBank || null,
        namaBank: namaBank || null,
      },
    });

    return NextResponse.json(
      { message: 'Profil Nadzir berhasil disimpan', data: profile },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving NadzirProfile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
