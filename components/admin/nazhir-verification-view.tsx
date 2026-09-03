'use client';

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  Eye,
  AlertCircle,
  Mail,
  Phone,
  Landmark,
  User,
  Check,
  X,
  Loader2,
  Award,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface NadzirItem {
  id: string;
  namaLembaga: string | null;
  kategori: string;
  namaBank: string | null;
  nomorRekeningBank: string | null;
  statusVerifikasi: string;
  verifiedAt: string | null;
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
  programsCount: number;
}

interface NazhirVerificationViewProps {
  initialNadzirs: NadzirItem[];
}

export function NazhirVerificationView({ initialNadzirs }: NazhirVerificationViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'verified'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNadzir, setSelectedNadzir] = useState<NadzirItem | null>(null);
  const [manualBwiNumber, setManualBwiNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const pendingList = initialNadzirs.filter(
    (n) => n.statusVerifikasi === 'PENDING'
  );
  const verifiedList = initialNadzirs.filter(
    (n) => n.statusVerifikasi === 'VERIFIED'
  );

  const filteredList = (activeTab === 'pending' ? pendingList : verifiedList).filter((n) => {
    const term = searchQuery.toLowerCase();
    return (
      (n.namaLembaga || '').toLowerCase().includes(term) ||
      (n.user.name || '').toLowerCase().includes(term) ||
      (n.user.email || '').toLowerCase().includes(term)
    );
  });

  const handleVerifyAction = async (nadzirId: string, status: 'VERIFIED' | 'REJECTED') => {
    if (status === 'REJECTED' && !adminNotes.trim()) {
      setFeedback({ type: 'error', text: 'Catatan verifikasi (alasan penolakan) wajib diisi untuk menolak permohonan.' });
      return;
    }

    setIsProcessing(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/nadzir/${nadzirId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          nomorRegistrasiBwi: manualBwiNumber.trim() || undefined,
          adminNotes: adminNotes.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal memproses verifikasi');

      setFeedback({
        type: 'success',
        text: `Lembaga Nadzir berhasil ${status === 'VERIFIED' ? 'diverifikasi' : 'ditolak'}.`,
      });
      setSelectedNadzir(null);
      setManualBwiNumber('');
      setAdminNotes('');
      router.refresh();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Terjadi kesalahan sistem' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 px-6 py-6 max-w-7xl mx-auto font-jakarta">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Otoritas Regulasi BWI
            </span>
            <span className="text-xs text-gray-500">Kepatuhan Badan Wakaf Indonesia</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-[#1B5E20]" />
            Verifikasi Lembaga Nadzir & Kepatuhan Legalitas
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Audit legalitas badan hukum, rekomendasi syariah MUI, rekening LKS-PWU, dan penerbitan nomor registrasi BWI manual.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#E8F5E9] border border-green-200 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] font-bold text-gray-500 block uppercase">Pending</span>
            <span className="text-lg font-black text-[#1B5E20]">{pendingList.length}</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] font-bold text-gray-500 block uppercase">Terverifikasi</span>
            <span className="text-lg font-black text-blue-700">{verifiedList.length}</span>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-[#1B5E20] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Permohonan Menunggu ({pendingList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verified')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'verified'
                ? 'bg-[#1B5E20] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Nadzir Terverifikasi BWI ({verifiedList.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama lembaga / ketua..."
            className="w-full pl-9.5 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20]"
          />
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            Tidak ada data lembaga nadzir pada kategori ini.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredList.map((nz) => (
              <div
                key={nz.id}
                className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                      {nz.kategori}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900">
                      {nz.namaLembaga || nz.user.name}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-600 flex items-center gap-3">
                    <span>Ketua: <strong>{nz.user.name}</strong></span>
                    <span>•</span>
                    <span>Email: {nz.user.email || '-'}</span>
                    <span>•</span>
                    <span>HP: {nz.user.phone || '-'}</span>
                  </p>

                  <p className="text-xs text-gray-500">
                    Rekening LKS-PWU: <strong>{nz.namaBank || 'BSI'}</strong> — {nz.nomorRekeningBank || 'Belum diisi'}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] font-semibold text-gray-400">Dokumen Legalitas:</span>
                    {nz.documents.length === 0 ? (
                      <span className="text-[11px] text-amber-600 italic">Belum ada dokumen</span>
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
                  {nz.statusVerifikasi === 'PENDING' ? (
                    <button
                      type="button"
                      onClick={() => setSelectedNadzir(nz)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1B5E20] hover:bg-[#144718] text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Review & Verifikasi</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        Terverifikasi BWI
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Review & Manual BWI Input */}
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
                  <span className="text-gray-500">Kategori:</span>
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

              {/* MANUAL BWI REGISTRATION NUMBER INPUT (NO AUTO-GENERATE) */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Nomor Registrasi BWI (Badan Wakaf Indonesia)
                </label>
                <input
                  type="text"
                  value={manualBwiNumber}
                  onChange={(e) => setManualBwiNumber(e.target.value)}
                  placeholder="Contoh: 3.3.00192/BWI/2026 (Wajib diinput manual oleh Admin)"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20]"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Input nomor registrasi resmi yang diterbitkan oleh BWI.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Catatan Verifikasi Admin
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Catatan persetujuan atau instruksi perbaikan dokumen..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleVerifyAction(selectedNadzir.id, 'VERIFIED')}
                className="flex-1 h-11 bg-[#1B5E20] hover:bg-[#144718] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 stroke-[3]" />}
                <span>Setujui & Terbitkan Status BWI</span>
              </button>

              <button
                type="button"
                disabled={isProcessing || !adminNotes.trim()}
                onClick={() => handleVerifyAction(selectedNadzir.id, 'REJECTED')}
                className="px-4 h-11 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title={!adminNotes.trim() ? 'Wajib mengisi catatan verifikasi alasan penolakan' : 'Tolak permohonan'}
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
