'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Award,
  ExternalLink,
  Filter,
  FolderOpen,
} from 'lucide-react';

export interface DocumentItem {
  id: string;
  title: string;
  category: 'LEGALITAS' | 'SERTIFIKAT' | 'RAB_PROYEK' | 'TEMPLATE';
  issuer: string;
  fileUrl: string;
  createdAt: string;
  badgeText?: string;
}

interface DocumentsViewProps {
  documents: DocumentItem[];
}

export function DocumentsView({ documents }: DocumentsViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter((d) => {
    const matchesCategory = activeCategory === 'SEMUA' || d.category === activeCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 px-6 py-6 max-w-7xl mx-auto font-jakarta">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Pusat Arsip Dokumen
            </span>
            <span className="text-xs text-gray-500">Legalitas & Kepatuhan Syariah</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <FolderOpen className="w-7 h-7 text-[#1B5E20]" />
            Manajemen Dokumen Resmi & Template
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Penyimpanan dan verifikasi dokumen legalitas lembaga, sertifikat digital wakaf, RAB proyek, dan template standar BWI.
          </p>
        </div>

        <div className="bg-[#E8F5E9] border border-green-200 px-5 py-3 rounded-2xl shrink-0 text-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">Total Arsip Aktif</span>
          <span className="text-xl font-black text-[#1B5E20]">{documents.length} Berkas</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['SEMUA', 'LEGALITAS', 'SERTIFIKAT', 'RAB_PROYEK', 'TEMPLATE'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama berkas..."
            className="w-full pl-9.5 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20]"
          />
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-card hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-700">
                  {doc.category.replace('_', ' ')}
                </span>
                {doc.badgeText && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {doc.badgeText}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1B5E20] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Penerbit: <strong>{doc.issuer}</strong>
                  </p>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    Diarsipkan: {new Date(doc.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-mono">Format PDF</span>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B5E20] hover:bg-[#144718] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Berkas</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
