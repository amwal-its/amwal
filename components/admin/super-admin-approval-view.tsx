'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Receipt,
  HeartHandshake,
  Building2,
  Coins,
  FileText,
  Check,
  X,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface PendingApprovalsData {
  counts: {
    nadzir: number;
    withdrawals: number;
    permohonan: number;
    receipts: number;
    total: number;
  };
  pendingNadzir: Array<{
    id: string;
    namaLembaga: string | null;
    kategori: string;
    namaBank: string | null;
    nomorRekeningBank: string | null;
    statusVerifikasi: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string | null;
      phone: string | null;
    };
    documents: Array<{
      id: string;
      tipeDokumen: string;
      fileUrl: string | null;
    }>;
  }>;
  pendingWithdrawals: Array<{
    id: string;
    amount: number;
    peruntukan: string | null;
    rekeningTujuan: string | null;
    adminNotes: string | null;
    status: string;
    createdAt: string;
    waqfProgram: {
      id: string;
      judul: string;
      kategori: string | null;
      targetDana: number;
      jenisWakaf: string;
    };
    requestedBy: {
      id: string;
      name: string;
      email: string | null;
    };
  }>;
  pendingPermohonan: Array<{
    id: string;
    namaPemohon: string;
    namaLembaga: string | null;
    alamatPemohon: string | null;
    nomorSuratPermohonan: string | null;
    kontak: string | null;
    penanggungJawab: string | null;
    nomorRekeningPemohon: string | null;
    namaBank: string | null;
    status: string;
    alokasiDagingDisetujuiKg: number | null;
    createdAt: string;
  }>;
  pendingProgressReports: Array<{
    id: string;
    persentaseFisik: number | null;
    deskripsi: string | null;
    kuitansiUrls: any;
    createdAt: string;
    waqfProgram: {
      id: string;
      judul: string;
      kategori: string | null;
    };
    createdBy: {
      id: string;
      name: string;
    };
  }>;
}

interface SuperAdminApprovalViewProps {
  initialData: PendingApprovalsData;
}

