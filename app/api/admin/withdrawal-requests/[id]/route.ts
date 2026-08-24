import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { WithdrawalStatus, Prisma } from '@/app/generated/prisma/client';
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
    let userId = req.headers.get('x-user-id');
    let userRole = req.headers.get('x-user-role');

    if (!userId || !userRole) {
      try {
        const session = await getSession();
        if (session) {
          userId = session.userId;
          userRole = session.role;
        }
      } catch {
        // cookies() called outside request context (e.g. unit tests)
      }
    }

    if (!userId || userRole !== 'ADMIN') {
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
          approvedById: userId,
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

    // Logika APPROVED: Percabangan Eksplisit Berdasarkan jenisWakaf
    const jenisWakaf = withdrawalRequest.waqfProgram.jenisWakaf;
    const ledger = withdrawalRequest.waqfProgram.principalLedger;
    const requestAmount = Number(withdrawalRequest.amount);

    if (jenisWakaf === 'HABIS_PAKAI') {
      const saldoPokok = ledger ? Number(ledger.pokokDanaTerkumpul) : 0;
      if (requestAmount > saldoPokok) {
        return NextResponse.json(
          { error: 'Saldo pokok tidak mencukupi' },
          { status: 400 }
        );
      }

      // Branch 1: HABIS_PAKAI -> Decrement pokokDanaTerkumpul
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const updatedRequest = await tx.fundWithdrawalRequest.update({
          where: { id: withdrawalRequestId },
          data: {
            status: WithdrawalStatus.APPROVED,
            adminNotes: adminNotes ? adminNotes.trim() : null,
            approvedById: userId,
          },
        });

        const updatedLedger = await tx.waqfPrincipalLedger.update({
          where: { waqfProgramId: withdrawalRequest.waqfProgramId },
          data: {
            pokokDanaTerkumpul: { decrement: requestAmount },
          },
        });

        return { request: updatedRequest, ledger: updatedLedger };
      });

      return NextResponse.json(
        {
          message: 'Pengajuan penarikan dana wakaf habis pakai berhasil disetujui',
          data: result.request,
          ledger: result.ledger,
        },
        { status: 200 }
      );
    } else {
      // Branch 2: PRODUKTIF_KEKAL -> Decrement totalHasilAvailable & Increment hasilInvestasiTersalurkan (pokok dana tetap utuh)
      const saldoHasil = ledger ? Number(ledger.totalHasilAvailable) : 0;
      if (requestAmount > saldoHasil) {
        return NextResponse.json(
          { error: 'Saldo hasil tidak mencukupi' },
          { status: 400 }
        );
      }

      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const updatedRequest = await tx.fundWithdrawalRequest.update({
          where: { id: withdrawalRequestId },
          data: {
            status: WithdrawalStatus.APPROVED,
            adminNotes: adminNotes ? adminNotes.trim() : null,
            approvedById: userId,
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
          message: 'Pengajuan penarikan hasil wakaf produktif berhasil disetujui',
          data: result.request,
          ledger: result.ledger,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error in PATCH /api/admin/withdrawal-requests/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
