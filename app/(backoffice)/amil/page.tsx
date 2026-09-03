import React from 'react';
import type { Metadata } from 'next';
import { ZiswafOverviewView } from '@/components/ziswaf/ziswaf-overview-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard Amil ZISWAF | Lembaga Amil Zakat & BAZNAS',
  description:
    'Portal tata kelola operasional Amil ZISWAF: penghimpunan infaq subuh, zakat maal 8 asnaf, kalkulator nisab emas, dan monitoring qurban terpadu.',
};

export default function AmilPage() {
  return <ZiswafOverviewView initialSubModule="overview" />;
}