export function SuperAdminApprovalView({ initialData }: SuperAdminApprovalViewProps) {
  const router = useRouter();
  const [data] = useState<PendingApprovalsData>(initialData);
  const [activeSubTab, setActiveSubTab] = useState<'nadzir' | 'withdrawals' | 'permohonan' | 'receipts'>('nadzir');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal Review Nadzir
  const [selectedNadzir, setSelectedNadzir] = useState<any | null>(null);
  const [manualBwiNumber, setManualBwiNumber] = useState('');
  const [nadzirNotes, setNadzirNotes] = useState('');

  // Modal Review Withdrawal
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any | null>(null);
  const [withdrawalNotes, setWithdrawalNotes] = useState('');

  // Verified Receipts State (Manual Boolean Inspection)
  const [verifiedReceiptIds, setVerifiedReceiptIds] = useState<Set<string>>(new Set());

  const toggleReceiptVerification = (reportId: string, urlIdx: number) => {
    const key = `${reportId}-${urlIdx}`;
    setVerifiedReceiptIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleNadzirAction = async (nadzirId: string, status: 'VERIFIED' | 'REJECTED') => {
    if (status === 'REJECTED' && !nadzirNotes.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Catatan alasan penolakan wajib diisi.' });
      return;
    }

    setIsProcessing(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/admin/nadzir/${nadzirId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          nomorRegistrasiBwi: manualBwiNumber.trim() || undefined,
          adminNotes: nadzirNotes.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal memproses verifikasi nadzir');

      setFeedbackMessage({
        type: 'success',
        text: `Nadzir berhasil ${status === 'VERIFIED' ? 'disetujui' : 'ditolak'}.`,
      });
      setSelectedNadzir(null);
      setManualBwiNumber('');
      setNadzirNotes('');
      router.refresh();
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Terjadi kesalahan' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawalAction = async (withdrawalId: string, status: 'APPROVED' | 'REJECTED') => {
    if (status === 'REJECTED' && !withdrawalNotes.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Catatan alasan penolakan pencairan wajib diisi.' });
      return;
    }

    setIsProcessing(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/admin/withdrawal-requests/${withdrawalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNotes: withdrawalNotes.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal memproses penarikan dana');

      setFeedbackMessage({
        type: 'success',
        text: `Pengajuan penarikan dana berhasil ${status === 'APPROVED' ? 'disetujui' : 'ditolak'}.`,
      });
      setSelectedWithdrawal(null);
      setWithdrawalNotes('');
      router.refresh();
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Terjadi kesalahan' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePermohonanAction = async (permohonanId: string, status: 'DISETUJUI' | 'DITOLAK') => {
    setIsProcessing(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/admin/permohonan-institusional/${permohonanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal memproses permohonan');

      setFeedbackMessage({
        type: 'success',
        text: `Permohonan institusional berhasil ${status === 'DISETUJUI' ? 'disetujui' : 'ditolak'}.`,
      });
      router.refresh();
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Terjadi kesalahan' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 px-6 py-6 max-w-7xl mx-auto font-jakarta">
      {/* Top Banner & Title */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Otoritas Super Admin
            </span>
            <span className="text-xs text-gray-500">BWI & Dewan Pengawas Platform</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#1B5E20]" />
            Pusat Persetujuan & Verifikasi Terpadu
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Audit pendaftaran nadzir, verifikasi penarikan termin wakaf, permohonan penyaluran zakat, dan bukti kuitansi belanja.
          </p>
        </div>

        {/* Total Count Badge */}
        <div className="flex items-center gap-3 bg-[#E8F5E9] border border-green-200 px-4 py-3 rounded-2xl shrink-0">
          <Clock className="w-6 h-6 text-[#1B5E20]" />
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Total Antrean Pending
            </span>
            <span className="text-xl font-black text-[#1B5E20]">
              {data.counts.total} Berkas
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('nadzir')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'nadzir'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Verifikasi Nadzir</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-current">
            {data.counts.nadzir}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('withdrawals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'withdrawals'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Penarikan Termin Wakaf</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-current">
            {data.counts.withdrawals}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('permohonan')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'permohonan'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Penyaluran Institusional</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-current">
            {data.counts.permohonan}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('receipts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'receipts'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Bukti Kuitansi Belanja</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-current">
            {data.counts.receipts}
          </span>
        </button>
      </div>

      {/* SUB-TAB 1: VERIFIKASI NADZIR */}
      {activeSubTab === 'nadzir' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1B5E20]" />
              Daftar Permohonan Pendaftaran Lembaga Nadzir
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              Menampilkan {data.pendingNadzir.length} permohonan pending
            </span>
          </div>

          {data.pendingNadzir.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              Tidak ada permohonan pendaftaran nadzir yang menunggu verifikasi saat ini.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.pendingNadzir.map((nz) => (
                <div key={nz.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                        {nz.kategori}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900">
                        {nz.namaLembaga || nz.user.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-3">
                      <span>Ketua/Penanggung Jawab: <strong>{nz.user.name}</strong></span>
                      <span>•</span>
                      <span>Email: {nz.user.email || '-'}</span>
                      <span>•</span>
                      <span>HP: {nz.user.phone || '-'}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Rekening: <strong>{nz.namaBank || 'BSI'}</strong> — {nz.nomorRekeningBank || 'Belum diisi'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-semibold text-gray-400">Dokumen Legalitas:</span>
                      {nz.documents.length === 0 ? (
                        <span className="text-[11px] text-amber-600 italic">Belum ada dokumen diunggah</span>
                      ) : (
                        nz.documents.map((doc) => (
                          <a
                            key={doc.id}
                            href={doc.fileUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                          >
                            <FileText className="w-3 h-3" />
                            {doc.tipeDokumen}
                          </a>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedNadzir(nz)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1B5E20] hover:bg-[#144718] text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Review & Verifikasi</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: PENARIKAN TERMIN WAKAF */}
      {activeSubTab === 'withdrawals' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#1B5E20]" />
              Daftar Pengajuan Penarikan Termin Pokok/Hasil Wakaf
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              Menampilkan {data.pendingWithdrawals.length} pengajuan
            </span>
          </div>

          {data.pendingWithdrawals.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              Tidak ada permohonan penarikan dana yang pending saat ini.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.pendingWithdrawals.map((w) => (
                <div key={w.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                        {w.waqfProgram.jenisWakaf}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900">
                        {w.waqfProgram.judul}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600">
                      Diajukan oleh: <strong>{w.requestedBy.name}</strong> ({w.requestedBy.email})
                    </p>
                    <p className="text-xs text-gray-500">
                      Peruntukan: <em>&quot;{w.peruntukan || 'Penyaluran dana pembangunan tahap termin'}&quot;</em>
                    </p>
                    <p className="text-xs text-gray-500">
                      Rekening Tujuan: <strong>{w.rekeningTujuan || 'Rekening Operasional Nadzir'}</strong>
                    </p>
                  </div>

                  <div className="flex flex-col md:items-end gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold block">NOMINAL DIMOHON</span>
                      <span className="text-base font-black text-[#1B5E20]">
                        {formatRupiah(Number(w.amount))}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedWithdrawal(w)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1B5E20] hover:bg-[#144718] text-white flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Persetujuan</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: PENYALURAN INSTITUSIONAL */}
      {activeSubTab === 'permohonan' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#1B5E20]" />
              Permohonan Penyaluran Bantuan Institusional
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              Menampilkan {data.pendingPermohonan.length} permohonan
            </span>
          </div>

          {data.pendingPermohonan.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              Tidak ada permohonan penyaluran bantuan institusional yang pending.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.pendingPermohonan.map((p) => (
                <div key={p.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {p.namaLembaga || 'Lembaga / Yayasan'}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900">
                        {p.namaPemohon}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600">
                      Penanggung Jawab: <strong>{p.penanggungJawab || p.namaPemohon}</strong> • Kontak: {p.kontak || '-'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Alamat: {p.alamatPemohon || '-'} • No. Surat: {p.nomorSuratPermohonan || '-'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Rekening: <strong>{p.namaBank || 'BSI'}</strong> — {p.nomorRekeningPemohon || '-'}
                    </p>
                  </div>

                  <div className="flex flex-col md:items-end gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold block">ALOKASI DISETUJUI</span>
                      <span className="text-base font-black text-[#1B5E20]">
                        {p.alokasiDagingDisetujuiKg ? `${p.alokasiDagingDisetujuiKg} Kg` : 'Menunggu Review'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handlePermohonanAction(p.id, 'DISETUJUI')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1B5E20] hover:bg-[#144718] text-white flex items-center gap-1 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Setujui</span>
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handlePermohonanAction(p.id, 'DITOLAK')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Tolak</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: KUITANSI BELANJA PROYEK */}
      {activeSubTab === 'receipts' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#1B5E20]" />
                Audit Dokumen Kuitansi Belanja Program Fisik
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                Verifikasi manual visual kuitansi belanja yang dilaporkan Nadzir (tanpa OCR)
              </span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
              {data.pendingProgressReports.length} Laporan Progres
            </span>
          </div>

          {data.pendingProgressReports.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              Tidak ada kuitansi laporan progres yang perlu diperiksa saat ini.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.pendingProgressReports.map((r) => (
                <div key={r.id} className="p-5 hover:bg-slate-50 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {r.waqfProgram.judul}
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Pelapor: <strong>{r.createdBy.name}</strong> • Progres Fisik: <strong>{Number(r.persentaseFisik || 0)}%</strong>
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(r.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed bg-white p-3 rounded-xl border border-gray-100">
                    <strong>Catatan Lapangan:</strong> {r.deskripsi || 'Laporan progres termin berkala.'}
                  </p>

                  {/* Visual Receipts Gallery */}
                  <div>
                    <span className="text-[11px] font-bold text-gray-700 block mb-2">
                      Galeri Berkas Kuitansi Belanja ({Array.isArray(r.kuitansiUrls) ? r.kuitansiUrls.length : 0}):
                    </span>
                    {Array.isArray(r.kuitansiUrls) && r.kuitansiUrls.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {r.kuitansiUrls.map((url: string, idx: number) => {
                          const isVerified = verifiedReceiptIds.has(`${r.id}-${idx}`);
                          return (
                            <div
                              key={idx}
                              className={`p-3 rounded-xl border transition-all bg-white flex flex-col justify-between gap-2.5 ${
                                isVerified
                                  ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                  <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                                  Kuitansi #{idx + 1}
                                </span>
                                {isVerified ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    Terverifikasi
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                    Belum Ditandai
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 py-1.5 px-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-[11px] text-center inline-flex items-center justify-center gap-1"
                                >
                                  <span>Buka Berkas</span>
                                  <ExternalLink className="w-3 h-3 text-gray-400" />
                                </a>

                                <button
                                  type="button"
                                  onClick={() => toggleReceiptVerification(r.id, idx)}
                                  className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                    isVerified
                                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                      : 'bg-[#1B5E20] text-white hover:bg-[#154a19] shadow-2xs'
                                  }`}
                                >
                                  {isVerified ? 'Batal' : 'Tandai Sah'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Tidak ada lampiran kuitansi</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL REVIEW NADZIR (MANUAL BWI INPUT) */}
      {selectedNadzir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Verifikasi Lembaga Nadzir
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedNadzir.namaLembaga || selectedNadzir.user.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNadzir(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kategori Lembaga:</span>
                  <span className="font-bold text-gray-900">{selectedNadzir.kategori}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ketua Pengurus:</span>
                  <span className="font-bold text-gray-900">{selectedNadzir.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-bold text-gray-900">{selectedNadzir.user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nomor Rekening:</span>
                  <span className="font-bold text-gray-900">{selectedNadzir.namaBank} - {selectedNadzir.nomorRekeningBank}</span>
                </div>
              </div>

              {/* MANUAL BWI REGISTRATION NUMBER INPUT */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Nomor Registrasi BWI (Badan Wakaf Indonesia)
                </label>
                <input
                  type="text"
                  value={manualBwiNumber}
                  onChange={(e) => setManualBwiNumber(e.target.value)}
                  placeholder="Contoh: 3.3.00192/BWI/2026 (Diisi manual oleh Admin)"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20]"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Input nomor registrasi resmi yang diterbitkan oleh BWI.
                </p>
              </div>

              {/* ADMIN NOTES */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Catatan Admin / SK Verifikasi
                </label>
                <textarea
                  rows={3}
                  value={nadzirNotes}
                  onChange={(e) => setNadzirNotes(e.target.value)}
                  placeholder="Tuliskan catatan verifikasi atau alasan perbaikan berkas..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] resize-none"
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleNadzirAction(selectedNadzir.id, 'VERIFIED')}
                className="flex-1 h-11 bg-[#1B5E20] hover:bg-[#144718] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 stroke-[3]" />}
                <span>Setujui & Terbitkan Status BWI</span>
              </button>

              <button
                type="button"
                disabled={isProcessing || !nadzirNotes.trim()}
                onClick={() => handleNadzirAction(selectedNadzir.id, 'REJECTED')}
                className="px-4 h-11 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title={!nadzirNotes.trim() ? "Wajib isi catatan penolakan" : undefined}
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REVIEW WITHDRAWAL */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Persetujuan Penarikan Termin
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedWithdrawal.waqfProgram.judul}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWithdrawal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Nominal Pencairan</span>
                <span className="text-2xl font-black text-[#1B5E20] block mt-1">
                  {formatRupiah(Number(selectedWithdrawal.amount))}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Catatan Persetujuan Pencairan Dana <span className="text-rose-500 text-[10px] font-normal">(Wajib jika menolak)</span>
                </label>
                <textarea
                  rows={3}
                  value={withdrawalNotes}
                  onChange={(e) => setWithdrawalNotes(e.target.value)}
                  placeholder="Instruksi pencairan atau alasan penolakan..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleWithdrawalAction(selectedWithdrawal.id, 'APPROVED')}
                className="flex-1 h-11 bg-[#1B5E20] hover:bg-[#144718] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 stroke-[3]" />}
                <span>Setujui Pencairan Termin</span>
              </button>

              <button
                type="button"
                disabled={isProcessing || !withdrawalNotes.trim()}
                onClick={() => handleWithdrawalAction(selectedWithdrawal.id, 'REJECTED')}
                className="px-4 h-11 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title={!withdrawalNotes.trim() ? "Wajib isi catatan penolakan" : undefined}
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
