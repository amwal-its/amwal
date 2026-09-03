import React from 'react';
import type { Metadata } from 'next';
import { DonorSegmentationView } from '@/components/admin/donor-segmentation-view';

export const metadata: Metadata = {
  title: 'Segmentasi Donatur (RFM-D) | Super Admin Amwal',
  description: 'Analisis dan pengelompokan donatur otomatis berbasis Recency, Frequency, Monetary, dan Diversity akad.',
};

export default function AdminDonorSegmentationPage() {
  return <DonorSegmentationView />;
}
