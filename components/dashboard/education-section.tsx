import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export function EducationSection() {
  const articles = [
    {
      id: '1',
      category: 'Finansial Pintar',
      title: 'Manajemen Keuangan Syariah untuk Milenial',
      href: '/edukasi',
      image: '/assets/images/education/pembagian-harta-waris-menurut-hukum-perdata.png',
    },
    {
      id: '2',
      category: 'Fiqih Muamalah',
      title: 'Perbedaan Mendasar Zakat, Infaq, dan Sedekah',
      href: '/edukasi',
      image: '/assets/images/education/jangan-tunda-pembagian-warisan.png',
    },
  ];

  return (
    <div className="mx-5 sm:mx-6 my-6">
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

      {/* Article Cards Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {articles.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="bg-white border border-gray-100 hover:border-emerald-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
          >
            {/* Top Cover Image */}
            <div className="relative w-full h-28 bg-slate-100 overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 600px) 50vw, 200px"
              />
            </div>

            {/* Bottom Text Content */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                {/* Category Subtitle */}
                <span className="text-[11px] font-semibold text-[#648BAA] block mb-1">
                  {item.category}
                </span>

                {/* Title */}
                <h4 className="text-xs font-bold text-gray-900 leading-snug group-hover:text-[#439F46] transition-colors line-clamp-2">
                  {item.title}
                </h4>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
