import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { WakafProgramsView } from '@/components/admin/wakaf-programs-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manajemen & Pengawasan Program Wakaf | Super Admin Amwal',
  description:
    'Pusat manajemen program wakaf, pemantauan slider progres fisik, audit kuitansi belanja digital, dan tata kelola termin escrow BSI.',
};

export default function AdminWakafPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800" />
        </div>
      }
    >
      <WakafProgramsView />
    </Suspense>
  );
}
