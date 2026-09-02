import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { WithdrawalStatus } from '@/app/generated/prisma/client';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createWithdrawalSchema = z.object({
  waqfProgramId: z.string().min(1, 'Program wakaf wajib dipilih'),
  amount: z.number().positive('Nominal penarikan harus lebih besar dari 0'),
  peruntukan: z.string().min(1, 'Peruntukan / termin ke- wajib diisi'),
  rekeningTujuan: z.string().optional().default('BSI Escrow'),
  adminNotes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak. Peran ADMIN diperlukan.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const programId = searchParams.get('programId');

    const requests = await prisma.fundWithdrawalRequest.findMany({
      where: programId ? { waqfProgramId: programId } : undefined,
      include: {
        waqfProgram: {
          select: {
            id: true,
            judul: true,
            jenisWakaf: true,
            targetDana: true,
            principalLedger: true,
          },
        },
        requestedBy: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: requests }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/admin/withdrawal-requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak. Peran ADMIN diperlukan.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createWithdrawalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validasi gagal', details: parsed.error.format() }, { status: 400 });
    }

    const { waqfProgramId, amount, peruntukan, rekeningTujuan, adminNotes } = parsed.data;

    const program = await prisma.waqfProgram.findUnique({
      where: { id: waqfProgramId },
      include: { principalLedger: true },
    });

    if (!program) {
      return NextResponse.json({ error: 'Program wakaf tidak ditemukan' }, { status: 404 });
    }

    const newRequest = await prisma.fundWithdrawalRequest.create({
      data: {
        waqfProgramId,
        amount,
        peruntukan,
        rekeningTujuan,
        adminNotes,
        requestedById: session.userId,
        status: WithdrawalStatus.PENDING,
      },
      include: {
        waqfProgram: true,
        requestedBy: { select: { name: true, phone: true } },
      },
    });

    return NextResponse.json({
      message: 'Pengajuan penarikan dana termin berhasil dibuat',
      data: newRequest,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/withdrawal-requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
