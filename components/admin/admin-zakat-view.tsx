'use client';

import React, { useState } from 'react';
import {
  Coins,
  Search,
  Filter,
  Plus,
  Send,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  Layers,
  Users,
  ChevronRight,
  TrendingUp,
  ExternalLink,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export interface ZakatOrderItem {
  id: string;
  nomorKwitansi: string;
  namaMuzakki: string;
  isAnonymous: boolean;
  noTelepon?: string | null;
  jenisZakat: string;
  metodePembayaran: string;
  nominal?: number | null;
  beratBerasKg?: number | null;
  jumlahJiwa?: number | null;
  status: string;
  createdAt: string;
  notes?: string | null;
  transaction?: {
    id: string;
    statusPembayaran: string;
    paymentMethod?: string | null;
    amount?: number | null;
  } | null;
  muzakki?: {
    name: string;
    email?: string | null;
    phone?: string | null;
  } | null;
  enteredByAmil?: {
    name: string;
  } | null;
}

export interface MustahiqItem {
  id: string;
  namaMustahiq: string;
  nik?: string | null;
  kategoriAsnaf: string;
  alamat?: string | null;
  noTelepon?: string | null;
  statusVerifikasi: string;
  createdAt: string;
}

export interface ZakatDistributionItem {
  id: string;
  mustahiqId: string;
  jenisZakat: string;
  nominal?: number | null;
  beratBerasKg?: number | null;
  buktiPenerimaanUrl?: string | null;
  status: string;
  notes?: string | null;
  createdAt: string;
  mustahiq?: {
    id: string;
    namaMustahiq: string;
    kategoriAsnaf: string;
    alamat?: string | null;
  } | null;
  distributedByAmil?: {
    name: string;
    email?: string | null;
  } | null;
}

export interface FundPoolStats {
  maal: {
    balance: number;
    totalDistributed: number;
  };
  fitrah: {
    balance: number;
    totalDistributed: number;
  };
}

export interface AdminZakatViewProps {
  initialOrders: ZakatOrderItem[];
  initialMustahiqs: MustahiqItem[];
  initialDistributions: ZakatDistributionItem[];
  initialFundPools: FundPoolStats;
  userRole?: string;
  userName?: string;
}

const ASNAF_LABELS: Record<string, { label: string; desc: string; color: string }> = {
  FAKIR: { label: 'Fakir', desc: 'Tidak memiliki harta/mata pencaharian', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  MISKIN: { label: 'Miskin', desc: 'Penghasilan tidak mencukupi kebutuhan pokok', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  AMIL: { label: 'Amil', desc: 'Petugas pengelola dan penyalur zakat', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  MUALLAF: { label: 'Muallaf', desc: 'Orang yang baru masuk Islam / dikuatkan hatinya', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  RIQAB: { label: 'Riqab', desc: 'Pembebasan dari belenggu perbudakan/ekonomi', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  GHARIMIN: { label: 'Gharimin', desc: 'Terlilit hutang untuk kebutuhan maslahat', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  FISABILILLAH: { label: 'Fisabilillah', desc: 'Pejuang di jalan Allah & pendidikan dakwah', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  IBNU_SABIL: { label: 'Ibnu Sabil', desc: 'Musafir yang kehabisan bekal dalam ketaatan', color: 'bg-teal-50 text-teal-700 border-teal-200' },
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function AdminZakatView({
  initialOrders,
  initialMustahiqs,
  initialDistributions,
  initialFundPools,
  userRole = 'ADMIN',
  userName = 'Super Admin',
}: AdminZakatViewProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'distributions' | 'mustahiq'>('orders');

  // Data states
  const [orders, setOrders] = useState<ZakatOrderItem[]>(initialOrders);
  const [mustahiqs, setMustahiqs] = useState<MustahiqItem[]>(initialMustahiqs);
  const [distributions, setDistributions] = useState<ZakatDistributionItem[]>(initialDistributions);
  const [fundPools, setFundPools] = useState<FundPoolStats>(initialFundPools);

  // Filters for Orders Tab
  const [orderSearch, setOrderSearch] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Filters for Mustahiq Tab
  const [mustahiqSearch, setMustahiqSearch] = useState('');
  const [mustahiqAsnafFilter, setMustahiqAsnafFilter] = useState('ALL');

  // UI Modals
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isDistributeModalOpen, setIsDistributeModalOpen] = useState(false);
  const [isAddMustahiqModalOpen, setIsAddMustahiqModalOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<ZakatOrderItem | null>(null);

  // Loading & feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedKwitansi, setCopiedKwitansi] = useState<string | null>(null);
  const [revealedNiks, setRevealedNiks] = useState<Record<string, boolean>>({});

  // Offline Order Form State
  const [offlineForm, setOfflineForm] = useState({
    jenisZakat: 'FITRAH',
    namaMuzakki: '',
    teleponMuzakki: '',
    isAnonymous: false,
    bentukZakat: 'UANG' as 'UANG' | 'BERAS',
    nominalRp: '',
    jumlahBerasKg: '',
    jenisBeras: 'Medium',
    notes: '',
  });

  // Distribution Form State
  const [distributeForm, setDistributeForm] = useState({
    mustahiqId: '',
    jenisZakat: 'FITRAH',
    bentukBantuan: 'UANG' as 'UANG' | 'BERAS',
    nominalRp: '',
    jumlahBerasKg: '',
    buktiFotoUrl: '',
    notes: '',
  });

  // Add Mustahiq Form State
  const [mustahiqForm, setMustahiqForm] = useState({
    namaLengkap: '',
    nik: '',
    kategoriAsnaf: 'FAKIR',
    alamat: '',
    noHp: '',
    statusVerifikasi: 'VERIFIED',
    adminNotes: '',
  });

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKwitansi(text);
    setTimeout(() => setCopiedKwitansi(null), 2000);
  };

  const toggleNikReveal = (id: string) => {
    setRevealedNiks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.namaMuzakki.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.nomorKwitansi.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (order.noTelepon && order.noTelepon.includes(orderSearch));

    const matchesType = orderTypeFilter === 'ALL' || order.jenisZakat === orderTypeFilter;
    const matchesStatus = orderStatusFilter === 'ALL' || order.status === orderStatusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Filtered Mustahiqs
  const filteredMustahiqs = mustahiqs.filter((m) => {
    const matchesSearch =
      m.namaMustahiq.toLowerCase().includes(mustahiqSearch.toLowerCase()) ||
      (m.alamat && m.alamat.toLowerCase().includes(mustahiqSearch.toLowerCase())) ||
      (m.noTelepon && m.noTelepon.includes(mustahiqSearch));

    const matchesAsnaf = mustahiqAsnafFilter === 'ALL' || m.kategoriAsnaf === mustahiqAsnafFilter;

    return matchesSearch && matchesAsnaf;
  });

  // Quick stats
  const totalVerifiedAmount = orders
    .filter((o) => o.status === 'TERVERIFIKASI')
    .reduce((acc, o) => acc + (Number(o.nominal) || 0), 0);

  const totalVerifiedBerasKg = orders
    .filter((o) => o.status === 'TERVERIFIKASI')
    .reduce((acc, o) => acc + (Number(o.beratBerasKg) || 0), 0);

  const pendingVerificationCount = orders.filter((o) => o.status === 'MENUNGGU_VERIFIKASI').length;

  // Handle Offline Zakat Submission
  const handleOfflineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = {
        jenisZakat: offlineForm.jenisZakat,
        namaMuzakki: offlineForm.namaMuzakki,
        teleponMuzakki: offlineForm.teleponMuzakki || undefined,
        isAnonymous: offlineForm.isAnonymous,
        bentukZakat: offlineForm.bentukZakat,
        notes: offlineForm.notes || undefined,
      };

      if (offlineForm.bentukZakat === 'UANG') {
        payload.nominalRp = Number(offlineForm.nominalRp);
      } else {
        payload.jumlahBerasKg = Number(offlineForm.jumlahBerasKg);
        payload.jenisBeras = offlineForm.jenisBeras;
      }

      const res = await fetch('/api/admin/zakat/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Gagal mencatat order zakat offline');
      }

      showToast(`Zakat offline berhasil dicatat: ${resData.data?.nomorKwitansi}`);
      setIsOfflineModalOpen(false);
      setOfflineForm({
        jenisZakat: 'FITRAH',
        namaMuzakki: '',
        teleponMuzakki: '',
        isAnonymous: false,
        bentukZakat: 'UANG',
        nominalRp: '',
        jumlahBerasKg: '',
        jenisBeras: 'Medium',
        notes: '',
      });

      // Refresh orders and fund pools
      const ordersRes = await fetch('/api/admin/zakat/orders?limit=50');
      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        setOrders(oData.data || []);
      }
      const summaryRes = await fetch('/api/admin/zakat/summary');
      if (summaryRes.ok) {
        const sData = await summaryRes.json();
        if (sData.data?.fundPools) setFundPools(sData.data.fundPools);
      }
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan sistem', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Distribute Zakat Submission
  const handleDistributeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!distributeForm.mustahiqId) {
      showToast('Pilih mustahik penerima zakat', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        mustahiqId: distributeForm.mustahiqId,
        jenisZakat: distributeForm.jenisZakat,
        bentukBantuan: distributeForm.bentukBantuan,
        buktiFotoUrl: distributeForm.buktiFotoUrl || undefined,
        notes: distributeForm.notes || undefined,
      };

      if (distributeForm.bentukBantuan === 'UANG') {
        payload.nominalRp = Number(distributeForm.nominalRp);
      } else {
        payload.jumlahBerasKg = Number(distributeForm.jumlahBerasKg);
      }

      const res = await fetch('/api/admin/zakat/distributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Gagal menyalurkan zakat');
      }

      showToast(resData.message || 'Zakat berhasil disalurkan kepada mustahik');
      setIsDistributeModalOpen(false);
      setDistributeForm({
        mustahiqId: '',
        jenisZakat: 'FITRAH',
        bentukBantuan: 'UANG',
        nominalRp: '',
        jumlahBerasKg: '',
        buktiFotoUrl: '',
        notes: '',
      });

      // Refresh distributions & summary
      const distRes = await fetch('/api/admin/zakat/distributions?limit=50');
      if (distRes.ok) {
        const dData = await distRes.json();
        setDistributions(dData.data || []);
      }
      const summaryRes = await fetch('/api/admin/zakat/summary');
      if (summaryRes.ok) {
        const sData = await summaryRes.json();
        if (sData.data?.fundPools) setFundPools(sData.data.fundPools);
      }
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan sistem', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Add Mustahiq Submission
  const handleAddMustahiqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/mustahiq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mustahiqForm),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Gagal mendaftarkan mustahik');
      }

      showToast(`Mustahik ${mustahiqForm.namaLengkap} berhasil didaftarkan`);
      setIsAddMustahiqModalOpen(false);
      setMustahiqForm({
        namaLengkap: '',
        nik: '',
        kategoriAsnaf: 'FAKIR',
        alamat: '',
        noHp: '',
        statusVerifikasi: 'VERIFIED',
        adminNotes: '',
      });

      // Refresh mustahiq list
      const mustRes = await fetch('/api/admin/mustahiq');
      if (mustRes.ok) {
        const mData = await mustRes.json();
        setMustahiqs(mData.data || []);
      }
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan sistem', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-jakarta space-y-8">
      {/* Toast Alert Feedback */}
      {feedbackMessage && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold transition-all ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1B5E20] text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 backdrop-blur-3xl transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Coins className="w-4 h-4" />
              <span>Modul Tata Kelola Zakat & 8 Asnaf</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manajemen Zakat & Kas Asnaf
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Pengawasan penerimaan Zakat Maal & Fitrah, alokasi saldo Fund Pool, transparansi distribusi 8 Asnaf, dan audit mustahik terenkripsi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsOfflineModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Entri Zakat Offline</span>
            </button>
            <button
              onClick={() => setIsDistributeModalOpen(true)}
              className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-emerald-700" />
              <span>Salurkan Zakat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Financial & Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kas Zakat Maal */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Kas Zakat Maal</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              M
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {formatRupiah(fundPools.maal?.balance || 0)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Tersalurkan:</span>
              <span className="font-semibold text-blue-600">
                {formatRupiah(fundPools.maal?.totalDistributed || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Kas Zakat Fitrah */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Kas Zakat Fitrah</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              F
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {formatRupiah(fundPools.fitrah?.balance || 0)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Tersalurkan:</span>
              <span className="font-semibold text-emerald-600">
                {formatRupiah(fundPools.fitrah?.totalDistributed || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Total Zakat Terkumpul */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Zakat Masuk</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {formatRupiah(totalVerifiedAmount)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Beras Terkumpul:</span>
              <span className="font-semibold text-slate-700">
                {totalVerifiedBerasKg.toFixed(1)} kg
              </span>
            </div>
          </div>
        </div>

        {/* Status Mustahik & Approval */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Mustahik & Antrean</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {mustahiqs.length} <span className="text-xs font-semibold text-slate-400">Mustahik</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-500">Menunggu Verifikasi:</span>
              <span className={`font-bold ${pendingVerificationCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {pendingVerificationCount} Order
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'border-[#1B5E20] text-[#1B5E20]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Monitoring Zakat Masuk ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('distributions')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'distributions'
              ? 'border-[#1B5E20] text-[#1B5E20]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Alokasi 8 Asnaf & Penyaluran ({distributions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mustahiq')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'mustahiq'
              ? 'border-[#1B5E20] text-[#1B5E20]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Transparansi Mustahiq (Audit Internal)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MONITORING ZAKAT MASUK */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama muzakki, kwitansi, telp..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={orderTypeFilter}
                onChange={(e) => setOrderTypeFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-semibold focus:outline-hidden"
              >
                <option value="ALL">Semua Jenis Zakat</option>
                <option value="FITRAH">Zakat Fitrah</option>
                <option value="MAAL_PENGHASILAN">Zakat Penghasilan</option>
                <option value="EMAS">Zakat Emas</option>
                <option value="PERUSAHAAN">Zakat Perusahaan</option>
                <option value="PERTANIAN">Zakat Pertanian</option>
                <option value="FIDYAH">Fidyah</option>
                <option value="KAFARAT">Kafarat</option>
              </select>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-semibold focus:outline-hidden"
              >
                <option value="ALL">Semua Status</option>
                <option value="TERVERIFIKASI">Terverifikasi (Lunas)</option>
                <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</option>
                <option value="DITOLAK">Ditolak / Gagal</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">No. Kwitansi</th>
                    <th className="px-5 py-3.5">Muzakki</th>
                    <th className="px-5 py-3.5">Jenis Zakat</th>
                    <th className="px-5 py-3.5">Bentuk / Nilai</th>
                    <th className="px-5 py-3.5">Metode Bayar</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                        Tidak ada transaksi zakat yang cocok dengan kriteria filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span>{order.nomorKwitansi}</span>
                            <button
                              onClick={() => copyToClipboard(order.nomorKwitansi)}
                              className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                              title="Salin nomor kwitansi"
                            >
                              {copiedKwitansi === order.nomorKwitansi ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">
                            {order.isAnonymous ? 'Hamba Allah (Anonim)' : order.namaMuzakki}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {order.noTelepon || order.muzakki?.phone || '-'}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                            {order.jenisZakat.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {order.nominal && Number(order.nominal) > 0 ? (
                            <div className="font-extrabold text-slate-900">
                              {formatRupiah(Number(order.nominal))}
                            </div>
                          ) : null}
                          {order.beratBerasKg && Number(order.beratBerasKg) > 0 ? (
                            <div className="text-[11px] font-semibold text-emerald-700">
                              {Number(order.beratBerasKg)} kg beras ({order.jumlahJiwa || '-'} jiwa)
                            </div>
                          ) : null}
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-700">{order.metodePembayaran}</span>
                          <div className="text-[10px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {order.status === 'TERVERIFIKASI' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                              <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                            </span>
                          ) : order.status === 'MENUNGGU_VERIFIKASI' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                              <Clock className="w-3 h-3" /> Menunggu
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                              <XCircle className="w-3 h-3" /> Ditolak
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => setSelectedOrderDetail(order)}
                            className="text-[#1B5E20] hover:underline font-bold text-xs cursor-pointer"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ALOKASI 8 ASNAF & PENYALURAN */}
      {/* ========================================================================= */}
      {activeTab === 'distributions' && (
        <div className="space-y-8">
          {/* Asnaf Allocation Matrix Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Matriks Target Penyaluran 8 Asnaf
                </h3>
                <p className="text-xs text-slate-500">
                  Pemetaan mustahik terdaftar dan total realisasi penyaluran dana zakat per kategori asnaf syar'i.
                </p>
              </div>
              <button
                onClick={() => setIsDistributeModalOpen(true)}
                className="flex items-center gap-2 bg-[#1B5E20] hover:bg-[#154a19] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Salurkan Sekarang</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {Object.entries(ASNAF_LABELS).map(([asnafKey, info]) => {
                const mustahikCount = mustahiqs.filter((m) => m.kategoriAsnaf === asnafKey).length;
                const totalNominal = distributions
                  .filter((d) => d.mustahiq?.kategoriAsnaf === asnafKey)
                  .reduce((acc, d) => acc + (Number(d.nominal) || 0), 0);

                return (
                  <div
                    key={asnafKey}
                    className={`p-4 rounded-xl border transition-all ${info.color} bg-opacity-40`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm tracking-tight">{info.label}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/70">
                        {mustahikCount} Mustahik
                      </span>
                    </div>
                    <p className="text-[11px] opacity-80 mt-1 line-clamp-1">{info.desc}</p>
                    <div className="mt-3 pt-2 border-t border-current/15 flex items-center justify-between text-xs">
                      <span>Tersalurkan:</span>
                      <span className="font-black">{formatRupiah(totalNominal)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Distribution History Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900">
                Log Riwayat Penyaluran Zakat
              </h4>
              <span className="text-xs font-semibold text-slate-400">
                Total {distributions.length} Penyaluran
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Tanggal</th>
                    <th className="px-5 py-3.5">Mustahik Penerima</th>
                    <th className="px-5 py-3.5">Kategori Asnaf</th>
                    <th className="px-5 py-3.5">Jenis & Bentuk</th>
                    <th className="px-5 py-3.5">Nominal / Beras</th>
                    <th className="px-5 py-3.5">Amil Penyalur</th>
                    <th className="px-5 py-3.5 text-right">Bukti / Dokumentasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {distributions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                        Belum ada riwayat penyaluran zakat yang tercatat.
                      </td>
                    </tr>
                  ) : (
                    distributions.map((dist) => (
                      <tr key={dist.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 text-slate-500">
                          {new Date(dist.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">
                            {dist.mustahiq?.namaMustahiq || 'Mustahik Terdaftar'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {dist.mustahiq?.alamat || '-'}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {dist.mustahiq?.kategoriAsnaf && ASNAF_LABELS[dist.mustahiq.kategoriAsnaf] ? (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                ASNAF_LABELS[dist.mustahiq.kategoriAsnaf].color
                              }`}
                            >
                              {ASNAF_LABELS[dist.mustahiq.kategoriAsnaf].label}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-700">
                            {dist.jenisZakat.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {dist.nominal && Number(dist.nominal) > 0 ? (
                            <div className="font-extrabold text-emerald-700">
                              {formatRupiah(Number(dist.nominal))}
                            </div>
                          ) : null}
                          {dist.beratBerasKg && Number(dist.beratBerasKg) > 0 ? (
                            <div className="text-[11px] font-bold text-amber-700">
                              {Number(dist.beratBerasKg)} kg beras
                            </div>
                          ) : null}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {dist.distributedByAmil?.name || 'Admin Amwal'}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {dist.buktiPenerimaanUrl ? (
                            <a
                              href={dist.buktiPenerimaanUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold"
                            >
                              <span>Lihat Bukti</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-300 text-[11px]">Tidak ada</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TRANSPARANSI MUSTAHIQ (INTERNAL AUDIT ONLY) */}
      {/* ========================================================================= */}
      {activeTab === 'mustahiq' && (
        <div className="space-y-6">
          {/* Privacy Notice Banner */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Kerahasiaan Data Mustahik & Kepatuhan UU PDP
              </h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Data NIK mustahik terenkripsi secara aman menggunakan <strong>AES-256</strong>. Halaman ini hanya dapat diakses oleh peran <strong>ADMIN</strong> dan <strong>PETUGAS LAPANGAN</strong> untuk keperluan audit syariah internal dan tidak dipublikasikan ke publik.
              </p>
            </div>
          </div>

          {/* Mustahiq Filter & Actions Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, alamat, no telp..."
                value={mustahiqSearch}
                onChange={(e) => setMustahiqSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={mustahiqAsnafFilter}
                onChange={(e) => setMustahiqAsnafFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-semibold focus:outline-hidden"
              >
                <option value="ALL">Semua Kategori Asnaf</option>
                {Object.entries(ASNAF_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsAddMustahiqModalOpen(true)}
                className="flex items-center gap-2 bg-[#1B5E20] hover:bg-[#154a19] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Mustahik</span>
              </button>
            </div>
          </div>

          {/* Mustahiq Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Nama Mustahik</th>
                    <th className="px-5 py-3.5">NIK (AES-256)</th>
                    <th className="px-5 py-3.5">Kategori Asnaf</th>
                    <th className="px-5 py-3.5">Alamat & Kontak</th>
                    <th className="px-5 py-3.5">Status Verifikasi</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMustahiqs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                        Tidak ada data mustahik yang terdaftar.
                      </td>
                    </tr>
                  ) : (
                    filteredMustahiqs.map((m) => {
                      const isRevealed = revealedNiks[m.id];
                      const maskedNik = m.nik
                        ? isRevealed
                          ? m.nik
                          : `${m.nik.slice(0, 4)}********${m.nik.slice(-4)}`
                        : '-';

                      return (
                        <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-4 font-bold text-slate-900">
                            {m.namaMustahiq}
                          </td>
                          <td className="px-5 py-4 font-mono text-slate-700">
                            <div className="flex items-center gap-2">
                              <span>{maskedNik}</span>
                              {m.nik && (
                                <button
                                  onClick={() => toggleNikReveal(m.id)}
                                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                                  title={isRevealed ? 'Sembunyikan NIK' : 'Tampilkan NIK asli'}
                                >
                                  {isRevealed ? (
                                    <EyeOff className="w-3.5 h-3.5 text-blue-600" />
                                  ) : (
                                    <Eye className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {ASNAF_LABELS[m.kategoriAsnaf] ? (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  ASNAF_LABELS[m.kategoriAsnaf].color
                                }`}
                              >
                                {ASNAF_LABELS[m.kategoriAsnaf].label}
                              </span>
                            ) : (
                              m.kategoriAsnaf
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-slate-900">{m.alamat || '-'}</div>
                            <div className="text-[11px] text-slate-400">{m.noTelepon || '-'}</div>
                          </td>
                          <td className="px-5 py-4">
                            {m.statusVerifikasi === 'VERIFIED' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => {
                                setDistributeForm((prev) => ({ ...prev, mustahiqId: m.id }));
                                setIsDistributeModalOpen(true);
                              }}
                              className="text-[#1B5E20] hover:underline font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                            >
                              <span>Salurkan</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ENTRI ZAKAT OFFLINE */}
      {/* ========================================================================= */}
      {isOfflineModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Entri Zakat Offline</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pencatatan penerimaan zakat tunai atau beras langsung oleh amil/petugas.
                </p>
              </div>
              <button
                onClick={() => setIsOfflineModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOfflineSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Zakat *</label>
                  <select
                    value={offlineForm.jenisZakat}
                    onChange={(e) => setOfflineForm({ ...offlineForm, jenisZakat: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  >
                    <option value="FITRAH">Zakat Fitrah</option>
                    <option value="MAAL_PENGHASILAN">Zakat Penghasilan</option>
                    <option value="EMAS">Zakat Emas</option>
                    <option value="PERUSAHAAN">Zakat Perusahaan</option>
                    <option value="PERTANIAN">Zakat Pertanian</option>
                    <option value="FIDYAH">Fidyah</option>
                    <option value="KAFARAT">Kafarat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bentuk Zakat *</label>
                  <select
                    value={offlineForm.bentukZakat}
                    onChange={(e) => setOfflineForm({ ...offlineForm, bentukZakat: e.target.value as any })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  >
                    <option value="UANG">Uang Tunai (Rp)</option>
                    <option value="BERAS">Beras (Kg)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Muzakki *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap muzakki"
                  value={offlineForm.namaMuzakki}
                  onChange={(e) => setOfflineForm({ ...offlineForm, namaMuzakki: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAnonOffline"
                  checked={offlineForm.isAnonymous}
                  onChange={(e) => setOfflineForm({ ...offlineForm, isAnonymous: e.target.checked })}
                  className="rounded border-slate-300 text-[#1B5E20] focus:ring-[#1B5E20]"
                />
                <label htmlFor="isAnonOffline" className="text-slate-600 font-medium">
                  Sembunyikan nama di kuitansi publik (Hamba Allah)
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="text"
                  placeholder="08123456789 (untuk notifikasi WA)"
                  value={offlineForm.teleponMuzakki}
                  onChange={(e) => setOfflineForm({ ...offlineForm, teleponMuzakki: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              {offlineForm.bentukZakat === 'UANG' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nominal Penerimaan (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="Contoh: 100000"
                    value={offlineForm.nominalRp}
                    onChange={(e) => setOfflineForm({ ...offlineForm, nominalRp: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Berat Beras (Kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="Contoh: 2.5"
                      value={offlineForm.jumlahBerasKg}
                      onChange={(e) => setOfflineForm({ ...offlineForm, jumlahBerasKg: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kualitas Beras</label>
                    <input
                      type="text"
                      value={offlineForm.jenisBeras}
                      onChange={(e) => setOfflineForm({ ...offlineForm, jenisBeras: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan amil..."
                  value={offlineForm.notes}
                  onChange={(e) => setOfflineForm({ ...offlineForm, notes: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOfflineModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#1B5E20] hover:bg-[#154a19] text-white px-5 py-2 rounded-xl font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Memproses...' : 'Simpan Penerimaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SALURKAN ZAKAT KE MUSTAHIK */}
      {/* ========================================================================= */}
      {isDistributeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Salurkan Zakat ke Mustahik</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pengeluaran kas zakat secara atomik kepada mustahik yang terverifikasi.
                </p>
              </div>
              <button
                onClick={() => setIsDistributeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDistributeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Mustahik Penerima *</label>
                <select
                  required
                  value={distributeForm.mustahiqId}
                  onChange={(e) => setDistributeForm({ ...distributeForm, mustahiqId: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                >
                  <option value="">-- Pilih Mustahik Terdaftar --</option>
                  {mustahiqs.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.namaMustahiq} ({m.kategoriAsnaf}) - {m.alamat || 'Alamat -'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sumber Kas Pool *</label>
                  <select
                    value={distributeForm.jenisZakat}
                    onChange={(e) => setDistributeForm({ ...distributeForm, jenisZakat: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  >
                    <option value="FITRAH">
                      Pool Zakat Fitrah ({formatRupiah(fundPools.fitrah?.balance || 0)})
                    </option>
                    <option value="MAAL_PENGHASILAN">
                      Pool Zakat Maal ({formatRupiah(fundPools.maal?.balance || 0)})
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bentuk Bantuan *</label>
                  <select
                    value={distributeForm.bentukBantuan}
                    onChange={(e) => setDistributeForm({ ...distributeForm, bentukBantuan: e.target.value as any })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  >
                    <option value="UANG">Uang Tunai (Rp)</option>
                    <option value="BERAS">Beras (Kg)</option>
                  </select>
                </div>
              </div>

              {distributeForm.bentukBantuan === 'UANG' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nominal Bantuan (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="Contoh: 500000"
                    value={distributeForm.nominalRp}
                    onChange={(e) => setDistributeForm({ ...distributeForm, nominalRp: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Beras Disalurkan (Kg) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="Contoh: 5"
                    value={distributeForm.jumlahBerasKg}
                    onChange={(e) => setDistributeForm({ ...distributeForm, jumlahBerasKg: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Bukti / Dokumentasi (Foto)</label>
                <input
                  type="url"
                  placeholder="https://... atau URL foto kuitansi/penyerahan"
                  value={distributeForm.buktiFotoUrl}
                  onChange={(e) => setDistributeForm({ ...distributeForm, buktiFotoUrl: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Penyaluran</label>
                <textarea
                  rows={2}
                  placeholder="Keperluan santunan, program sembako, biaya pendidikan..."
                  value={distributeForm.notes}
                  onChange={(e) => setDistributeForm({ ...distributeForm, notes: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDistributeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#1B5E20] hover:bg-[#154a19] text-white px-5 py-2 rounded-xl font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Memproses...' : 'Kirim Penyaluran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: TAMBAH MUSTAHIK BARU */}
      {/* ========================================================================= */}
      {isAddMustahiqModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Daftarkan Mustahik Baru</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Data NIK akan dienkripsi secara otomatis menggunakan AES-256.
                </p>
              </div>
              <button
                onClick={() => setIsAddMustahiqModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMustahiqSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Mustahik *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama sesuai KTP"
                  value={mustahiqForm.namaLengkap}
                  onChange={(e) => setMustahiqForm({ ...mustahiqForm, namaLengkap: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIK (16 Digit) *</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    pattern="\d{16}"
                    placeholder="3578xxxxxxxxxxxx"
                    value={mustahiqForm.nik}
                    onChange={(e) => setMustahiqForm({ ...mustahiqForm, nik: e.target.value.replace(/\D/g, '') })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Asnaf *</label>
                  <select
                    value={mustahiqForm.kategoriAsnaf}
                    onChange={(e) => setMustahiqForm({ ...mustahiqForm, kategoriAsnaf: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  >
                    {Object.entries(ASNAF_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label} - {v.desc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="08xxxxxxxx"
                    value={mustahiqForm.noHp}
                    onChange={(e) => setMustahiqForm({ ...mustahiqForm, noHp: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Verifikasi</label>
                  <select
                    value={mustahiqForm.statusVerifikasi}
                    onChange={(e) => setMustahiqForm({ ...mustahiqForm, statusVerifikasi: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  >
                    <option value="VERIFIED">Terverifikasi (Aktif)</option>
                    <option value="PENDING">Menunggu Survei</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Domisili</label>
                <textarea
                  rows={2}
                  placeholder="Kelurahan, Kecamatan, Kota..."
                  value={mustahiqForm.alamat}
                  onChange={(e) => setMustahiqForm({ ...mustahiqForm, alamat: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMustahiqModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#1B5E20] hover:bg-[#154a19] text-white px-5 py-2 rounded-xl font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Daftarkan Mustahik'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DETAIL ORDER & KWITANSI */}
      {/* ========================================================================= */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">Detail Order Zakat</h3>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 font-mono">
                <div className="text-[10px] text-slate-400 font-bold uppercase">No. Kwitansi</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {selectedOrderDetail.nomorKwitansi}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Muzakki</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedOrderDetail.isAnonymous
                      ? 'Hamba Allah (Anonim)'
                      : selectedOrderDetail.namaMuzakki}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Jenis Zakat</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedOrderDetail.jenisZakat.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Nominal / Nilai</div>
                  <div className="font-extrabold text-emerald-700 mt-0.5 text-sm">
                    {selectedOrderDetail.nominal
                      ? formatRupiah(Number(selectedOrderDetail.nominal))
                      : selectedOrderDetail.beratBerasKg
                      ? `${selectedOrderDetail.beratBerasKg} kg beras`
                      : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Metode Bayar</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedOrderDetail.metodePembayaran}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Status</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedOrderDetail.status}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Waktu Transaksi</div>
                  <div className="text-slate-700 mt-0.5">
                    {new Date(selectedOrderDetail.createdAt).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {selectedOrderDetail.notes && (
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Catatan</div>
                  <div className="text-slate-700 mt-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/50">
                    {selectedOrderDetail.notes}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
