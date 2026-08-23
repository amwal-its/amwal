import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { WithdrawalStatus } from '@/app/generated/prisma/client';
import { z } from 'zod';

const createWithdrawalRequestSchema = z.object({
  nominal: z.number({ message: 'Nominal penarikan wajib diisi' }).positive('Nominal penarikan harus lebih besar dari 0'),
  peruntukan: z.string().optional(),
  rekeningTujuan: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'NADZIR') {
      return NextResponse.json(
        { error: 'Unauthorized: Akses ditolak. Peran NADZIR diperlukan.' },
        { status: 401 }
      );
    }

    const { id: waqfProgramId } = await params;

    // Verify program exists and check ownership (Nadzir owns the program)
    const program = await prisma.waqfProgram.findUnique({
      where: { id: waqfProgramId },
      include: {
        nadzirProfile: true,
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program wakaf tidak ditemukan' },
        { status: 404 }
      );
    }

    if (program.nadzirProfile.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Forbidden: Anda bukan pemilik (Nadzir) dari program wakaf ini' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createWithdrawalRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { nominal, peruntukan, rekeningTujuan } = parsed.data;

    const withdrawalRequest = await prisma.fundWithdrawalRequest.create({
      data: {
        waqfProgramId: program.id,
        amount: nominal,
        peruntukan: peruntukan || null,
        rekeningTujuan: rekeningTujuan || null,
        requestedById: session.userId,
        status: WithdrawalStatus.PENDING,
      },
    });

    return NextResponse.json(
      {
        message: 'Pengajuan penarikan dana hasil wakaf berhasil dibuat',
        data: withdrawalRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating FundWithdrawalRequest:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
