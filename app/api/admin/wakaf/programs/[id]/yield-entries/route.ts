import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { Prisma } from '@/app/generated/prisma/client';
import { z } from 'zod';

const createYieldEntrySchema = z.object({
  amount: z.number({ message: 'Nominal hasil investasi wajib diisi' }).positive('Nominal hasil investasi harus lebih besar dari 0'),
  sourceDescription: z.string().min(1, 'Deskripsi sumber hasil investasi wajib diisi'),
});

export async function POST(
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

    const { id: waqfProgramId } = await params;

    const program = await prisma.waqfProgram.findUnique({
      where: { id: waqfProgramId },
      include: { principalLedger: true },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program wakaf tidak ditemukan' },
        { status: 404 }
      );
    }

    // VALIDASI WAJIB: Hanya berlaku untuk wakaf produktif
    if (program.jenisWakaf !== 'PRODUKTIF_KEKAL') {
      return NextResponse.json(
        { error: 'Pencatatan hasil investasi hanya berlaku untuk wakaf produktif' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = createYieldEntrySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { amount, sourceDescription } = parsed.data;

    // Execute atomic creation of WaqfYieldEntry AND increment of totalHasilAvailable
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const entry = await tx.waqfYieldEntry.create({
        data: {
          waqfProgramId: program.id,
          amount,
          sourceDescription,
          recordedByAdminId: userId,
        },
      });

      const updatedLedger = await tx.waqfPrincipalLedger.upsert({
        where: { waqfProgramId: program.id },
        update: {
          totalHasilAvailable: { increment: amount },
        },
        create: {
          waqfProgramId: program.id,
          pokokDanaTerkumpul: 0,
          totalHasilAvailable: amount,
          hasilInvestasiTersalurkan: 0,
        },
      });

      return { entry, ledger: updatedLedger };
    });

    return NextResponse.json(
      {
        message: 'Pencatatan hasil investasi wakaf berhasil',
        data: result.entry,
        ledger: result.ledger,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/admin/wakaf/programs/[id]/yield-entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
