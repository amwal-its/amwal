'use client';

import React, { useState } from 'react';
import {
  Grid,
  Filter,
  Download,
  Info,
  TrendingUp,
  ArrowUpRight,
  TrendingDown,
  Layers,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { DrmSimulationBanner } from '@/components/admin/drm-simulation-banner';
import { mockCohortMatrix } from '@/lib/mock-drm-analytics';

export function CohortHeatmapView() {
  const { showToast } = useToast();
  const [selectedAkadFilter, setSelectedAkadFilter] = useState('ALL');

  const getHeatmapBg = (val: number | null) => {
    if (val === null) return 'bg-slate-50 text-slate-300';
    if (val === 100) return 'bg-emerald-900 text-white font-black';
    if (val >= 70) return 'bg-emerald-800 text-white font-bold';
    if (val >= 55) return 'bg-emerald-600 text-white font-semibold';
    if (val >= 45) return 'bg-emerald-400 text-emerald-950 font-semibold';
    if (val >= 35) return 'bg-emerald-200 text-emerald-900 font-medium';
    return 'bg-emerald-100 text-emerald-800';
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 py-6 max-w-7xl mx-auto font-jakarta">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {/* Mandatory Simulation Warning Banner */}
        <DrmSimulationBanner />

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Grid className="w-5 h-5 text-emerald-800" />
                Peta Kesetiaan Donatur &amp; Akumulasi Donasi (Retensi Kohort)
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Melacak berapa lama donatur tetap aktif berdonasi rutin dari bulan pertama kali bergabung.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  showToast({
                    title: 'Laporan Kohort LTV Diunduh',
                    description: 'File spreadsheet analitik retensi dan lifetime value donatur (Excel / CSV) berhasil diexport.',
                    type: 'success',
                  })
                }
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 border border-slate-200 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Cohort LTV Report</span>
              </button>
            </div>
          </div>

          {/* Filter Akad */}
          <div className="mt-4 flex flex-wrap items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-600 mr-1 shrink-0">Filter Akad:</span>
            {['ALL', 'Waqf Uang Abadi', 'Infaq Operasional', 'Zakat Maal', 'Sedekah Subuh'].map((ak) => (
              <button
                key={ak}
                type="button"
                onClick={() => setSelectedAkadFilter(ak)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border whitespace-nowrap cursor-pointer ${
                  selectedAkadFilter === ak
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {ak}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cohort Key Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs text-slate-500 font-semibold block">Rata-Rata Retensi M+1</span>
          <span className="text-2xl font-black text-emerald-900 mt-1 block">73.0%</span>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+4.2% vs benchmark nasional</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs text-slate-500 font-semibold block">Average Donor LTV</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">Rp 4.028.000</span>
          <p className="text-[11px] text-slate-500 mt-1">Estimasi kontribusi lifetime per donor</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs text-slate-500 font-semibold block">Total Kohort Terpantau</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">10.920 Donor</span>
          <p className="text-[11px] text-slate-500 mt-1">Periode Januari 2025 – Juni 2025</p>
        </div>
      </div>

      {/* Expanded Heatmap Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-bold text-slate-900">
            Matrix Retensi Bulan-ke-Bulan (Jan 2025 – Jun 2025)
          </h3>
          <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
            Nilai % Menunjukkan % Donor Yang Berdonasi Kembali
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-center text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                <th className="text-left py-3 px-3">Bulan Akuisisi</th>
                <th className="py-3 px-2">Jumlah Donor</th>
                <th className="py-3 px-2 text-emerald-900">Est. LTV</th>
                <th className="py-3 px-2">M+0</th>
                <th className="py-3 px-2">M+1</th>
                <th className="py-3 px-2">M+2</th>
                <th className="py-3 px-2">M+3</th>
                <th className="py-3 px-2">M+4</th>
                <th className="py-3 px-2">M+5</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockCohortMatrix.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50/80 transition">
                  <td className="text-left py-3 px-3 font-extrabold text-slate-900 whitespace-nowrap">
                    {row.month}
                  </td>
                  <td className="py-3 px-2 font-semibold text-slate-600">{row.count}</td>
                  <td className="py-3 px-2 font-bold text-emerald-900 whitespace-nowrap">{row.ltv}</td>

                  {/* M0 - M5 Cells */}
                  {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5].map((val, idx) => (
                    <td key={idx} className="p-1">
                      <div className={`py-2 px-1 rounded-lg text-xs font-semibold transition ${getHeatmapBg(val)}`}>
                        {val !== null ? `${val}%` : '-'}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-800" />
            <span>Catatan Strategis Kohort Amwal:</span>
          </div>
          <p className="text-slate-600 leading-snug">
            Terdapat kecenderungan penurunan retensi tajam di bulan M+2 (rata-rata turun dari 73% ke 58%). Disarankan mengaktifkan pesan otomatis pengingat dampak sosial pada hari ke-45 pasca donasi pertama.
          </p>
        </div>
      </div>
    </div>
  );
}
