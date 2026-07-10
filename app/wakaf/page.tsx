"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, ShieldCheck, MapPin, Users, Heart } from 'lucide-react';

export default function WakafDetailPage() {
  const router = useRouter();
  
  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs">
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
        <button onClick={() => router.push('/catalog')} className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
          <ArrowLeft size={24} />
        </button>
        <button className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
          <Share2 size={20} />
        </button>
      </div>

      <img 
        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80" 
        referrerPolicy="no-referrer"
        className="w-full h-64 object-cover relative z-10" 
        alt="Banner Detail"
      />

      <div className="bg-white rounded-t-3xl -mt-6 relative z-20 pb-24">
        <div className="p-5">
          <span className="text-xs bg-amwal-secondary-teal/10 text-amwal-secondary-teal px-2.5 py-1 rounded-full font-bold mb-3 inline-block">Wakaf Pendidikan</span>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">Pembangunan Gedung Sekolah Yatim</h1>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs text-gray-500 font-medium">Terkumpul</p>
                <p className="text-xl font-bold text-amwal-secondary-teal border-b border-dashed border-amwal-secondary-teal/30 pb-0.5">Rp 450.000.000</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium">Target</p>
                <p className="text-sm font-bold text-gray-800">Rp 1.000.000.000</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2 mb-3 overflow-hidden">
              <div className="bg-amwal-secondary-green h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            
            <div className="flex justify-between items-center text-xs font-medium text-gray-500">
              <span>45% Tercapai</span>
              <span className="bg-white px-2 py-1 rounded shadow-sm">45 Hari Lagi</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center space-x-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Wakif/Donatur</p>
                <p className="font-bold text-gray-800 text-sm">1.240 Orang</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <Heart size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Penerima Manfaat</p>
                <p className="font-bold text-gray-800 text-sm">500+ Yatim</p>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-lg text-gray-900 mb-2">Keterangan</h3>
          <p className="text-sm text-gray-600 leading-relaxed text-justify mb-6">
            Pondok Pesantren Al-Hidayah saat ini menampung lebih dari 500 santri yatim dan dhuafa. Kondisi asrama dan ruang kelas saat ini sudah sangat tidak layak dan overkapasitas. Melalui program wakaf ini, kita akan membangun gedung baru 3 lantai yang akan menjadi amal jariyah yang pahalanya tidak terputus...
          </p>

          <h3 className="font-bold text-lg text-gray-900 mb-3">Profil Pengelola (Nazhir)</h3>
          <div className="flex items-center space-x-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm mb-6 cursor-pointer" onClick={() => router.push('/nazhir')}>
            <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=100&q=80" referrerPolicy="no-referrer" className="w-12 h-12 rounded bg-gray-100 object-cover p-1" alt="Nazhir Avatar" />
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 flex items-center">
                Dompet Dhuafa 
                <ShieldCheck size={14} className="text-blue-500 ml-1" />
              </h4>
              <p className="text-xs text-gray-500 flex items-center mt-0.5"><MapPin size={12} className="mr-1"/> Jakarta Selatan</p>
            </div>
          </div>
          
          <h3 className="font-bold text-lg text-gray-900 mb-3">Transparansi</h3>
          <div className="space-y-2">
            <button onClick={() => router.push('/dashboard')} className="w-full text-left p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg flex justify-between hover:bg-gray-100 cursor-pointer">
              Rencana Anggaran Biaya (RAB) <ArrowLeft size={16} className="rotate-180 text-gray-400" />
            </button>
            <button onClick={() => router.push('/dashboard')} className="w-full text-left p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg flex justify-between hover:bg-gray-100 cursor-pointer">
              Legalitas Nazhir <ArrowLeft size={16} className="rotate-180 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 p-4 z-30 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => router.push('/infaq')} 
          className="w-full bg-amwal-secondary-teal text-white font-bold py-3.5 rounded-xl hover:bg-amwal-secondary-teal/90 transition cursor-pointer"
        >
          Wakaf Sekarang
        </button>
      </div>
    </div>
  );
}
