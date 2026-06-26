"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';

interface HistoryItem {
  id: string;
  campaignTitle: string;
  date: string;
  amount: number;
  status: 'Semua' | 'Proses' | 'Berhasil' | 'Gagal';
}

export default function HistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('Semua');
  
  const historyData: HistoryItem[] = [
    { id: 'INV-2026-001', campaignTitle: 'Pembangunan Gedung Sekolah Yatim', date: '25 Mei 2026 14:30', amount: 500000, status: 'Proses' },
    { id: 'INV-2026-002', campaignTitle: 'Wakaf Alat Kesehatan Klinik Umat', date: '10 Apr 2026 09:15', amount: 1000000, status: 'Berhasil' },
    { id: 'INV-2025-098', campaignTitle: 'Wakaf Sumur Air Bersih', date: '12 Des 2025 16:45', amount: 250000, status: 'Berhasil' },
    { id: 'INV-2025-075', campaignTitle: 'Wakaf Al-Quran Pelosok', date: '01 Nov 2025 10:00', amount: 150000, status: 'Gagal' },
  ];

  const filteredHistory = activeTab === 'Semua' 
    ? historyData 
    : historyData.filter(item => item.status === activeTab);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Berhasil': return 'text-amwal-secondary-teal bg-amwal-secondary-teal/5 border-amwal-secondary-teal/15';
      case 'Proses': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Gagal': return 'text-rose-600 bg-rose-50 border-rose-150';
      default: return 'text-gray-600 bg-gray-50 border-gray-150';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Berhasil': return <CheckCircle2 size={16} className="text-amwal-secondary-teal mr-1" />;
      case 'Proses': return <Clock size={16} className="text-amber-600 mr-1" />;
      case 'Gagal': return <XCircle size={16} className="text-rose-600 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <button onClick={() => router.back()} className="mr-3 text-gray-600 hover:text-amwal-secondary-teal transition cursor-pointer">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg flex-1">Riwayat Wakaf</h1>
      </div>
      
      {/* Tabs */}
      <div className="bg-white py-3 px-4 shadow-sm border-b border-gray-100">
        <div className="flex overflow-x-auto space-x-2 hide-scrollbar">
          {['Semua', 'Proses', 'Berhasil', 'Gagal'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'bg-amwal-secondary-teal text-white shadow-xs' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      <div className="p-4 space-y-4 max-w-md mx-auto w-full">
        {filteredHistory.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-xs border border-gray-100 p-4 hover:shadow-sm transition duration-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] text-gray-400 mb-1 block font-mono">{item.date} • {item.id}</span>
                <h4 className="font-bold text-sm text-gray-800 leading-tight pr-4">{item.campaignTitle}</h4>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold flex items-center border ${getStatusColor(item.status)}`}>
                {getStatusIcon(item.status)}
                {item.status}
              </div>
            </div>
            
            <div className="border-t border-dashed border-gray-200 my-3"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Nominal Wakaf</span>
              <span className="font-bold text-amwal-secondary-teal text-base">Rp {item.amount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        ))}

        {filteredHistory.length === 0 && (
          <div className="text-center py-16 opacity-60 flex flex-col items-center justify-center">
            <Clock size={40} className="text-gray-400 mb-3 animate-pulse" />
            <p className="font-bold text-gray-500 text-xs">Belum ada riwayat {activeTab !== 'Semua' ? activeTab.toLowerCase() : ''}</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
