import React from 'react';
import { Building2, CheckCircle2, MapPin, ShieldCheck } from 'lucide-react';

interface WakafNazhirCardProps {
  nazhir?: {
    id: string;
    namaLembaga?: string | null;
    kategori?: string | null;
    statusVerifikasi?: string | null;
  } | null;
}

export function WakafNazhirCard({ nazhir }: WakafNazhirCardProps) {
  const lembagaName = nazhir?.namaLembaga || 'Yayasan Pengelola Wakaf';
  const isVerified = nazhir?.statusVerifikasi === 'VERIFIED' || nazhir?.statusVerifikasi === 'TERDAFTAR_BWI';
  const initial = lembagaName.charAt(0).toUpperCase();

  return (
    <div className="my-6">
      <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
        Profil Pengelola (Nazhir)
      </h2>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 sm:gap-4 shadow-xs hover:border-emerald-200/80 transition-all">
        {/* Avatar / Logo */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center text-lg sm:text-xl font-black shadow-sm shrink-0">
          {initial}
        </div>

        {/* Institution Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
              {lembagaName}
            </h3>

            {isVerified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Terdaftar BWI
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
            <span className="inline-flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-gray-400" />
              {nazhir?.kategori || 'Organisasi'}
            </span>

            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              Indonesia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
