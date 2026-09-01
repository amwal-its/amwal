'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * BANNER WAJIB — TIDAK BOLEH DI-DISMISS
 * Harus menempel di atas setiap widget Box A, B, C, D yang menggunakan
 * data simulasi dari lib/mock-drm-analytics.ts
 */
export function DrmSimulationBanner() {
  return (
    <div className="flex items-center gap-3 rounded-t-xl bg-amber-400 px-4 py-3 border-b-2 border-amber-600">
      <AlertTriangle className="w-5 h-5 min-w-[20px] min-h-[20px] text-amber-950 shrink-0" aria-hidden="true" />
      <p className="text-xs sm:text-sm font-extrabold text-amber-950 leading-snug">
        CONTOH TAMPILAN —{' '}
        <span className="font-black underline decoration-amber-700 decoration-2">Data Simulasi</span>{' '}
        untuk Ilustrasi DRM, Bukan Data Donatur Aktual
      </p>
    </div>
  );
}
