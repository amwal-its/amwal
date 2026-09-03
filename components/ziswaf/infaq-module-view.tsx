'use client';

import React, { useState } from 'react';
import {
  HeartHandshake,
  TrendingUp,
  Plus,
  QrCode,
  Download,
  Search,
  Layers,
  Printer,
  FileSpreadsheet,
  Coins,
  Users,
  Building,
  Check,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { InfaqProgram, InfaqTransaction } from '@/types/ziswaf';
import { useToast } from '@/components/ui/toast';
import { ZiswafModals } from './ziswaf-modals';
import { DrmSimulationBanner } from '@/components/admin/drm-simulation-banner';

const defaultInfaqPrograms: InfaqProgram[] = [
  { id: 'INF-001', name: 'Gerakan Sedekah Subuh Berkah', category: 'Infaq Subuh', target: 200000000, collected: 178500000, status: 'Aktif' },
  { id: 'INF-002', name: 'Infaq Nutrisi & Beasiswa Santri Penghafal Al-Qur\'an', category: 'Infaq Yatim & Dhuafa', target: 350000000, collected: 310000000, status: 'Aktif' },
  { id: 'INF-003', name: 'Sedekah Jariyah Pengadaan Karpet & Sound System Masjid', category: 'Infaq Masjid & Sarana', target: 120000000, collected: 95000000, status: 'Aktif' },
  { id: 'INF-004', name: 'Infaq Siaga Bencana & Dapur Umum Darurat', category: 'Infaq Tanggap Bencana', target: 0, collected: 215000000, status: 'Aktif' },
  { id: 'INF-005', name: 'Sedekah Air Bersih & Sumur Bor Pelosok', category: 'Sedekah Jariyah', target: 150000000, collected: 150000000, status: 'Selesai' },
];

const defaultInfaqTransactions: InfaqTransaction[] = [
  { id: 'TX-INF-1092', donorName: 'Hamba Allah', amount: 100000, date: 'Hari ini, 05:14 WIB', program: 'Gerakan Sedekah Subuh Berkah', method: 'QRIS Syariah (BSI)', status: 'Berhasil' },
  { id: 'TX-INF-1091', donorName: 'dr. Farah Annisa', amount: 500000, date: 'Hari ini, 05:02 WIB', program: 'Infaq Nutrisi & Beasiswa Santri', method: 'BSI Virtual Account', status: 'Berhasil' },
  { id: 'TX-INF-1090', donorName: 'Keluarga Bpk. H. Mulyadi', amount: 2500000, date: 'Kemarin, 19:40 WIB', program: 'Sedekah Jariyah Pengadaan Karpet', method: 'Transfer Bank Muamalat', status: 'Berhasil' },
  { id: 'TX-INF-1089', donorName: 'Kotak Infaq Masjid Al-Ikhlas', amount: 3450000, date: 'Kemarin, 13:10 WIB', program: 'Gerakan Sedekah Subuh Berkah', method: 'Kasir Tunai / Kotak Infaq', status: 'Berhasil' },
  { id: 'TX-INF-1088', donorName: 'Ibu Ratna Dewi', amount: 250000, date: '21 Agt 2026', program: 'Infaq Siaga Bencana & Dapur Umum', method: 'QRIS Syariah (BSI)', status: 'Berhasil' },
];

export function InfaqModuleView() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'transactions' | 'payment_methods' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedMethodFilter, setSelectedMethodFilter] = useState('all');

  // Infaq State
  const [programs, setPrograms] = useState<InfaqProgram[]>(defaultInfaqPrograms);
  const [transactions, setTransactions] = useState<InfaqTransaction[]>(defaultInfaqTransactions);

  // Modals state
  const [isCreateInfaqOpen, setIsCreateInfaqOpen] = useState(false);
  const [infaqFormName, setInfaqFormName] = useState('');
  const [infaqFormCategory, setInfaqFormCategory] = useState('Infaq Subuh');
  const [infaqFormTarget, setInfaqFormTarget] = useState('');
  const [infaqFormNoTarget, setInfaqFormNoTarget] = useState(false);
  const [infaqFormDesc, setInfaqFormDesc] = useState('');

  const [isManualInfaqOpen, setIsManualInfaqOpen] = useState(false);
  const [infaqManualDonor, setInfaqManualDonor] = useState('');
  const [infaqManualAmount, setInfaqManualAmount] = useState('');
  const [infaqManualProgram, setInfaqManualProgram] = useState(programs[0]?.name || 'Gerakan Sedekah Subuh Berkah');
  const [infaqManualMethod, setInfaqManualMethod] = useState('Kasir Tunai / Kotak Infaq');

  const [isQrisGeneratorOpen, setIsQrisGeneratorOpen] = useState(false);
  const [qrisGenAmount, setQrisGenAmount] = useState('50000');
  const [qrisGenNote, setQrisGenNote] = useState('Infaq Subuh Berkah');

  const infaqWeeklyTrend = [
    { day: 'Sen', amount: 14200000 },
    { day: 'Sel', amount: 18500000 },
    { day: 'Rab', amount: 16900000 },
    { day: 'Kam', amount: 22400000 },
    { day: 'Jum (Subuh)', amount: 68500000 },
    { day: 'Sab', amount: 31200000 },
    { day: 'Ahd', amount: 28900000 },
  ];

  const totalCollected = 1250000000;
  const totalDisbursed = 980000000;
  const operationalAmil = 156250000;
  const cashBalance = totalCollected - operationalAmil - totalDisbursed; // 113.750.000

  const filteredTransactions = transactions.filter((tx) => {
    const matchSearch =
      tx.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMethod = selectedMethodFilter === 'all' || tx.method.toLowerCase().includes(selectedMethodFilter.toLowerCase());
    return matchSearch && matchMethod;
  });

  const filteredPrograms = programs.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategoryFilter === 'all' || p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchSearch && matchCat;
  });

  const handleCreateInfaqSubmit = () => {
    if (!infaqFormName) {
      showToast({
        title: 'Form Belum Lengkap',
        description: 'Mohon isi nama program infaq.',
        type: 'error',
      });
      return;
    }

    const newProg: InfaqProgram = {
      id: `INF-00${programs.length + 1}`,
      name: infaqFormName,
      category: infaqFormCategory,
      target: infaqFormNoTarget ? 0 : Number(infaqFormTarget) || 50000000,
      collected: 0,
      status: 'Aktif',
    };

    setPrograms([newProg, ...programs]);
    setIsCreateInfaqOpen(false);
    setInfaqFormName('');
    setInfaqFormTarget('');
    setInfaqFormDesc('');
    showToast({
      title: 'Program Infaq Diterbitkan',
      description: `Program "${newProg.name}" berhasil diaktifkan.`,
      type: 'success',
    });
  };

  const handleManualInfaqSubmit = () => {
    if (!infaqManualDonor || !infaqManualAmount) {
      showToast({
        title: 'Form Belum Lengkap',
        description: 'Mohon isi nama donatur dan nominal donasi.',
        type: 'error',
      });
      return;
    }

    const amount = Number(infaqManualAmount) || 0;
    const newTx: InfaqTransaction = {
      id: `TX-INF-${1090 + transactions.length + 1}`,
      donorName: infaqManualDonor,
      amount: amount,
      date: 'Hari ini, Baru saja',
      program: infaqManualProgram,
      method: infaqManualMethod,
      status: 'Berhasil',
    };

    setTransactions([newTx, ...transactions]);

    // Update target program collected amount
    setPrograms((prev) =>
      prev.map((p) => (p.name === infaqManualProgram ? { ...p, collected: p.collected + amount } : p))
    );

    setIsManualInfaqOpen(false);
    setInfaqManualDonor('');
    setInfaqManualAmount('');
    showToast({
      title: 'Donasi Infaq Berhasil Dicatat',
      description: `Penerimaan Rp ${amount.toLocaleString('id-ID')} dari ${newTx.donorName} tercatat di buku kas.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 font-jakarta pb-12">
      {/* Simulation Banner */}
      <DrmSimulationBanner
        title="Modul Penerimaan & Rekonsiliasi Infaq / Sedekah (Data Simulasi Amil)"
        description="Monitoring penerimaan infaq subuh realtime, settlement QRIS BSI otomatis, katalog program tematik, dan neraca buku kas PSAK."
      />

      {/* Sub-Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs">
        <div className="flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Ringkasan &amp; Metrik
            </button>
            <button
              onClick={() => setActiveTab('programs')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'programs'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Akad &amp; Program Infaq
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${activeTab === 'programs' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {programs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Transaksi Donatur
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${activeTab === 'transactions' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {transactions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('payment_methods')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'payment_methods'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              Kanal Bayar &amp; QRIS
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Laporan Rekapitulasi
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsManualInfaqOpen(true)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#1B5E20] border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Catat Infaq Masuk
            </button>
            <button
              onClick={() => setIsQrisGeneratorOpen(true)}
              className="px-3 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              QRIS Dinamis
            </button>
          </div>
        </div>
      </div>

      {/* 1. OVERVIEW / RINGKASAN */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Total Infaq Terhimpun</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-[#1B5E20]">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                Rp {totalCollected.toLocaleString('id-ID')}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">+18.4%</span>
                <span>dibandingkan bulan lalu</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Penyaluran Realtime</span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-800">
                  <HeartHandshake className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                Rp {totalDisbursed.toLocaleString('id-ID')}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                <span className="text-blue-700 font-bold">78.4%</span>
                <span>rasio tersalurkan dari dana terhimpun</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Saldo Kas Siaga Infaq</span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-800">
                  <Coins className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-900 font-mono tracking-tight">
                Rp {cashBalance.toLocaleString('id-ID')}
              </div>
              <div className="mt-2 text-[11px] text-slate-500 font-semibold">
                Siap didistribusikan untuk program tematik
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Total Donatur / Munfiq</span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-800">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                3.120 Munfiq
              </div>
              <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
                82% Donatur Rutin Gerakan Subuh Berkah
              </div>
            </div>
          </div>

          {/* Cashflow & Financial Balance Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Arus Kas &amp; Distribusi Penyaluran Infaq</h3>
                <p className="text-xs text-slate-500">
                  Perbandingan penerimaan bruto, hak amil sesuai syariah (maks 12.5%), realisasi program, dan sisa kas operasional.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-bold border border-emerald-200">
                Status Kas: Likuid &amp; Teraudit
              </span>
            </div>

            {/* Visual Progress Ratio */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Alokasi Dana Terhimpun</span>
                <span className="font-mono">Rp 1.250.000.000 (100%)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: '78.4%' }} className="bg-[#1B5E20] h-full" title="Penyaluran Mustahik (78.4%)" />
                <div style={{ width: '12.5%' }} className="bg-amber-500 h-full" title="Hak Amil Operasional (12.5%)" />
                <div style={{ width: '9.1%' }} className="bg-teal-400 h-full" title="Saldo Kas Siaga (9.1%)" />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#1B5E20]" />
                  <span>Penyaluran Program: <strong>Rp 980.000.000 (78.4%)</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Hak Amil Operasional: <strong>Rp 156.250.000 (12.5%)</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-teal-400" />
                  <span>Sisa Saldo Kas: <strong>Rp 113.750.000 (9.1%)</strong></span>
                </div>
              </div>
            </div>

            {/* Weekly Infaq Trend Chart */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Grafik Pola Penerimaan Infaq Mingguan</h4>
                  <p className="text-[11px] text-slate-500">Lonjakan penerimaan terjadi secara konsisten setiap hari Jumat (Infaq Subuh)</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#1B5E20] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Puncak: Jumat Subuh (Rp 68.5 Jt)
                </span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={infaqWeeklyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `Rp${(v / 1000000).toFixed(0)}Jt`} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(val: any) => `Rp ${Number(val).toLocaleString('id-ID')}`} />
                    <Area type="monotone" dataKey="amount" name="Infaq Harian" stroke="#1B5E20" fill="#1B5E20" fillOpacity={0.18} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROGRAM & AKAD INFAQ */}
      {activeTab === 'programs' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Katalog Program Akad &amp; Penyaluran Infaq</h3>
              <p className="text-xs text-slate-500">Kelola kuota, peruntukan dana, dan target capaian program</p>
            </div>
            <button
              onClick={() => setIsCreateInfaqOpen(true)}
              className="px-3.5 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Buat Program Infaq Baru
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari program infaq berdasarkan nama atau ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
              />
            </div>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">Semua Kategori Akad</option>
              <option value="Infaq Subuh">Infaq Subuh</option>
              <option value="Infaq Yatim & Dhuafa">Infaq Yatim &amp; Dhuafa</option>
              <option value="Sedekah Jariyah">Sedekah Jariyah</option>
              <option value="Infaq Masjid & Sarana">Infaq Masjid &amp; Sarana</option>
              <option value="Infaq Tanggap Bencana">Infaq Tanggap Bencana</option>
            </select>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredPrograms.map((prog) => {
              const isNoTarget = !prog.target || prog.target === 0;
              const percent = isNoTarget ? 100 : Math.min(100, Math.round((prog.collected / prog.target) * 100));
              return (
                <div key={prog.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#1B5E20] font-bold">
                      {prog.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isNoTarget && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold border border-teal-200">
                          Tanpa Target
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{prog.id}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prog.name}</h4>
                    <div className="flex items-center justify-between text-xs font-mono mt-2">
                      <span className="text-slate-500">Terkumpul: <strong>Rp {prog.collected.toLocaleString('id-ID')}</strong></span>
                      <span className="text-slate-700 font-bold">
                        {isNoTarget ? (
                          <span className="text-teal-700 font-sans font-bold">Terbuka / Berkelanjutan</span>
                        ) : (
                          `Target: Rp ${prog.target.toLocaleString('id-ID')}`
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full rounded-full ${isNoTarget ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600' : 'bg-[#1B5E20]'}`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                      <span>{isNoTarget ? '♾️ Program Terbuka Berkelanjutan' : `${percent}% tercapai`}</span>
                      <span>Status: {prog.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TRANSAKSI DONATUR */}
      {activeTab === 'transactions' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daftar Transaksi Infaq &amp; Sedekah Masuk</h3>
              <p className="text-xs text-slate-500">Monitoring realtime penerimaan dari seluruh kanal digital &amp; kasir tunai</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsManualInfaqOpen(true)}
                className="px-3 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Input Donasi Manual
              </button>
              <button
                onClick={() => {
                  showToast({
                    title: 'Ekspor Data Infaq',
                    description: 'Mengunduh laporan transaksi infaq format CSV...',
                    type: 'success',
                  });
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Table Filters */}
          <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama donatur, ID donasi, atau program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              />
            </div>
            <select
              value={selectedMethodFilter}
              onChange={(e) => setSelectedMethodFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">Semua Metode Pembayaran</option>
              <option value="QRIS">QRIS Syariah</option>
              <option value="BSI">BSI Virtual Account</option>
              <option value="Tunai">Kasir Tunai</option>
              <option value="Muamalat">Bank Muamalat</option>
            </select>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ID Transaksi</th>
                  <th className="py-3 px-4">Nama Donatur</th>
                  <th className="py-3 px-4">Program Akad</th>
                  <th className="py-3 px-4">Metode Bayar</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Nominal</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-[11px]">{tx.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{tx.donorName}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{tx.program}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {tx.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{tx.date}</td>
                    <td className="py-3 px-4 font-bold text-emerald-900 font-mono">
                      Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. KANAL BAYAR & QRIS */}
      {activeTab === 'payment_methods' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#1B5E20]" />
                <h3 className="text-sm font-bold text-slate-900">QRIS Dinamis &amp; Statis Masjid</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Standar BI / ASPI
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              QRIS resmi Lembaga Amil ZISWAF terhubung langsung ke settlement rekening penampungan BSI.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs font-mono text-slate-700">
              <div className="flex justify-between">
                <span>NMID:</span>
                <strong>ID1020039281920</strong>
              </div>
              <div className="flex justify-between">
                <span>Merchant Name:</span>
                <strong>ZISWAF AMWAL NUSANTARA</strong>
              </div>
            </div>
            <button
              onClick={() => setIsQrisGeneratorOpen(true)}
              className="w-full py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              Buka Generator QRIS Dinamis
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">Rekening Giro &amp; Virtual Account</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                Bank Syariah
              </span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Bank Syariah Indonesia (BSI)</div>
                  <div className="text-slate-500 text-[11px]">711-229-8801 • a.n Infaq Operasional</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">Aktif</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Bank Muamalat Indonesia</div>
                  <div className="text-slate-500 text-[11px]">301-008-9912 • a.n Sedekah Subuh</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">Aktif</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. LAPORAN REKAPITULASI */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Laporan Rekapitulasi &amp; Pertanggungjawaban Infaq</h3>
              <p className="text-xs text-slate-500">Standar Transparansi Pengelolaan Dana Sosial Keagamaan Lainnya (Buku Kas &amp; Neraca)</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  showToast({
                    title: 'Buku Kas Siap Cetak',
                    description: 'Membuka format cetak A4 Laporan Arus Kas Infaq & Sedekah.',
                    type: 'info',
                  });
                }}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#1B5E20] border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Buku Kas A4
              </button>
              <button
                onClick={() => {
                  showToast({
                    title: 'Ekspor Laporan Resmi',
                    description: 'Mengunduh rekapitulasi PSAK & BAZNAS format PDF...',
                    type: 'success',
                  });
                }}
                className="px-3.5 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Laporan Lengkap
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Periode Pelaporan:</span>
              <strong className="text-slate-900 text-sm">Tahun Buku 2026 (Semester 1)</strong>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Status Audit DPS:</span>
              <strong className="text-emerald-800 text-sm flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-600" /> Sesuai Fatwa DSN-MUI
              </strong>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Penerima Manfaat Infaq:</span>
              <strong className="text-slate-900 text-sm">8.420 Jiwa Mustahik</strong>
            </div>
          </div>

          {/* Detailed Ledger Preview */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Ringkasan Posisi Kas &amp; Bank Infaq (Real-Time)</h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-700">
                <span>Total Penerimaan Terkumpul:</span>
                <strong className="text-emerald-900 font-bold">Rp {totalCollected.toLocaleString('id-ID')}</strong>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Penyaluran Program &amp; Bantuan Mustahik:</span>
                <strong className="text-rose-700 font-bold">- Rp {totalDisbursed.toLocaleString('id-ID')}</strong>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Hak Amil / Biaya Operasional (12.5%):</span>
                <strong className="text-rose-700 font-bold">- Rp {operationalAmil.toLocaleString('id-ID')}</strong>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold border-t pt-2 bg-emerald-100/60 p-2 rounded-lg">
                <span>SISA SALDO KAS INFAQ SIAGA:</span>
                <span className="text-[#1B5E20]">Rp {cashBalance.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Modals */}
      <ZiswafModals
        selectedBszMuzakki={null}
        onCloseBsz={() => {}}
        selectedQurbanCert={null}
        onCloseQurbanCert={() => {}}
        isQrisGeneratorOpen={isQrisGeneratorOpen}
        onCloseQris={() => setIsQrisGeneratorOpen(false)}
        qrisGenAmount={qrisGenAmount}
        setQrisGenAmount={setQrisGenAmount}
        qrisGenNote={qrisGenNote}
        setQrisGenNote={setQrisGenNote}
        isCreateInfaqOpen={isCreateInfaqOpen}
        onCloseCreateInfaq={() => setIsCreateInfaqOpen(false)}
        infaqFormName={infaqFormName}
        setInfaqFormName={setInfaqFormName}
        infaqFormCategory={infaqFormCategory}
        setInfaqFormCategory={setInfaqFormCategory}
        infaqFormTarget={infaqFormTarget}
        setInfaqFormTarget={setInfaqFormTarget}
        infaqFormNoTarget={infaqFormNoTarget}
        setInfaqFormNoTarget={setInfaqFormNoTarget}
        infaqFormDesc={infaqFormDesc}
        setInfaqFormDesc={setInfaqFormDesc}
        onSubmitCreateInfaq={handleCreateInfaqSubmit}
        isManualInfaqOpen={isManualInfaqOpen}
        onCloseManualInfaq={() => setIsManualInfaqOpen(false)}
        infaqManualDonor={infaqManualDonor}
        setInfaqManualDonor={setInfaqManualDonor}
        infaqManualAmount={infaqManualAmount}
        setInfaqManualAmount={setInfaqManualAmount}
        infaqManualProgram={infaqManualProgram}
        setInfaqManualProgram={setInfaqManualProgram}
        infaqManualMethod={infaqManualMethod}
        setInfaqManualMethod={setInfaqManualMethod}
        infaqPrograms={programs}
        onSubmitManualInfaq={handleManualInfaqSubmit}
        isRecordZakatOpen={false}
        onCloseRecordZakat={() => {}}
        zakatMuzakkiName=""
        setZakatMuzakkiName={() => {}}
        zakatMuzakkiPhone=""
        setZakatMuzakkiPhone={() => {}}
        zakatMuzakkiNpwp=""
        setZakatMuzakkiNpwp={() => {}}
        zakatTypeSelected="Zakat Maal - Penghasilan"
        setZakatTypeSelected={() => {}}
        zakatNominalInput=""
        setZakatNominalInput={() => {}}
        zakatCalcNote=""
        setZakatCalcNote={() => {}}
        onSubmitRecordZakat={() => {}}
        isDistributeAsnafOpen={false}
        onCloseDistributeAsnaf={() => {}}
        selectedAsnafTarget="Fakir"
        setSelectedAsnafTarget={() => {}}
        distributeNominal=""
        setDistributeNominal={() => {}}
        distributeBeneficiaryCount=""
        setDistributeBeneficiaryCount={() => {}}
        distributeNotes=""
        setDistributeNotes={() => {}}
        onSubmitDistributeAsnaf={() => {}}
        isAddShohibulOpen={false}
        onCloseAddShohibul={() => {}}
        shohibulBuyerName=""
        setShohibulBuyerName={() => {}}
        shohibulQurbanName=""
        setShohibulQurbanName={() => {}}
        shohibulAnimalChoice="Slot 1/7 Sapi (Sapi 02)"
        setShohibulAnimalChoice={() => {}}
        shohibulDistOption="Disalurkan 100% (Pelosok 3T)"
        setShohibulDistOption={() => {}}
        onSubmitAddShohibul={() => {}}
        selectedRphStream={null}
        onCloseRphStream={() => {}}
        selectedShohibulReport={null}
        onCloseShohibulReport={() => {}}
        onShowToast={showToast}
      />
    </div>
  );
}
