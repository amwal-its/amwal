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
    <div className="mx-5 sm:mx-6 my-6">
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
              className="bg-white rounded-2xl overflow-hidden flex items-center shadow-xs border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
            >
              {/* Full-bleed Left Banner Image (Figma: 139x139px) */}
              <div className="relative w-[139px] h-[139px] shrink-0 overflow-hidden bg-slate-100">
                <Image
                  src={p.bannerUrl && p.bannerUrl.trim() !== '' ? p.bannerUrl : '/assets/images/wakaf/wakaf-pembangunan-masjid-al-furqon.png'}
                  alt={p.judul}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="139px"
                />
              </div>

              {/* Info & Progress Container (Figma: padding right 16px, spacing 12px) */}
              <div className="flex-1 min-w-0 pl-3 pr-4 py-2.5 flex flex-col justify-between h-[139px]">
                <div>
                  {/* Category Pill Badge (Figma: bg #B7EFD1, text #3A6E57) */}
                  <span className="inline-block bg-[#B7EFD1] text-[#3A6E57] text-[10px] font-medium px-2 py-0.5 rounded-[4px] mb-1">
                    {p.kategori || 'Pendidikan'}
                  </span>

                  {/* Title (Figma: 14px Medium #1C2024, 2 lines) */}
                  <h4 className="text-[13px] sm:text-[14px] font-medium text-[#1C2024] leading-[1.35] line-clamp-2 group-hover:text-[#439F46] transition-colors mb-0.5">
                    {p.judul}
                  </h4>

                  {/* Institution Name (Figma: 10px Regular #6B7280) */}
                  <p className="text-[10px] text-[#6B7280] truncate">
                    {p.namaLembaga || 'Dompet Dhuafa'}
                  </p>
                </div>

                {/* Progress Bar & Sub-info (Figma: h-1 bg #E4E7EC, fill #0F3D1A / #188B46) */}
                <div className="pt-1">
                  <div className="w-full h-1 bg-[#E4E7EC] rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-[#1A6B38] rounded-full"
                      style={{ width: `${Math.max(4, percent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
                    <span className="text-[#1C2024] font-normal">
                      Terkumpul {formatJuta(p.pokokDanaTerkumpul)}
                    </span>
                    <span className="font-normal text-[#6B7280]">
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
