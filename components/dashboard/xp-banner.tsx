'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface XpBannerProps {
  initialXp?: number;
}

export function XpBanner({ initialXp = 200 }: XpBannerProps) {
  const [xp, setXp] = useState(initialXp);
  const [hasClaimed, setHasClaimed] = useState(true);

  const handleClaim = () => {
    if (!hasClaimed) {
      setXp((prev) => prev + 10);
      setHasClaimed(true);
    }
  };

  return (
    <div className="mx-4 sm:mx-6 my-4 bg-gradient-to-r from-[#0F3D1A] to-[#164e23] border border-emerald-900/50 rounded-2xl p-4 sm:p-5 text-white shadow-md flex items-center justify-between gap-3 relative overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-[#439F46]/20 rounded-full blur-xl pointer-events-none" />

      {/* Left side: Points Info */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#006D34] flex items-center justify-center shadow-inner shrink-0 p-1">
          <Image
            src="/assets/images/dashboard/point-icon.png"
            alt="Poin Berkah"
            width={28}
            height={28}
            className="object-contain"
          />
        </div>

        <div>
          <span className="block text-[10px] sm:text-[11px] font-bold text-emerald-300 tracking-wider uppercase">
            Poin Berkah Anda
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {xp}
            </span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400">
              XP
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Claim Status Button */}
      <div className="relative z-10">
        {hasClaimed ? (
          <div className="bg-[#439F46]/90 border border-emerald-400/40 text-white px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
            <span>Sudah Absen Hari ini</span>
          </div>
        ) : (
          <button
            onClick={handleClaim}
            className="bg-[#439F46] hover:bg-[#38863b] text-white px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Klaim +10 XP</span>
          </button>
        )}
      </div>
    </div>
  );
}

