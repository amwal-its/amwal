'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ChevronRight, Sparkles } from 'lucide-react';

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Infaq Jumat Berkah',
      subtitle: 'Raih keberkahan di hari yang mulia',
      tag: 'Infaq Rutin',
      cta: 'Salurkan Sekarang',
      href: '/wakaf',
      bgGradient: 'from-emerald-700 via-emerald-600 to-teal-700',
      image: '/assets/images/wakaf/wakaf-pembangunan-masjid-al-furqon.png',
    },
    {
      title: 'Wakaf Dana Abadi Pendidikan',
      subtitle: 'Amal jariyah tanpa henti untuk masa depan santri',
      tag: 'Wakaf Produktif',
      cta: 'Lihat Program',
      href: '/wakaf',
      bgGradient: 'from-teal-700 via-emerald-700 to-green-800',
      image: '/assets/images/wakaf/wakaf-dana-abadi-untuk-pendidikan-agama-islam.png',
    },
    {
      title: 'Persiapkan Qurban Terbaik',
      subtitle: 'Pilihan hewan sehat & pemotongan syar\'i amanah',
      tag: 'Qurban Amwal',
      cta: 'Pesan Sekarang',
      href: '/qurban',
      bgGradient: 'from-emerald-800 via-green-700 to-teal-800',
      image: '/assets/images/wakaf/wakaf-air-bersih-desa-nurul-amanah.png',
    },
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="mx-4 sm:mx-6 my-2">
      {/* Slide Card Container */}
      <div className="relative h-[160px] sm:h-[180px] rounded-3xl overflow-hidden shadow-md">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background image if available with gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${s.bgGradient}`} />

            <div className="absolute inset-0 bg-black/20" />

            {/* Slide Content */}
            <div className="relative z-10 h-full p-5 flex flex-col justify-between text-white">
              <div>
                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {s.tag}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold leading-tight tracking-tight drop-shadow-xs">
                  {s.title}
                </h3>
                <p className="text-xs text-white/90 font-medium mt-1 line-clamp-1 drop-shadow-xs">
                  {s.subtitle}
                </p>
              </div>

              <div>
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1 bg-white text-[#0F3D1A] hover:bg-emerald-50 active:scale-95 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>{s.cta}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              idx === currentSlide ? 'w-5 bg-[#439F46]' : 'w-1.5 bg-gray-200 hover:bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
