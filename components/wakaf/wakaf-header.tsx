'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { WakafShareButton } from '@/components/wakaf/wakaf-share-button';

interface WakafHeaderProps {
  bannerUrl?: string | null;
  judul: string;
}

export function WakafHeader({ bannerUrl, judul }: WakafHeaderProps) {
  const router = useRouter();

  const defaultBanner = '/assets/images/wakaf/wakaf-dana-abadi-untuk-pendidikan-agama-islam.png';
  const imageSrc = bannerUrl && bannerUrl.trim() !== '' ? bannerUrl : defaultBanner;

  return (
    <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] bg-slate-900 overflow-hidden">
      {/* Banner Image */}
      <Image
        src={imageSrc}
        alt={judul}
        fill
        priority
        className="object-cover object-center transition-transform duration-700 hover:scale-105"
        sizes="(max-width: 768px) 100vw, 800px"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

      {/* Top Navigation Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-md active:scale-95 hover:bg-black/60 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <WakafShareButton judul={judul} variant="floating" />
      </div>
    </div>
  );
}
