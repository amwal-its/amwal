import React from 'react';
import type { Metadata } from 'next';
import { TransparencyLogsView } from '@/components/admin/transparency-logs-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Log Transparansi & Realisasi Anggaran | Super Admin Amwal',
  description:
    'Buku besar transparansi transaksi multi-modul (Wakaf, Zakat, Infaq, Qurban) dan jejak audit realisasi anggaran terverifikasi.',
};

export default function AdminTransparansiPage() {
  return <TransparencyLogsView />;
}
