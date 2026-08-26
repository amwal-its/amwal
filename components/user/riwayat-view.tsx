'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, FileText } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';

export interface RiwayatTransactionItem {
  id: string;
  orderId?: string;
  nomorKwitansi: string;
  programTitle: string;
  nominal: number;
  status: 'MENUNGGU_VERIFIKASI' | 'TERVERIFIKASI' | 'LUNAS' | 'DIBATALKAN' | 'EXPIRED' | string;
  tanggal: string;
  jenisTransaksi: string;
  metodePembayaran?: string;
}

interface RiwayatViewProps {
  transactions: RiwayatTransactionItem[];
}

type FilterTab = 'Semua' | 'Proses' | 'Berhasil' | 'Gagal';

export function RiwayatView({ transactions }: RiwayatViewProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('Semua');

  const formatRupiah = (val: number) => {
    return `Rp${val.toLocaleString('id-ID')}`;
  };

  const formatDateFigma = (dateStr: string) => {
    const d = new Date(dateStr);
    const dateFormatted = d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const timeFormatted = d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${dateFormatted} ${timeFormatted}`;
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'TERVERIFIKASI' || s === 'LUNAS' || s === 'SUCCESS' || s === 'BERHASIL') {
      return {
        label: 'Berhasil',
        bg: 'bg-[#EEF7EE]',
        text: 'text-[#00AA45]',
      };
    }
    if (s === 'DIBATALKAN' || s === 'EXPIRED' || s === 'GAGAL' || s === 'FAILED') {
      return {
        label: 'Gagal',
        bg: 'bg-[#FEF2F2]',
        text: 'text-[#E11D48]',
      };
    }
    return {
      label: 'Proses',
      bg: 'bg-[#FFF4D6]',
      text: 'text-[#D97706]',
    };
  };

  const filteredTransactions = transactions.filter((tx) => {
    const badge = getStatusBadge(tx.status).label;
    if (activeTab === 'Semua') return true;
    return badge === activeTab;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-jakarta antialiased selection:bg-[#439F46] selection:text-white">
      {/* Phone Screen Container for Desktop View (430px width, 844px fixed height frame matching Dashboard) */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[844px] bg-white shadow-2xl border border-gray-200/80 sm:rounded-[40px] relative flex flex-col justify-between overflow-hidden">
        {/* Top Header (Figma 648:2665) */}
        <div className="pt-6 px-5 sm:px-6 pb-2 shrink-0 bg-white z-20 border-b border-gray-50">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Riwayat Wakaf
          </h1>

          {/* Filter Chips (Figma 648:2667) */}
          <div className="pt-3 pb-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {(['Semua', 'Proses', 'Berhasil', 'Gagal'] as FilterTab[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'border border-[#00AA45] bg-[#F4FBF5] text-[#00AA45] font-semibold'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{tab}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-[#00AA45] stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto px-5 sm:px-6 py-3 space-y-3 pb-[84px]">
          {filteredTransactions.length === 0 ? (
            <div className="py-20 text-center text-gray-400 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200 mt-4">
              <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300 stroke-[1.5]" />
              <p className="text-xs font-semibold text-gray-600">Tidak ada riwayat wakaf</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Transaksi dengan status {activeTab !== 'Semua' ? `"${activeTab}"` : ''} belum tersedia.
              </p>
              <Link
                href="/wakaf"
                className="mt-4 inline-block px-5 py-2.5 bg-[#439F46] hover:bg-[#388E3C] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Jelajahi Program Wakaf
              </Link>
            </div>
          ) : (
            filteredTransactions.map((item) => {
              const badge = getStatusBadge(item.status);

              return (
                <Link
                  key={item.id}
                  href={`/riwayat/${item.id}`}
                  className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-[#439F46]/40 hover:shadow-md transition-all group cursor-pointer"
                >
                  {/* Header Row: Date & Invoice + Badge (Figma 648:2672 hd) */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs text-gray-400 font-normal">
                      {formatDateFigma(item.tanggal)} · {item.nomorKwitansi}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${badge.bg} ${badge.text}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Program Title */}
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#439F46] transition-colors leading-snug line-clamp-2 mt-1 mb-3">
                    {item.programTitle}
                  </h3>

                  {/* Divider Line (Dashed / Dotted in Figma) */}
                  <div className="border-t border-dashed border-gray-200 my-2.5" />

                  {/* Bottom Row: Nominal (Figma 648:2672 amt) */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="text-xs text-gray-400 font-normal">
                      Nominal Wakaf
                    </span>
                    <span className="text-base font-semibold text-[#00AA45]">
                      {formatRupiah(item.nominal)}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </main>

        {/* Unified Bottom Navigation with Dashboard & Other Pages */}
        <BottomNav />
      </div>
    </div>
  );
}
