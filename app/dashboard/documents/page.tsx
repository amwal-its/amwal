"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, FileText } from 'lucide-react';

export default function DocumentsPage() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs">
      {/* Sticky Header */}
      <div className="bg-white px-4 py-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <button onClick={() => router.back()} className="mr-3 text-gray-600 hover:text-amwal-secondary-teal transition cursor-pointer">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg flex-1 truncate pr-2">Rencana Anggaran Biaya (RAB)</h1>
        <button className="text-gray-600 hover:text-amwal-secondary-teal transition p-1 cursor-pointer">
          <Download size={22} />
        </button>
      </div>

      {/* PDF Document Skeleton Preview */}
      <div className="p-4 flex-grow flex flex-col items-center justify-center bg-gray-200">
        <div className="bg-white w-full max-w-xs aspect-[1/1.414] shadow-md flex items-center justify-center rounded-sm">
          <div className="text-center text-gray-400 flex flex-col items-center p-6">
            <FileText size={48} className="mb-3 text-amwal-secondary-teal/40 animate-pulse" />
            <p className="font-bold text-gray-700 text-sm">Pratinjau Dokumen PDF</p>
            <p className="text-[11px] mt-2 text-center text-gray-500 leading-normal">
              Rekomendasi Dokumen RAB - Pembangunan Gedung Sekolah Yatim.pdf
            </p>
            
            <div className="mt-6 border border-gray-150 rounded-lg text-xs p-3.5 w-full bg-gray-50/50">
              <div className="bg-gray-200 h-2 w-full rounded mb-2"></div>
              <div className="bg-gray-200 h-2 w-5/6 rounded mb-2"></div>
              <div className="bg-gray-200 h-2 w-4/6 rounded mb-2"></div>
              <div className="bg-gray-200 h-2 w-full rounded mb-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
