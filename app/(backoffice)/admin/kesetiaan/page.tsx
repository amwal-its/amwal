import React from 'react';
import type { Metadata } from 'next';
import { CohortHeatmapView } from '@/components/admin/cohort-heatmap-view';

export const metadata: Metadata = {
  title: 'Kesetiaan & Retensi Donatur (Kohort) | Super Admin Amwal',
  description: 'Analisis retensi kohort donatur bulanan (M0-M5) dan estimasi lifetime value (LTV).',
};

export default function AdminCohortHeatmapPage() {
  return <CohortHeatmapView />;
}
