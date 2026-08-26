import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Clock, Building2, ShieldCheck } from 'lucide-react';

export interface ProgramItem {
  id: string;
  judul: string;
  kategori: string;
  bannerUrl?: string | null;
  targetDana: number;
  pokokDanaTerkumpul: number;
  durasiHari?: number | null;
  namaLembaga?: string | null;
}

interface FeaturedProgramsProps {
  programs?: ProgramItem[];
}

export function FeaturedPrograms({ programs = [] }: FeaturedProgramsProps) {
  const formatJuta = (val: number) => {
    if (val >= 1000000000) {
      return `Rp ${(val / 1000000000).toFixed(1)} Miliar`;
    }
    if (val >= 1000000) {
      return `Rp ${Math.round(val / 1000000)}jt`;
    }
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  return (
    <div className="mx-4 sm:mx-6 my-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
          Program Wakaf Pilihan
        </h3>

        <Link
          href="/wakaf"
          className="text-xs font-bold text-[#439F46] hover:text-[#38863b] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Program Cards */}
      <div className="flex flex-col gap-3.5">
        {programs.map((p) => {
          const percent = p.targetDana > 0 ? Math.min(100, Math.round((p.pokokDanaTerkumpul / p.targetDana) * 100)) : 0;
          return (
            <Link
              key={p.id}
              href={`/wakaf/${p.id}`}
              className="bg-white border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-3.5 sm:p-4 flex gap-3.5 shadow-2xs hover:shadow-xs transition-all group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <Image
                  src={p.bannerUrl && p.bannerUrl.trim() !== '' ? p.bannerUrl : '/assets/images/wakaf/wakaf-pembangunan-masjid-al-furqon.png'}
                  alt={p.judul}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="120px"
                />
                <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                  {p.kategori || 'Wakaf'}
                </span>
              </div>

              {/* Info & Progress */}
              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug group-hover:text-[#439F46] transition-colors line-clamp-2 mb-1">
                    {p.judul}
                  </h4>
                  <p className="text-[11px] text-gray-500 truncate flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-gray-400" />
                    <span>{p.namaLembaga || 'Badan Pengelola Wakaf'}</span>
                  </p>
                </div>

                {/* Progress Bar & Sub-info */}
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-[#439F46] rounded-full"
                      style={{ width: `${Math.max(4, percent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold">
                    <span className="text-gray-900">
                      Terkumpul {formatJuta(p.pokokDanaTerkumpul)}
                    </span>
                    <span className="text-gray-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {p.durasiHari || 45} hari lagi
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
