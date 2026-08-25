import React from 'react';
import { ShieldCheck, TrendingUp, Sparkles, HandHeart, Info } from 'lucide-react';

interface WakafLedgerCardProps {
  jenisWakaf?: 'PRODUKTIF_KEKAL' | 'HABIS_PAKAI' | string;
  pokokDanaTerkumpul: number;
  totalHasilAvailable: number;
  hasilInvestasiTersalurkan: number;
}

export function WakafLedgerCard({
  jenisWakaf,
  pokokDanaTerkumpul,
  totalHasilAvailable,
  hasilInvestasiTersalurkan,
}: WakafLedgerCardProps) {
  // CRITICAL RULE: HANYA render jika jenisWakaf === 'PRODUKTIF_KEKAL'
  if (jenisWakaf !== 'PRODUKTIF_KEKAL') {
    return null;
  }

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="my-5 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/60 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 leading-tight">
              Transparansi Wakaf Produktif
            </h3>
            <p className="text-[11px] text-gray-500">
              Pengelolaan pokok abadi & hasil investasi
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          Fiqih Abadi
        </span>
      </div>

      {/* 3 Metric Cards Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* 1. Pokok Dana (Kekal) */}
        <div className="bg-white/95 border border-emerald-200/90 rounded-xl p-3 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-500">
              Pokok Dana
            </span>
            <span className="inline-flex text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-md shadow-2xs">
              Kekal
            </span>
          </div>

          <p className="text-sm sm:text-base font-extrabold text-emerald-700 tracking-tight">
            {formatRupiah(pokokDanaTerkumpul)}
          </p>

          <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50/80 px-1.5 py-0.5 rounded">
            <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Tidak pernah berkurang</span>
          </div>
        </div>

        {/* 2. Hasil Tersedia */}
        <div className="bg-white/95 border border-blue-200/80 rounded-xl p-3 shadow-2xs">
          <span className="block text-[10px] font-semibold tracking-wider uppercase text-gray-500 mb-1">
            Hasil Tersedia
          </span>
          <p className="text-sm sm:text-base font-extrabold text-blue-600 tracking-tight">
            {formatRupiah(totalHasilAvailable)}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">Siap disalurkan untuk manfaat</p>
        </div>

        {/* 3. Hasil Tersalurkan */}
        <div className="bg-white/95 border border-purple-200/80 rounded-xl p-3 shadow-2xs">
          <span className="block text-[10px] font-semibold tracking-wider uppercase text-gray-500 mb-1">
            Hasil Tersalurkan
          </span>
          <p className="text-sm sm:text-base font-extrabold text-purple-700 tracking-tight">
            {formatRupiah(hasilInvestasiTersalurkan)}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-purple-700">
            <HandHeart className="w-3 h-3 text-purple-500 shrink-0" />
            <span>Diterima Mauquf Alaih</span>
          </div>
        </div>
      </div>
    </div>
  );
}
