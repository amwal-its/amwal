"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, X } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';

const WAKAF_PROGRAMS = [
  {
    id: 1,
    title: 'Pembangunan Gedung Sekolah Yatim',
    category: 'Pendidikan',
    institution: 'Yayasan Amanah',
    progress: 50,
    collectedValue: 160,
    daysLeft: 17,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80",
    catBg: "bg-amwal-secondary-teal/10 text-amwal-secondary-teal"
  },
  {
    id: 2,
    title: 'Wakaf Alat Kesehatan Klinik Umat',
    category: 'Kesehatan',
    institution: 'Yayasan Amanah',
    progress: 60,
    collectedValue: 180,
    daysLeft: 22,
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=200&q=80",
    catBg: "bg-blue-100 text-blue-700"
  },
  {
    id: 3,
    title: 'Pembangunan Gedung Sekolah Yatim',
    category: 'Pendidikan',
    institution: 'Yayasan Amanah',
    progress: 70,
    collectedValue: 200,
    daysLeft: 27,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80",
    catBg: "bg-amwal-secondary-teal/10 text-amwal-secondary-teal"
  },
  {
    id: 4,
    title: 'Wakaf Pembukaan Sumur Produktif',
    category: 'Produktif',
    institution: 'Yayasan Amanah',
    progress: 80,
    collectedValue: 220,
    daysLeft: 32,
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=200&q=80",
    catBg: "bg-amber-100 text-amber-700"
  }
];

export default function CatalogPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Filter
  const filtered = WAKAF_PROGRAMS.filter(item => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs pb-24 font-sans">
      {/* Sticky header */}
      <div className="bg-white px-4 py-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shadow-sm justify-between">
        <div className="flex items-center flex-1">
          <button onClick={() => router.push('/dashboard')} className="mr-3 text-gray-600 hover:text-amwal-secondary-teal transition">
            <ArrowLeft size={24} />
          </button>
          {showSearch ? (
            <div className="flex-grow flex items-center bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 mr-2">
              <Search size={15} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Cari program wakaf..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-gray-800 w-full focus:ring-0"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
          ) : (
            <h1 className="font-bold text-lg flex-1">Program Wakaf</h1>
          )}
        </div>
        <button 
          onClick={() => {
            setShowSearch(!showSearch);
            if (showSearch) setSearchQuery('');
          }} 
          className="text-gray-600 hover:text-amwal-secondary-teal transition"
        >
          {showSearch ? <X size={22} /> : <Search size={22} />}
        </button>
      </div>
      
      {/* Filters and sorting bar */}
      <div className="bg-white py-3 px-4 shadow-sm border-b border-gray-100 sticky top-15 z-10">
        <div className="flex overflow-x-auto space-x-2 hide-scrollbar relative">
          {['Semua', 'Pendidikan', 'Kesehatan', 'Produktif'].map((catName) => {
            const isSelected = selectedCategory === catName;
            return (
              <button 
                key={catName}
                onClick={() => setSelectedCategory(catName)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                  isSelected 
                    ? 'bg-amwal-secondary-teal text-white border-transparent shadow-sm' 
                    : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Program items list */}
      <div className="p-4 space-y-4">
        {filtered.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex cursor-pointer hover:border-amwal-secondary-teal/30 transition" 
            onClick={() => router.push('/wakaf')}
          >
            <img 
              src={item.image} 
              referrerPolicy="no-referrer"
              className="w-32 h-auto object-cover" 
              alt={item.title}
            />
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium mb-1.5 inline-block ${item.catBg}`}>
                  {item.category}
                </span>
                <h4 className="font-extrabold text-sm text-gray-800 leading-tight mb-1 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mb-2">{item.institution}</p>
              </div>
              <div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1.5">
                  <div className="bg-amwal-secondary-green h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-medium">
                  <span className="text-amwal-secondary-teal font-extrabold">Terkumpul Rp {item.collectedValue}jt</span>
                  <span className="text-gray-500">{item.daysLeft} hari</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 font-semibold text-xs">
            Tidak ada program wakaf yang cocok.
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
