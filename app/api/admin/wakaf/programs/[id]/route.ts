import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { WaqfType, WaqfStatus } from '@/app/generated/prisma/client';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateProgramSchema = z.object({
  judul: z.string().min(1).optional(),
  kategori: z.string().optional(),
  deskripsi: z.string().optional(),
  targetDana: z.number().positive().optional(),
  durasiHari: z.number().int().positive().optional(),
  bannerUrl: z.string().optional().or(z.literal('')),
  jenisWakaf: z.nativeEnum(WaqfType).optional(),
  status: z.nativeEnum(WaqfStatus).optional(),
  progressFisik: z.number().min(0).max(100).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak. Peran ADMIN diperlukan.' }, { status: 401 });
    }

    const { id } = await params;
    const program = await prisma.waqfProgram.findUnique({
      where: { id },
      include: {
        principalLedger: true,
        nadzirProfile: true,
        progressReports: {
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: {
              select: { name: true, role: true },
            },
          },
        },
        withdrawalRequests: {
          orderBy: { createdAt: 'desc' },
          include: {
            requestedBy: { select: { name: true, phone: true } },
            approvedBy: { select: { name: true } },
          },
        },
        yieldEntries: {
          orderBy: { recordedAt: 'desc' },
        },
        waqfOrders: {
          where: { status: 'TERVERIFIKASI' },
          include: {
            wakif: true,
            transaction: { include: { certificate: true } },
          },
        },
      },
    });

    if (!program) {
      return NextResponse.json({ error: 'Program wakaf tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ data: program }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/admin/wakaf/programs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak. Peran ADMIN diperlukan.' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.waqfProgram.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Program wakaf tidak ditemukan' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateProgramSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validasi gagal', details: parsed.error.format() }, { status: 400 });
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
      progressFisik,
    } = parsed.data;

    const updated = await prisma.waqfProgram.update({
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
      },
      include: {
        principalLedger: true,
        progressReports: { orderBy: { createdAt: 'desc' } },
      },
    });

    // If progressFisik was specified, also update or create a ProgressReport
    if (progressFisik !== undefined) {
      await prisma.programProgressReport.create({
        data: {
          waqfProgramId: id,
          persentaseFisik: progressFisik,
          deskripsi: `Pembaruan progres fisik oleh Admin menjadi ${progressFisik}%.`,
          createdById: session.userId,
          kuitansiUrls: [],
        },
      });
    }

    return NextResponse.json({ message: 'Program wakaf berhasil diperbarui', data: updated }, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH /api/admin/wakaf/programs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak. Peran ADMIN diperlukan.' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.waqfProgram.findUnique({
      where: { id },
      include: {
        waqfOrders: { where: { status: 'TERVERIFIKASI' } },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Program wakaf tidak ditemukan' }, { status: 404 });
    }

    if (existing.waqfOrders.length > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus program yang sudah memiliki transaksi wakaf terverifikasi.' },
        { status: 400 }
      );
    }

    // Cascade delete related auxiliary records
    await prisma.$transaction([
      prisma.waqfPrincipalLedger.deleteMany({ where: { waqfProgramId: id } }),
      prisma.programProgressReport.deleteMany({ where: { waqfProgramId: id } }),
      prisma.waqfYieldEntry.deleteMany({ where: { waqfProgramId: id } }),
      prisma.fundWithdrawalRequest.deleteMany({ where: { waqfProgramId: id } }),
      prisma.waqfProgram.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: 'Program wakaf berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/admin/wakaf/programs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
