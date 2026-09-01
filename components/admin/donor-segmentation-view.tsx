'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Award,
  Calendar,
  Layers,
  ArrowUpDown,
  ExternalLink,
  Phone,
  Send,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { DrmSimulationBanner } from '@/components/admin/drm-simulation-banner';
import {
  mockDonorsList,
  mockDonorSegments,
  MockDonor,
} from '@/lib/mock-drm-analytics';

export function DonorSegmentationView() {
  const { showToast } = useToast();
  const [activeSegmentFilter, setActiveSegmentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonor, setSelectedDonor] = useState<MockDonor | null>(null);

  const getSegmentBadgeStyle = (segment: string) => {
    switch (segment) {
      case 'Champion':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold';
      case 'Loyal':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
      case 'New':
        return 'bg-blue-50 text-blue-800 border-blue-200 font-bold';
      case 'At-Risk':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold';
      case 'Lapsed':
        return 'bg-rose-100 text-rose-900 border-rose-300 font-extrabold';
      case 'Situational':
        return 'bg-teal-50 text-teal-800 border-teal-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const filteredDonors = mockDonorsList.filter((d) => {
    const matchesSegment =
      activeSegmentFilter === 'ALL' || d.segment.toUpperCase() === activeSegmentFilter.toUpperCase();
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSegment && matchesSearch;
  });

  const handleSendNudge = (donor: MockDonor, messageType: string) => {
    showToast({
      title: `Pesan Nudge Terkirim (${messageType})`,
      description: `Pesan berhasil dikirimkan ke kontak ${donor.name} (${donor.phone || donor.email}).`,
      type: 'success',
    });
  };

  const handleExportLedger = () => {
    showToast({
      title: 'Unduhan Dimulai',
      description: 'Laporan Segmentasi RFM-D (Excel / CSV) sedang diexport...',
      type: 'info',
    });
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 py-6 max-w-7xl mx-auto font-jakarta">
      {/* Header Cards & Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {/* Mandatory Simulation Warning Banner */}
        <DrmSimulationBanner />

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-800" />
                Analisis &amp; Kelompok Donatur (Segmentasi RFM-D)
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Pengelompokan donatur otomatis berdasarkan keaktifan donasi, frekuensi, nominal rupiah, dan variasi program yang diikuti.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportLedger}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 border border-slate-200 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export RFMD Ledger</span>
              </button>
            </div>
          </div>

          {/* Filter Segment Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['ALL', 'Champion', 'Loyal', 'New', 'At-Risk', 'Lapsed', 'Situational'].map((seg) => (
              <button
                key={seg}
                type="button"
                onClick={() => setActiveSegmentFilter(seg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border whitespace-nowrap cursor-pointer ${
                  activeSegmentFilter === seg
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {seg === 'ALL' ? 'Semua Segmen (12.080)' : seg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ID Donor, Nama, Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition outline-hidden"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <strong className="text-slate-900">{filteredDonors.length}</strong> donor terdaftar (simulasi)
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Donor ID &amp; Nama</th>
                <th className="py-3 px-3">Penghasilan</th>
                <th className="py-3 px-3">Segmen RFMD</th>
                <th className="py-3 px-3">Recency</th>
                <th className="py-3 px-3">Frequency</th>
                <th className="py-3 px-3">Monetary</th>
                <th className="py-3 px-3">Diversity (Akad)</th>
                <th className="py-3 px-3">Skor RFMD</th>
                <th className="py-3 px-4 text-right">Aksi Strategis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonors.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition">
                  {/* Donor Info */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-extrabold flex items-center justify-center text-xs">
                        {d.name.charAt(0)}
                      </div>
                      <div>
                        <div
                          className="font-bold text-slate-900 hover:text-emerald-800 cursor-pointer"
                          onClick={() => setSelectedDonor(d)}
                        >
                          {d.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{d.id} • {d.phone}</div>
                      </div>
                    </div>
                  </td>

                  {/* Penghasilan */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="text-slate-700 font-semibold text-[11px]">
                      {d.incomeRange}
                    </span>
                  </td>

                  {/* Segment */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] border ${getSegmentBadgeStyle(d.segment)}`}>
                      {d.segment}
                    </span>
                  </td>

                  {/* Recency */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="font-semibold text-slate-800">{d.recency}</span>
                  </td>

                  {/* Frequency */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="font-bold text-slate-900">{d.frequency}x</span>
                  </td>

                  {/* Monetary */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="font-extrabold text-emerald-900">{d.monetary}</span>
                  </td>

                  {/* Diversity */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {d.akads.map((ak, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                          {ak}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* RFMD Score */}
                  <td className="py-3.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600 font-medium">
                    {d.rfmdScore}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSendNudge(d, 'WhatsApp Nudge')}
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer"
                        title="Kirim WA Nudge"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDonor(d)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition cursor-pointer"
                      >
                        Detail Profil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Donor Profile Modal Drawer */}
      {selectedDonor && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 bg-emerald-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-black text-sm flex items-center justify-center border border-emerald-600">
                  {selectedDonor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-snug">{selectedDonor.name}</h3>
                  <p className="text-xs text-emerald-200 font-mono">{selectedDonor.id} • {selectedDonor.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDonor(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-medium block text-[10px]">Segmen RFMD</span>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-xs border ${getSegmentBadgeStyle(selectedDonor.segment)}`}>
                    {selectedDonor.segment}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-medium block text-[10px]">Total Lifetime Donasi</span>
                  <span className="font-black text-emerald-900 text-sm mt-1 block">{selectedDonor.monetary}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-medium block text-[10px]">Aktivitas Terakhir</span>
                  <span className="font-bold text-slate-800 text-xs mt-1 block">{selectedDonor.recency}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-medium block text-[10px]">Keberagaman Akad</span>
                  <span className="font-bold text-slate-800 text-xs mt-1 block">{selectedDonor.diversity} Akad Terdaftar</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Riwayat Akad Terdaftar:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDonor.akads.map((ak: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200">
                      {ak}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-700" />
                  Rekomendasi Aksi Sistem
                </div>
                <p className="text-amber-800 text-[11px] leading-snug">
                  {selectedDonor.segment === 'Champion' && 'Undang menjadi Ambassador Waqf Abadi & berikan sertifikat penghargaan digital BWI.'}
                  {selectedDonor.segment === 'Loyal' && 'Tawarkan fitur Autodebet bulanan untuk Akad Waqf Uang berkala.'}
                  {selectedDonor.segment === 'New' && 'Kirimkan video greeting transparansi penggunaan dana 30 hari pertama.'}
                  {selectedDonor.segment === 'At-Risk' && 'Lakukan panggilan silaturahmi oleh Nadzir untuk menanyakan feedback program.'}
                  {selectedDonor.segment === 'Lapsed' && 'Ajak kembali berdonasi via program Waqf Produktif berkonsep pemberdayaan.'}
                  {selectedDonor.segment === 'Situational' && 'Kirimkan katalog program darurat & persiapan Ramadhan.'}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleSendNudge(selectedDonor, 'Sertifikat & Nudge WA');
                    setSelectedDonor(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Nudge WA &amp; Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
