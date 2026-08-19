import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

/**
 * GET /api/zakat-fitrah-config
 * Publik — dipakai kalkulator & UI. `?active=true` hanya kembalikan varian aktif.
 */
export async function GET(req: NextRequest) {
  try {
    const activeOnly = req.nextUrl.searchParams.get('active') === 'true';
    const configs = await prisma.zakatFitrahConfig.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ message: 'Sukses', data: configs }, { status: 200 });
  } catch (error) {
    console.error('Get zakat fitrah config error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
