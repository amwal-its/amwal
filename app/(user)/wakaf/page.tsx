import React from 'react';
import { prisma } from '@/lib/prisma';
import { WaqfStatus } from '@/app/generated/prisma/client';
import { WakafCatalogView, CatalogProgramItem } from '@/components/wakaf/wakaf-catalog-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Katalog Program Wakaf | Amwal HETI ITS',
  description: 'Temukan dan tunaikan program wakaf produktif & manfaat terbaik dari Yayasan Manarul Ilmi ITS.',
};

export default async function WakafCatalogPage() {
  const programs = await prisma.waqfProgram.findMany({
    where: {
      status: WaqfStatus.LIVE,
    },
    include: {
      principalLedger: true,
      nadzirProfile: {
        select: {
          namaLembaga: true,
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

  const formattedPrograms: CatalogProgramItem[] = programs.map((p) => ({
    id: p.id,
    judul: p.judul,
    kategori: p.kategori || 'Wakaf Produktif',
    bannerUrl: p.bannerUrl,
    jenisWakaf: p.jenisWakaf,
    targetDana: Number(p.targetDana) || 0,
    pokokDanaTerkumpul: Number(p.principalLedger?.pokokDanaTerkumpul) || 0,
    durasiHari: p.durasiHari || 60,
    namaLembaga: p.nadzirProfile?.namaLembaga || 'Yayasan Manarul Ilmi ITS',
    donorCount: p._count.waqfOrders || 0,
  }));

  return <WakafCatalogView initialPrograms={formattedPrograms} />;
}
