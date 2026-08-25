import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { WakafHeader } from '@/components/wakaf/wakaf-header';
import { WakafProgressCard } from '@/components/wakaf/wakaf-progress-card';
import { WakafLedgerCard } from '@/components/wakaf/wakaf-ledger-card';
import { WakafStatsGrid } from '@/components/wakaf/wakaf-stats-grid';
import { WakafNazhirCard } from '@/components/wakaf/wakaf-nazhir-card';
import { WakafTransparencyCard } from '@/components/wakaf/wakaf-transparency-card';
import { WakafBottomCta } from '@/components/wakaf/wakaf-bottom-cta';
import { WakafShareButton } from '@/components/wakaf/wakaf-share-button';
import { Sparkles, Building2, Coins, ShieldCheck } from 'lucide-react';
import { DescriptionToggle } from './description-toggle';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const program = await prisma.waqfProgram.findUnique({
    where: { id },
    select: { judul: true, deskripsi: true },
  });

  if (!program) {
    return { title: 'Program Wakaf Tidak Ditemukan - Amwal' };
  }

  return {
    title: `${program.judul} | Amwal Wakaf`,
    description: program.deskripsi?.slice(0, 160) || 'Salurkan wakaf produktif dan sosial terbaik melalui Amwal.',
  };
}

export default async function WakafDetailPage({ params }: PageProps) {
  const { id } = await params;

  const program = await prisma.waqfProgram.findUnique({
    where: { id },
    include: {
      principalLedger: true,
      nadzirProfile: {
        select: {
          id: true,
          namaLembaga: true,
          kategori: true,
          statusVerifikasi: true,
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
  });

  if (!program) {
    notFound();
  }

  const pokokDanaTerkumpul = Number(program.principalLedger?.pokokDanaTerkumpul || 0);
  const totalHasilAvailable = Number(program.principalLedger?.totalHasilAvailable || 0);
  const hasilInvestasiTersalurkan = Number(program.principalLedger?.hasilInvestasiTersalurkan || 0);
  const targetDana = Number(program.targetDana || 0);
  const totalWakif = program._count?.waqfOrders || 0;

  const formattedYieldEntries = (program.yieldEntries || []).map((y) => ({
    id: y.id,
    amount: Number(y.amount),
    sourceDescription: y.sourceDescription,
    recordedAt: y.recordedAt,
  }));

  const isProduktif = program.jenisWakaf === 'PRODUKTIF_KEKAL';

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-start antialiased font-jakarta">
      {/* Central responsive card container: mobile-first (max-w-md), scaling seamlessly on desktop */}
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl bg-white shadow-xl min-h-screen relative flex flex-col">
        
        {/* 1. Header Section with Banner & Floating Navigation */}
        <WakafHeader
          bannerUrl={program.bannerUrl}
          judul={program.judul}
        />

        {/* 2. Main Content Area */}
        <div className="relative -mt-6 rounded-t-3xl bg-white z-10 px-5 pt-6 pb-28 sm:px-6 md:px-8 flex-1">
          
          {/* Badges & Tags Row */}
          <div className="flex items-center gap-2 flex-wrap mb-2.5">
            {/* Category Tag */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              {program.kategori || 'Wakaf Pendidikan'}
            </span>

            {/* Wakaf Type Badge */}
            {isProduktif ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                Wakaf Produktif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Wakaf Fisik / Sosial
              </span>
            )}

            {/* Share Program Button */}
            <div className="ml-auto">
              <WakafShareButton judul={program.judul} variant="button" />
            </div>
          </div>

          {/* Heading 1: Program Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
            {program.judul}
          </h1>

          {/* Section: Progress Card */}
          <WakafProgressCard
            terkumpul={pokokDanaTerkumpul}
            target={targetDana}
            durasiHari={program.durasiHari}
            createdAt={program.createdAt}
          />

          {/* Section: Financial Ledger Transparency (HANYA PRODUKTIF_KEKAL) */}
          <WakafLedgerCard
            jenisWakaf={program.jenisWakaf}
            pokokDanaTerkumpul={pokokDanaTerkumpul}
            totalHasilAvailable={totalHasilAvailable}
            hasilInvestasiTersalurkan={hasilInvestasiTersalurkan}
            yieldEntries={formattedYieldEntries}
          />

          {/* Section: Stats Grid (Wakif / Donatur & Penerima Manfaat) */}
          <WakafStatsGrid
            totalWakif={totalWakif}
            targetPenerima={program.kategori?.includes('Pendidikan') ? '500+ Santri' : 'Masyarakat Umum'}
          />

          {/* Section: Description / Keterangan */}
          <div className="my-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2.5">
              Keterangan
            </h2>
            <DescriptionToggle text={program.deskripsi || 'Program wakaf ini diinisiasi untuk memberikan manfaat berkelanjutan dan bernilai jariyah yang tidak pernah terputus bagi umat.'} />
          </div>

          <div className="h-px bg-slate-100 my-4" />

          {/* Section: Organizer Profile (Nazhir) */}
          <WakafNazhirCard nazhir={program.nadzirProfile} />

          <div className="h-px bg-slate-100 my-4" />

          {/* Section: Transparency & Documents */}
          <WakafTransparencyCard
            rabDocumentUrl={program.rabDocumentUrl}
            dokumenLegalitasUrl={program.dokumenLegalitasUrl}
            programTitle={program.judul}
          />
        </div>

        {/* 3. Fixed Bottom CTA Bar */}
        <WakafBottomCta
          programId={program.id}
          isCompleted={program.status === 'SELESAI'}
        />
      </div>
    </main>
  );
}
