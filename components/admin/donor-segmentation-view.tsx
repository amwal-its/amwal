'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Download,
  Mail,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Award,
  Calendar,
  Layers,
  ExternalLink,
  Phone,
  Send,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export function DonorSegmentationView() {
  const { showToast } = useToast();
  const [activeSegmentFilter, setActiveSegmentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonor, setSelectedDonor] = useState<any | null>(null);

  const donorsList = [
    {
      id: 'DNR-8401',
      name: 'H. Bambang Soewito',
      email: 'bambang.s@gmail.com',
      phone: '+62 812-9840-1122',
      segment: 'Champion',
      recency: '8 hari lalu',
      recencyDays: 8,
      frequency: 18,
      monetary: 'Rp 48.500.000',
      monetaryVal: 48500000,
      diversity: 4,
      akads: ['Waqf Uang', 'Waqf Pembangunan', 'Infaq Subuh', 'Zakat Maal'],
      lastAkad: 'Waqf Pembangunan Klinik Al-Azhar',
      rfmdScore: 'R: 5 | F: 5 | M: 5 | D: 4',
      status: 'Sangat Aktif',
    },
    {
      id: 'DNR-8402',
      name: 'Hj. Siti Rahmah, S.E.',
      email: 'siti.rahmah@yahoo.co.id',
      phone: '+62 811-2345-6789',
      segment: 'Loyal',
      recency: '15 hari lalu',
      recencyDays: 15,
      frequency: 12,
      monetary: 'Rp 14.200.000',
      monetaryVal: 14200000,
      diversity: 3,
      akads: ['Waqf Uang', 'Infaq Operasional Ambulans', 'Sedekah Subuh'],
      lastAkad: 'Infaq Operasional Ambulans Gratis',
      rfmdScore: 'R: 4 | F: 4 | M: 4 | D: 3',
      status: 'Aktif Rutin',
    },
    {
      id: 'DNR-8403',
      name: 'Ahmad Subandi',
      email: 'ahmad.subandi@gmail.com',
      phone: '+62 856-7788-9900',
      segment: 'New',
      recency: '4 hari lalu',
      recencyDays: 4,
      frequency: 1,
      monetary: 'Rp 1.500.000',
      monetaryVal: 1500000,
      diversity: 1,
      akads: ['Waqf Sumur Air Bersih Sukabumi'],
      lastAkad: 'Sumur Waqf Sukabumi',
      rfmdScore: 'R: 5 | F: 1 | M: 2 | D: 1',
      status: 'Onboarding 30 Hari',
    },
    {
      id: 'DNR-8404',
      name: 'Drs. Irwan Wijaya',
      email: 'irwan.w@corporate.co.id',
      phone: '+62 813-1122-3344',
      segment: 'At-Risk',
      recency: '72 hari lalu',
      recencyDays: 72,
      frequency: 7,
      monetary: 'Rp 8.900.000',
      monetaryVal: 8900000,
      diversity: 2,
      akads: ['Waqf Uang', 'Infaq Masjid'],
      lastAkad: 'Waqf Uang Masjid Al-Kautsar',
      rfmdScore: 'R: 2 | F: 3 | M: 3 | D: 2',
      status: 'Butuh Retargeting',
    },
    {
      id: 'DNR-8405',
      name: 'Faisal Basri, M.Kom.',
      email: 'faisal.basri@startup.io',
      phone: '+62 819-4455-6677',
      segment: 'Lapsed',
      recency: '194 hari lalu',
      recencyDays: 194,
      frequency: 4,
      monetary: 'Rp 3.400.000',
      monetaryVal: 3400000,
      diversity: 2,
      akads: ['Waqf Sumur Air Bersih', 'Sedekah Subuh'],
      lastAkad: 'Waqf Air Bersih Nurul Amanah',
      rfmdScore: 'R: 1 | F: 2 | M: 2 | D: 1',
      status: 'Pasif > 6 Bulan',
    },
    {
      id: 'DNR-8406',
      name: 'dr. H. Rahmat Hidayat, Sp.A.',
      email: 'dr.rahmat@hospital.com',
      phone: '+62 812-3344-5566',
      segment: 'Champion',
      recency: '12 hari lalu',
      recencyDays: 12,
      frequency: 24,
      monetary: 'Rp 75.000.000',
      monetaryVal: 75000000,
      diversity: 5,
      akads: ['Waqf Produktif RS', 'Waqf Air', 'Zakat Mal', 'Qurban', 'Infaq'],
      lastAkad: 'Waqf Alat Medis Inkubator Gratis',
      rfmdScore: 'R: 5 | F: 5 | M: 5 | D: 5',
      status: 'Duta Wakaf Utama',
    },
    {
      id: 'DNR-8407',
      name: 'Keluarga Alm. H. Sudirman',
      email: 'kel.sudirman@foundation.org',
      phone: '+62 811-7788-9911',
      segment: 'Loyal',
      recency: '28 hari lalu',
      recencyDays: 28,
      frequency: 14,
      monetary: 'Rp 32.000.000',
      monetaryVal: 32000000,
      diversity: 3,
      akads: ['Waqf Abadi', 'Infaq Pesantren', 'Zakat Maal'],
      lastAkad: 'Waqf Fasilitas Asrama Tahfidz',
      rfmdScore: 'R: 4 | F: 4 | M: 5 | D: 3',
      status: 'Rutin Per Bulan',
    },
    {
      id: 'DNR-8408',
      name: 'Rina Kusumawati, S.Psi.',
      email: 'rina.k@gmail.com',
      phone: '+62 878-1122-8899',
      segment: 'Situational',
      recency: '110 hari lalu',
      recencyDays: 110,
      frequency: 3,
      monetary: 'Rp 2.100.000',
      monetaryVal: 2100000,
      diversity: 2,
      akads: ['Sedekah Bencana Semeru', 'Infaq Ramadhan'],
      lastAkad: 'Tanggap Darurat Banjir Demak',
      rfmdScore: 'R: 2 | F: 2 | M: 2 | D: 2',
      status: 'Insidental Musiman',
    },
  ];

  const filteredDonors = donorsList.filter((donor) => {
    const matchSegment =
      activeSegmentFilter === 'ALL' || donor.segment.toLowerCase() === activeSegmentFilter.toLowerCase();
    const matchQuery =
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSegment && matchQuery;
  });

  const getSegmentBadge = (seg: string) => {
    switch (seg) {
      case 'Champion':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold';
      case 'Loyal':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
      case 'New':
        return 'bg-green-100 text-green-800 border-green-200 font-medium';
      case 'At-Risk':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Lapsed':
        return 'bg-rose-100 text-rose-800 border-rose-200 font-medium';
      case 'Situational':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200 font-medium';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleExportLedger = () => {
    showToast({
      title: 'Ledger RFMD Diunduh',
      description: 'Berkas database segmentasi 12.080 donatur berhasil diexport ke format CSV / Excel.',
      type: 'success',
    });
  };

  const handleSendNudge = (donor: any, actionType: string) => {
    showToast({
      title: `Aksi ${actionType} Berhasil`,
      description: `Pesan personalisasi & laporan progres penyaluran terkirim ke WhatsApp ${donor.phone}.`,
      type: 'success',
    });
    setSelectedDonor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Cards & Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users size={20} className="text-emerald-800 shrink-0" />
                Analisis &amp; Kelompok Donatur (Segmentasi)
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                using dummy data
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pengelompokan donatur otomatis berdasarkan keaktifan donasi, frekuensi, nominal rupiah, dan variasi program yang diikuti.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportLedger}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 border border-slate-200 transition cursor-pointer"
            >
              <Download size={16} className="shrink-0" />
              Export RFMD Ledger
            </button>
          </div>
        </div>

        {/* Filter Segment Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['ALL', 'Champion', 'Loyal', 'New', 'At-Risk', 'Lapsed', 'Situational'].map((seg) => (
            <button
              key={seg}
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

      {/* Search & Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari ID Donor, Nama, Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
              using dummy data
            </span>
            <span>
              Menampilkan <strong className="text-slate-900">{filteredDonors.length}</strong> donor terdaftar
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Donor ID &amp; Nama</th>
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
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{d.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span>{d.id}</span>
                      <span>•</span>
                      <span>{d.phone}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] border ${getSegmentBadge(d.segment)}`}>
                      {d.segment}
                    </span>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-medium">
                    {d.recency}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap text-slate-900 font-bold font-mono">
                    {d.frequency}x
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap font-black text-slate-900">
                    {d.monetary}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                    <div className="flex items-center gap-1 font-semibold text-emerald-900">
                      <Layers size={14} className="text-emerald-700 shrink-0" />
                      <span>{d.diversity} Akad</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600 bg-slate-50/50 px-2 rounded">
                    {d.rfmdScore}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedDonor(d)}
                      className="px-3 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1 ml-auto shadow-2xs transition cursor-pointer"
                    >
                      <span>Aksi</span>
                      <ChevronRight size={14} className="shrink-0" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: DETAIL DONOR & REKOMENDASI RETENSI */}
      {selectedDonor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{selectedDonor.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] border ${getSegmentBadge(selectedDonor.segment)}`}>
                    {selectedDonor.segment}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    using dummy data
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {selectedDonor.id} • {selectedDonor.email}
                </p>
              </div>
              <button
                onClick={() => setSelectedDonor(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={20} className="shrink-0" />
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Recency</span>
                <span className="font-bold text-slate-900">{selectedDonor.recency}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Frekuensi</span>
                <span className="font-bold text-slate-900">{selectedDonor.frequency}x Transaksi</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Total Wakaf/Infaq</span>
                <span className="font-black text-emerald-900">{selectedDonor.monetary}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Ragam Akad</span>
                <span className="font-bold text-slate-900">{selectedDonor.diversity} Program</span>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-2">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-800 shrink-0" />
                <span>Rekomendasi Strategis AI Amwal:</span>
              </div>
              <p className="text-emerald-900 text-xs leading-relaxed">
                {selectedDonor.segment === 'Champion' &&
                  'Ajak Bapak/Ibu menjadi Duta Wakaf Abadi dan undang dalam seremoni peresmian proyek fisik terdekat.'}
                {selectedDonor.segment === 'Loyal' &&
                  'Tawarkan fasilitas autodebet rutin via Bank BSI / QRIS subscription agar donasi berkala berjalan tanpa kendala manual.'}
                {selectedDonor.segment === 'New' &&
                  'Kirimkan buletin progres proyek wakaf dalam 30 hari pertama pasca donasi untuk mengonversi menjadi donatur berulang.'}
                {selectedDonor.segment === 'At-Risk' &&
                  'Kirimkan sapaan silaturahmi hangat dengan infografis dampak donasi sebelumnya sebelum donatur memasuki fase tidak aktif (lapsed).'}
                {selectedDonor.segment === 'Lapsed' &&
                  'Kirimkan penawaran program donasi mikro atau infaq subuh tematik untuk mengaktifkan kembali riwayat kebaikan.'}
                {selectedDonor.segment === 'Situational' &&
                  'Kirimkan update saat momentum besar (Bulan Ramadhan, Qurban, atau Program Bencana Tanggap Cepat).'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={() => setSelectedDonor(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleSendNudge(selectedDonor, 'Sapaan WhatsApp')}
                className="px-4 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send size={14} className="shrink-0" />
                <span>Eksekusi Sapaan WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonorSegmentationView;
