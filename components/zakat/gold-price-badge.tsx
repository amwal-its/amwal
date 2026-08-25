'use client';

import React from 'react';

interface GoldPriceBadgeProps {
  pricePerGram: string | null;
  isStale: boolean;
  fetchedAt?: string;
  loading?: boolean;
}

export function GoldPriceBadge({ pricePerGram, isStale, fetchedAt, loading }: GoldPriceBadgeProps) {
  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 animate-pulse">
        <span>Memuat harga emas acuan...</span>
      </div>
    );
  }

  const formattedPrice = pricePerGram
    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
        Number(pricePerGram)
      )
    : 'Rp 0';

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-amber-800 font-medium">
        <span className="text-amber-500">🪙</span>
        <span>Harga Emas Acuan: {formattedPrice}/gram</span>
      </div>
      {isStale && (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          ⚠️ Harga belum ter-update hari ini
        </span>
      )}
      {fetchedAt && (
        <span className="text-xs text-slate-400">
          (Update: {new Date(fetchedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })})
        </span>
      )}
    </div>
  );
}
