import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: waqfProgramId } = await params;

    const program = await prisma.waqfProgram.findUnique({
      where: { id: waqfProgramId },
      include: {
        principalLedger: true,
        yieldEntries: {
          orderBy: {
            recordedAt: 'desc',
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

    if (program.jenisWakaf !== 'PRODUKTIF_KEKAL') {
      return NextResponse.json(
        { error: 'Program ini bukan wakaf produktif kekal' },
        { status: 400 }
      );
    }

    // Resolve admin names for each yield entry
    const adminIds = Array.from(new Set(program.yieldEntries.map((e) => e.recordedByAdminId).filter(Boolean)));
    const admins = await prisma.user.findMany({
      where: { id: { in: adminIds } },
      select: { id: true, name: true, role: true },
    });

    const adminMap = new Map(admins.map((a) => [a.id, a.name]));

    const formattedYieldEntries = program.yieldEntries.map((entry) => ({
      id: entry.id,
      amount: Number(entry.amount),
      sourceDescription: entry.sourceDescription,
      recordedAt: entry.recordedAt.toISOString(),
      recordedByAdminId: entry.recordedByAdminId,
      adminName: adminMap.get(entry.recordedByAdminId) || 'Super Admin',
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          programId: program.id,
          judul: program.judul,
          jenisWakaf: program.jenisWakaf,
          ledger: {
            pokokDanaTerkumpul: Number(program.principalLedger?.pokokDanaTerkumpul || 0),
            totalHasilAvailable: Number(program.principalLedger?.totalHasilAvailable || 0),
            hasilInvestasiTersalurkan: Number(program.principalLedger?.hasilInvestasiTersalurkan || 0),
            updatedAt: program.principalLedger?.updatedAt || program.updatedAt,
          },
          yieldEntries: formattedYieldEntries,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching yield entries:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
