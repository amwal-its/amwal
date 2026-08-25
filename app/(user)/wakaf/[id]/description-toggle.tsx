'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DescriptionToggleProps {
  text: string;
}

export function DescriptionToggle({ text }: DescriptionToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > 220;

  return (
    <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
      <p className={isExpanded ? '' : 'line-clamp-4'}>
        {text}
      </p>

      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-emerald-600 hover:text-emerald-700 font-bold text-xs inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          {isExpanded ? (
            <>
              <span>Tutup Keterangan</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>Baca Selengkapnya</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
