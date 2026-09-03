'use client';

import React, { useState } from 'react';
import {
  Grid,
  Download,
  Info,
  ArrowUpRight,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export function CohortHeatmapView() {
  const { showToast } = useToast();
  const [selectedAkadFilter, setSelectedAkadFilter] = useState('ALL');

  const cohortFullData = [
    { month: "Jan '25", count: 1240, ltv: 'Rp 3.420.000', m0: 100, m1: 68, m2: 54, m3: 48, m4: 42, m5: 39 },
    { month: "Feb '25", count: 1450, ltv: 'Rp 3.850.000', m0: 100, m1: 72, m2: 58, m3: 51, m4: 46, m5: null },
    { month: "Mar '25", count: 1680, ltv: 'Rp 4.100.000', m0: 100, m1: 75, m2: 62, m3: 55, m4: null, m5: null },
    { month: "Apr '25", count: 1920, ltv: 'Rp 3.950.000', m0: 100, m1: 71, m2: 59, m3: null, m4: null, m5: null },
    { month: "May '25", count: 2150, ltv: 'Rp 4.250.000', m0: 100, m1: 76, m2: null, m3: null, m4: null, m5: null },
    { month: "Jun '25", count: 2480, ltv: 'Rp 4.600.000', m0: 100, m1: null, m2: null, m3: null, m4: null, m5: null },
  ];

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
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Grid size={20} className="text-emerald-800 shrink-0" />
                Peta Kesetiaan Donatur &amp; Akumulasi Donasi (Retensi)
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                using dummy data
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Melacak berapa lama donatur tetap aktif berdonasi rutin dari bulan pertama kali bergabung.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                showToast({
                  title: 'Laporan Kohort LTV Diunduh',
                  description: 'File spreadsheet analitik retensi dan lifetime value donatur (Excel / CSV) berhasil diexport.',
                  type: 'success',
                })
              }
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 border border-slate-200 transition cursor-pointer"
            >
              <Download size={16} className="shrink-0" />
              Export Cohort LTV Report
            </button>
          </div>
        </div>

        {/* Filter Akad */}
        <div className="mt-4 flex flex-wrap items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-600 mr-1 shrink-0">Filter Akad:</span>
          {['ALL', 'Waqf Uang Abadi', 'Infaq Operasional', 'Zakat Maal', 'Sedekah Subuh'].map((ak) => (
            <button
              key={ak}
              onClick={() => setSelectedAkadFilter(ak)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border whitespace-nowrap cursor-pointer ${
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

      {/* Cohort Key Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold block">Rata-Rata Retensi M+1</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              using dummy data
            </span>
          </div>
          <span className="text-2xl font-black text-emerald-900 mt-1 block">73.0%</span>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight size={14} className="shrink-0" /> +4.2% vs benchmark nasional
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold block">Average Donor LTV</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              using dummy data
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 mt-1 block">Rp 4.028.000</span>
          <p className="text-[11px] text-slate-500 mt-1">Estimasi kontribusi lifetime per donor</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold block">Total Kohort Terpantau</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              using dummy data
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 mt-1 block">10.920 Donor</span>
          <p className="text-[11px] text-slate-500 mt-1">Januari 2025 - Juni 2025</p>
        </div>
      </div>

      {/* Expanded Heatmap Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>Matrix Retensi Bulan-ke-Bulan (Jan 2025 - Jun 2025)</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              using dummy data
            </span>
          </div>
          <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start sm:self-auto">
            Nilai % Menunjukkan % Donor Yang Berdonasi Kembali
          </span>
        </h3>

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
              {cohortFullData.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50/80 transition">
                  <td className="text-left py-3 px-3 font-extrabold text-slate-900 whitespace-nowrap">
                    {row.month}
                  </td>
                  <td className="py-3 px-2 font-semibold text-slate-600">{row.count}</td>
                  <td className="py-3 px-2 font-bold text-emerald-900 whitespace-nowrap">{row.ltv}</td>

                  {/* M0 - M5 Cells */}
                  {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5].map((val, idx) => (
                    <td key={idx} className="p-1">
                      <div className={`py-2 px-1 rounded-lg text-xs transition ${getHeatmapBg(val)}`}>
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
            <Info size={16} className="text-emerald-800 shrink-0" />
            Catatan Strategis Kohort Amwal:
          </div>
          <p className="text-slate-600 leading-snug">
            Terdapat kecenderungan penurunan retensi tajam di bulan M+2 (rata-rata turun dari 73% ke 58%). Disarankan mengaktifkan pesan otomatis pengingat dampak sosial pada hari ke-45 pasca donasi pertama.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CohortHeatmapView;
