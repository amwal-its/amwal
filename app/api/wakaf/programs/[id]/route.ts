import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WaqfType, WaqfStatus, VerificationStatus } from '@/app/generated/prisma/client';
import { z } from 'zod';

const updateWaqfProgramSchema = z.object({
  judul: z.string().min(1, 'Judul program tidak boleh kosong').optional(),
  kategori: z.string().optional(),
  deskripsi: z.string().optional(),
  targetDana: z.number().positive('Target dana harus lebih besar dari 0').optional(),
  durasiHari: z.number().int().positive('Durasi hari harus berupa angka positif').optional(),
  bannerUrl: z.string().url('URL banner tidak valid').optional().or(z.literal('')),
  jenisWakaf: z.nativeEnum(WaqfType).optional(),
  status: z.nativeEnum(WaqfStatus).optional(),
  rabDocumentUrl: z.string().url('URL dokumen RAB tidak valid').optional().or(z.literal('')),
  dokumenLegalitasUrl: z.string().url('URL dokumen legalitas tidak valid').optional().or(z.literal('')),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const program = await prisma.waqfProgram.findUnique({
      where: { id },
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
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program wakaf tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Berhasil mengambil detail program wakaf', data: program },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching WaqfProgram detail:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (userRole !== 'NADZIR') {
      return NextResponse.json({ error: 'Akses ditolak. Peran NADZIR diperlukan.' }, { status: 403 });
    }

    const nadzirProfile = await prisma.nadzirProfile.findUnique({
      where: { userId },
    });

    if (!nadzirProfile || nadzirProfile.statusVerifikasi !== VerificationStatus.VERIFIED) {
      return NextResponse.json(
        { error: 'Akses ditolak. Profil Nadzir belum terverifikasi.' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existingProgram = await prisma.waqfProgram.findUnique({
      where: { id },
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program wakaf tidak ditemukan' },
        { status: 404 }
      );
    }

    // Ownership check: Nadzir can only update their own programs
    if (existingProgram.nadzirProfileId !== nadzirProfile.id) {
      return NextResponse.json(
        { error: 'Akses ditolak. Anda bukan pemilik program ini.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateWaqfProgramSchema.safeParse(body);

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

    // Logic transaction & immutability:
    // Reject change of jenisWakaf if current program status is NOT 'DRAFT'
    if (
      jenisWakaf !== undefined &&
      jenisWakaf !== existingProgram.jenisWakaf &&
      existingProgram.status !== WaqfStatus.DRAFT
    ) {
      return NextResponse.json(
        { error: 'Perubahan jenisWakaf hanya diperbolehkan saat status program DRAFT' },
        { status: 400 }
      );
    }

    const updatedProgram = await prisma.waqfProgram.update({
      where: { id },
      data: {
        ...(judul !== undefined && { judul }),
        ...(kategori !== undefined && { kategori }),
        ...(deskripsi !== undefined && { deskripsi }),
        ...(targetDana !== undefined && { targetDana }),
        ...(durasiHari !== undefined && { durasiHari }),
        ...(bannerUrl !== undefined && { bannerUrl: bannerUrl || null }),
        ...(jenisWakaf !== undefined && { jenisWakaf }),
        ...(status !== undefined && { status }),
        ...(rabDocumentUrl !== undefined && { rabDocumentUrl: rabDocumentUrl || null }),
        ...(dokumenLegalitasUrl !== undefined && { dokumenLegalitasUrl: dokumenLegalitasUrl || null }),
      },
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
    });

    return NextResponse.json(
      { message: 'Program wakaf berhasil diperbarui', data: updatedProgram },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating WaqfProgram:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
