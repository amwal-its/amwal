import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WaqfType, WaqfStatus, VerificationStatus } from '@/app/generated/prisma/client';
import { z } from 'zod';

const createWaqfProgramSchema = z.object({
  judul: z.string().min(1, 'Judul program wajib diisi'),
  kategori: z.string().optional(),
  deskripsi: z.string().optional(),
  targetDana: z.number({ message: 'Target dana wajib diisi' }).positive('Target dana harus lebih besar dari 0'),
  durasiHari: z.number().int().positive('Durasi hari harus berupa angka positif').optional(),
  bannerUrl: z.string().url('URL banner tidak valid').optional().or(z.literal('')),
  jenisWakaf: z.nativeEnum(WaqfType),
  status: z.nativeEnum(WaqfStatus).optional().default(WaqfStatus.DRAFT),
  rabDocumentUrl: z.string().url('URL dokumen RAB tidak valid').optional().or(z.literal('')),
  dokumenLegalitasUrl: z.string().url('URL dokumen legalitas tidak valid').optional().or(z.literal('')),
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

    // Checking Nadzir profile verification status
    const nadzirProfile = await prisma.nadzirProfile.findUnique({
      where: { userId },
    });

    if (!nadzirProfile || nadzirProfile.statusVerifikasi !== VerificationStatus.VERIFIED) {
      return NextResponse.json(
        { error: 'Akses ditolak. Profil Nadzir belum terverifikasi.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createWaqfProgramSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      judul,
      kategori,
      deskripsi,
      targetDana,
      durasiHari,
      bannerUrl,
      jenisWakaf,
      status,
      rabDocumentUrl,
      dokumenLegalitasUrl,
    } = parsed.data;

    // Execute atomic creation of WaqfProgram AND initial WaqfPrincipalLedger
    const result = await prisma.$transaction(async (tx) => {
      const program = await tx.waqfProgram.create({
        data: {
          nadzirProfileId: nadzirProfile.id,
          judul,
          kategori,
          deskripsi,
          targetDana,
          durasiHari,
          bannerUrl: bannerUrl || null,
          jenisWakaf,
          status,
          rabDocumentUrl: rabDocumentUrl || null,
          dokumenLegalitasUrl: dokumenLegalitasUrl || null,
        },
      });

      const ledger = await tx.waqfPrincipalLedger.create({
        data: {
          waqfProgramId: program.id,
          pokokDanaTerkumpul: 0,
          hasilInvestasiTersalurkan: 0,
        },
      });

      return { ...program, principalLedger: ledger };
    });

    return NextResponse.json(
      { message: 'Program wakaf berhasil dibuat', data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating WaqfProgram:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const kategori = searchParams.get('kategori');
    const search = searchParams.get('search');
    const statusParam = searchParams.get('status');

    // Build dynamic filter
    const whereClause: Record<string, unknown> = {};

    if (kategori) {
      whereClause.kategori = { contains: kategori, mode: 'insensitive' };
    }

    if (search) {
      whereClause.OR = [
        { judul: { contains: search, mode: 'insensitive' } },
        { deskripsi: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (statusParam && Object.values(WaqfStatus).includes(statusParam as WaqfStatus)) {
      whereClause.status = statusParam as WaqfStatus;
    }

    const programs = await prisma.waqfProgram.findMany({
      where: whereClause,
      include: {
        principalLedger: true,
        nadzirProfile: {
          select: {
            id: true,
            namaLembaga: true,
            kategori: true,
            statusVerifikasi: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { message: 'Berhasil mengambil daftar program wakaf', data: programs },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching WaqfPrograms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
