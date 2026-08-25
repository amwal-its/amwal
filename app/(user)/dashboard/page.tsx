import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { ProgramItem } from '@/components/dashboard/featured-programs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Beranda | Amwal - Platform Wakaf, Zakat & Qurban Terpercaya',
  description: 'Kelola amal ibadah Anda dengan mudah, amanah dan transparan bersama Amwal.',
};

export default async function DashboardPage() {
  const session = await getSession();

  let userName = 'Ahmad Abdullah';
  if (session?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true },
    });
    if (user?.name) {
      userName = user.name;
    }
  }

  // Fetch top active waqf programs from database
  let programs: ProgramItem[] = [];
  try {
    const dbPrograms = await prisma.waqfProgram.findMany({
      where: { status: 'LIVE' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        principalLedger: true,
        nadzirProfile: {
          select: {
            namaLembaga: true,
          },
        },
      },
    });

    programs = dbPrograms.map((p) => ({
      id: p.id,
      judul: p.judul,
      kategori: p.kategori || 'Wakaf',
      bannerUrl: p.bannerUrl,
      targetDana: Number(p.targetDana || 0),
      pokokDanaTerkumpul: Number(p.principalLedger?.pokokDanaTerkumpul || 0),
      durasiHari: p.durasiHari,
      namaLembaga: p.nadzirProfile?.namaLembaga || 'Badan Pengelola Wakaf',
    }));
  } catch (err) {
    console.error('Error fetching dashboard programs:', err);
  }

  return <DashboardView userName={userName} programs={programs} />;
}
