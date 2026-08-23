import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { WithdrawalStatus } from '@/app/generated/prisma/client';
import { z } from 'zod';

const patchWithdrawalRequestSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'], {
    message: 'Status wajib diisi dengan APPROVED atau REJECTED',
  }),
  adminNotes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Akses ditolak. Peran ADMIN diperlukan.' },
        { status: 401 }
      );
    }

    const { id: withdrawalRequestId } = await params;

    const withdrawalRequest = await prisma.fundWithdrawalRequest.findUnique({
      where: { id: withdrawalRequestId },
      include: {
        waqfProgram: {
          include: {
            principalLedger: true,
          },
        },
      },
    });

    if (!withdrawalRequest) {
      return NextResponse.json(
        { error: 'Pengajuan penarikan dana tidak ditemukan' },
        { status: 404 }
      );
    }

    if (withdrawalRequest.status !== WithdrawalStatus.PENDING) {
      return NextResponse.json(
        { error: `Pengajuan penarikan dana sudah diproses (Status: ${withdrawalRequest.status})` },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = patchWithdrawalRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { status, adminNotes } = parsed.data;

    // Logika REJECTED: adminNotes wajib diisi (tidak boleh kosong atau hanya whitespace)
    if (status === 'REJECTED') {
      if (!adminNotes || adminNotes.trim().length === 0) {
        return NextResponse.json(
          { error: 'Alasan penolakan wajib diisi' },
          { status: 400 }
        );
      }

      const updatedRequest = await prisma.fundWithdrawalRequest.update({
        where: { id: withdrawalRequestId },
        data: {
          status: WithdrawalStatus.REJECTED,
          adminNotes: adminNotes.trim(),
          approvedById: session.userId,
        },
      });

      return NextResponse.json(
        {
          message: 'Pengajuan penarikan dana berhasil ditolak',
          data: updatedRequest,
        },
        { status: 200 }
      );
    }

    // Logika APPROVED: Validasi saldo hasil available pada WaqfPrincipalLedger
    const ledger = withdrawalRequest.waqfProgram.principalLedger;
    const availableBalance = ledger ? Number(ledger.totalHasilAvailable) : 0;
    const requestAmount = Number(withdrawalRequest.amount);

    if (requestAmount > availableBalance) {
      return NextResponse.json(
        { error: 'Saldo hasil tidak mencukupi' },
        { status: 400 }
      );
    }

    // Atomic update inside $transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.fundWithdrawalRequest.update({
        where: { id: withdrawalRequestId },
        data: {
          status: WithdrawalStatus.APPROVED,
          adminNotes: adminNotes ? adminNotes.trim() : null,
          approvedById: session.userId,
        },
      });

      const updatedLedger = await tx.waqfPrincipalLedger.update({
        where: { waqfProgramId: withdrawalRequest.waqfProgramId },
        data: {
          totalHasilAvailable: { decrement: requestAmount },
          hasilInvestasiTersalurkan: { increment: requestAmount },
        },
      });

      return { request: updatedRequest, ledger: updatedLedger };
    });

    return NextResponse.json(
      {
        message: 'Pengajuan penarikan dana berhasil disetujui',
        data: result.request,
        ledger: result.ledger,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PATCH /api/admin/withdrawal-requests/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
