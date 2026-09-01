'use client';

import React, { useState } from 'react';
import {
  Coins,
  TrendingUp,
  Scale,
  Award,
  Plus,
  Send,
  Download,
  Search,
  Users,
  Check,
  RefreshCw,
  Printer,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
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
import { ZakatTransaction, AsnafDistribution } from '@/types/ziswaf';
import { useToast } from '@/components/ui/toast';
import { ZiswafModals } from './ziswaf-modals';
import { DrmSimulationBanner } from '@/components/admin/drm-simulation-banner';

const defaultZakatTransactions: ZakatTransaction[] = [
  {
    id: 'TX-ZKT-001',
    muzakkiName: 'H. Bambang Soedirman',
    phone: '081298765432',
    type: 'Zakat Maal - Penghasilan',
    calculation: 'Penghasilan Bruto Rp 35.000.000 x 2.5%',
    amount: 875000,
    souls: 1,
    date: '22 Agt 2026',
    status: 'Terverifikasi DPS',
    bszNumber: 'BSZ/AMW/2026/08/00142',
  },
  {
    id: 'TX-ZKT-002',
    muzakkiName: 'Hj. Siti Aminah Marwah',
    phone: '081387654321',
    type: 'Zakat Maal - Emas/Tabungan',
    calculation: 'Simpanan Emas 120g x Rp 1.450.000 x 2.5%',
    amount: 4350000,
    souls: 1,
    date: '21 Agt 2026',
    status: 'Terverifikasi DPS',
    bszNumber: 'BSZ/AMW/2026/08/00143',
  },
  {
    id: 'TX-ZKT-003',
    muzakkiName: 'Keluarga Ir. Hendra Gunawan',
    phone: '081123456789',
    type: 'Zakat Fitrah',
    calculation: '5 Jiwa x Rp 45.000 (Setara 2.5kg Beras Premium)',
    amount: 225000,
    souls: 5,
    date: '20 Agt 2026',
    status: 'Terverifikasi DPS',
    bszNumber: 'BSZ/AMW/2026/08/00144',
  },
  {
    id: 'TX-ZKT-004',
    muzakkiName: 'PT Berkah Logistik Syariah',
    phone: '0217890123',
    type: 'Zakat Maal - Perdagangan',
    calculation: 'Aktiva Lancar - Kewajiban Jangka Pendek x 2.5%',
    amount: 28500000,
    souls: 1,
    date: '19 Agt 2026',
    status: 'Terverifikasi DPS',
    bszNumber: 'BSZ/AMW/2026/08/00145',
  },
];

const defaultAsnafList: AsnafDistribution[] = [
  { asnaf: 'Fakir', allocationPercent: 25, distributedAmount: 620000000, recipients: 410, desc: 'Bantuan pangan pokok bulanan & santunan hidup lansia terlantar' },
  { asnaf: 'Miskin', allocationPercent: 25, distributedAmount: 620000000, recipients: 380, desc: 'Modal usaha mikro bergulir & beasiswa anak sekolah dhuafa' },
  { asnaf: 'Amil', allocationPercent: 12.5, distributedAmount: 310000000, recipients: 45, desc: 'Operasional amil, verifikasi mustahik, & sistem digital ZISWAF' },
  { asnaf: 'Muallaf', allocationPercent: 7.5, distributedAmount: 185000000, recipients: 80, desc: 'Pembinaan aqidah, paket ibadah, & penguatan kemandirian ekonomi' },
  { asnaf: 'Riqab', allocationPercent: 5, distributedAmount: 125000000, recipients: 30, desc: 'Advokasi buruh migran teraniaya & pembebasan jerat rentenir' },
  { asnaf: 'Gharimin', allocationPercent: 10, distributedAmount: 250000000, recipients: 95, desc: 'Pelunasan hutang biaya medis darurat & musibah keluarga' },
  { asnaf: 'Fisabilillah', allocationPercent: 10, distributedAmount: 250000000, recipients: 210, desc: 'Honor Dai pedalaman 3T, operasional TPQ, & kader dakwah' },
  { asnaf: 'Ibnu Sabil', allocationPercent: 5, distributedAmount: 120000000, recipients: 35, desc: 'Bantuan bekal musafir kehabisan ongkos & santri perantau' },
];

export function ZakatModuleView() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'parameters' | 'distribution' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [goldLastUpdated, setGoldLastUpdated] = useState('22 Agt 2026, 08:30 WIB');
  const [isSyncingGold, setIsSyncingGold] = useState(false);
  const [showPsakModal, setShowPsakModal] = useState(false);

  // Zakat State
  const [zakatTransactions, setZakatTransactions] = useState<ZakatTransaction[]>(defaultZakatTransactions);
  const [asnafList, setAsnafList] = useState<AsnafDistribution[]>(defaultAsnafList);
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(1450000);
  const [zakatFitrahRiceKg, setZakatFitrahRiceKg] = useState<number>(2.5);
  const [zakatFitrahPricePerSoul, setZakatFitrahPricePerSoul] = useState<number>(45000);
  const zakatMaalPercentage = 2.5;

  // Modal States
  const [selectedBszMuzakki, setSelectedBszMuzakki] = useState<ZakatTransaction | null>(null);
  const [isRecordZakatOpen, setIsRecordZakatOpen] = useState(false);
  const [zakatMuzakkiName, setZakatMuzakkiName] = useState('');
  const [zakatMuzakkiPhone, setZakatMuzakkiPhone] = useState('');
  const [zakatMuzakkiNpwp, setZakatMuzakkiNpwp] = useState('');
  const [zakatTypeSelected, setZakatTypeSelected] = useState('Zakat Maal - Penghasilan');
  const [zakatNominalInput, setZakatNominalInput] = useState('');
  const [zakatCalcNote, setZakatCalcNote] = useState('');

  const [isDistributeAsnafOpen, setIsDistributeAsnafOpen] = useState(false);
  const [selectedAsnafTarget, setSelectedAsnafTarget] = useState('Fakir');
  const [distributeNominal, setDistributeNominal] = useState('');
  const [distributeBeneficiaryCount, setDistributeBeneficiaryCount] = useState('');
  const [distributeNotes, setDistributeNotes] = useState('');

  const zakatTrendData = [
    { month: 'Jan', fitrah: 12000000, maal: 145000000 },
    { month: 'Feb', fitrah: 18000000, maal: 160000000 },
    { month: 'Mar (Ramadan)', fitrah: 640000000, maal: 720000000 },
    { month: 'Apr (Syawal)', fitrah: 150000000, maal: 210000000 },
    { month: 'Mei', fitrah: 0, maal: 195000000 },
    { month: 'Jun', fitrah: 0, maal: 230000000 },
  ];

  const nisabYearly = goldPricePerGram * 85;
  const nisabMonthly = Math.round(nisabYearly / 12);

  const filteredTransactions = zakatTransactions.filter((tx) => {
    const matchSearch =
      tx.muzakkiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.bszNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedTypeFilter === 'all' || tx.type.toLowerCase().includes(selectedTypeFilter.toLowerCase());
    return matchSearch && matchType;
  });

  const totalDistributedAsnaf = asnafList.reduce((acc, curr) => acc + curr.distributedAmount, 0);
  const amilAsnaf = asnafList.find((a) => a.asnaf.toLowerCase().includes('amil'));
  const amilPercent = amilAsnaf ? amilAsnaf.allocationPercent : 12.5;
  const isAmilExceeded = amilPercent > 12.5;

  const handleSyncGoldPrice = () => {
    setIsSyncingGold(true);
    setTimeout(() => {
      setGoldPricePerGram(1465000);
      setGoldLastUpdated('22 Agt 2026, 16:45 WIB (Antam / BAZNAS Sync)');
      setIsSyncingGold(false);
      showToast({
        title: 'Harga Emas BAZNAS Tersinkronisasi',
        description: 'Harga acuan emas diperbarui ke Rp 1.465.000/gram. Nisab tahunan: Rp 124.525.000.',
        type: 'success',
      });
    }, 800);
  };

  const handleRecordZakatSubmit = () => {
    if (!zakatMuzakkiName || !zakatNominalInput) {
      showToast({
        title: 'Form Belum Lengkap',
        description: 'Mohon isi nama muzakki dan nominal zakat.',
        type: 'error',
      });
      return;
    }

    const newTx: ZakatTransaction = {
      id: `TX-ZKT-00${zakatTransactions.length + 1}`,
      muzakkiName: zakatMuzakkiName,
      phone: zakatMuzakkiPhone || '0812XXXXXXXX',
      type: zakatTypeSelected,
      calculation: zakatCalcNote || 'Perhitungan Zakat Maal 2.5%',
      amount: Number(zakatNominalInput) || 0,
      souls: 1,
      date: 'Hari Ini',
      status: 'Terverifikasi DPS',
      bszNumber: `BSZ/AMW/2026/08/00${150 + zakatTransactions.length}`,
    };

    setZakatTransactions([newTx, ...zakatTransactions]);
    setIsRecordZakatOpen(false);
    setZakatMuzakkiName('');
    setZakatNominalInput('');
    setZakatCalcNote('');
    showToast({
      title: 'Zakat Berhasil Dicatat',
      description: `BSZ Resmi ${newTx.bszNumber} telah diterbitkan untuk ${newTx.muzakkiName}.`,
      type: 'success',
    });
  };

  const handleDistributeAsnafSubmit = () => {
    if (!distributeNominal) {
      showToast({
        title: 'Form Belum Lengkap',
        description: 'Mohon isi nominal penyaluran dana asnaf.',
        type: 'error',
      });
      return;
    }

    const amount = Number(distributeNominal) || 0;
    const count = Number(distributeBeneficiaryCount) || 10;

    setAsnafList((prev) =>
      prev.map((item) =>
        item.asnaf === selectedAsnafTarget
          ? {
              ...item,
              distributedAmount: item.distributedAmount + amount,
              recipients: item.recipients + count,
            }
          : item
      )
    );

    setIsDistributeAsnafOpen(false);
    setDistributeNominal('');
    setDistributeBeneficiaryCount('');
    setDistributeNotes('');
    showToast({
      title: 'Penyaluran Asnaf Dibukukan',
      description: `Dana Rp ${amount.toLocaleString('id-ID')} berhasil dialokasikan ke Asnaf ${selectedAsnafTarget}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 font-jakarta pb-12">
      {/* Simulation Banner */}
      <DrmSimulationBanner
        title="Modul Tata Kelola Zakat & 8 Asnaf (Data Simulasi Amil)"
        description="Perhitungan nisab emas realtime BAZNAS, penerbitan Bukti Setor Zakat (BSZ) sah fiskal PPh, dan guardrail kepatuhan 8 Asnaf At-Taubah 60."
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
              Ringkasan Zakat
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Transaksi Muzakki &amp; BSZ
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${activeTab === 'transactions' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {zakatTransactions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('parameters')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'parameters'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              Parameter Nisab BAZNAS
            </button>
            <button
              onClick={() => setActiveTab('distribution')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'distribution'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              Penyaluran 8 Asnaf
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
              Laporan PSAK 109
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDistributeAsnafOpen(true)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#1B5E20] border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              Penyaluran Asnaf
            </button>
            <button
              onClick={() => setIsRecordZakatOpen(true)}
              className="px-3 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
            >
              <Award className="w-3.5 h-3.5" />
              Catat Zakat &amp; Terbitkan BSZ
            </button>
          </div>
        </div>
      </div>

      {/* 1. OVERVIEW ZAKAT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Penghimpunan Zakat</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-[#1B5E20]">
                  <Coins className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                Rp 2.485.000.000
              </div>
              <div className="mt-2 text-[11px] text-slate-500 font-semibold">
                Fitrah: <strong className="text-teal-700 font-mono">Rp 820Jt</strong> • Maal: <strong className="text-emerald-800 font-mono">Rp 1.66M</strong>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Total BSZ Diterbitkan</span>
                <span className="p-2 rounded-xl bg-teal-50 text-teal-800">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                1.842 Lembar BSZ
              </div>
              <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> 100% Sah Pengurang Pajak PPh
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Penyaluran 8 Asnaf</span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-800">
                  <Send className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                Rp {totalDistributedAsnaf.toLocaleString('id-ID')}
              </div>
              <div className="mt-2 text-[11px] text-slate-500 font-semibold">
                Disalurkan langsung ke 8 golongan berhak
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Total Mustahik Terlayani</span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-800">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                1.285 Mustahik
              </div>
              <div className="mt-2 text-[11px] text-purple-800 font-semibold">
                Terdata lengkap dalam SK Penetapan
              </div>
            </div>
          </div>

          {/* Zakat Trend Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Grafik Tren Pembayaran Zakat (Fitrah vs Maal)</h3>
                <p className="text-xs text-slate-500">Pola musiman menunjukkan puncak pada bulan Ramadan &amp; Syawal</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <span className="w-3 h-3 rounded-full bg-[#1B5E20]" />
                  Zakat Maal
                </span>
                <span className="flex items-center gap-1.5 text-teal-800">
                  <span className="w-3 h-3 rounded-full bg-teal-400" />
                  Zakat Fitrah
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={zakatTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `Rp${(v / 1000000).toFixed(0)}Jt`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value: any) => `Rp ${Number(value).toLocaleString('id-ID')}`} />
                  <Area type="monotone" dataKey="maal" name="Zakat Maal" stroke="#1B5E20" fill="#1B5E20" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="fitrah" name="Zakat Fitrah" stroke="#00897B" fill="#00897B" fillOpacity={0.25} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 2. TRANSAKSI ZAKAT & BSZ */}
      {activeTab === 'transactions' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daftar Transaksi Zakat &amp; Bukti Setor Zakat (BSZ)</h3>
              <p className="text-xs text-slate-500">Standar Sah Pengurang Pajak Penghasilan (PPh) Sesuai UU No. 23/2011</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRecordZakatOpen(true)}
                className="px-3.5 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Catat Zakat &amp; Terbitkan BSZ
              </button>
            </div>
          </div>

          {/* Table Filters */}
          <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama muzakki, nomor BSZ, atau ID transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              />
            </div>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">Semua Kategori Zakat</option>
              <option value="Fitrah">Zakat Fitrah</option>
              <option value="Penghasilan">Zakat Penghasilan (Profesi)</option>
              <option value="Emas">Zakat Emas / Tabungan</option>
              <option value="Perdagangan">Zakat Perdagangan</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. BSZ &amp; ID</th>
                  <th className="py-3 px-4">Nama Muzakki</th>
                  <th className="py-3 px-4">Kategori Zakat</th>
                  <th className="py-3 px-4">Rincian Perhitungan</th>
                  <th className="py-3 px-4">Nominal Zakat</th>
                  <th className="py-3 px-4 text-center">Aksi / Cetak BSZ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 font-mono text-[11px]">{tx.bszNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{tx.id}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{tx.muzakkiName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs text-[11px]">{tx.calculation}</td>
                    <td className="py-3 px-4 font-bold text-emerald-900 font-mono">
                      Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedBszMuzakki(tx)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#1B5E20] border border-emerald-300 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition shadow-2xs"
                      >
                        <Award className="w-3 h-3 text-emerald-700" />
                        Cetak BSZ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PARAMETER & NISAB BAZNAS */}
      {activeTab === 'parameters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fitrah */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#1B5E20]" />
                Pengaturan Zakat Fitrah (Tahun Berjalan)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                SK BAZNAS RI
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Takaran Beras Standar (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={zakatFitrahRiceKg}
                  onChange={(e) => setZakatFitrahRiceKg(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
                <span className="text-[10px] text-slate-400">Standar MUI/BAZNAS: 2.5 kg atau 3.5 liter beras</span>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Konversi Nilai Uang per Jiwa (Rp)</label>
                <input
                  type="number"
                  value={zakatFitrahPricePerSoul}
                  onChange={(e) => setZakatFitrahPricePerSoul(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-950 font-mono"
                />
                <span className="text-[10px] text-slate-400">Setara harga beras premium Rp 18.000/kg di Jabodetabek</span>
              </div>
            </div>
            <button
              onClick={() => {
                showToast({
                  title: 'Tarif Zakat Fitrah Tersimpan',
                  description: `Konversi beras ${zakatFitrahRiceKg} kg (Rp ${zakatFitrahPricePerSoul.toLocaleString('id-ID')}/jiwa) aktif.`,
                  type: 'success',
                });
              }}
              className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Simpan Tarif Zakat Fitrah
            </button>
          </div>

          {/* Maal */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#1B5E20]" />
                Pengaturan Zakat Maal (Nisab &amp; Acuan Emas)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncGoldPrice}
                  disabled={isSyncingGold}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                  title="Tarik harga emas terbaru dari Antam / BAZNAS"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncingGold ? 'animate-spin text-amber-700' : ''}`} />
                  {isSyncingGold ? 'Menyinkronkan...' : 'Sinkron Harga Emas'}
                </button>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                  85 Gram Emas
                </span>
              </div>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Harga Acuan Emas Murni BAZNAS (per gram)</label>
                  <span className="text-[10px] text-slate-400 font-mono">Pembaruan: {goldLastUpdated}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400 font-mono">Rp</span>
                  <input
                    type="number"
                    value={goldPricePerGram}
                    onChange={(e) => {
                      setGoldPricePerGram(parseFloat(e.target.value) || 0);
                      setGoldLastUpdated('Manual disesuaikan amil');
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-emerald-950 focus:bg-white focus:border-[#1B5E20]"
                  />
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-emerald-950">
                  <span>Nisab Tahunan (85g Emas):</span>
                  <strong>Rp {nisabYearly.toLocaleString('id-ID')}</strong>
                </div>
                <div className="flex justify-between text-emerald-950">
                  <span>Nisab Bulanan (Profesi):</span>
                  <strong>Rp {nisabMonthly.toLocaleString('id-ID')} / bulan</strong>
                </div>
                <div className="flex justify-between text-emerald-950">
                  <span>Tarif Kewajiban Zakat:</span>
                  <strong>{zakatMaalPercentage}%</strong>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                showToast({
                  title: 'Acuan Nisab Emas Diperbarui',
                  description: `Harga acuan Rp ${goldPricePerGram.toLocaleString('id-ID')}/g. Nisab tahunan: Rp ${nisabYearly.toLocaleString('id-ID')}.`,
                  type: 'success',
                });
              }}
              className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Simpan Acuan Nisab Emas
            </button>
          </div>
        </div>
      )}

      {/* 4. PENYALURAN 8 ASNAF */}
      {activeTab === 'distribution' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Distribusi Penyaluran 8 Golongan Asnaf</h3>
              <p className="text-xs text-slate-500">Ketentuan Al-Qur&apos;an Surat At-Taubah ayat 60 &amp; Standar Fiqh BAZNAS</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                Total Tersalurkan: Rp {totalDistributedAsnaf.toLocaleString('id-ID')}
              </span>
              <button
                onClick={() => setIsDistributeAsnafOpen(true)}
                className="px-3.5 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Catat Penyaluran Asnaf
              </button>
            </div>
          </div>

          {/* Syariah Guardrail Alert */}
          {isAmilExceeded ? (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-3 text-rose-950 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Peringatan Kepatuhan Syariah (Fiqh Guardrail):</strong>
                Alokasi hak Amil Zakat terdeteksi {amilPercent}%, melebihi batas ketentuan maksimal syariah 1/8 bagian (12.5%). Harap sesuaikan proporsi penyaluran untuk fakir/miskin.
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Kepatuhan Syariah 8 Asnaf Terpenuhi: Hak Operasional Amil berada pada batas aman (<strong>{amilPercent}% ≤ 12.5%</strong>)</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full">Sesuai Fatwa MUI</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {asnafList.map((as) => (
              <div key={as.asnaf} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Asnaf {as.asnaf}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${as.asnaf.toLowerCase().includes('amil') ? 'bg-amber-100 text-amber-900' : 'bg-[#1B5E20] text-white'}`}>
                    {as.allocationPercent}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">{as.desc}</p>
                <div className="pt-2 border-t border-slate-200 text-xs font-mono">
                  <div className="font-bold text-emerald-900">Rp {as.distributedAmount.toLocaleString('id-ID')}</div>
                  <div className="text-[10px] text-slate-500">{as.recipients} Penerima Manfaat</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. LAPORAN PSAK 109 */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Laporan Resmi Penghimpunan &amp; Penyaluran Zakat</h3>
              <p className="text-xs text-slate-500">Standar Akuntansi Keuangan Entitas Pengelola Zakat (PSAK 109)</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPsakModal(true)}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#1B5E20] border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Pratinjau Neraca PSAK 109
              </button>
              <button
                onClick={() => {
                  showToast({
                    title: 'Ekspor Laporan BAZNAS',
                    description: 'Mengunduh laporan PSAK 109 resmi untuk audit dan pelaporan BAZNAS RI.',
                    type: 'success',
                  });
                }}
                className="px-3.5 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Export Laporan BAZNAS
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Kategori Audit:</span>
              <strong className="text-slate-900 text-sm">Wajar Tanpa Pengecualian (WTP)</strong>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Rasio Penyaluran Zakat:</span>
              <strong className="text-emerald-800 text-sm">92.4% Terdistribusi Tepat Sasaran</strong>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Sinkronisasi SiMBA BAZNAS:</span>
              <strong className="text-slate-900 text-sm">Terhubung (Realtime API)</strong>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pratinjau PSAK 109 */}
      {showPsakModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Laporan Keuangan Neraca &amp; Posisi Dana Zakat (PSAK 109)</h3>
                <p className="text-xs text-slate-500">Lembaga Amil Zakat Amwal Nusantara • Periode Tahun Berjalan</p>
              </div>
              <button
                onClick={() => setShowPsakModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-3 text-xs font-mono text-slate-800">
              <div className="flex justify-between font-bold border-b pb-2 text-slate-900">
                <span>KOMPONEN AKUNTANSI ZAKAT</span>
                <span>NOMINAL RUPIAH</span>
              </div>
              <div className="flex justify-between">
                <span>Penerimaan Zakat Maal (Muzakki):</span>
                <span>Rp 1.665.000.000</span>
              </div>
              <div className="flex justify-between">
                <span>Penerimaan Zakat Fitrah:</span>
                <span>Rp 820.000.000</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold border-t pt-1">
                <span>TOTAL PENGHIMPUNAN ZAKAT (A):</span>
                <span>Rp 2.485.000.000</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>Penyaluran 8 Asnaf (Fakir/Miskin/Fi Sabilillah/dll):</span>
                <span className="text-rose-700">- Rp 2.180.000.000</span>
              </div>
              <div className="flex justify-between">
                <span>Bagian Amil Zakat (Maks 12.5%):</span>
                <span className="text-rose-700">- Rp 115.000.000</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t pt-2 bg-emerald-100/60 p-2 rounded-lg">
                <span>SALDO AKHIR DANA ZAKAT SIAGA:</span>
                <span className="text-[#1B5E20]">Rp 190.000.000</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setShowPsakModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setShowPsakModal(false);
                  showToast({
                    title: 'Laporan Neraca Dicetak',
                    description: 'Mencetak dokumen resmi Neraca & Saldo PSAK 109...',
                    type: 'success',
                  });
                }}
                className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Format Resmi A4
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Modals */}
      <ZiswafModals
        selectedBszMuzakki={selectedBszMuzakki}
        onCloseBsz={() => setSelectedBszMuzakki(null)}
        selectedQurbanCert={null}
        onCloseQurbanCert={() => {}}
        isQrisGeneratorOpen={false}
        onCloseQris={() => {}}
        qrisGenAmount=""
        setQrisGenAmount={() => {}}
        qrisGenNote=""
        setQrisGenNote={() => {}}
        isCreateInfaqOpen={false}
        onCloseCreateInfaq={() => {}}
        infaqFormName=""
        setInfaqFormName={() => {}}
        infaqFormCategory="Infaq Subuh"
        setInfaqFormCategory={() => {}}
        infaqFormTarget=""
        setInfaqFormTarget={() => {}}
        infaqFormNoTarget={false}
        setInfaqFormNoTarget={() => {}}
        infaqFormDesc=""
        setInfaqFormDesc={() => {}}
        onSubmitCreateInfaq={() => {}}
        isManualInfaqOpen={false}
        onCloseManualInfaq={() => {}}
        infaqManualDonor=""
        setInfaqManualDonor={() => {}}
        infaqManualAmount=""
        setInfaqManualAmount={() => {}}
        infaqManualProgram=""
        setInfaqManualProgram={() => {}}
        infaqManualMethod="Kasir Tunai / Kotak Infaq"
        setInfaqManualMethod={() => {}}
        infaqPrograms={[]}
        onSubmitManualInfaq={() => {}}
        isRecordZakatOpen={isRecordZakatOpen}
        onCloseRecordZakat={() => setIsRecordZakatOpen(false)}
        zakatMuzakkiName={zakatMuzakkiName}
        setZakatMuzakkiName={setZakatMuzakkiName}
        zakatMuzakkiPhone={zakatMuzakkiPhone}
        setZakatMuzakkiPhone={setZakatMuzakkiPhone}
        zakatMuzakkiNpwp={zakatMuzakkiNpwp}
        setZakatMuzakkiNpwp={setZakatMuzakkiNpwp}
        zakatTypeSelected={zakatTypeSelected}
        setZakatTypeSelected={setZakatTypeSelected}
        zakatNominalInput={zakatNominalInput}
        setZakatNominalInput={setZakatNominalInput}
        zakatCalcNote={zakatCalcNote}
        setZakatCalcNote={setZakatCalcNote}
        onSubmitRecordZakat={handleRecordZakatSubmit}
        isDistributeAsnafOpen={isDistributeAsnafOpen}
        onCloseDistributeAsnaf={() => setIsDistributeAsnafOpen(false)}
        selectedAsnafTarget={selectedAsnafTarget}
        setSelectedAsnafTarget={setSelectedAsnafTarget}
        distributeNominal={distributeNominal}
        setDistributeNominal={setDistributeNominal}
        distributeBeneficiaryCount={distributeBeneficiaryCount}
        setDistributeBeneficiaryCount={setDistributeBeneficiaryCount}
        distributeNotes={distributeNotes}
        setDistributeNotes={setDistributeNotes}
        onSubmitDistributeAsnaf={handleDistributeAsnafSubmit}
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
