'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Repeat,
  Wallet,
  Layers,
  TrendingUp,
  Sparkles,
  Info,
  ChevronRight,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  BarChart2,
  Grid,
  Send,
  X,
  Building2,
  UserCheck,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export interface AdminOverviewViewProps {
  onNavigateTab?: (tab: string) => void;
  data?: any;
}

export function AdminOverviewView({ onNavigateTab }: AdminOverviewViewProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [selectedActionAlert, setSelectedActionAlert] = useState<{
    title: string;
    segment: string;
    description: string;
    suggestedAction: string;
    count: string;
  } | null>(null);

  const handleNavigate = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
      return;
    }
    const routes: Record<string, string> = {
      overview: '/admin',
      transparency: '/admin/transparansi',
      nazhir_verifikasi: '/admin/nadzir-verifikasi',
      segmentation: '/admin/segmentasi',
      cohort: '/admin/kesetiaan',
      super_admin_approvals: '/admin/approvals',
      wakaf_programs: '/admin/wakaf',
      education: '/admin/edukasi',
      news: '/admin/berita',
      documents: '/admin/dokumen',
      settings: '/admin/pengaturan',
    };
    if (routes[tab]) {
      router.push(routes[tab]);
    }
  };

  // Box A Donut Chart Data
  const segmentData = [
    { name: 'Champion', value: 12, color: '#1B5E20', count: '1.450 donor', desc: 'Nilai & frekuensi tertinggi' },
    { name: 'Loyal', value: 22, color: '#2E7D32', count: '2.660 donor', desc: 'Rutin berdonasi berkala' },
    { name: 'New', value: 28, color: '#4CAF50', count: '3.380 donor', desc: 'Bergabung < 30 hari' },
    { name: 'At-Risk', value: 20, color: '#E65100', count: '2.420 donor', desc: 'Keaktifan menurun > 60 hari' },
    { name: 'Lapsed', value: 13, color: '#C62828', count: '1.570 donor', desc: 'Tidak ada transaksi > 180 hari' },
    { name: 'Situational', value: 5, color: '#00838F', count: '600 donor', desc: 'Berdonasi saat bencana/ramadhan' },
  ];

  // Box B Cohort Data (Jan '25 - Jun '25)
  const cohortRows = [
    { month: "Jan '25", count: 1240, m0: 100, m1: 68, m2: 54, m3: 48, m4: 42, m5: 39 },
    { month: "Feb '25", count: 1450, m0: 100, m1: 72, m2: 58, m3: 51, m4: 46, m5: null },
    { month: "Mar '25", count: 1680, m0: 100, m1: 75, m2: 62, m3: 55, m4: null, m5: null },
    { month: "Apr '25", count: 1920, m0: 100, m1: 71, m2: 59, m3: null, m4: null, m5: null },
    { month: "May '25", count: 2150, m0: 100, m1: 76, m2: null, m3: null, m4: null, m5: null },
    { month: "Jun '25", count: 2480, m0: 100, m1: null, m2: null, m3: null, m4: null, m5: null },
  ];

  // Function for retention heatmap cell background color & opacity
  const getHeatmapColor = (val: number | null) => {
    if (val === null) return 'bg-slate-50 text-slate-300';
    if (val === 100) return 'bg-emerald-800 text-white font-bold';
    if (val >= 70) return 'bg-emerald-700/85 text-white font-semibold';
    if (val >= 55) return 'bg-emerald-600/65 text-white font-medium';
    if (val >= 45) return 'bg-emerald-500/45 text-emerald-950 font-medium';
    if (val >= 35) return 'bg-emerald-300/35 text-emerald-900';
    return 'bg-emerald-200/25 text-emerald-800';
  };

  // Box C Markov Transition Matrix (5x5)
  const markovSegments = ['Champion', 'Loyal', 'New', 'At-Risk', 'Lapsed'];
  const markovMatrix = [
    [68.4, 24.2, 0.0, 5.2, 2.2],   // From Champion
    [15.8, 58.2, 0.0, 18.4, 7.6],  // From Loyal
    [8.5, 32.1, 22.4, 25.0, 12.0], // From New
    [2.1, 11.3, 0.0, 56.6, 30.0],  // From At-Risk -> Lapsed (Highlighted!)
    [0.5, 3.2, 0.0, 12.1, 84.2],   // From Lapsed
  ];

  const getMarkovCellColor = (fromIdx: number, toIdx: number, val: number) => {
    // Highlight At-Risk -> Lapsed (Row 3, Col 4)
    if (fromIdx === 3 && toIdx === 4) {
      return 'bg-rose-100 text-rose-800 font-extrabold border-2 border-rose-400 animate-pulse';
    }
    // High retention on diagonal
    if (fromIdx === toIdx) {
      return 'bg-emerald-100 text-emerald-900 font-bold';
    }
    if (val >= 25) return 'bg-slate-100 text-slate-900 font-semibold';
    if (val >= 10) return 'bg-slate-50 text-slate-700';
    return 'bg-white text-slate-400';
  };

  const handleGenerateAiInsight = async () => {
    setIsGeneratingAi(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analisis data Amwal:
1. Segmen Donor: Champion 12%, Loyal 22%, New 28%, At-Risk 20%, Lapsed 13%, Situational 5%.
2. Markov Matrix: At-Risk ke Lapsed mencapai 30.0% (HIGH Churn Risk).
3. Cohort Retention: Retensi M+1 rata-rata 73%, M+3 turun ke 51%.
Berikan 3 rekomendasi strategi retensi Waqf & Infaq yang konkret dalam bahasa Indonesia profesional.`,
        }),
      });
      const data = await res.json();
      setAiResult(data.result || data.error);
    } catch (e) {
      setAiResult('Gagal menghubungi Amwal AI Advisor. Menggunakan rekomendasi terukur sistem.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Action */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-700/30 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-700/60 text-emerald-200 text-xs font-semibold border border-emerald-600/50">
                HETI 2026 Engine
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-200 text-[10px] font-bold border border-amber-400/40">
                using dummy data
              </span>
              <span className="text-[11px] sm:text-xs text-emerald-200">
                Update Realtime: 11 Agustus 2026, 12:11 WIB
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Dashboard Tatakelola Waqf &amp; Social Finance
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Ringkasan otomatis keaktifan donatur, tingkat kesetiaan (retensi), prediksi risiko, serta rekomendasi aksi untuk pengelola.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleGenerateAiInsight}
              disabled={isGeneratingAi}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Sparkles size={16} className="text-slate-950 shrink-0" />
              <span>{isGeneratingAi ? 'Menganalisis...' : 'Analisis AI Otomatis'}</span>
            </button>
            <button
              onClick={() => handleNavigate('transparency')}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-2 border border-white/20 transition cursor-pointer shrink-0"
            >
              <CheckCircle size={16} className="text-white shrink-0" />
              <span>Catatan Transparansi</span>
            </button>
          </div>
        </div>

        {/* AI Result Box if Generated */}
        {aiResult && (
          <div className="mt-4 p-4 rounded-xl bg-white/95 text-slate-900 border border-amber-300 shadow-md animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-200">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
                <Sparkles size={16} className="text-amber-600 shrink-0" />
                Rekomendasi Strategis AI Amwal
              </div>
              <button
                onClick={() => setAiResult(null)}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Tutup
              </button>
            </div>
            <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
              {aiResult}
            </div>
          </div>
        )}
      </div>

      {/* Super Admin Action Banner: Verifikasi & Pendaftaran Nazhir */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-300/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold shrink-0 mt-0.5">
            <Building2 size={20} className="text-slate-950 shrink-0" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Verifikasi Lembaga Nazhir
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-[10px]">
                2 Permohonan Menunggu
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[10px]">
                using dummy data
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1 max-w-2xl leading-relaxed">
              Yayasan RSI Surabaya &amp; Ponpes Bina Insan Mandiri mengajukan pendaftaran Nazhir Wakaf Uang baru dan menunggu persetujuan Super Admin / verifikasi BWI.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => handleNavigate('nazhir_verifikasi')}
            className="w-full sm:w-auto px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            <UserCheck size={16} className="text-white shrink-0" />
            <span>Review &amp; Setujui Nazhir</span>
          </button>
        </div>
      </div>

      {/* 1. KPI Metric Cards Grid (4x1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Keaktifan Donatur */}
        <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-800 shrink-0">
                  <Clock size={16} className="text-emerald-800 shrink-0" />
                </div>
                <span className="text-[11px] uppercase tracking-wider text-slate-700 font-bold leading-snug">
                  Keaktifan Donatur
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  -12 hari (Lebih Cepat)
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                  using dummy data
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">68</span>
              <span className="text-xs font-semibold text-slate-500">hari sekali</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug pt-2 border-t border-slate-100">
            Rata-rata waktu donatur kembali berdonasi sejak transaksi terakhir
          </p>
        </div>

        {/* Card 2: Frekuensi Donasi */}
        <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-800 shrink-0">
                  <Repeat size={16} className="text-emerald-800 shrink-0" />
                </div>
                <span className="text-[11px] uppercase tracking-wider text-slate-700 font-bold leading-snug">
                  Frekuensi Donasi
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  +0.8x Naik
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                  using dummy data
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">4.2</span>
              <span className="text-xs font-semibold text-slate-500">kali transaksi</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug pt-2 border-t border-slate-100">
            Rata-rata jumlah donasi yang dilakukan setiap donatur
          </p>
        </div>

        {/* Card 3: Rata-rata Nominal */}
        <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-800 shrink-0">
                  <Wallet size={16} className="text-emerald-800 shrink-0" />
                </div>
                <span className="text-[11px] uppercase tracking-wider text-slate-700 font-bold leading-snug">
                  Rata-rata Nominal
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  +15% Naik
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                  using dummy data
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">Rp 842.000</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug pt-2 border-t border-slate-100">
            Besar donasi rata-rata per sekali transaksi (Waqf &amp; Infaq)
          </p>
        </div>

        {/* Card 4: Variasi Program */}
        <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-800 shrink-0">
                  <Layers size={16} className="text-emerald-800 shrink-0" />
                </div>
                <span className="text-[11px] uppercase tracking-wider text-slate-700 font-bold leading-snug">
                  Variasi Program
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  +0.4 Jenis
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                  using dummy data
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">2.3</span>
              <span className="text-xs font-semibold text-slate-500">Jenis Program</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug pt-2 border-t border-slate-100">
            Rata-rata ragam jenis donasi yang diikuti (Waqf, Infaq, Sedekah)
          </p>
        </div>
      </div>

      {/* 2. Main Section Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BOX A: Segmen Donor (Donut Chart) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart2 size={16} className="text-emerald-800 shrink-0" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Box A: Kelompok &amp; Status Donatur
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                    using dummy data
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pembagian 12.080 donatur berdasarkan tingkat keaktifan &amp; loyalitas
                </p>
              </div>
              <button
                onClick={() => handleNavigate('segmentation')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Lihat Daftar Donatur</span>
                <ChevronRight size={14} className="shrink-0" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mt-4">
              {/* Donut Chart */}
              <div className="sm:col-span-6 h-56 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={segmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {segmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Persentase Donatur']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#cbd5e1',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut Center Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-900">100%</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Donatur</span>
                </div>
              </div>

              {/* Segment Legend & Counts */}
              <div className="sm:col-span-6 space-y-2">
                {segmentData.map((seg) => (
                  <div
                    key={seg.name}
                    onClick={() => setSelectedSegment(seg.name)}
                    className={`p-2 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between ${
                      selectedSegment === seg.name
                        ? 'border-emerald-700 bg-emerald-50/80 shadow-xs'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <div>
                        <span className="font-bold text-slate-800">{seg.name}</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">
                          {seg.desc}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-slate-900">{seg.value}%</span>
                      <span className="text-[10px] text-slate-400 block">{seg.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Kelompok Terbesar: <strong className="text-slate-800">Baru (28%) &amp; Rutin (22%)</strong></span>
            <span className="text-emerald-800 font-semibold">Kesehatan Komunitas: Sangat Baik</span>
          </div>
        </div>

        {/* BOX B: Cohort Retention Heatmap */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Grid size={16} className="text-emerald-800 shrink-0" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Box B: Tingkat Kesetiaan Donatur per Bulan
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                    using dummy data
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Berapa persen donatur baru yang masih terus berdonasi di bulan berikutnya
                </p>
              </div>
              <button
                onClick={() => handleNavigate('cohort')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Detail Kesetiaan</span>
                <ChevronRight size={14} className="shrink-0" />
              </button>
            </div>

            {/* Quick Helper Note for Laypeople */}
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-950 flex items-start gap-1.5">
              <Info size={16} className="text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Cara Membaca:</strong> <strong>M+0</strong> adalah bulan pertama donatur bergabung (100%). <strong>M+1</strong> adalah bulan ke-2. Contoh: Dari donatur Jan &apos;25, <strong>68%</strong> masih terus berdonasi di bulan berikutnya.
              </span>
            </div>

            {/* Heatmap Table */}
            <div className="mt-3 overflow-x-auto -mx-2 px-2">
              <table className="w-full min-w-[480px] text-center text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-bold">
                    <th className="text-left py-2 px-2">Bulan Masuk</th>
                    <th className="py-2 px-1">Jumlah</th>
                    <th className="py-2 px-1">M+0</th>
                    <th className="py-2 px-1">M+1</th>
                    <th className="py-2 px-1">M+2</th>
                    <th className="py-2 px-1">M+3</th>
                    <th className="py-2 px-1">M+4</th>
                    <th className="py-2 px-1">M+5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {cohortRows.map((r) => (
                    <tr key={r.month} className="hover:bg-slate-50/80 transition">
                      <td className="text-left py-2 px-2 font-bold text-slate-800 whitespace-nowrap">
                        {r.month}
                      </td>
                      <td className="py-2 px-1 text-slate-500 font-medium">{r.count}</td>

                      {/* M0 */}
                      <td className="py-1 px-1">
                        <div className={`py-1 rounded font-bold ${getHeatmapColor(r.m0)}`}>
                          {r.m0}%
                        </div>
                      </td>
                      {/* M1 */}
                      <td className="py-1 px-1">
                        <div className={`py-1 rounded font-medium ${getHeatmapColor(r.m1)}`}>
                          {r.m1 !== null ? `${r.m1}%` : '-'}
                        </div>
                      </td>
                      {/* M2 */}
                      <td className="py-1 px-1">
                        <div className={`py-1 rounded font-medium ${getHeatmapColor(r.m2)}`}>
                          {r.m2 !== null ? `${r.m2}%` : '-'}
                        </div>
                      </td>
                      {/* M3 */}
                      <td className="py-1 px-1">
                        <div className={`py-1 rounded font-medium ${getHeatmapColor(r.m3)}`}>
                          {r.m3 !== null ? `${r.m3}%` : '-'}
                        </div>
                      </td>
                      {/* M4 */}
                      <td className="py-1 px-1">
                        <div className={`py-1 rounded font-medium ${getHeatmapColor(r.m4)}`}>
                          {r.m4 !== null ? `${r.m4}%` : '-'}
                        </div>
                      </td>
                      {/* M5 */}
                      <td className="py-1 px-1">
                        <div className={`py-1 rounded font-medium ${getHeatmapColor(r.m5)}`}>
                          {r.m5 !== null ? `${r.m5}%` : '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded bg-emerald-800 shrink-0" /> Tinggi (100%)
              <span className="w-2.5 h-2.5 rounded bg-emerald-600/70 ml-2 shrink-0" /> Sedang (50-75%)
              <span className="w-2.5 h-2.5 rounded bg-emerald-200/40 ml-2 shrink-0" /> Rendah (&lt;45%)
            </div>
            <span className="text-emerald-800 font-bold">Rata-rata Bulan ke-2: 73.0% Donor Kembali</span>
          </div>
        </div>

        {/* BOX C: Markov Transition Matrix (5x5) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-800 shrink-0" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Box C: Prediksi Perubahan Status Donatur
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                    using dummy data
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Peluang (%) donatur berpindah antar status dalam 30 hari ke depan
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                Risiko: At-Risk → Pasif (30%)
              </span>
            </div>

            {/* Helper note for laypeople */}
            <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-start gap-1.5">
              <HelpCircle size={16} className="text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong>Cara Membaca:</strong> Baris = Status Saat Ini. Kolom = Prediksi Status Bulan Depan. Kotak merah <strong>(30%)</strong> artinya donatur &quot;At-Risk&quot; berisiko tinggi berubah menjadi &quot;Pasif/Lapsed&quot;.
              </span>
            </div>

            {/* Matrix 5x5 Grid Table */}
            <div className="mt-3 overflow-x-auto -mx-2 px-2">
              <table className="w-full min-w-[500px] text-center text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] font-bold">
                    <th className="text-left py-2 px-1 text-slate-400">Dari \ Ke</th>
                    {markovSegments.map((s) => (
                      <th key={s} className="py-2 px-1 font-bold text-slate-700">
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {markovSegments.map((fromSeg, rIdx) => (
                    <tr key={fromSeg}>
                      <td className="text-left py-2 px-1 font-bold text-slate-800 text-[11px] whitespace-nowrap bg-slate-50/50">
                        {fromSeg}
                      </td>
                      {markovMatrix[rIdx].map((val, cIdx) => (
                        <td key={`${rIdx}-${cIdx}`} className="p-1">
                          <div
                            className={`py-1.5 px-1 rounded transition text-[11px] ${getMarkovCellColor(
                              rIdx,
                              cIdx,
                              val
                            )}`}
                          >
                            {val.toFixed(1)}%
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              Kestabilan Tertinggi: <strong className="text-slate-800">Kelompok Pasif Stay Lapsed (84.2%)</strong>
            </span>
            <span className="text-rose-600 font-bold">Perlu Sapaan Ulang</span>
          </div>
        </div>

        {/* BOX D: Early Warning Alerts & Strategic Recommendations */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-rose-600 shrink-0" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Box D: Peringatan Otomatis &amp; Saran Tindakan
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                    using dummy data
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Deteksi dini donatur yang mulai pasif beserta solusi praktis
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                2 Peringatan
              </span>
            </div>

            {/* Alert List */}
            <div className="mt-4 space-y-3">
              {/* Alert 1 */}
              <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white uppercase">
                      RISIKO TINGGI
                    </span>
                    <span className="font-bold text-rose-950">At-Risk Berisiko Pasif (30.0%)</span>
                  </div>
                  <p className="text-[11px] text-rose-800 leading-snug">
                    Ada 2.420 donatur yang belum berdonasi lagi dalam 60 hari terakhir. Perlu disapa kembali!
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  <button
                    onClick={() =>
                      setSelectedActionAlert({
                        title: 'Kirim Pesan Sapaan Retensi',
                        segment: 'At-Risk (2.420 Donatur)',
                        description:
                          'Kirimkan pesan silaturahmi berkala dan update progres program wakaf terakhir agar donatur kembali berdonasi.',
                        suggestedAction: 'Blast WhatsApp Sapaan & Buletin Dampak',
                        count: '2.420 Kontak',
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer shrink-0"
                  >
                    Kirim Pesan Sapaan
                  </button>
                  <button
                    onClick={() =>
                      setSelectedActionAlert({
                        title: 'Instruksi Khusus ke Nazhir Pengelola',
                        segment: 'At-Risk & Pasif',
                        description:
                          'Teruskan daftar donatur prioritas tinggi ke tim Relationship Manager Yayasan/Nadzir untuk follow up personal.',
                        suggestedAction: 'Disposisi Tugas Internal CRM',
                        count: '2.420 Kontak',
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-white text-rose-800 font-semibold text-[11px] border border-rose-300 hover:bg-rose-100 transition cursor-pointer shrink-0"
                  >
                    Kontak Pengelola
                  </button>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-white uppercase">
                      RISIKO SEDANG
                    </span>
                    <span className="font-bold text-amber-950">Loyal Berisiko Menurun (18.4%)</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Donatur rutin yang belum mengaktifkan pengingat donasi bulanan (autodebet).
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  <button
                    onClick={() =>
                      setSelectedActionAlert({
                        title: 'Aktivasi Penawaran Autodebet Syariah',
                        segment: 'Loyal (2.660 Donatur)',
                        description:
                          'Kirimkan rekomendasi pengaturan transfer berkala otomatis (BSI Debit Rutin / QRIS Subscription) untuk mempermudah wakaf rutin.',
                        suggestedAction: 'Kirim Panduan & Link Aktivasi Autodebet',
                        count: '2.660 Kontak',
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer shrink-0"
                  >
                    Tawarkan Autodebet
                  </button>
                </div>
              </div>

              {/* Action Chips Pairings */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-700 block mb-2">
                  Panduan Strategi Per Kelompok Donatur:
                </span>
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-1.5">
                    <span className="font-bold text-emerald-950">Champion:</span>
                    <span>&quot;Ajak menjadi Duta Waqf Abadi&quot;</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-1.5">
                    <span className="font-bold text-blue-950">Donatur Baru:</span>
                    <span>&quot;Kirim laporan dampak dalam 30 hari&quot;</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">Musiman:</span>
                    <span>&quot;Ingatkan saat Program Ramadhan &amp; Bencana&quot;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Estimasi Potensi Donasi Terselamatkan: <strong className="text-emerald-800">Rp 420 Juta / bulan</strong></span>
            <button
              onClick={() => handleNavigate('segmentation')}
              className="text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Jalankan Program</span>
              <ChevronRight size={14} className="shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: AKSI CEPAT DINI (EARLY WARNING ACTION MODAL)                      */}
      {/* ========================================================================= */}
      {selectedActionAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                  <ShieldAlert size={20} className="text-rose-800 shrink-0" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {selectedActionAlert.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      using dummy data
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Target Segmen: <strong className="text-slate-800">{selectedActionAlert.segment}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedActionAlert(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={20} className="shrink-0" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Deskripsi &amp; Tujuan:</span>
                <p className="text-slate-800 mt-0.5 leading-relaxed">
                  {selectedActionAlert.description}
                </p>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-600 font-medium">Estimasi Penerima Kampanye:</span>
                <span className="font-bold text-emerald-900 font-mono">{selectedActionAlert.count}</span>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-950 space-y-1">
                <div className="font-bold text-[11px] flex items-center gap-1">
                  <Sparkles size={14} className="text-emerald-700 shrink-0" />
                  Rekomendasi Template Pesan AI:
                </div>
                <p className="text-[11px] text-emerald-900 italic leading-relaxed">
                  &quot;Assalamu&apos;alaikum Bapak/Ibu Donatur, semoga senantiasa diberkahi. Kami ingin menyampaikan kabar gembira terkait amanah wakaf Anda pada program Klinik Al-Azhar yang saat ini progresnya telah mencapai 65%...&quot;
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedActionAlert(null);
                  handleNavigate('segmentation');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Daftar Kontak Detail</span>
                <ChevronRight size={14} className="shrink-0" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedActionAlert(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    showToast({
                      title: 'Kampanye Retensi Diluncurkan',
                      description: `Berhasil mengeksekusi "${selectedActionAlert.suggestedAction}" ke ${selectedActionAlert.count}.`,
                      type: 'success',
                    });
                    setSelectedActionAlert(null);
                  }}
                  className="px-4 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send size={14} className="text-white shrink-0" />
                  Eksekusi Aksi Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOverviewView;
