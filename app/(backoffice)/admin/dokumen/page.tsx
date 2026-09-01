import React from 'react';
import type { Metadata } from 'next';
import { DocumentsView } from '@/components/admin/documents-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manajemen Dokumen & Legalitas Lembaga | Super Admin Amwal',
  description:
    'Pusat arsip berkas legalitas lembaga, sertifikat digital wakaf BWI, SK Nazhir, laporan audit DPS, dan template resmi.',
};

export default function AdminDokumenPage() {
  return <DocumentsView initialSubTab="legalitas" currentRole="super_admin" />;
}
