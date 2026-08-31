'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ArrowRight } from 'lucide-react';

export function OnboardingView() {
  const items = [
    {
      title: 'Zakat',
      subtitle: 'Tunaikan kewajiban dengan mudah',
    },
    {
      title: 'Wakaf',
      subtitle: 'Bangun aset kebaikan jangka panjang',
    },
    {
      title: 'Infaq',
      subtitle: 'Bantu sesama kapan saja',
    },
    {
      title: 'Qurban',
      subtitle: 'Sembelih dengan amanah',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-jakarta antialiased">
      {/* Mobile Phone Screen Container for Desktop */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[844px] bg-white shadow-2xl border border-gray-200/80 sm:rounded-[40px] relative flex flex-col justify-between overflow-hidden pt-[36px] px-[20px] pb-[24px]">

        
        {/* Top Header Section (Centered) */}
        <div className="flex flex-col items-center text-center">
          {/* Logo Masjid */}
          <div className="w-[72px] h-[72px] relative mb-5 flex items-center justify-center">
            <Image
              src="/assets/images/logo-amwal.png"
              alt="Amwal Logo"
              width={72}
              height={72}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-[24px] sm:text-3xl font-bold text-gray-900 tracking-tight leading-snug mb-2">
            Selamat Datang di Amwal
          </h1>
          <p className="text-[13px] sm:text-sm text-gray-500 leading-relaxed max-w-[360px]">
            Kelola zakat, wakaf, infak & qurban dalam satu aplikasi yang mudah dan transparan.
          </p>
        </div>

        {/* Middle Section: List Items with bottom border dividers */}
        <div className="my-auto py-6 flex flex-col divide-y divide-gray-100 max-w-md mx-auto w-full">
          {items.map((item, idx) => (
            <div key={idx} className="py-3.5 flex items-center gap-3.5 first:pt-0 last:pb-0">
              {/* Green Circular Check Badge */}
              <div className="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#439F46] flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1 text-left">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 leading-snug mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section: Pagination Dots & Action Buttons */}
        <div className="pt-4 max-w-md mx-auto w-full">
          {/* 3 Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#439F46]" />
            <span className="w-2 h-2 rounded-full bg-gray-200" />
            <span className="w-2 h-2 rounded-full bg-gray-200" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full">
            {/* Primary CTA: Mulai Sekarang */}
            <Link
              href="/register"
              className="w-full h-[52px] bg-[#439F46] hover:bg-[#388E3C] text-white font-semibold text-[16px] rounded-xl sm:rounded-2xl text-center active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="w-5 h-5 ml-1 stroke-[2.5]" />
            </Link>

            {/* Secondary CTA: Sudah punya akun? Masuk */}
            <Link
              href="/login"
              className="w-full h-[52px] bg-[#EEF7EE] hover:bg-[#d8edd8] text-[#2E7D32] font-semibold text-[16px] rounded-xl sm:rounded-2xl text-center active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer"
            >
              Sudah punya akun? Masuk
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

