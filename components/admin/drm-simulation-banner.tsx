'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DrmSimulationBannerProps {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * BANNER WAJIB — TIDAK BOLEH DI-DISMISS
 * Menempel di atas setiap section/widget yang menggunakan data simulasi
 */
export function DrmSimulationBanner({ title, description, className = '' }: DrmSimulationBannerProps = {}) {
  return (
    <div className={`flex items-start gap-3 rounded-xl bg-amber-400 px-4 py-3 border-b-2 border-amber-600 shadow-xs ${className}`}>
      <AlertTriangle className="w-5 h-5 min-w-[20px] min-h-[20px] text-amber-950 shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="text-xs sm:text-sm font-extrabold text-amber-950 leading-snug">
          {title || (
            <>
              CONTOH TAMPILAN —{' '}
              <span className="font-black underline decoration-amber-700 decoration-2">Data Simulasi</span>{' '}
              untuk Ilustrasi DRM, Bukan Data Donatur Aktual
            </>
          )}
        </p>
        {description && (
          <p className="text-[11px] text-amber-900 font-medium mt-0.5 leading-normal">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

