import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Asnaf, VerificationStatus } from '@/app/generated/prisma/client';
import { encryptAES256, decryptAES256 } from '@/lib/crypto';

const ALLOWED_ROLES = ['ADMIN', 'PETUGAS_LAPANGAN'];

const createMustahiqSchema = z.object({
  namaLengkap: z.string().min(2, 'Nama mustahik wajib diisi'),
  nik: z
    .string()
    .regex(/^\d{16}$/, 'NIK harus 16 digit angka'),
  kategoriAsnaf: z.nativeEnum(Asnaf, {
    message: 'Kategori asnaf tidak valid (FAKIR, MISKIN, AMIL, MUALLAF, RIQAB, GHARIMIN, FISABILILLAH, IBNU_SABIL)',
  }),
  alamat: z.string().optional(),
  noHp: z.string().optional(),
  statusVerifikasi: z.nativeEnum(VerificationStatus).default(VerificationStatus.PENDING),
  adminNotes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');
    if (!userId || !userRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ALLOWED_ROLES.includes(userRole)) {
      return NextResponse.json({ error: 'Akses ditolak. Peran ADMIN atau PETUGAS_LAPANGAN diperlukan.' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createMustahiqSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { namaLengkap, nik, kategoriAsnaf, alamat, noHp, statusVerifikasi, adminNotes } = parsed.data;

    const mustahiq = await prisma.mustahiqProfile.create({
      data: {
        namaMustahiq: namaLengkap,
        nik: encryptAES256(nik),
        kategoriAsnaf,
        alamat,
        noTelepon: noHp,
        statusVerifikasi,
        adminNotes,
      },
      select: {
        id: true,
        namaMustahiq: true,
        kategoriAsnaf: true,
        alamat: true,
        noTelepon: true,
        statusVerifikasi: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ message: 'Mustahik berhasil didaftarkan', data: mustahiq }, { status: 201 });
  } catch (error) {
    console.error('Create mustahiq error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role');
    if (!userRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ALLOWED_ROLES.includes(userRole)) {
      return NextResponse.json({ error: 'Akses ditolak. Peran ADMIN atau PETUGAS_LAPANGAN diperlukan.' }, { status: 403 });
    }

    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search');
    const kategoriAsnaf = searchParams.get('kategoriAsnaf');
    const statusVerifikasi = searchParams.get('statusVerifikasi');
    const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100);

    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause.OR = [
        { namaMustahiq: { contains: search, mode: 'insensitive' } },
        { alamat: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (kategoriAsnaf && Object.values(Asnaf).includes(kategoriAsnaf as Asnaf)) {
      whereClause.kategoriAsnaf = kategoriAsnaf as Asnaf;
    }
    if (statusVerifikasi && Object.values(VerificationStatus).includes(statusVerifikasi as VerificationStatus)) {
      whereClause.statusVerifikasi = statusVerifikasi as VerificationStatus;
    }

    const mustahiqs = await prisma.mustahiqProfile.findMany({
      where: whereClause,
      select: {
        id: true,
        namaMustahiq: true,
        nik: true,
        kategoriAsnaf: true,
        alamat: true,
        noTelepon: true,
        statusVerifikasi: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const data = mustahiqs.map((m: { id: string; namaMustahiq: string; nik: string | null; kategoriAsnaf: any; alamat: string | null; noTelepon: string | null; statusVerifikasi: any; createdAt: Date }) => ({ ...m, nik: decryptAES256(m.nik ?? '') || null }));

    return NextResponse.json({ message: 'Berhasil mengambil daftar mustahik', data }, { status: 200 });
  } catch (error) {
    console.error('List mustahiq error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
