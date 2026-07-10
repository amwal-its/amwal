"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, FileText, Download, ChevronRight, Coins } from 'lucide-react';
import { getPoints } from '@/lib/points';

export default function ProfilePage() {
  const router = useRouter();
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    setPoints(getPoints());
    const handlePointsUpdated = () => {
      setPoints(getPoints());
    };
    window.addEventListener('amwal_points_updated', handlePointsUpdated);
    return () => {
      window.removeEventListener('amwal_points_updated', handlePointsUpdated);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs pb-20 font-sans">
      <div className="bg-white px-4 py-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <button onClick={() => router.push('/dashboard')} className="mr-3 text-gray-600 hover:text-gray-950 p-1 rounded-full transition cursor-pointer">
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-bold text-lg flex-1 text-gray-800">Profil</h1>
        <button onClick={() => router.push('/dashboard/settings')} className="text-gray-600 hover:text-gray-950 p-1 rounded-full transition cursor-pointer">
          <Settings size={22} />
        </button>
      </div>

      <div className="bg-white p-5 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" 
            alt="Profile" 
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full border-2 border-amwal-secondary-teal p-0.5 object-cover"
          />
          <div>
            <h2 className="font-bold text-lg text-gray-800">Ahmad Abdullah</h2>
            <p className="text-sm text-gray-500">ahmad.abdullah@email.com</p>
            <div className="mt-1 inline-flex items-center bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-bold rounded">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg> 
              <span>Terverifikasi KYC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Poin Berkah Banner */}
      <div 
        onClick={() => router.push('/dashboard/points')}
        className="mx-4 mt-4 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-xl p-3.5 flex items-center justify-between shadow-3xs cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-lg text-amber-300">
            <Coins size={18} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider block">Level 1 • Mubtadi</span>
            <span className="text-xs font-black font-mono">{points} XP Berkah</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-xs text-emerald-250 font-bold">
          <span>Rincian</span>
          <ChevronRight size={14} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-sm text-gray-800 mb-3">Ringkasan Portofolio</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <span className="text-xs text-gray-500 mb-1">Total Wakaf</span>
            <span className="font-bold text-lg text-amwal-secondary-teal">Rp 12.5M</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <span className="text-xs text-gray-500 mb-1">Program Didanai</span>
            <span className="font-bold text-lg text-gray-800">14 <span className="text-xs font-normal text-gray-500">Proyek</span></span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <span className="text-xs text-gray-500 mb-1">Sertifikat Wakaf</span>
            <span className="font-bold text-lg text-gray-800">12 <span className="text-xs font-normal text-gray-500">Terbit</span></span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <span className="text-xs text-gray-500 mb-1">Total Zakat</span>
            <span className="font-bold text-lg text-blue-600">Rp 4.2M</span>
          </div>
        </div>
      </div>

      <div className="mt-2 text-left">
        <div className="px-4 mb-2">
          <h3 className="font-bold text-sm text-gray-800">Dokumen Saya</h3>
        </div>
        <div className="bg-white border-y border-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`px-4 py-3 flex items-center justify-between ${i !== 3 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amwal-secondary-teal/5 text-amwal-secondary-teal rounded-full flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Sertifikat Wakaf Masjid</p>
                  <p className="text-xs text-gray-500">12 Apr 2026 • SW-009{i}</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/dashboard/documents')}
                className="text-gray-400 hover:text-amwal-secondary-teal p-2 cursor-pointer"
              >
                <Download size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 px-4 pb-4">
        <button 
          onClick={() => router.push('/login')} 
          className="w-full bg-red-50 text-red-600 font-bold py-3.5 rounded-lg text-sm border border-red-100 cursor-pointer hover:bg-red-100/50 transition"
        >
          Keluar (Logout)
        </button>
      </div>

    </div>
  );
}
