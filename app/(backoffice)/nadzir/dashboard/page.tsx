import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { BackofficeProgramManagementView, BackofficeProgramItem } from '@/components/backoffice/backoffice-program-management-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Dashboard Nadzir | Portofolio Wakaf YMI ITS',
  description: 'Kelola program wakaf, pantau progres penghimpunan dana, dan lihat transparansi ledger hasil investasi.',
};

export default async function NadzirDashboardPage() {
  const session = await getSession();
  const userRole = session?.role || 'NADZIR';
  const userName = session?.email || 'Nadzir YMI ITS';

  const programs = await prisma.waqfProgram.findMany({
    where: {
      status: 'LIVE',
    },
    include: {
      principalLedger: true,
      nadzirProfile: {
        select: {
          namaLembaga: true,
        },
      },
      yieldEntries: {
        orderBy: {
          recordedAt: 'desc',
        },
      },
      _count: {
        select: {
          waqfOrders: {
            where: {
              status: 'TERVERIFIKASI',
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedPrograms: BackofficeProgramItem[] = programs.map((p) => ({
    id: p.id,
    judul: p.judul,
    kategori: p.kategori || 'Wakaf',
    bannerUrl: p.bannerUrl,
    jenisWakaf: p.jenisWakaf,
    status: p.status,
    targetDana: Number(p.targetDana) || 0,
    pokokDanaTerkumpul: Number(p.principalLedger?.pokokDanaTerkumpul) || 0,
    durasiHari: p.durasiHari || 60,
    namaLembaga: p.nadzirProfile?.namaLembaga || 'Yayasan Manarul Ilmi ITS',
    donorCount: p._count.waqfOrders || 0,
    ledger: {
      pokokDanaTerkumpul: Number(p.principalLedger?.pokokDanaTerkumpul || 0),
      totalHasilAvailable: Number(p.principalLedger?.totalHasilAvailable || 0),
      hasilInvestasiTersalurkan: Number(p.principalLedger?.hasilInvestasiTersalurkan || 0),
    },
    yieldEntries: p.yieldEntries.map((y) => ({
      id: y.id,
      amount: Number(y.amount),
      sourceDescription: y.sourceDescription,
      recordedAt: y.recordedAt.toISOString(),
      recordedByAdminId: y.recordedByAdminId,
      adminName: 'Super Admin BWI',
    })),
  }));

  return (
    <BackofficeProgramManagementView
      programs={formattedPrograms}
      userRole={userRole}
      userName={userName}
    />
  );
}
