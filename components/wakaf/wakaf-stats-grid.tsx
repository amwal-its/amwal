import React from 'react';
import { Users, HeartHandshake } from 'lucide-react';

interface WakafStatsGridProps {
  totalWakif?: number | null;
  targetPenerima?: string | null;
}

export function WakafStatsGrid({
  totalWakif = 0,
  targetPenerima = '500+ Yatim & Dhuafa',
}: WakafStatsGridProps) {
  const displayWakif = (totalWakif && totalWakif > 0) ? `${totalWakif.toLocaleString('id-ID')} Orang` : 'Belum Ada';

  return (
    <div className="grid grid-cols-2 gap-3 my-5">
      {/* 1. Wakif / Donatur Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] sm:text-xs text-gray-500 font-medium truncate">
            Wakif / Donatur
          </span>
          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
            {displayWakif}
          </p>
        </div>
      </div>

      {/* 2. Penerima Manfaat Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] sm:text-xs text-gray-500 font-medium truncate">
            Penerima Manfaat
          </span>
          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
            {targetPenerima || '500+ Yatim'}
          </p>
        </div>
      </div>
    </div>
  );
}
