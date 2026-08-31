'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Landmark,
  Coins,
  ShieldCheck,
  TrendingUp,
  Plus,
  Search,
  Clock,
  Building2,
  Lock,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  X,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { WakafYieldLedgerPanel, YieldEntryItem, LedgerMetrics } from '@/components/wakaf/wakaf-yield-ledger-panel';

export interface BackofficeProgressReportItem {
  id: string;
  persentaseFisik: number | null;
  deskripsi: string | null;
  kuitansiUrls: string[];
  createdAt: string;
  createdByName?: string;
}

export interface BackofficeProgramItem {
  id: string;
  judul: string;
  kategori: string;
  bannerUrl?: string | null;
  jenisWakaf: 'PRODUKTIF_KEKAL' | 'HABIS_PAKAI' | string;
  status: string;
  targetDana: number;
  pokokDanaTerkumpul: number;
  durasiHari?: number | null;
  namaLembaga?: string | null;
  donorCount?: number;
  ledger?: LedgerMetrics | null;
  yieldEntries?: YieldEntryItem[];
  progressReports?: BackofficeProgressReportItem[];
}

interface BackofficeProgramManagementViewProps {
  programs: BackofficeProgramItem[];
  userRole?: string;
  userName?: string;
}

export function BackofficeProgramManagementView({
  programs,
  userRole = 'ADMIN',
  userName = 'Super Admin',
}: BackofficeProgramManagementViewProps) {
  const isAdmin = userRole === 'ADMIN';

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLedgerProgram, setActiveLedgerProgram] = useState<BackofficeProgramItem | null>(null);
  const [activeProgressProgram, setActiveProgressProgram] = useState<BackofficeProgramItem | null>(null);

  // BWI Registration States
  const [showBwiModal, setShowBwiModal] = useState<boolean>(false);
  const [certIdentifier, setCertIdentifier] = useState<string>('');
  const [bwiNumberInput, setBwiNumberInput] = useState<string>('');
  const [isSavingBwi, setIsSavingBwi] = useState<boolean>(false);
  const [bwiMessage, setBwiMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveBwi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certIdentifier.trim() || !bwiNumberInput.trim()) {
      setBwiMessage({ type: 'error', text: 'Semua field wajib diisi' });
      return;
    }

    setIsSavingBwi(true);
    setBwiMessage(null);

    try {
      const res = await fetch(`/api/admin/certificates/${encodeURIComponent(certIdentifier.trim())}/bwi-number`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bwiRegistrationNumber: bwiNumberInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBwiMessage({ type: 'error', text: data.error || 'Gagal menyimpan nomor BWI' });
        setIsSavingBwi(false);
        return;
      }

      setBwiMessage({
        type: 'success',
        text: `Nomor registrasi BWI (${bwiNumberInput.trim()}) berhasil ditautkan ke sertifikat ${data.data?.nomorInternalAmwal || ''}!`,
      });
      setIsSavingBwi(false);
      setBwiNumberInput('');
      setCertIdentifier('');
    } catch (err) {
      console.error('Error saving BWI:', err);
      setBwiMessage({ type: 'error', text: 'Terjadi kendala jaringan saat menghubungi server.' });
      setIsSavingBwi(false);
    }
  };

  // Aggregate Stats
  const totalTerkumpul = programs.reduce((acc, p) => acc + p.pokokDanaTerkumpul, 0);
  const totalTarget = programs.reduce((acc, p) => acc + p.targetDana, 0);
  const totalWakif = programs.reduce((acc, p) => acc + (p.donorCount || 0), 0);
  const totalHasilAvailable = programs.reduce(
    (acc, p) => acc + (p.ledger?.totalHasilAvailable || 0),
    0
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredPrograms = programs.filter((p) => {
    const matchCategory =
      selectedCategory === 'Semua' ||
      (selectedCategory === 'Produktif' && p.jenisWakaf === 'PRODUKTIF_KEKAL') ||
      (selectedCategory === 'Manfaat' && p.jenisWakaf === 'HABIS_PAKAI') ||
      p.kategori.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchSearch =
      searchQuery.trim() === '' ||
      p.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kategori.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <main className="p-6 sm:p-8 space-y-6 font-jakarta max-w-7xl mx-auto antialiased">
      {/* Top Banner & Header Action */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-gray-900">
              {isAdmin ? 'Manajemen Program Wakaf & Tatakelola Ledger' : 'Dashboard Portofolio Wakaf YMI'}
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Kepatuhan Syariah
            </span>
          </div>
          <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
            Pengawasan dana wakaf, pencatatan hasil investasi produktif kekal, dan monitoring laporan progres fisik sesuai standar Badan Wakaf Indonesia (BWI).
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Terbitkan Program Baru</span>
          </button>
        )}
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-gray-500">Total Dana Terhimpun</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1B5E20] flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold text-gray-900 block">
              {formatRupiah(totalTerkumpul)}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              dari target {formatRupiah(totalTarget)}
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-gray-500">Program Terkelola</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold text-gray-900 block">
              {programs.length} Program
            </span>
            <span className="text-[11px] text-blue-700 font-semibold mt-1 block">
              4 Aktif Live di Katalog
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-gray-500">Total Wakif / Donatur</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold text-gray-900 block">
              {totalWakif} Wakif
            </span>
            <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
              Terverifikasi & Transparan
            </span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-gray-500">Hasil Investasi Siap Salur</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold text-[#2E7D32] block">
              {formatRupiah(totalHasilAvailable)}
            </span>
            <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
              Wakaf Produktif Abadi
            </span>
          </div>
        </div>
      </div>

      {/* BWI Notice Card & Quick BWI Input */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-900 block">
              Tatakelola Fiqih Wakaf & Sertifikasi BWI
            </span>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Pokok dana program berjenis <strong>Produktif Kekal</strong> dijamin tidak berkurang dan diinvestasikan pada sektor riil amanah.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setBwiMessage(null);
                setShowBwiModal(true);
              }}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Input Nomor Registrasi BWI</span>
            </button>
          )}
          <span className="hidden sm:inline-block bg-white text-amber-900 text-xs font-bold px-3 py-2 rounded-xl border border-amber-200 shadow-2xs">
            Terakreditasi BWI RI
          </span>
        </div>
      </div>

      {/* Table & Program Cards Section */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 space-y-4">
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['Semua', 'Produktif', 'Manfaat', 'Pendidikan', 'Infrastruktur'].map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B5E20] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari program wakaf..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-[#1B5E20] transition-all"
            />
          </div>
        </div>

        {/* List of Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredPrograms.map((p) => {
            const percent = p.targetDana > 0 ? Math.min(100, Math.round((p.pokokDanaTerkumpul / p.targetDana) * 100)) : 0;
            const isProduktif = p.jenisWakaf === 'PRODUKTIF_KEKAL';

            return (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-gray-200/90 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between bg-white"
              >
                <div>
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden relative shrink-0">
                      <Image
                        src={p.bannerUrl || '/assets/images/wakaf/wakaf-pembangunan-masjid-al-furqon.png'}
                        alt={p.judul}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            isProduktif
                              ? 'bg-emerald-100 text-[#1B5E20]'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isProduktif ? 'PRODUKTIF KEKAL' : 'WAKAF MANFAAT'}
                        </span>
                        <span className="bg-gray-100 text-gray-600 text-[9px] font-semibold px-1.5 py-0.5 rounded">
                          {p.kategori}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 leading-snug">
                        {p.judul}
                      </h3>
                      <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
                        <span>{p.namaLembaga || 'Yayasan Manarul Ilmi ITS'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="my-2.5">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isProduktif ? 'bg-[#1B5E20]' : 'bg-[#439F46]'
                        }`}
                        style={{ width: `${Math.max(5, percent)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-900">
                      <span>Terkumpul {formatRupiah(p.pokokDanaTerkumpul)}</span>
                      <span className="text-gray-500">{percent}%</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 mt-2">
                  <Link
                    href={`/wakaf/${p.id}`}
                    target="_blank"
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Halaman Publik</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-1.5">
                    {/* Button: Progres Fisik & Kuitansi */}
                    <button
                      type="button"
                      onClick={() => setActiveProgressProgram(p)}
                      className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>Progres & Kuitansi ({p.progressReports?.length || 0})</span>
                    </button>

                    {/* Button: Buka Ledger / Catat Hasil (Only for Produktif) */}
                    {isProduktif ? (
                      <button
                        type="button"
                        onClick={() => setActiveLedgerProgram(p)}
                        className="px-3 py-1.5 bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>{isAdmin ? 'Ledger & Hasil' : 'Ledger'}</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: Input Nomor Registrasi BWI Admin */}
      {showBwiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Input Nomor Registrasi BWI</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBwiModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bwiMessage && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  bwiMessage.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-700'
                }`}
              >
                {bwiMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <X className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{bwiMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveBwi} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  ID Transaksi / Nomor Kwitansi / ID Sertifikat <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={certIdentifier}
                  onChange={(e) => setCertIdentifier(e.target.value)}
                  placeholder="Contoh: AMW-2026-0001 atau UUID Transaksi"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-mono"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Bisa berupa Nomor Kwitansi (AMW-XXXX) atau ID Transaksi Prisma.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Nomor Registrasi BWI RI <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={bwiNumberInput}
                  onChange={(e) => setBwiNumberInput(e.target.value)}
                  placeholder="Contoh: BWI-REG-2026-YMI-0842"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-mono font-bold uppercase"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Nomor ini akan langsung ter-render pada dokumen PDF Sertifikat Digital Wakif.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowBwiModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={isSavingBwi}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isSavingBwi ? 'Menyimpan...' : 'Simpan Nomor BWI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Ledger Wakaf Produktif Panel (For selected program) */}
      {activeLedgerProgram && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {activeLedgerProgram.judul}
                </h3>
                <p className="text-xs text-gray-500">
                  Pengelolaan & Audit Ledger Hasil Investasi Wakaf
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveLedgerProgram(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Embed the WakafYieldLedgerPanel */}
            <WakafYieldLedgerPanel
              programId={activeLedgerProgram.id}
              programTitle={activeLedgerProgram.judul}
              jenisWakaf={activeLedgerProgram.jenisWakaf}
              userRole={userRole}
              initialLedger={activeLedgerProgram.ledger}
              initialYieldEntries={activeLedgerProgram.yieldEntries}
            />
          </div>
        </div>
      )}

      {/* MODAL: Progres Fisik & Kuitansi Belanja Program */}
      {activeProgressProgram && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Laporan Progres & Bukti Kuitansi Belanja
                </h3>
                <p className="text-xs text-gray-500">
                  {activeProgressProgram.judul} ({activeProgressProgram.namaLembaga || 'Nadzir'})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveProgressProgram(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {(!activeProgressProgram.progressReports || activeProgressProgram.progressReports.length === 0) ? (
              <div className="py-12 text-center text-gray-500 text-xs">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                Belum ada laporan progres fisik atau kuitansi belanja yang diunggah untuk program ini.
              </div>
            ) : (
              <div className="space-y-4">
                {activeProgressProgram.progressReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 rounded-2xl bg-gray-50 border border-gray-200/90 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-[#1B5E20]">
                          Progres: {report.persentaseFisik ? `${report.persentaseFisik}%` : '-'}
                        </span>
                        <span className="text-gray-500 text-[11px]">
                          Pelapor: <strong>{report.createdByName || 'Nadzir'}</strong>
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(report.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {report.deskripsi || 'Laporan progres tahapan berkala.'}
                    </p>

                    {/* Visual Receipts List */}
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-[11px] font-bold text-gray-700 block mb-1.5">
                        Lampiran Kuitansi Belanja ({report.kuitansiUrls.length}):
                      </span>
                      {report.kuitansiUrls.length === 0 ? (
                        <span className="text-gray-400 italic text-[11px]">Tidak ada lampiran berkas</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {report.kuitansiUrls.map((url, idx) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-gray-200 hover:border-emerald-300 rounded-xl text-[11px] font-semibold transition-all shadow-2xs"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Kuitansi #{idx + 1}</span>
                              <ExternalLink className="w-3 h-3 text-gray-400" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
