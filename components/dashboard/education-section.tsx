import React from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, Clock } from 'lucide-react';

export function EducationSection() {
  const articles = [
    {
      id: '1',
      category: 'Finansial Pintar',
      title: 'Manajemen Keuangan Syariah untuk Milenial',
      readTime: '5 min baca',
      href: '/edukasi',
      bgHeader: 'from-blue-600 to-indigo-700',
    },
    {
      id: '2',
      category: 'Fiqih Muamalah',
      title: 'Perbedaan Mendasar Zakat, Infaq, dan Sedekah',
      readTime: '4 min baca',
      href: '/edukasi',
      bgHeader: 'from-emerald-600 to-teal-700',
    },
  ];

  return (
    <div className="mx-4 sm:mx-6 my-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
          Berita & Edukasi
        </h3>

        <Link
          href="/edukasi"
          className="text-xs font-bold text-[#439F46] hover:text-[#38863b] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Horizontal Scroll / Grid Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {articles.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="bg-white border border-slate-200/90 hover:border-emerald-300 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
          >
            {/* Top Color Accent */}
            <div className={`h-24 bg-gradient-to-r ${item.bgHeader} p-3.5 flex items-start justify-between relative`}>
              <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                {item.category}
              </span>
              <BookOpen className="w-4 h-4 text-white/70" />
            </div>

            {/* Bottom Content */}
            <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug group-hover:text-[#439F46] transition-colors line-clamp-2 mb-2">
                {item.title}
              </h4>

              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                <Clock className="w-3 h-3" />
                <span>{item.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
