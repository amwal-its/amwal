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

    const setoran = await prisma.setoranPetugasLapangan.findUnique({
      where: { id },
      include: {
        setoranQurbanOrderLinks: {
          include: {
            qurbanOrder: true
          }
        }
      }
    });

    if (!setoran) {
      return NextResponse.json({ error: 'Setoran tidak ditemukan' }, { status: 404 });
    }

    if (setoran.verifiedByAdminId) {
      return NextResponse.json({ error: 'Setoran sudah diverifikasi sebelumnya' }, { status: 400 });
    }

    const updatedSetoran = await prisma.$transaction(async (tx) => {
      // Mark setoran as verified
      const verifiedSetoran = await tx.setoranPetugasLapangan.update({
        where: { id },
        data: {
          verifiedByAdminId: session.userId,
          verifiedAt: new Date()
        }
      });

      // Update related QurbanOrders slots to TERJUAL if they are LUNAS
      const lunasOrdersIds = setoran.setoranQurbanOrderLinks
        .map(link => link.qurbanOrder)
        .filter(order => order.statusPembayaran === 'LUNAS')
        .map(order => order.id);

      if (lunasOrdersIds.length > 0) {
        await tx.qurbanAnimalSlot.updateMany({
          where: {
            qurbanOrderId: { in: lunasOrdersIds }
          },
          data: {
            status: 'TERJUAL'
          }
        });
      }

      // If we want to create/update transaction status to SUCCESS for cash orders here, we could
      // but for now, slot status update suffices for Qurban flow.

      return verifiedSetoran;
    });

    return NextResponse.json({ success: true, data: updatedSetoran });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
