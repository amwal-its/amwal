import React from 'react';
import type { Metadata } from 'next';
import { InfaqModuleView } from '@/components/ziswaf/infaq-module-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manajemen Infaq & Sedekah | Super Admin Amwal',
  description:
    'Monitoring penerimaan infaq subuh realtime, settlement QRIS Dinamis BSI, katalog program tematik, dan neraca buku kas PSAK.',
};

export default function AdminInfaqPage() {
  return <InfaqModuleView />;
}
