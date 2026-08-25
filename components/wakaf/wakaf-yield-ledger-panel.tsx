'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Lock,
  Coins,
  ArrowUpRight,
  PlusCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  Loader2,
  X,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export interface YieldEntryItem {
  id: string;
  amount: number;
  sourceDescription: string;
  recordedAt: string;
  recordedByAdminId: string;
  adminName?: string;
}

export interface LedgerMetrics {
  pokokDanaTerkumpul: number;
  totalHasilAvailable: number;
  hasilInvestasiTersalurkan: number;
}

interface WakafYieldLedgerPanelProps {
  programId: string;
  programTitle: string;
  jenisWakaf: 'PRODUKTIF_KEKAL' | 'HABIS_PAKAI' | string;
  userRole?: 'ADMIN' | 'NADZIR' | 'WAKIF' | 'PETUGAS_LAPANGAN' | string | null;
  initialLedger?: LedgerMetrics | null;
  initialYieldEntries?: YieldEntryItem[];
}

export function WakafYieldLedgerPanel({
  programId,
  programTitle,
  jenisWakaf,
  userRole = 'NADZIR',
  initialLedger,
  initialYieldEntries = [],
}: WakafYieldLedgerPanelProps) {
  // CRITICAL REQUIREMENT 1: Do NOT render to DOM if HABIS_PAKAI
  if (jenisWakaf !== 'PRODUKTIF_KEKAL') {
    return null;
  }

  const isAdmin = userRole === 'ADMIN';

  const [ledger, setLedger] = useState<LedgerMetrics>({
    pokokDanaTerkumpul: initialLedger?.pokokDanaTerkumpul || 0,
    totalHasilAvailable: initialLedger?.totalHasilAvailable || 0,
    hasilInvestasiTersalurkan: initialLedger?.hasilInvestasiTersalurkan || 0,
  });

  const [yieldEntries, setYieldEntries] = useState<YieldEntryItem[]>(initialYieldEntries);
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const [amountInput, setAmountInput] = useState<string>('');
  const [sourceDescription, setSourceDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const parsedAmount = parseInt(amountInput.replace(/\D/g, ''), 10) || 0;

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (parsedAmount <= 0) {
      setErrorMessage('Nominal hasil investasi harus lebih besar dari 0');
      return;
    }
    if (!sourceDescription.trim()) {
      setErrorMessage('Deskripsi sumber hasil investasi wajib diisi');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleExecuteSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/wakaf/programs/${programId}/yield-entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parsedAmount,
          sourceDescription: sourceDescription.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal mencatat hasil investasi.');
        setIsSubmitting(false);
        setShowConfirmModal(false);
        return;
      }

      // Live update ledger without full page reload
      setLedger((prev) => ({
        ...prev,
        totalHasilAvailable: prev.totalHasilAvailable + parsedAmount,
      }));

      // Prepend new entry
      const newEntry: YieldEntryItem = {
        id: data.data?.entry?.id || `yield-${Date.now()}`,
        amount: parsedAmount,
        sourceDescription: sourceDescription.trim(),
        recordedAt: new Date().toISOString(),
        recordedByAdminId: 'admin',
        adminName: 'Super Admin',
      };
      setYieldEntries((prev) => [newEntry, ...prev]);

      // Reset form
      setAmountInput('');
      setSourceDescription('');
      setShowConfirmModal(false);
      setShowInputModal(false);
      setIsSubmitting(false);

      setSuccessToast('Hasil investasi berhasil dicatat & saldo tersedia telah diperbarui!');
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      console.error('Submit yield error:', err);
      setErrorMessage('Terjadi kendala jaringan saat menghubungi server.');
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-4 sm:p-6 mb-6 font-jakarta antialiased">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#439F46] flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Ledger Wakaf Produktif & Bagi Hasil
              </h2>
              <span className="bg-emerald-100 text-[#2E7D32] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Produktif Kekal
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Transparansi tatakelola dana abadi & distribusi hasil investasi
            </p>
          </div>
        </div>

        {/* Action Button: ONLY for ADMIN */}
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setShowInputModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#439F46] hover:bg-[#388E3C] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Catat Hasil Investasi</span>
          </button>
        )}
      </div>

      {/* Toast Notification */}
      {successToast && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* 3-Metric Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
        {/* Metric 1: Pokok Dana (Kekal) */}
        <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-600">Pokok Dana (Kekal)</span>
            <div className="w-7 h-7 rounded-lg bg-gray-200/70 text-gray-700 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold text-gray-900 block">
              {formatRupiah(ledger.pokokDanaTerkumpul)}
            </span>
            {/* Clear label "Tidak pernah berkurang" */}
            <span className="inline-block mt-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/70">
              🔒 Tidak pernah berkurang
            </span>
          </div>
        </div>

        {/* Metric 2: Hasil Tersedia */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-emerald-900">Hasil Tersedia (Available)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-200/70 text-emerald-800 flex items-center justify-center">
              <Coins className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold text-[#2E7D32] block">
              {formatRupiah(ledger.totalHasilAvailable)}
            </span>
            <span className="inline-block mt-1 text-[11px] text-emerald-700 font-medium">
              Siap disalurkan ke Mauquf Alaih
            </span>
          </div>
        </div>

        {/* Metric 3: Hasil Tersalurkan */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-blue-900">Hasil Tersalurkan</span>
            <div className="w-7 h-7 rounded-lg bg-blue-200/70 text-blue-800 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold text-blue-800 block">
              {formatRupiah(ledger.hasilInvestasiTersalurkan)}
            </span>
            <span className="inline-block mt-1 text-[11px] text-blue-700 font-medium">
              Manfaat terdistribusi ke umat
            </span>
          </div>
        </div>
      </div>

      {/* Riwayat Hasil Investasi (WaqfYieldEntry List) */}
      <div className="border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>Riwayat Pencatatan Hasil Investasi</span>
          </h3>
          <span className="text-xs text-gray-400 font-medium">
            {yieldEntries.length} Catatan
          </span>
        </div>

        {yieldEntries.length === 0 ? (
          <div className="py-8 text-center text-gray-400 bg-gray-50/60 rounded-xl border border-dashed border-gray-200">
            <p className="text-xs font-medium">Belum ada catatan hasil investasi untuk program ini.</p>
            {isAdmin && <p className="text-[11px] text-gray-400 mt-1">Gunakan tombol di atas untuk mencatat dividen/hasil kelolaan pertama.</p>}
          </div>
        ) : (
          <div className="space-y-2.5">
            {yieldEntries.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-gray-900">
                      +{formatRupiah(item.amount)}
                    </span>
                    <span className="bg-emerald-50 text-[#2E7D32] text-[10px] font-bold px-1.5 py-0.2 rounded">
                      Hasil Masuk
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {item.sourceDescription}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] text-gray-400 block">
                    {new Date(item.recordedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="text-[11px] font-medium text-gray-500 flex items-center sm:justify-end gap-1 mt-0.5">
                    <UserCheck className="w-3 h-3 text-[#439F46]" />
                    <span>Dicatat oleh: {item.adminName || 'Admin BWI/YMI'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: Form Input Pencatatan Hasil Investasi (ADMIN ONLY) */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#439F46] flex items-center justify-center">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Catat Hasil Investasi</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInputModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleOpenConfirm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Program Wakaf
                </label>
                <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  {programTitle}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Nominal Hasil / Dividen (Rp) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={amountInput}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      setAmountInput(raw ? parseInt(raw, 10).toLocaleString('id-ID') : '');
                    }}
                    placeholder="Contoh: 4.500.000"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Sumber Hasil Investasi <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={sourceDescription}
                  onChange={(e) => setSourceDescription(e.target.value)}
                  placeholder="Contoh: Bagi hasil dividen panen kebun pisang cavendish Q2 2026..."
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowInputModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#439F46] hover:bg-[#388E3C] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Lanjut Konfirmasi →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Mandatory Confirmation Modal (DoD requirement) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-1">
              Konfirmasi Pencatatan Hasil
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Pastikan rincian hasil investasi di bawah ini sudah sesuai dengan laporan rekonsiliasi perbankan/bisnis:
            </p>

            <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3.5 text-left text-xs space-y-2 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Nominal:</span>
                <span className="font-bold text-[#2E7D32] text-sm">{formatRupiah(parsedAmount)}</span>
              </div>
              <div className="flex flex-col gap-0.5 pt-1 border-t border-gray-200/70">
                <span className="text-gray-500 font-medium">Sumber:</span>
                <span className="text-gray-800 font-semibold">{sourceDescription}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-60"
              >
                Kembali Edit
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleExecuteSubmit}
                className="flex-1 py-2.5 bg-[#439F46] hover:bg-[#388E3C] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Ya, Konfirmasi & Simpan</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
