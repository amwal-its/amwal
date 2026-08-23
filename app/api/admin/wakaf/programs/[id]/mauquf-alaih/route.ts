import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { WithdrawalStatus } from '@/app/generated/prisma/client';
import { z } from 'zod';

const createMauqufAlaihDistributionSchema = z.object({
  namaPenerima: z.string().min(1, 'Nama penerima manfaat wajib diisi'),
  kategoriPenerima: z.string().optional(),
  nominal: z.number().positive('Nominal disalurkan harus lebih besar dari 0').optional(),
  buktiPenyaluranUrl: z.string().url('URL bukti penyaluran tidak valid').optional().or(z.literal('')),
  deskripsiKegiatan: z.string().optional(),
  withdrawalRequestId: z.string().min(1, 'withdrawalRequestId wajib diisi'),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'NADZIR')) {
      return NextResponse.json(
        { error: 'Unauthorized: Akses ditolak. Peran ADMIN atau NADZIR diperlukan.' },
        { status: 401 }
      );
    }

    const { id: waqfProgramId } = await params;

    // Verify program exists
    const program = await prisma.waqfProgram.findUnique({
      where: { id: waqfProgramId },
      include: { nadzirProfile: true },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program wakaf tidak ditemukan' },
        { status: 404 }
      );
    }

    // Ownership check for Nadzir role
    if (session.role === 'NADZIR' && program.nadzirProfile.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Forbidden: Anda bukan pemilik dari program wakaf ini' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createMauqufAlaihDistributionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      namaPenerima,
      kategoriPenerima,
      nominal,
      buktiPenyaluranUrl,
      deskripsiKegiatan,
      withdrawalRequestId,
    } = parsed.data;

    // Validate that withdrawalRequestId exists and has status APPROVED
    const withdrawalRequest = await prisma.fundWithdrawalRequest.findUnique({
      where: { id: withdrawalRequestId },
    });

    if (!withdrawalRequest) {
      return NextResponse.json(
        { error: `Pengajuan penarikan dana dengan ID ${withdrawalRequestId} tidak ditemukan` },
        { status: 400 }
      );
    }

    if (withdrawalRequest.waqfProgramId !== program.id) {
      return NextResponse.json(
        { error: 'Pengajuan penarikan dana tidak cocok dengan program wakaf ini' },
        { status: 400 }
      );
    }

    if (withdrawalRequest.status !== WithdrawalStatus.APPROVED) {
      return NextResponse.json(
        { error: `Penyaluran hanya dapat dihubungkan dengan pengajuan penarikan berstatus APPROVED (Status saat ini: ${withdrawalRequest.status})` },
        { status: 400 }
      );
    }

    // Create MauqufAlaihDistribution record
    const distribution = await prisma.mauqufAlaihDistribution.create({
      data: {
        waqfProgramId: program.id,
        withdrawalRequestId: withdrawalRequest.id,
        namaPenerimaManfaat: namaPenerima,
        kategoriPenerima: kategoriPenerima || null,
        nominalDisalurkan: nominal || null,
        buktiPenyaluranUrl: buktiPenyaluranUrl || null,
        notes: deskripsiKegiatan || null,
        tanggalPenyaluran: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: 'Realisasi penyaluran hasil wakaf (Mauquf Alaih) berhasil dicatat',
        data: distribution,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating MauqufAlaihDistribution:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
