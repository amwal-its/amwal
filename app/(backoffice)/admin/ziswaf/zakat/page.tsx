import React from 'react';
import type { Metadata } from 'next';
import { ZakatModuleView } from '@/components/ziswaf/zakat-module-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manajemen Zakat & 8 Asnaf | Super Admin Amwal',
  description:
    'Pengawasan penerimaan Zakat Fitrah & Maal, kalkulator nisab BAZNAS, penerbitan Bukti Setor Zakat (BSZ), dan distribusi 8 Asnaf.',
};

export default function AdminZakatPage() {
  return <ZakatModuleView />;
}
