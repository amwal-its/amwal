'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  Landmark,
  Users,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Building2,
  FileText,
  FileSpreadsheet,
  Settings,
  ChevronRight,
  ExternalLink,
  Coins,
  Layers,
  ArrowRight,
  BarChart2,
  Grid,
  HelpCircle,
  Info,
  Send,
  X,
  Repeat,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { motion } from 'motion/react';
import { DrmSimulationBanner } from '@/components/admin/drm-simulation-banner';
import {
  mockRfmdKpis,
  mockDonorSegments,
  mockCohortMatrix,
  mockChurnPredictions,
  mockChurnSegments,
} from '@/lib/mock-drm-analytics';

export interface OverviewMetrics {
  totalDanaTerkumpul: number;
  wakafVolume: number;
  zakatVolume: number;
  qurbanVolume: number;
  totalProgramLive: number;
  totalProgramAll: number;
  totalDonaturUnik: number;
  totalRegisteredUsers?: number;
  totalGuestUsers?: number;
  certificatesWithBwiCount?: number;
  totalCertificatesCount?: number;
  totalTransactionsCount: number;
  pendingApprovals: {
    nadzir: number;
    withdrawals: number;
    permohonan: number;
    total: number;
  };
  trendData: Array<{
    period: string;
    wakaf: number;
    zakat: number;
    qurban: number;
    total: number;
  }>;
  moduleDistribution: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
  recentTransactions: Array<{
    id: string;
    nomorKwitansi: string;
    jenisTransaksi: string;
    donorName: string;
    isAnonymous: boolean;
    programTitle: string;
    amount: number;
    statusPembayaran: string;
    createdAt: string;
  }>;
  topPrograms: Array<{
    id: string;
    judul: string;
    kategori: string;
    jenisWakaf: string;
    namaLembaga: string;
    targetDana: number;
    pokokDanaTerkumpul: number;
    persentaseDana: number;
    persentaseFisik: number | null;
  }>;
}

interface AdminOverviewViewProps {
  data: OverviewMetrics;
}

