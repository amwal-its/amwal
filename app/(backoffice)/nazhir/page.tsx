import React from 'react';
import type { Metadata } from 'next';
import { NazhirDashboardView } from '@/components/nazhir/nazhir-dashboard-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard Nazhir Wakaf | Badan Wakaf Indonesia & Amwal',
  description:
    'Portal pengelolaan program wakaf produktif, pencairan dana bertahap, dan pengunggahan bukti kuitansi belanja terverifikasi DPS.',
};

export default function NazhirPage() {
  return <NazhirDashboardView defaultView="manage" />;
}
