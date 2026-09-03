import React from 'react';
import type { Metadata } from 'next';
import { SettingsManagementView } from '@/components/admin/settings-management-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pengaturan Rekening & Parameter Sistem | Super Admin Amwal',
  description:
    'Konfigurasi rekening giro syariah escrow, payment gateway, parameter algoritma RFM-D, dan gateway notifikasi WhatsApp.',
};

export default function AdminPengaturanPage() {
  return <SettingsManagementView />;
}
