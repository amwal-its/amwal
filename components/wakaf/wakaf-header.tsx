'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Share2, Check, Copy } from 'lucide-react';

interface WakafHeaderProps {
  bannerUrl?: string | null;
  judul: string;
}

export function WakafHeader({ bannerUrl, judul }: WakafHeaderProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const defaultBanner = '/assets/images/wakaf/wakaf-dana-abadi-untuk-pendidikan-agama-islam.png';
  const imageSrc = bannerUrl && bannerUrl.trim() !== '' ? bannerUrl : defaultBanner;

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: judul,
            text: `Mari berwakaf untuk program: ${judul}`,
            url,
          });
          return;
        } catch (err) {
          // User cancelled or share failed, fallback to copy clipboard
        }
      }

      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // clipboard write error
      }
    }
  };

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

        <button
          onClick={handleShare}
          aria-label="Bagikan Program"
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-md active:scale-95 hover:bg-black/60 transition-all cursor-pointer relative"
        >
          {copied ? (
            <Check className="w-5 h-5 text-emerald-400 animate-in fade-in" />
          ) : (
            <Share2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Toast Notification when link copied */}
      {copied && (
        <div className="absolute top-16 right-4 z-30 bg-gray-900/90 backdrop-blur-md text-white text-xs font-medium px-3.5 py-2 rounded-xl shadow-lg border border-white/10 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tautan berhasil disalin!</span>
        </div>
      )}
    </div>
  );
}
