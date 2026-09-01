import React from 'react';
import type { Metadata } from 'next';
import { EducationManagementView } from '@/components/admin/education-management-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manajemen Edukasi & Literasi Syariah | Super Admin Amwal',
  description:
    'Pusat pengelolaan artikel literasi wakaf, video kajian interaktif, kuis pemahaman fiqih, dan moderasi diskusi jamaah.',
};

export default function AdminEducationPage() {
  return <EducationManagementView />;
}
