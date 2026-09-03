import React from 'react';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { AdminOverviewView } from '@/components/admin/admin-overview-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Ringkasan Utama & Analitik RFM-D | Super Admin Amwal',
  description:
    'Ringkasan otomatis keaktifan donatur, tingkat kesetiaan (retensi), prediksi risiko, serta rekomendasi aksi untuk pengelola.',
};

export default async function AdminOverviewPage() {
  const session = await getSession();

  if (process.env.NODE_ENV === 'production' && (!session || session.role !== 'ADMIN')) {
    redirect('/login');
  }

  return <AdminOverviewView />;
}
