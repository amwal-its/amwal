'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export interface RiwayatDetailData {
  id: string;
  orderId?: string;
  nomorKwitansi: string;
  programTitle: string;
  programKategori?: string;
  programDeskripsi?: string;
  namaLembaga?: string;
  nominal: number;
  status: string;
  tanggal: string;
  jenisTransaksi: string;
  metodePembayaran: string;
  isAnonymous?: boolean;
  namaWakif?: string;
  certificateNumber?: string | null;
  bwiRegistrationNumber?: string | null;
  programId?: string;
}

interface RiwayatDetailViewProps {
  transaction: RiwayatDetailData;
}

export function RiwayatDetailView({ transaction }: RiwayatDetailViewProps) {
  const formatRupiah = (val: number) => {
    return `Rp${val.toLocaleString('id-ID')}`;
  };

  const d = new Date(transaction.tanggal);
  const formattedFullDate = d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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

  const badge = getStatusBadge(transaction.status);
  const isLunas = badge.label === 'Berhasil';
  const subtitleText = transaction.programDeskripsi || 'Bantu anak yatim & umat meraih cita';

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-jakarta antialiased selection:bg-[#439F46] selection:text-white">
      {/* Mobile Container Wrapper (Figma 661:574 matching Dashboard & Riwayat) */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[844px] bg-white shadow-2xl border border-gray-200/80 sm:rounded-[40px] relative flex flex-col justify-between overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-8">
          {/* Header (Figma 661:575) */}
          <div className="pt-6 px-5 sm:px-6 pb-3 flex items-center gap-2.5 bg-white sticky top-0 z-20 border-b border-gray-50">
            <Link
              href="/riwayat"
              className="text-[#439F46] hover:opacity-80 transition-opacity p-1 -ml-1 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </Link>
            <h1 className="text-lg font-semibold text-[#439F46] tracking-tight">
              Detail Transaksi
            </h1>
          </div>

          {/* Content Body (Figma 661:577) */}
          <div className="p-4 space-y-4">
            {/* Top Transaction Summary Card (Figma 661:577 Transaction Card) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              {/* Header Row: Date & Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs text-gray-400 font-normal">
                  Tanggal: {formattedFullDate}
                </span>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${badge.bg} ${badge.text}`}
                >
                  {badge.label}
                </span>
              </div>

              {/* Program Title */}
              <h2 className="text-base font-semibold text-gray-900 leading-snug mt-1 mb-3">
                {transaction.programTitle}
              </h2>

              {/* Divider (Dashed in Figma) */}
              <div className="border-t border-dashed border-gray-200 my-2.5" />

              {/* Amount Row */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <span className="text-xs text-gray-400 font-normal">
                  Nominal Wakaf
                </span>
                <span className="text-base font-semibold text-[#00AA45]">
                  {formatRupiah(transaction.nominal)}
                </span>
              </div>
            </div>

            {/* Checklist Timeline List Items (Figma 661:577 List Items) */}
            <div className="flex flex-col">
              {/* Item 1: Metode Pembayaran */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3.5 flex-1 pr-2 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#EBF7EE] flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-[#439F46] stroke-[3]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-gray-900 block truncate">
                      Metode: {transaction.metodePembayaran}
                    </span>
                    <span className="text-xs text-gray-400 block truncate">
                      {subtitleText}
                    </span>
                  </div>
                </div>
                <span className="text-right text-xs text-[#00AA45] font-medium shrink-0 ml-auto">
                  Tanggal: {formattedFullDate}
                </span>
              </div>

              {/* Item 2: Nominal Transaksi */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3.5 flex-1 pr-2 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#EBF7EE] flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-[#439F46] stroke-[3]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-gray-900 block truncate">
                      Nominal: {formatRupiah(transaction.nominal)}
                    </span>
                    <span className="text-xs text-gray-400 block truncate">
                      {subtitleText}
                    </span>
                  </div>
                </div>
                <span className="text-right text-xs text-[#00AA45] font-medium shrink-0 ml-auto">
                  Metode: {transaction.metodePembayaran}
                </span>
              </div>

              {/* Item 3: Status Verifikasi */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3.5 flex-1 pr-2 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#EBF7EE] flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-[#439F46] stroke-[3]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-gray-900 block truncate">
                      Status: {badge.label}
                    </span>
                    <span className="text-xs text-gray-400 block truncate">
                      {subtitleText}
                    </span>
                  </div>
                </div>
                <span className="text-right text-xs text-[#00AA45] font-medium shrink-0 ml-auto">
                  Nominal: {formatRupiah(transaction.nominal)}
                </span>
              </div>

              {/* Item 4: Detail Program Wakaf */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3.5 flex-1 pr-2 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#EBF7EE] flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-[#439F46] stroke-[3]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-gray-900 block truncate">
                      {transaction.programKategori || 'Wakaf Pendidikan'}
                    </span>
                    <span className="text-xs text-gray-400 block truncate">
                      {subtitleText}
                    </span>
                  </div>
                </div>
                <span className="text-right text-xs text-[#00AA45] font-medium shrink-0 ml-auto">
                  Status: {badge.label}
                </span>
              </div>
            </div>

            {/* BWI Registration Badge if available */}
            {transaction.bwiRegistrationNumber && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>No. Registrasi BWI:</span>
                </div>
                <span className="font-mono font-bold text-amber-900">
                  {transaction.bwiRegistrationNumber}
                </span>
              </div>
            )}

            {/* Download Certificate Button (Sprint 6 Requirement) */}
            {isLunas && (
              <div className="pt-4">
                <a
                  href={`/api/certificates/${transaction.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-[52px] bg-[#439F46] hover:bg-[#388E3C] text-white font-semibold text-[15px] rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Unduh Sertifikat Wakaf (PDF)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
                <p className="text-[11px] text-center text-gray-400 mt-2">
                  Dokumen resmi terakreditasi BWI & Yayasan Manarul Ilmi ITS.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
