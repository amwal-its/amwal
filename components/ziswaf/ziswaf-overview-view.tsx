'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  Coins,
  PackageCheck,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Users,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { InfaqModuleView } from './infaq-module-view';
import { ZakatModuleView } from './zakat-module-view';
import { QurbanModuleView } from './qurban-module-view';
import { DrmSimulationBanner } from '@/components/admin/drm-simulation-banner';

interface ZiswafOverviewViewProps {
  initialSubModule?: 'overview' | 'infaq' | 'zakat' | 'qurban';
}

export function ZiswafOverviewView({
  initialSubModule = 'overview',
}: ZiswafOverviewViewProps = {}) {
  const [activeSubModule, setActiveSubModule] = useState<'overview' | 'infaq' | 'zakat' | 'qurban'>(initialSubModule);

  return (
    <div className="space-y-6 font-jakarta pb-12">
      {/* Simulation Banner */}
      <DrmSimulationBanner
        title="Dashboard Amil ZISWAF Terpadu (Infaq, Zakat &amp; Qurban)"
        description="Pusat tata kelola operasional Amil ZISWAF terakreditasi BAZNAS &amp; MUI dengan rekonsiliasi kas, kalkulator nisab, dan tracking distribusi mustahik."
      />

      {/* Top Multi-Module Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs">
        <div className="flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => setActiveSubModule('overview')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeSubModule === 'overview'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Ikhtisar Amil ZISWAF
            </button>
            <button
              onClick={() => setActiveSubModule('infaq')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeSubModule === 'infaq'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              Infaq &amp; Sedekah
            </button>
            <button
              onClick={() => setActiveSubModule('zakat')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeSubModule === 'zakat'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Coins className="w-4 h-4" />
              Zakat &amp; 8 Asnaf
            </button>
            <button
              onClick={() => setActiveSubModule('qurban')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeSubModule === 'qurban'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              Qurban &amp; RPH
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>LAZ / UPZ BAZNAS Terakreditasi A</span>
          </div>
        </div>
      </div>

      {/* OVERVIEW CONTENT */}
      {activeSubModule === 'overview' && (
        <div className="space-y-6">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Total Penghimpunan ZISWAF</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-[#1B5E20]">
                  <Wallet className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                Rp 842.500.000
              </div>
              <div className="mt-2 text-[11px] text-emerald-800 font-semibold">
                +18.4% dari bulan lalu
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Infaq &amp; Sedekah Realtime</span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <HeartHandshake className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                Rp 312.000.000
              </div>
              <div className="mt-2 text-[11px] text-blue-700 font-semibold">
                4.580 Transaksi QRIS &amp; VA
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Zakat Maal &amp; Fitrah</span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-800">
                  <Coins className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                Rp 428.000.000
              </div>
              <div className="mt-2 text-[11px] text-amber-800 font-semibold">
                680 Muzakki Terbit BSZ
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Realisasi Qurban 1447H</span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-800">
                  <PackageCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                Rp 102.500.000
              </div>
              <div className="mt-2 text-[11px] text-purple-800 font-semibold">
                79 Hewan &amp; Slot Terisi
              </div>
            </div>
          </div>

          {/* Quick Submodule Portal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-emerald-50 text-[#1B5E20]">
                    <HeartHandshake className="w-6 h-6" />
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#1B5E20] font-bold">
                    QRIS Realtime
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Modul Infaq &amp; Sedekah</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kelola kampanye infaq subuh berkah, sedekah jariyah sarana ibadah, santunan yatim, dan auto-generate QRIS dinamis instan.
                </p>
              </div>
              <button
                onClick={() => setActiveSubModule('infaq')}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#1B5E20] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Buka Modul Infaq</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                    <Coins className="w-6 h-6" />
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    8 Asnaf &amp; BSZ
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Modul Zakat &amp; 8 Asnaf</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kalkulator nisab emas BAZNAS, pencatatan muzakki, penerbitan Bukti Setor Zakat (BSZ) resmi, dan batas hak amil maks 12.5%.
                </p>
              </div>
              <button
                onClick={() => setActiveSubModule('zakat')}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Buka Modul Zakat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-amber-300 transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-amber-50 text-amber-800">
                    <PackageCheck className="w-6 h-6" />
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                    Slot 1/7 &amp; RPH
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Modul Qurban &amp; RPH</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Visualizer 7-slot sapi kolektif, sertifikat qurban digital, log akad wakalah syar&apos;i, dan broadcast WhatsApp bukti sembelih video.
                </p>
              </div>
              <button
                onClick={() => setActiveSubModule('qurban')}
                className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Buka Modul Qurban</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER ACTIVE SUBMODULE */}
      {activeSubModule === 'infaq' && <InfaqModuleView />}
      {activeSubModule === 'zakat' && <ZakatModuleView />}
      {activeSubModule === 'qurban' && <QurbanModuleView />}
    </div>
  );
}
