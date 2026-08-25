'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface WakafBottomCtaProps {
  programId: string;
  isCompleted?: boolean;
}

export function WakafBottomCta({ programId, isCompleted = false }: WakafBottomCtaProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 sm:py-3.5 shadow-2xl">
      <div className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto flex items-center justify-between gap-3">
        {isCompleted ? (
          <div className="w-full bg-gray-100 text-gray-500 font-bold py-3.5 px-6 rounded-xl text-center text-sm sm:text-base">
            Target Program Telah Terpenuhi
          </div>
        ) : (
          <Link
            href={`/wakaf/${programId}/donate`}
            className="w-full bg-[#00AA45] hover:bg-[#00923b] active:scale-[0.98] text-white font-extrabold py-3.5 px-6 rounded-xl text-center text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white shrink-0" />
            <span>Wakaf Sekarang</span>
          </Link>
        )}
      </div>
    </div>
  );
}
