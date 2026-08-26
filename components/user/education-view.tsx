'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Play } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';

interface PopularArticle {
  id: string;
  title: string;
  category: string;
  categoryBg: string;
  categoryText: string;
  image: string;
  href: string;
}

interface VideoTutorial {
  id: string;
  title: string;
  image: string;
  href: string;
}

interface RecentArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  image: string;
  href: string;
}

export function EducationView() {
  const [searchQuery, setSearchQuery] = useState('');

  const popularArticles: PopularArticle[] = [
    {
      id: '1',
      title: 'Manajemen Keuangan Syariah untuk Milenial',
      category: 'FINANSIAL PINTAR',
      categoryBg: 'bg-[#EBF3FE]',
      categoryText: 'text-[#2563EB]',
      image: '/assets/images/education/pembagian-harta-waris-menurut-hukum-perdata.png',
      href: '/edukasi/1',
    },
    {
      id: '2',
      title: 'Memahami Zakat Emas & Perak secara Mendalam',
      category: 'ZAKAT MAAL',
      categoryBg: 'bg-[#EBF3FE]',
      categoryText: 'text-[#2563EB]',
      image: '/assets/images/education/jangan-tunda-pembagian-warisan.png',
      href: '/edukasi/2',
    },
  ];

  const videoTutorials: VideoTutorial[] = [
    {
      id: '1',
      title: 'Cara Hitung Zakat Emas 1',
      image: '/assets/images/education/ilmu-faraidh-dijamin-bisa-bagi-waris.png',
      href: '/edukasi/video/1',
    },
    {
      id: '2',
      title: 'Cara Hitung Zakat Emas 2',
      image: '/assets/images/education/jangan-tunda-pembagian-warisan.png',
      href: '/edukasi/video/2',
    },
    {
      id: '3',
      title: 'Cara Hitung Zakat Emas 3',
      image: '/assets/images/education/pembagian-harta-waris-menurut-hukum-perdata.png',
      href: '/edukasi/video/3',
    },
  ];

  const recentArticles: RecentArticle[] = [
    {
      id: '1',
      title: 'Manajemen Keuangan Syariah untuk Milenial',
      category: 'Finansial',
      readTime: '12 mnt baca',
      image: '/assets/images/education/pembagian-harta-waris-menurut-hukum-perdata.png',
      href: '/edukasi/1',
    },
    {
      id: '2',
      title: 'Strategi Wakaf Produktif di Era Digital',
      category: 'Wakaf',
      readTime: '8 mnt baca',
      image: '/assets/images/education/ilmu-faraidh-dijamin-bisa-bagi-waris.png',
      href: '/edukasi/3',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-jakarta antialiased selection:bg-[#439F46] selection:text-white">
      {/* Phone Screen Container matching Dashboard frame */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[844px] bg-white shadow-2xl border border-gray-200/80 sm:rounded-[40px] relative flex flex-col justify-between overflow-hidden">
        
        {/* Top Header */}
        <header className="pt-6 px-5 sm:px-6 pb-3 flex items-center justify-between bg-white z-20 border-b border-gray-50 shrink-0">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Edukasi
          </h1>
          <button
            aria-label="Cari Edukasi"
            className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-gray-900 active:scale-95 transition-all cursor-pointer"
          >
            <Search size={20} className="text-gray-800 stroke-[2.2]" />
          </button>
        </header>

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-6 pb-[84px]">
          
          {/* Section 1: Populer */}
          <section>
            <h2 className="text-base font-bold text-gray-900 tracking-tight mb-3">
              Populer
            </h2>
            <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5 sm:-mx-6 sm:px-6">
              {popularArticles.map((art) => (
                <Link
                  key={art.id}
                  href={art.href}
                  className="w-[230px] shrink-0 bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden group cursor-pointer hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative w-full h-[120px] bg-slate-100 overflow-hidden">
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="230px"
                    />
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <span
                      className={`inline-block w-fit px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider ${art.categoryBg} ${art.categoryText} mb-2`}
                    >
                      {art.category}
                    </span>
                    <h3 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#439F46] transition-colors">
                      {art.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Section 2: Video Tutorial */}
          <section>
            <h2 className="text-base font-bold text-gray-900 tracking-tight mb-3">
              Video Tutorial
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {videoTutorials.map((vid) => (
                <Link
                  key={vid.id}
                  href={vid.href}
                  className="relative rounded-2xl overflow-hidden shadow-xs group cursor-pointer h-[105px] border border-gray-100 bg-slate-900"
                >
                  {/* Background Image & Overlay */}
                  <Image
                    src={vid.image}
                    alt={vid.title}
                    fill
                    className="object-cover opacity-75 group-hover:opacity-85 group-hover:scale-105 transition-all duration-300"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />

                  {/* Play Button Icon (Figma Style) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-white/90 group-hover:bg-white text-gray-900 flex items-center justify-center shadow-md ring-2 ring-black/10 group-hover:scale-110 active:scale-95 transition-all">
                      <Play size={15} className="fill-gray-900 text-gray-900 ml-0.5" />
                    </div>
                  </div>

                  {/* Video Title Bottom */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 z-10">
                    <span className="text-[11px] font-semibold text-white truncate block drop-shadow-xs">
                      {vid.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Section 3: Artikel Terbaru */}
          <section>
            <h2 className="text-base font-bold text-gray-900 tracking-tight mb-3">
              Artikel Terbaru
            </h2>
            <div className="space-y-3">
              {recentArticles.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3 flex items-center gap-3.5 hover:border-[#439F46]/30 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#439F46] transition-colors mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {item.category} • {item.readTime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </main>

        {/* Unified Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
