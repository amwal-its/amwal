import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { Prisma } from '@/app/generated/prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    let userId = req.headers.get('x-user-id');
    let userRole = req.headers.get('x-user-role');

    if (!userId || !userRole) {
      const session = await getSession();
      if (session) {
        userId = session.userId;
        userRole = session.role;
      }
    }

    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Akses khusus Super Admin' },
        { status: 401 }
      );
    }

    // 1. Pending Nadzir Verification
    const pendingNadzir = await prisma.nadzirProfile.findMany({
      where: { statusVerifikasi: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Pending Fund Withdrawal Requests (Waqf)
    const pendingWithdrawals = await prisma.fundWithdrawalRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        waqfProgram: {
          select: {
            id: true,
            judul: true,
            kategori: true,
            targetDana: true,
            jenisWakaf: true,
          },
        },
        requestedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Pending Permohonan Penyaluran Institusional (Sosial / Qurban)
    const pendingPermohonan = await prisma.permohonanPenyaluranInstitusional.findMany({
      where: { status: 'DIAJUKAN' },
      orderBy: { createdAt: 'desc' },
    });

    // 4. Pending Progress Reports with Receipts
    const pendingProgressReports = await prisma.programProgressReport.findMany({
      where: {
        kuitansiUrls: {
          not: Prisma.JsonNull,
        },
      },
      take: 10,
      include: {
        waqfProgram: {
          select: {
            id: true,
            judul: true,
            kategori: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      data: {
        counts: {
          nadzir: pendingNadzir.length,
          withdrawals: pendingWithdrawals.length,
          permohonan: pendingPermohonan.length,
          receipts: pendingProgressReports.length,
          total:
            pendingNadzir.length +
            pendingWithdrawals.length +
            pendingPermohonan.length +
            pendingProgressReports.length,
        },
        pendingNadzir,
        pendingWithdrawals,
        pendingPermohonan,
        pendingProgressReports,
      },
    });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
