import React from 'react';
import type { Metadata } from 'next';
import { NewsManagementView } from '@/components/admin/news-management-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manajemen Berita & Publikasi Penyaluran | Super Admin Amwal',
  description:
    'Publikasi artikel transparansi program, dokumentasi penyaluran donasi mustahiq, siaran pers, dan liputan khusus lapangan.',
};

export default function AdminBeritaPage() {
  return <NewsManagementView />;
}