export function AdminOverviewView({ data }: AdminOverviewViewProps) {
  const [activeChartMetric, setActiveChartMetric] = useState<'total' | 'wakaf' | 'zakat' | 'qurban'>('total');

  // DRM Widget State
  const [selectedDrmSegment, setSelectedDrmSegment] = useState<string | null>(null);
  const [selectedActionAlert, setSelectedActionAlert] = useState<{
    title: string;
    segment: string;
    description: string;
    count: string;
  } | null>(null);

  // Helpers for DRM widgets
  const getHeatmapColor = (val: number | null) => {
    if (val === null) return 'bg-slate-50 text-slate-300';
    if (val === 100) return 'bg-emerald-800 text-white font-bold';
    if (val >= 70) return 'bg-emerald-700/85 text-white font-semibold';
    if (val >= 55) return 'bg-emerald-600/65 text-white font-medium';
    if (val >= 45) return 'bg-emerald-500/45 text-emerald-950 font-medium';
    if (val >= 35) return 'bg-emerald-300/35 text-emerald-900';
    return 'bg-emerald-200/25 text-emerald-800';
  };

  const getMarkovCellColor = (fromIdx: number, toIdx: number, val: number) => {
    if (fromIdx === 3 && toIdx === 4) {
      return 'bg-rose-100 text-rose-800 font-extrabold border-2 border-rose-400 animate-pulse';
    }
    if (fromIdx === toIdx) return 'bg-emerald-100 text-emerald-900 font-bold';
    if (val >= 25) return 'bg-slate-100 text-slate-900 font-semibold';
    if (val >= 10) return 'bg-slate-50 text-slate-700';
    return 'bg-white text-slate-400';
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatShortNumber = (val: number) => {
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)} M`;
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)} Jt`;
    return formatRupiah(val);
  };

  return (
    <div className="space-y-6 px-6 py-6 max-w-7xl mx-auto font-jakarta">
      {/* Top Banner & Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#1B5E20] border border-green-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1B5E20] animate-pulse" />
              Sistem Ledger Berjalan Normal
            </span>
            <span className="text-xs text-gray-500 hidden sm:inline">•</span>
            <span className="text-xs text-gray-500 hidden sm:inline">Database Supabase PostgreSQL Terkoneksi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Ringkasan Eksekutif & Pengawasan Platform
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Monitoring real-time penghimpunan dana wakaf, distribusi zakat, transparansi qurban, dan audit tatakelola institusional.
          </p>
        </div>

        {/* Pending Approvals Quick CTA */}
        {data.pendingApprovals.total > 0 ? (
          <Link
            href="/admin/approvals"
            className="flex items-center gap-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/90 px-4 py-3 rounded-2xl transition-all shadow-2xs group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
                Pusat Persetujuan
              </span>
              <span className="text-sm font-black text-gray-900 flex items-center gap-1">
                {data.pendingApprovals.total} Berkas Menunggu
                <ChevronRight className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3 bg-[#E8F5E9] border border-green-200 px-4 py-3 rounded-2xl shrink-0">
            <CheckCircle2 className="w-6 h-6 text-[#1B5E20]" />
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Antrean Persetujuan</span>
              <span className="text-sm font-black text-[#1B5E20]">Semua Berkas Bersih</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Top 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Dana Terkumpul */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card hover:border-emerald-300 hover:shadow-card-hover transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Dana Terhimpun
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight">
            {formatShortNumber(data.totalDanaTerkumpul)}
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Dari {data.totalTransactionsCount} transaksi lunas</span>
            <span className="text-[#1B5E20] font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              100% Sah
            </span>
          </div>
        </motion.div>

        {/* Card 2: Program Wakaf Aktif */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card hover:border-emerald-300 hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Program Wakaf Aktif
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight">
            {data.totalProgramLive} <span className="text-sm font-semibold text-gray-400">/ {data.totalProgramAll} Program</span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Wakaf Produktif & Manfaat</span>
            <Link href="/admin/wakaf" className="text-blue-700 font-bold hover:underline inline-flex items-center gap-0.5">
              <span>Kelola</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        {/* Card 3: Donatur & Muzakki Terdaftar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card hover:border-emerald-300 hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Donatur & Muzakki
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight">
            {data.totalRegisteredUsers ?? data.totalDonaturUnik} <span className="text-sm font-semibold text-gray-400">Akun Terdaftar</span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>{data.totalGuestUsers ?? 0} Tamu (Guest)</span>
            <span className="text-purple-700 font-semibold">{data.totalDonaturUnik} Donatur Lunas</span>
          </div>
        </motion.div>

        {/* Card 4: Sertifikat Ter-registrasi BWI */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card hover:border-emerald-300 hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Sertifikat Ter-registrasi BWI
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1B5E20] tracking-tight flex items-center gap-1.5">
            {data.certificatesWithBwiCount ?? 0} <span className="text-sm font-semibold text-gray-400">/ {data.totalCertificatesCount ?? 0} Sertifikat</span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>
              {(data.totalCertificatesCount ?? 0) > 0
                ? `${Math.round(((data.certificatesWithBwiCount ?? 0) / (data.totalCertificatesCount ?? 1)) * 100)}% Terdaftar BWI`
                : 'Nomor Registrasi BWI'}
            </span>
            <Link href="/admin/nadzir-verifikasi" className="text-amber-800 font-bold hover:underline inline-flex items-center gap-0.5">
              <span>Audit</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Main Charts Section (2 Columns Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 Cols): Tren Penerimaan Dana Waktu Riil */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-card p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#1B5E20]" />
                  Tren Penghimpunan Dana (Time-Series)
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Agregasi transaksi lunas masuk per periode waktu
                </p>
              </div>

              {/* Metric Switcher */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs">
                {(
                  [
                    { id: 'total', label: 'Semua' },
                    { id: 'wakaf', label: 'Wakaf' },
                    { id: 'zakat', label: 'Zakat' },
                    { id: 'qurban', label: 'Qurban' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveChartMetric(m.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      activeChartMetric === m.id
                        ? 'bg-white text-gray-900 shadow-2xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Chart Container */}
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradientEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B5E20" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1B5E20" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1E88E5" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="gradientAmber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)} Jt` : v)}
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatRupiah(Number(value) || 0), 'Nominal']}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                    itemStyle={{ color: '#81C784' }}
                  />
                  <Area
                    type="monotone"
                    dataKey={activeChartMetric}
                    stroke={
                      activeChartMetric === 'wakaf'
                        ? '#1B5E20'
                        : activeChartMetric === 'zakat'
                        ? '#1E88E5'
                        : activeChartMetric === 'qurban'
                        ? '#D97706'
                        : '#1B5E20'
                    }
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={
                      activeChartMetric === 'zakat'
                        ? 'url(#gradientBlue)'
                        : activeChartMetric === 'qurban'
                        ? 'url(#gradientAmber)'
                        : 'url(#gradientEmerald)'
                    }
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Wakaf</span>
              <span className="font-extrabold text-[#1B5E20]">{formatShortNumber(data.wakafVolume)}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Zakat</span>
              <span className="font-extrabold text-blue-700">{formatShortNumber(data.zakatVolume)}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Qurban</span>
              <span className="font-extrabold text-amber-700">{formatShortNumber(data.qurbanVolume)}</span>
            </div>
          </div>
        </motion.div>

        {/* Right (5 Cols): Donut Pie Chart Komposisi Modul */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-card p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#1B5E20]" />
                Komposisi Dana per Modul
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                100% Nyata
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Proporsi perolehan dana sosial berdasarkan jenis akad syariah
            </p>

            {/* Pie Chart Container */}
            <div className="h-52 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.moduleDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.moduleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [formatRupiah(Number(value) || 0), 'Nominal']}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dominan</span>
                <span className="text-sm font-black text-gray-900">Wakaf & ZIS</span>
              </div>
            </div>
          </div>

          {/* Module List Legend */}
          <div className="space-y-2 pt-3 border-t border-gray-100">
            {data.moduleDistribution.map((m) => (
              <div key={m.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <span className="font-semibold text-gray-800">{m.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono text-[11px]">{formatShortNumber(m.value)}</span>
                  <span className="font-extrabold text-gray-900 w-9 text-right">{m.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 2-Column Lower Section: Live Transactions & Program Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 Cols): Transaksi Masuk Terverifikasi Terbaru */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#1B5E20]" />
                Transaksi Masuk Terverifikasi Terbaru
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Aliran dana masuk langsung ke rekening LKS-PWU BSI
              </p>
            </div>
            <Link
              href="/admin/transparansi"
              className="text-xs font-bold text-[#1B5E20] hover:underline inline-flex items-center gap-1"
            >
              <span>Lihat Semua Log</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {data.recentTransactions.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                Belum ada data transaksi yang tercatat.
              </div>
            ) : (
              data.recentTransactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/60 px-2 rounded-xl transition-colors">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          tx.jenisTransaksi === 'WAKAF'
                            ? 'bg-emerald-100 text-[#1B5E20]'
                            : tx.jenisTransaksi === 'ZAKAT'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tx.jenisTransaksi}
                      </span>
                      <span className="font-bold text-gray-900 truncate block">
                        {tx.isAnonymous ? 'Hamba Allah (Anonim)' : tx.donorName}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">
                      {tx.programTitle} • No: <span className="font-mono">{tx.nomorKwitansi}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-gray-900 block text-xs">
                      {formatRupiah(tx.amount)}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Right (5 Cols): Program Fisik & Ledger Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#1B5E20]" />
                Portofolio Program Prioritas
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Monitoring progres dana & progres fisik
              </p>
            </div>
            <Link
              href="/admin/wakaf"
              className="text-xs font-bold text-[#1B5E20] hover:underline inline-flex items-center gap-1"
            >
              <span>Semua Program</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {data.topPrograms.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                Belum ada program wakaf aktif.
              </div>
            ) : (
              data.topPrograms.map((prog) => (
                <div key={prog.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">
                        {prog.judul}
                      </h3>
                      <span className="text-[11px] text-gray-500">
                        {prog.namaLembaga} • {prog.jenisWakaf === 'PRODUKTIF_KEKAL' ? 'Produktif' : 'Manfaat'}
                      </span>
                    </div>

                    {prog.persentaseFisik !== null && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 shrink-0">
                        Fisik {prog.persentaseFisik}%
                      </span>
                    )}
                  </div>

                  {/* Dana Progress Bar */}
                  <div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full bg-[#1B5E20] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, prog.persentaseDana)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold text-gray-600">
                      <span>Terkumpul: {formatShortNumber(prog.pokokDanaTerkumpul)}</span>
                      <span>{prog.persentaseDana}% dari {formatShortNumber(prog.targetDana)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* ===================================================================== */}
      {/* DRM ANALYTICS SECTION: Box A–D — DATA SIMULASI (Wajib Ada Banner)   */}
      {/* ===================================================================== */}
      <div className="space-y-6">
        {/* 4 Mini KPI Metric Cards (RFM-D Summary) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Keaktifan Donatur */}
          <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200 shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-800 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-700 font-bold leading-snug">
                    {mockRfmdKpis[0].title}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  {mockRfmdKpis[0].change}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{mockRfmdKpis[0].value}</span>
                <span className="text-xs font-semibold text-slate-500">{mockRfmdKpis[0].unit}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug pt-2 border-t border-slate-100">
              {mockRfmdKpis[0].desc}
            </p>
          </div>

          {/* Card 2: Frekuensi Donasi */}
          <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200 shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-800 shrink-0">
                    <Repeat className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-700 font-bold leading-snug">
                    {mockRfmdKpis[1].title}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  {mockRfmdKpis[1].change}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{mockRfmdKpis[1].value}</span>
                <span className="text-xs font-semibold text-slate-500">{mockRfmdKpis[1].unit}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug pt-2 border-t border-slate-100">
              {mockRfmdKpis[1].desc}
            </p>
          </div>

          {/* Card 3: Rata-rata Nominal */}
          <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200 shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-800 shrink-0">
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-700 font-bold leading-snug">
                    {mockRfmdKpis[2].title}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  {mockRfmdKpis[2].change}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{mockRfmdKpis[2].value}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug pt-2 border-t border-slate-100">
              {mockRfmdKpis[2].desc}
            </p>
          </div>

          {/* Card 4: Variasi Program */}
          <div className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200 shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-800 shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-700 font-bold leading-snug">
                    {mockRfmdKpis[3].title}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  {mockRfmdKpis[3].change}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{mockRfmdKpis[3].value}</span>
                <span className="text-xs font-semibold text-slate-500">{mockRfmdKpis[3].unit}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug pt-2 border-t border-slate-100">
              {mockRfmdKpis[3].desc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BOX A: RFMD Donor Segmentation Donut Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card flex flex-col overflow-hidden">
          {/* MANDATORY SIMULATION BANNER — DO NOT REMOVE */}
          <DrmSimulationBanner />
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-800" />
                  Box A: Kelompok &amp; Status Donatur
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pembagian 12.080 donatur berdasarkan tingkat keaktifan &amp; loyalitas
                </p>
              </div>
              <Link
                href="/admin/segmentasi"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Lihat Tabel Donatur</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mt-4">
              {/* Donut Chart */}
              <div className="sm:col-span-6 h-56 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockDonorSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {mockDonorSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`${Number(val)}%`, 'Persentase Donatur']}
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
                {/* Center Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-900">100%</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Donatur</span>
                </div>
              </div>

              {/* Legend */}
              <div className="sm:col-span-6 space-y-2">
                {mockDonorSegments.map((seg) => (
                  <div
                    key={seg.name}
                    onClick={() => setSelectedDrmSegment(seg.name)}
                    className={`p-2 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between ${
                      selectedDrmSegment === seg.name
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
                        <span className="text-[10px] text-slate-500 block leading-tight">{seg.desc}</span>
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

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Kelompok Terbesar: <strong className="text-slate-800">Baru (28%) &amp; Rutin (22%)</strong></span>
              <span className="text-emerald-800 font-semibold">Kesehatan Komunitas: Sangat Baik</span>
            </div>
          </div>
        </div>

        {/* BOX B: Cohort Retention Heatmap M0-M5 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card flex flex-col overflow-hidden">
          {/* MANDATORY SIMULATION BANNER — DO NOT REMOVE */}
          <DrmSimulationBanner />
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Grid className="w-4 h-4 text-emerald-800" />
                  Box B: Tingkat Kesetiaan Donatur per Bulan
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Berapa persen donatur baru yang masih terus berdonasi di bulan berikutnya
                </p>
              </div>
              <Link
                href="/admin/kesetiaan"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Detail Kesetiaan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Helper note */}
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-950 flex items-start gap-1.5">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
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
                  {mockCohortMatrix.map((r) => (
                    <tr key={r.month} className="hover:bg-slate-50/80 transition">
                      <td className="text-left py-2 px-2 font-bold text-slate-800 whitespace-nowrap">{r.month}</td>
                      <td className="py-2 px-1 text-slate-500 font-medium">{r.count}</td>
                      {[r.m0, r.m1, r.m2, r.m3, r.m4, r.m5].map((val, idx) => (
                        <td key={idx} className="py-1 px-1">
                          <div className={`py-1 rounded font-medium ${getHeatmapColor(val)}`}>
                            {val !== null ? `${val}%` : '-'}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded bg-emerald-800" /> Tinggi (100%)
                <span className="w-2.5 h-2.5 rounded bg-emerald-600/70 ml-2" /> Sedang (50-75%)
                <span className="w-2.5 h-2.5 rounded bg-emerald-200/40 ml-2" /> Rendah (&lt;45%)
              </div>
              <span className="text-emerald-800 font-bold">Rata-rata Bulan ke-2: 73.0% Donor Kembali</span>
            </div>
          </div>
        </div>

        {/* BOX C: Markov Churn Transition Matrix */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card flex flex-col overflow-hidden">
          {/* MANDATORY SIMULATION BANNER — DO NOT REMOVE */}
          <DrmSimulationBanner />
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-800" />
                  Box C: Prediksi Perubahan Status Donatur
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Peluang (%) donatur berpindah antar status dalam 30 hari ke depan
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                Risiko: At-Risk → Pasif (30%)
              </span>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-start gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong>Cara Membaca:</strong> Baris = Status Saat Ini. Kolom = Prediksi Status Bulan Depan. Kotak merah <strong>(30%)</strong> artinya donatur &quot;At-Risk&quot; berisiko tinggi berubah menjadi &quot;Pasif/Lapsed&quot;.
              </span>
            </div>

            <div className="mt-3 overflow-x-auto -mx-2 px-2">
              <table className="w-full min-w-[500px] text-center text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] font-bold">
                    <th className="text-left py-2 px-1 text-slate-400">Dari \ Ke</th>
                    {mockChurnSegments.map((s) => (
                      <th key={s} className="py-2 px-1 font-bold text-slate-700">{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {mockChurnSegments.map((fromSeg, rIdx) => (
                    <tr key={fromSeg}>
                      <td className="text-left py-2 px-1 font-bold text-slate-800 text-[11px] whitespace-nowrap bg-slate-50/50">
                        {fromSeg}
                      </td>
                      {mockChurnPredictions.markovMatrix[rIdx].map((val, cIdx) => (
                        <td key={`${rIdx}-${cIdx}`} className="p-1">
                          <div className={`py-1.5 px-1 rounded transition text-[11px] ${getMarkovCellColor(rIdx, cIdx, val)}`}>
                            {val.toFixed(1)}%
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">
                Kestabilan Tertinggi: <strong className="text-slate-800">Kelompok Pasif Stay Lapsed (84.2%)</strong>
              </span>
              <span className="text-rose-600 font-bold">Perlu Sapaan Ulang</span>
            </div>
          </div>
        </div>

        {/* BOX D: Action Hub — Early Warning & Strategic Recommendations */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card flex flex-col overflow-hidden">
          {/* MANDATORY SIMULATION BANNER — PALING KRITIS DI BOX D — DO NOT REMOVE */}
          <DrmSimulationBanner />
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Box D: Peringatan Otomatis &amp; Saran Tindakan
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Deteksi dini donatur yang mulai pasif beserta solusi praktis
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                {mockChurnPredictions.actionAlerts.length} Peringatan
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {/* Alert 1: HIGH */}
              <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white uppercase">
                      RISIKO TINGGI
                    </span>
                    <span className="font-bold text-rose-950">{mockChurnPredictions.actionAlerts[0].label}</span>
                  </div>
                  <p className="text-[11px] text-rose-800 leading-snug">
                    {mockChurnPredictions.actionAlerts[0].description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedActionAlert({
                        title: 'Kirim Pesan Sapaan Retensi',
                        segment: `At-Risk (${mockChurnPredictions.actionAlerts[0].count})`,
                        description: mockChurnPredictions.actionAlerts[0].description,
                        count: mockChurnPredictions.actionAlerts[0].count,
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer"
                  >
                    Kirim Pesan Sapaan
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedActionAlert({
                        title: 'Instruksi Khusus ke Nazhir Pengelola',
                        segment: 'At-Risk & Pasif',
                        description: 'Teruskan daftar donatur prioritas tinggi ke tim Relationship Manager Yayasan/Nadzir untuk follow up personal.',
                        count: mockChurnPredictions.actionAlerts[0].count,
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-white text-rose-800 font-semibold text-[11px] border border-rose-300 hover:bg-rose-100 transition cursor-pointer"
                  >
                    Kontak Pengelola
                  </button>
                </div>
              </div>

              {/* Alert 2: MEDIUM */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-white uppercase">
                      RISIKO SEDANG
                    </span>
                    <span className="font-bold text-amber-950">{mockChurnPredictions.actionAlerts[1].label}</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    {mockChurnPredictions.actionAlerts[1].description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedActionAlert({
                        title: 'Aktivasi Penawaran Autodebet Syariah',
                        segment: `Loyal (${mockChurnPredictions.actionAlerts[1].count})`,
                        description: 'Kirimkan rekomendasi pengaturan transfer berkala otomatis (BSI Debit Rutin / QRIS Subscription) untuk mempermudah wakaf rutin.',
                        count: mockChurnPredictions.actionAlerts[1].count,
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer"
                  >
                    Tawarkan Autodebet
                  </button>
                </div>
              </div>

              {/* Strategy Chips */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-700 block mb-2">
                  Panduan Strategi Per Kelompok Donatur:
                </span>
                <div className="flex flex-wrap gap-2">
                  {mockChurnPredictions.strategyChips.map((chip) => (
                    <div
                      key={chip.segment}
                      className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 ${chip.colorClass}`}
                    >
                      <span className="font-bold">{chip.segment}:</span>
                      <span>{chip.strategy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">
                Estimasi Potensi Donasi Terselamatkan: <strong className="text-emerald-800">Rp 420 Juta / bulan</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Action Alert Modal */}
      {selectedActionAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl space-y-4 border border-slate-200 overflow-hidden">
            {/* Banner Wajib di dalam modal juga */}
            <DrmSimulationBanner />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{selectedActionAlert.title}</h3>
                    <p className="text-xs text-slate-500">
                      Target Segmen: <strong className="text-slate-800">{selectedActionAlert.segment}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedActionAlert(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Deskripsi &amp; Tujuan:</span>
                  <p className="text-slate-800 mt-0.5 leading-relaxed">{selectedActionAlert.description}</p>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-600 font-medium">Estimasi Penerima Kampanye:</span>
                  <span className="font-bold text-emerald-900 font-mono">{selectedActionAlert.count}</span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 space-y-1">
                  <div className="font-bold text-[11px]">⚠ Template ini berbasis data simulasi. Verifikasi ke data aktual sebelum dieksekusi.</div>
                  <p className="text-[11px] text-amber-900 italic leading-relaxed">
                    &quot;Assalamu&apos;alaikum Bapak/Ibu Donatur, semoga senantiasa diberkahi. Kami ingin menyampaikan kabar gembira terkait amanah wakaf Anda pada program Klinik Al-Azhar yang saat ini progresnya telah mencapai 65%...&quot;
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedActionAlert(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Navigation Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <Link
          href="/admin/approvals"
          className="bg-white p-4 rounded-2xl border border-gray-200 shadow-card hover:border-emerald-300 hover:shadow-card-hover transition-all flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#1B5E20] transition-colors">
              Pusat Persetujuan
            </h3>
            <p className="text-[11px] text-gray-400">Verifikasi berkas & termin</p>
          </div>
        </Link>

        <Link
          href="/admin/nadzir-verifikasi"
          className="bg-white p-4 rounded-2xl border border-gray-200 shadow-card hover:border-emerald-300 hover:shadow-card-hover transition-all flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
              Verifikasi Nadzir BWI
            </h3>
            <p className="text-[11px] text-gray-400">Audit legalitas lembaga</p>
          </div>
        </Link>

        <Link
          href="/admin/transparansi"
          className="bg-white p-4 rounded-2xl border border-gray-200 shadow-card hover:border-emerald-300 hover:shadow-card-hover transition-all flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1B5E20] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#1B5E20] transition-colors">
              Log Transparansi
            </h3>
            <p className="text-[11px] text-gray-400">Audit rekam transaksi</p>
          </div>
        </Link>

        <Link
          href="/admin/pengaturan"
          className="bg-white p-4 rounded-2xl border border-gray-200 shadow-card hover:border-emerald-300 hover:shadow-card-hover transition-all flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 group-hover:text-slate-900 transition-colors">
              Pengaturan Sistem
            </h3>
            <p className="text-[11px] text-gray-400">Rekening & parameter</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
