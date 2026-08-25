import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { ProgramItem } from '@/components/dashboard/featured-programs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Beranda | Amwal - Platform Wakaf, Zakat & Qurban Terpercaya',
  description: 'Salurkan wakaf, zakat, dan qurban Anda dengan aman, amanah, dan transparan bersama Yayasan Manarul Ilmi ITS.',
};

export default async function RootHomePage() {
  const session = await getSession();
  const isLoggedIn = !!session?.userId;

  let userName = 'Tamu';
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
    console.error('Error fetching root homepage programs:', err);
  }

  return (
    <DashboardView
      userName={userName}
      programs={programs}
      isLoggedIn={isLoggedIn}
    />
  );
}
