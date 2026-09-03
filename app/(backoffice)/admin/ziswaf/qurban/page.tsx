import React from 'react';
import type { Metadata } from 'next';
import { QurbanModuleView } from '@/components/ziswaf/qurban-module-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manajemen Qurban & RPH Halal | Super Admin Amwal',
  description:
    'Monitoring visualizer slot patungan sapi 1/7, pelaporan video Juleha RPH bersertifikat MUI, log akad wakalah digital, dan sertifikat qurban.',
};

export default function AdminQurbanPage() {
  return <QurbanModuleView />;
}
