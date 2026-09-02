import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const addReceiptSchema = z.object({
  title: z.string().min(1, 'Judul kuitansi wajib diisi'),
  vendor: z.string().optional().default(''),
  amount: z.number().positive('Nominal kuitansi harus lebih besar dari 0'),
  fileName: z.string().optional().default('Kuitansi_Belanja.jpg'),
  date: z.string().optional(),
  notes: z.string().optional(),
  ocrDetected: z.boolean().optional().default(true),
});

const verifyReceiptSchema = z.object({
  receiptId: z.string().min(1),
  status: z.enum(['Terverifikasi Super Admin', 'Ditolak Super Admin', 'Menunggu Verifikasi Super Admin']).default('Terverifikasi Super Admin'),
  notes: z.string().optional(),
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

    const { id: waqfProgramId } = await params;
    const program = await prisma.waqfProgram.findUnique({
      where: { id: waqfProgramId },
      include: {
        progressReports: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!program) {
      return NextResponse.json({ error: 'Program wakaf tidak ditemukan' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = addReceiptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validasi gagal', details: parsed.error.format() }, { status: 400 });
    }

    const receiptItem = {
      id: `RCP-${Date.now().toString().slice(-6)}`,
      title: parsed.data.title,
      vendor: parsed.data.vendor,
      amount: parsed.data.amount,
      fileName: parsed.data.fileName,
      date: parsed.data.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Terverifikasi Super Admin',
      ocrDetected: parsed.data.ocrDetected,
      notes: parsed.data.notes || 'Dicatat dan diverifikasi langsung oleh Super Admin.',
    };

    const latestReport = program.progressReports[0];
    let updatedReport;

    if (latestReport) {
      const existingKuitansi = Array.isArray(latestReport.kuitansiUrls) ? (latestReport.kuitansiUrls as any[]) : [];
      const updatedList = [receiptItem, ...existingKuitansi];

      updatedReport = await prisma.programProgressReport.update({
        where: { id: latestReport.id },
        data: {
          kuitansiUrls: updatedList,
        },
      });
    } else {
      updatedReport = await prisma.programProgressReport.create({
        data: {
          waqfProgramId,
          persentaseFisik: 0,
          deskripsi: 'Laporan kuitansi digital awal.',
          createdById: session.userId,
          kuitansiUrls: [receiptItem],
        },
      });
    }

    return NextResponse.json({
      message: 'Kuitansi belanja berhasil ditambahkan dan diverifikasi',
      data: receiptItem,
      report: updatedReport,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/wakaf/programs/[id]/receipts:', error);
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

    const { id: waqfProgramId } = await params;
    const body = await req.json();
    const parsed = verifyReceiptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validasi gagal', details: parsed.error.format() }, { status: 400 });
    }

    const { receiptId, status, notes } = parsed.data;

    const reports = await prisma.programProgressReport.findMany({
      where: { waqfProgramId },
    });

    let found = false;
    for (const report of reports) {
      if (Array.isArray(report.kuitansiUrls)) {
        const list = report.kuitansiUrls as any[];
        const idx = list.findIndex((item) => item.id === receiptId);
        if (idx !== -1) {
          list[idx] = {
            ...list[idx],
            status,
            ...(notes ? { notes } : {}),
          };
          await prisma.programProgressReport.update({
            where: { id: report.id },
            data: { kuitansiUrls: list },
          });
          found = true;
          break;
        }
      }
    }

    if (!found) {
      return NextResponse.json({ error: 'Kuitansi belanja tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      message: `Status kuitansi berhasil diperbarui menjadi ${status}`,
      receiptId,
      status,
    }, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH /api/admin/wakaf/programs/[id]/receipts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
