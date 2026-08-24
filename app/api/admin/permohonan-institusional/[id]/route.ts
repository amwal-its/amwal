import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes, alokasiDagingDisetujuiKg } = body;

    if (!status) {
      return NextResponse.json({ error: 'status is required' }, { status: 400 });
    }

    if (status === 'DITOLAK' && (!adminNotes || adminNotes.trim() === '')) {
      return NextResponse.json({ error: 'Alasan penolakan wajib diisi' }, { status: 400 });
    }

    const permohonan = await prisma.permohonanPenyaluranInstitusional.findUnique({
      where: { id }
    });

    if (!permohonan) {
      return NextResponse.json({ error: 'Permohonan tidak ditemukan' }, { status: 404 });
    }

    const updated = await prisma.permohonanPenyaluranInstitusional.update({
      where: { id },
      data: {
        status: status as any,
        adminNotes: adminNotes || permohonan.adminNotes,
        alokasiDagingDisetujuiKg: status === 'DISETUJUI' && alokasiDagingDisetujuiKg !== undefined 
          ? Number(alokasiDagingDisetujuiKg) 
          : permohonan.alokasiDagingDisetujuiKg,
        approvedByAdminId: status === 'DISETUJUI' ? session.userId : permohonan.approvedByAdminId,
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
