import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const progressSchema = z.object({
  progressFisik: z.number().min(0, 'Progres fisik minimal 0%').max(100, 'Progres fisik maksimal 100%'),
  deskripsi: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak. Peran ADMIN diperlukan.' }, { status: 401 });
    }

    const { id } = await params;
    const program = await prisma.waqfProgram.findUnique({ where: { id } });
    if (!program) {
      return NextResponse.json({ error: 'Program wakaf tidak ditemukan' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = progressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validasi gagal', details: parsed.error.format() }, { status: 400 });
    }

    const { progressFisik, deskripsi } = parsed.data;

    const report = await prisma.programProgressReport.create({
      data: {
        waqfProgramId: id,
        persentaseFisik: progressFisik,
        deskripsi: deskripsi || `Pembaruan progres fisik oleh Admin menjadi ${progressFisik}%.`,
        createdById: session.userId,
        kuitansiUrls: [],
      },
      include: {
        createdBy: {
          select: { name: true, role: true },
        },
      },
    });

    return NextResponse.json({
      message: 'Progres fisik berhasil diperbarui',
      data: report,
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating progress fisik:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
