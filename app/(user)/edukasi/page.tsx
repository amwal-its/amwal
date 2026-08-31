import React from 'react';
import { EducationView } from '@/components/user/education-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Edukasi & Literasi Syariah | Amwal',
  description: 'Panduan lengkap zakat, wakaf produktif, dan manajemen keuangan syariah terpercaya.',
};

export default function EdukasiPage() {
  return <EducationView />;
}
