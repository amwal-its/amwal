import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Asnaf, ZakatOrderStatus } from '@/app/generated/prisma/client';

const ALLOWED_ROLES = ['ADMIN', 'PETUGAS_LAPANGAN'];

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role');
    if (!userRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ALLOWED_ROLES.includes(userRole)) {
      return NextResponse.json({ error: 'Akses ditolak. Peran ADMIN atau PETUGAS_LAPANGAN diperlukan.' }, { status: 403 });
    }

    const [
      fundPools,
      verifiedOrdersStats,
      pendingOrdersCount,
      totalMustahiqCount,
      asnafMustahiqCounts,
      distributions,
    ] = await Promise.all([
      prisma.fundPool.findMany(),
      prisma.zakatOrder.aggregate({
        where: { status: ZakatOrderStatus.TERVERIFIKASI },
        _sum: {
          nominal: true,
          beratBerasKg: true,
        },
        _count: true,
      }),
      prisma.zakatOrder.count({
        where: { status: ZakatOrderStatus.MENUNGGU_VERIFIKASI },
      }),
      prisma.mustahiqProfile.count(),
      prisma.mustahiqProfile.groupBy({
        by: ['kategoriAsnaf'],
        _count: true,
      }),
      prisma.zakatDistribution.findMany({
        select: {
          nominal: true,
          beratBerasKg: true,
          mustahiq: {
            select: {
              kategoriAsnaf: true,
            },
          },
        },
      }),
    ]);

    // Parse Fund Pools
    const maalPool = fundPools.find((p) => p.kode === 'ZAKAT_MAAL');
    const fitrahPool = fundPools.find((p) => p.kode === 'ZAKAT_FITRAH');

    // Calculate distribution per Asnaf
    const asnafDisbursedMap: Record<string, { count: number; totalNominal: number; totalBerasKg: number }> = {};
    Object.values(Asnaf).forEach((asnaf) => {
      asnafDisbursedMap[asnaf] = { count: 0, totalNominal: 0, totalBerasKg: 0 };
    });

    asnafMustahiqCounts.forEach((group) => {
      if (asnafDisbursedMap[group.kategoriAsnaf]) {
        asnafDisbursedMap[group.kategoriAsnaf].count = group._count;
      }
    });

    distributions.forEach((d) => {
      const asnaf = d.mustahiq?.kategoriAsnaf;
      if (asnaf && asnafDisbursedMap[asnaf]) {
        asnafDisbursedMap[asnaf].totalNominal += Number(d.nominal || 0);
        asnafDisbursedMap[asnaf].totalBerasKg += Number(d.beratBerasKg || 0);
      }
    });

    return NextResponse.json({
      message: 'Berhasil mengambil ringkasan zakat & asnaf',
      data: {
        fundPools: {
          maal: {
            balance: Number(maalPool?.balance || 0),
            totalDistributed: Number(maalPool?.totalDistributed || 0),
          },
          fitrah: {
            balance: Number(fitrahPool?.balance || 0),
            totalDistributed: Number(fitrahPool?.totalDistributed || 0),
          },
        },
        orders: {
          totalVerifiedAmount: Number(verifiedOrdersStats._sum.nominal || 0),
          totalVerifiedBerasKg: Number(verifiedOrdersStats._sum.beratBerasKg || 0),
          verifiedCount: verifiedOrdersStats._count || 0,
          pendingCount: pendingOrdersCount,
        },
        mustahiq: {
          totalCount: totalMustahiqCount,
          asnafBreakdown: asnafDisbursedMap,
        },
      },
    });
  } catch (error) {
    console.error('Zakat summary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
