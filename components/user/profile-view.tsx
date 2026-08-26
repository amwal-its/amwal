'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  Sparkles,
  ChevronRight,
  FileText,
  Download,
  LogOut,
} from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';

export interface UserProfileData {
  name: string;
  email?: string | null;
  phone?: string | null;
  xp?: number;
  level?: string;
  totalWakaf?: number;
  proyekDidanai?: number;
  sertifikatTerbit?: number;
  totalZakat?: number;
  documents?: {
    id: string;
    title: string;
    date: string;
    code: string;
    downloadUrl?: string;
  }[];
}

interface ProfileViewProps {
  user: UserProfileData;
}

export function ProfileView({ user }: ProfileViewProps) {
  const router = useRouter();

  const formatRupiah = (val: number) => {
    if (val >= 1000000000) {
      const m = val / 1000000000;
      return `Rp ${m % 1 === 0 ? m : m.toFixed(1)}M`;
    }
    if (val >= 1000000) {
      const jt = val / 1000000;
      return `Rp ${jt % 1 === 0 ? jt : jt.toFixed(1)}jt`;
    }
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/login');
      router.refresh();
    }
  };

  const defaultDocs = [
    {
      id: 'doc-1',
      title: 'Sertifikat Wakaf Masjid',
      date: '12 Apr 2026',
      code: 'SW-0091',
    },
    {
      id: 'doc-2',
      title: 'Sertifikat Wakaf Masjid',
      date: '12 Apr 2026',
      code: 'SW-0092',
    },
    {
      id: 'doc-3',
      title: 'Sertifikat Wakaf Masjid',
      date: '12 Apr 2026',
      code: 'SW-0093',
    },
  ];

  const documents = user.documents && user.documents.length > 0 ? user.documents : defaultDocs;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-jakarta antialiased selection:bg-[#00AB55] selection:text-white">
      {/* 430px Mobile Container Matching Figma Canvas 648:3811 */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[844px] bg-[#F8FAFC] shadow-2xl border border-gray-200/80 sm:rounded-[40px] relative flex flex-col justify-between overflow-hidden">
        
        {/* Main Header (Figma: 648:3926) */}
        <header className="pt-6 px-5 sm:px-6 pb-3 flex items-center justify-between bg-white z-20 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              aria-label="Kembali"
              className="w-10 h-10 -ml-2 text-[#1E293B] hover:bg-slate-100 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft size={22} className="stroke-[2.5]" />
            </button>
            <h1 className="text-xl font-bold text-[#1E293B] tracking-tight">
              Profil
            </h1>
          </div>

          <button
            aria-label="Pengaturan"
            className="w-10 h-10 -mr-2 text-[#1E293B] hover:bg-slate-100 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          >
            <Settings size={22} className="text-[#1E293B]" />
          </button>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5 pb-24">
          
          {/* Section 1: Profile Details (Figma: 648:3812) */}
          <div className="flex items-center gap-4">
            {/* Avatar with brand green border */}
            <div className="w-16 h-16 rounded-full p-[3px] border-2 border-[#00AB55] shrink-0 flex items-center justify-center overflow-hidden bg-emerald-50 shadow-2xs">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#006D34] to-[#00AB55] text-white font-bold text-xl flex items-center justify-center uppercase">
                {user.name ? user.name.slice(0, 2) : 'AA'}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-[#1E293B] tracking-tight truncate">
                {user.name || 'Ahmad Abdullah'}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-[#64748B] truncate mt-0.5">
                {user.email || user.phone || 'ahmad.abdullah@email.com'}
              </p>
            </div>
          </div>

          {/* Section 2: XP Level Card (Figma: 648:3828) */}
          <div className="bg-[#064E3B] rounded-2xl p-4 sm:p-5 text-white shadow-md flex items-center justify-between gap-3 relative overflow-hidden">
            {/* Background glow circle */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#00AB55]/30 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-[#006D34] border border-[#00AB55]/40 flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles size={22} className="text-amber-300" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-emerald-300 tracking-wider uppercase">
                  {user.level || 'LEVEL 1 • MUBTADI'}
                </span>
                <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {user.xp ?? 200} XP Berkah
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="relative z-10 flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-200 hover:text-white transition-colors cursor-pointer"
            >
              <span>Rincian</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Section 3: Portfolio Summary (Figma: 648:3846) */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
              Ringkasan Portofolio
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Total Wakaf */}
              <div className="bg-white border border-[#F1F5F9] rounded-xl p-4 shadow-2xs flex flex-col justify-between h-[86px]">
                <span className="text-xs font-medium text-[#64748B]">
                  Total Wakaf
                </span>
                <span className="text-lg font-bold text-[#00AB55] tracking-tight">
                  {formatRupiah(user.totalWakaf ?? 12500000)}
                </span>
              </div>

              {/* Card 2: Program Didanai */}
              <div className="bg-white border border-[#F1F5F9] rounded-xl p-4 shadow-2xs flex flex-col justify-between h-[86px]">
                <span className="text-xs font-medium text-[#64748B]">
                  Program Didanai
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-[#1E293B]">
                    {user.proyekDidanai ?? 14}
                  </span>
                  <span className="text-sm font-medium text-[#94A3B8]">
                    Proyek
                  </span>
                </div>
              </div>

              {/* Card 3: Sertifikat Wakaf */}
              <div className="bg-white border border-[#F1F5F9] rounded-xl p-4 shadow-2xs flex flex-col justify-between h-[86px]">
                <span className="text-xs font-medium text-[#64748B]">
                  Sertifikat Wakaf
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-[#1E293B]">
                    {user.sertifikatTerbit ?? 12}
                  </span>
                  <span className="text-sm font-medium text-[#94A3B8]">
                    Terbit
                  </span>
                </div>
              </div>

              {/* Card 4: Total Zakat */}
              <div className="bg-white border border-[#F1F5F9] rounded-xl p-4 shadow-2xs flex flex-col justify-between h-[86px]">
                <span className="text-xs font-medium text-[#64748B]">
                  Total Zakat
                </span>
                <span className="text-lg font-bold text-[#2563EB] tracking-tight">
                  {formatRupiah(user.totalZakat ?? 4200000)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: My Documents (Figma: 648:3872) */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
              Dokumen Saya
            </h3>

            <div className="bg-white border border-[#F1F5F9] rounded-2xl divide-y divide-gray-100 shadow-2xs overflow-hidden">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center shrink-0">
                      <FileText size={20} className="text-[#00AB55]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-[#1E293B] truncate">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                        {doc.date} • {doc.code}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/riwayat')}
                    aria-label={`Unduh ${doc.title}`}
                    className="w-9 h-9 rounded-xl text-gray-400 hover:text-[#00AB55] hover:bg-emerald-50 flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Logout Button (Figma: 648:3924) */}
          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-xl bg-white border border-rose-200 text-rose-600 font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-rose-50/50 active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
            >
              <LogOut size={18} className="text-rose-600" />
              <span>Keluar (Logout)</span>
            </button>
          </div>

        </main>

        {/* Unified Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
