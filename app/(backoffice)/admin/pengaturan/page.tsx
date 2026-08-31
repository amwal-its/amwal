import React from 'react';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { SettingsManagementView } from '@/components/admin/settings-management-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Pengaturan Rekening & Parameter Sistem | Super Admin Amwal',
  description: 'Konfigurasi rekening operasional yayasan, identitas kelembagaan, dan preferensi notifikasi transaksi.',
};

export default async function AdminPengaturanPage() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/login?redirect=/admin/pengaturan');
  }

  return <SettingsManagementView />;
}
