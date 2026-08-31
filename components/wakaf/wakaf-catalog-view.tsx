'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Clock, Building2, ChevronRight, Coins, ShieldCheck, Heart } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';

export interface CatalogProgramItem {
  id: string;
  judul: string;
  kategori: string;
  bannerUrl?: string | null;
  jenisWakaf: string;
  targetDana: number;
  pokokDanaTerkumpul: number;
  durasiHari?: number | null;
  namaLembaga?: string | null;
  donorCount?: number;
}

interface WakafCatalogViewProps {
  initialPrograms: CatalogProgramItem[];
}

const CATEGORIES = ['Semua', 'Pendidikan', 'Produktif', 'Infrastruktur', 'Sosial', 'Kesehatan'];

export function WakafCatalogView({ initialPrograms }: WakafCatalogViewProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filteredPrograms = useMemo(() => {
    return initialPrograms.filter((p) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        p.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.namaLembaga && p.namaLembaga.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === 'Semua' ||
        p.kategori.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchSearch && matchCategory;
    });
  }, [initialPrograms, searchQuery, selectedCategory]);

  const formatJuta = (val: number) => {
    if (val >= 1000000000) {
      return `Rp ${(val / 1000000000).toFixed(1)} Miliar`;
    }
    if (val >= 1000000) {
      const jt = val / 1000000;
      return `Rp ${jt % 1 === 0 ? jt : jt.toFixed(1)}jt`;
    }
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-jakarta antialiased">
      {/* Mobile-first 430px canvas */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[932px] bg-white shadow-sm border border-gray-100 sm:rounded-3xl overflow-hidden flex flex-col justify-between relative pb-20">
        
        {/* Top Header & Navigation */}
        <div className="pt-6 px-5 sm:px-6 sticky top-0 bg-white/95 backdrop-blur-md z-30 pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3.5">
            <button
              onClick={() => router.push('/dashboard')}
              aria-label="Kembali ke Dashboard"
              className="w-10 h-10 -ml-2 text-gray-800 flex items-center justify-center hover:bg-slate-100 rounded-full active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              Program Wakaf
            </h1>
          </div>

          {/* Search Bar Input */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari akad: ITS, Sumur, Agrobisnis..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all"
            />
          </div>

          {/* Horizontal Category Chips (Hidden Scrollbar) */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#439F46] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main List of Programs */}
        <div className="px-5 sm:px-6 py-4 flex-1">
          {filteredPrograms.length === 0 ? (
            <div className="py-16 text-center text-gray-400 flex flex-col items-center">
              <Search className="w-10 h-10 mb-2 stroke-1 text-gray-300" />
              <p className="text-sm font-semibold text-gray-700">Tidak ada program ditemukan</p>
              <p className="text-xs text-gray-400 mt-1">Coba gunakan kata kunci pencarian yang lain</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {filteredPrograms.map((p) => {
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

                    {/* Program Info Container */}
                    <div className="flex-1 min-w-0 pl-3 pr-4 py-2.5 flex flex-col justify-between h-[139px]">
                      <div>
                        {/* Category Pill Badge (Figma: bg #B7EFD1, text #3A6E57) */}
                        <span className="inline-block bg-[#B7EFD1] text-[#3A6E57] text-[10px] font-medium px-2 py-0.5 rounded-[4px] mb-1">
                          {p.kategori.split(' ')[0] || 'Wakaf'}
                        </span>

                        {/* Title (Figma: 14px Medium #1C2024, 2 lines) */}
                        <h2 className="text-[13px] sm:text-[14px] font-medium text-[#1C2024] leading-[1.35] line-clamp-2 group-hover:text-[#439F46] transition-colors mb-0.5">
                          {p.judul}
                        </h2>

                        {/* Institution Name */}
                        <p className="text-[10px] text-[#6B7280] truncate">
                          {p.namaLembaga || 'Yayasan Manarul Ilmi ITS'}
                        </p>
                      </div>

                      {/* Progress Bar & Sub-info */}
                      <div className="pt-1">
                        <div className="w-full h-1 bg-[#E4E7EC] rounded-full overflow-hidden mb-1.5">
                          <div
                            className="h-full bg-[#1A6B38] rounded-full transition-all duration-700"
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
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
