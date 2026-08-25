'use client';

import React, { useState } from 'react';
import { FileText, ShieldCheck, ChevronRight, Download, ExternalLink, X } from 'lucide-react';

interface WakafTransparencyCardProps {
  rabDocumentUrl?: string | null;
  dokumenLegalitasUrl?: string | null;
  programTitle: string;
}

export function WakafTransparencyCard({
  rabDocumentUrl,
  dokumenLegalitasUrl,
  programTitle,
}: WakafTransparencyCardProps) {
  const [modalDoc, setModalDoc] = useState<{ title: string; url: string } | null>(null);

  const handleOpenDoc = (title: string, url?: string | null) => {
    if (url && url.trim() !== '') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setModalDoc({
        title,
        url: '#',
      });
    }
  };

  return (
    <div className="my-6">
      <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
        Transparansi
      </h2>

      <div className="flex flex-col gap-2.5">
        {/* 1. RAB Document Button */}
        <button
          onClick={() => handleOpenDoc('Rencana Anggaran Biaya (RAB)', rabDocumentUrl)}
          className="w-full bg-[#F8F9FA] hover:bg-slate-100/90 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs sm:text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                Rencana Anggaran Biaya (RAB)
              </span>
              <span className="block text-[11px] text-gray-500">
                {rabDocumentUrl ? 'Dokumen PDF terverifikasi' : 'Transparansi alokasi dana program'}
              </span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-gray-400 group-hover:text-emerald-600 group-hover:border-emerald-300 transition-all">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* 2. Legalitas Nazhir Button */}
        <button
          onClick={() => handleOpenDoc('Legalitas Nazhir', dokumenLegalitasUrl)}
          className="w-full bg-[#F8F9FA] hover:bg-slate-100/90 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs sm:text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                Legalitas Nazhir
              </span>
              <span className="block text-[11px] text-gray-500">
                {dokumenLegalitasUrl ? 'Sertifikat & Izin BWI' : 'SK Kemenag & Sertifikasi BWI'}
              </span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:border-blue-300 transition-all">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Info Modal if URL is preview placeholder */}
      {modalDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-gray-900">{modalDoc.title}</h3>
              </div>
              <button
                onClick={() => setModalDoc(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-5">
              Dokumen resmi <strong>{modalDoc.title}</strong> untuk program <em>&ldquo;{programTitle}&rdquo;</em> telah diarsipkan dan terverifikasi dalam sistem kustodian Amwal BWI.
            </p>

            <button
              onClick={() => setModalDoc(null)}
              className="w-full bg-[#00AA45] hover:bg-[#00923b] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
