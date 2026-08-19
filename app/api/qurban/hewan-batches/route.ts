import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const batches = await prisma.hewanBatch.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            qurbanAnimalSlots: {
              where: { status: 'TERSEDIA' }
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: batches });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
