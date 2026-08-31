'use client';

import React, { useState } from 'react';
import {
  Newspaper,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Tag,
  ExternalLink,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
} from 'lucide-react';

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  author: string;
  imageUrl?: string | null;
  publishedAt: string;
  status: 'PUBLISHED' | 'DRAFT';
}

interface NewsManagementViewProps {
  initialNews: NewsItem[];
}

export function NewsManagementView({ initialNews }: NewsManagementViewProps) {
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNews);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Kabar Penyaluran');
  const [newSummary, setNewSummary] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const filteredNews = newsList.filter((n) => {
    const matchesCategory = selectedCategory === 'SEMUA' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const item: NewsItem = {
      id: `news-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      summary: newSummary.trim(),
      author: 'Super Admin Amwal',
      imageUrl: newImageUrl.trim() || '/assets/images/wakaf/wakaf-pembangunan-masjid-al-furqon.png',
      publishedAt: new Date().toISOString(),
      status: 'PUBLISHED',
    };

    setNewsList([item, ...newsList]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewSummary('');
    setNewImageUrl('');
  };

  return (
    <div className="space-y-6 px-6 py-6 max-w-7xl mx-auto font-jakarta">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              CMS Publikasi Berita
            </span>
            <span className="text-xs text-gray-500">Transparansi Kabar & Penyaluran</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-[#1B5E20]" />
            Manajemen Berita & Kabar Penyaluran
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Publikasi artikel transparansi program, dokumentasi penyaluran donasi mustahiq, dan berita terkini kegiatan lembaga.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-3 bg-[#1B5E20] hover:bg-[#144718] text-white text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Berita Baru</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['SEMUA', 'Kabar Penyaluran', 'Edukasi Syariah', 'Berita Utama', 'Laporan Nadzir'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul berita..."
            className="w-full pl-9.5 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20]"
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-card hover:border-emerald-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-44 bg-slate-100 relative overflow-hidden">
                <img
                  src={item.imageUrl || '/assets/images/wakaf/wakaf-pembangunan-masjid-al-furqon.png'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#1B5E20] text-white shadow-xs">
                  {item.category}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(item.publishedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span>Oleh {item.author}</span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Terbit Publik
              </span>

              <button
                type="button"
                onClick={() => alert(`Pratinjau Berita: ${item.title}`)}
                className="text-xs font-bold text-gray-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat Detail</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tulis Berita */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-gray-900">Publikasi Berita Baru</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Judul Artikel / Berita <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Penyaluran Dana Termin 2 Renovasi Masjid Al-Furqon"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Kategori Berita
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20]"
                >
                  <option value="Kabar Penyaluran">Kabar Penyaluran</option>
                  <option value="Edukasi Syariah">Edukasi Syariah</option>
                  <option value="Berita Utama">Berita Utama</option>
                  <option value="Laporan Nadzir">Laporan Nadzir</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Ringkasan / Isi Berita <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Tuliskan isi ringkasan berita, kutipan wawancara penerima manfaat, dan rincian penyaluran..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  URL Gambar Banner
                </label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://... atau path gambar lokal"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex-1 h-11 bg-[#1B5E20] hover:bg-[#144718] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Publikasikan Berita</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
