'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  ShieldCheck,
  Search,
  Download,
  CheckCircle2,
  Clock,
  Filter,
  User,
  CreditCard,
  Building2,
  Receipt,
  TrendingUp,
  Wallet,
  Landmark,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export function TransparencyLogsView() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'transactions' | 'audit'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAkad, setFilterAkad] = useState<string>('SEMUA');

  // Transactions Data conforming to Requirement 3
  const transactions = [
    {
      id: 'TX-AMW-9921',
      donorName: 'Hamba Allah',
      isAnonymous: true,
      donorType: 'Donatur Anonim',
      program: 'Waqf Pembangunan Klinik Air Bersih Al-Azhar',
      amount: 50000000,
      jenisAkad: 'Wakaf Uang',
      timestamp: '11 Agt 2026, 13:14:02 WIB',
      paymentMethod: 'BSI Virtual Account',
      status: 'TERVERIFIKASI',
    },
    {
      id: 'TX-AMW-9920',
      donorName: 'Dra. Hj. Siti Rahmah',
      isAnonymous: false,
      donorType: 'Individu / Donatur Rutin',
      program: 'Waqf Renovasi Masjid & Gedung Sekolah Yatim',
      amount: 15000000,
      jenisAkad: 'Wakaf Melalui Uang',
      timestamp: '11 Agt 2026, 11:45:18 WIB',
      paymentMethod: 'QRIS Syariah (Auto-NPP)',
      status: 'TERVERIFIKASI',
    },
    {
      id: 'TX-AMW-9919',
      donorName: 'PT Nusantara Syariah Utama',
      isAnonymous: false,
      donorType: 'Korporat / Ziswaf Perusahaan',
      program: 'Program Pembersihan Harta & Zakat Mal Corporate',
      amount: 125000000,
      jenisAkad: 'Zakat',
      timestamp: '11 Agt 2026, 09:20:55 WIB',
      paymentMethod: 'Transfer Bank Syariah',
      status: 'TERVERIFIKASI',
    },
    {
      id: 'TX-AMW-9918',
      donorName: 'Ahmad Fauzan, S.T.',
      isAnonymous: false,
      donorType: 'Donatur Rutin Subuh',
      program: 'Sumur Waqf Air Bersih & Pemberdayaan Sosial',
      amount: 2500000,
      jenisAkad: 'Infaq',
      timestamp: '10 Agt 2026, 21:05:30 WIB',
      paymentMethod: 'QRIS Syariah',
      status: 'TERVERIFIKASI',
    },
    {
      id: 'TX-AMW-9917',
      donorName: 'Hamba Allah',
      isAnonymous: true,
      donorType: 'Donatur Anonim',
      program: 'Sedekah Subuh Berkelanjutan',
      amount: 1000000,
      jenisAkad: 'Sedekah',
      timestamp: '10 Agt 2026, 18:30:12 WIB',
      paymentMethod: 'BSI Virtual Account',
      status: 'TERVERIFIKASI',
    },
    {
      id: 'TX-AMW-9916',
      donorName: 'Ir. H. Hendra Wijaya',
      isAnonymous: false,
      donorType: 'Wakif Abadi',
      program: 'Waqf Pembangunan Klinik Air Bersih Al-Azhar',
      amount: 100000000,
      jenisAkad: 'Wakaf Uang',
      timestamp: '10 Agt 2026, 15:10:44 WIB',
      paymentMethod: 'Transfer Bank Syariah',
      status: 'TERVERIFIKASI',
    },
  ];

  // Physical Audit Ledger Data
  const auditLogs = [
    {
      id: 'LOG-2026-084',
      campaign: 'Waqf Pembangunan Klinik Air Bersih Al-Azhar',
      activity: 'Pemasangan Pipa Besi & Pompa Submersible 3 HP',
      progress: '65% Fisik',
      disbursement: 'Rp 18.500.000',
      receiptHash: '0x8f4a...92b1 (Kuitansi_Pipa_02.png)',
      auditor: 'Drs. H. M. Said (BWI Audit)',
      status: 'VERIFIED',
      date: '10 Agt 2026, 14:22 WIB',
    },
    {
      id: 'LOG-2026-083',
      campaign: 'Sumur Waqf Produktif Desa Maju Sukabumi',
      activity: 'Selesai Pengeboran Kedalaman 80 Meter & Uji Kelayakan Air',
      progress: '92% Fisik',
      disbursement: 'Rp 24.000.000',
      receiptHash: '0x3c1b...77e4 (Nota_Pengeboran.jpg)',
      auditor: 'H. Lukman Hakim (Auditor Independen)',
      status: 'VERIFIED',
      date: '08 Agt 2026, 11:05 WIB',
    },
    {
      id: 'LOG-2026-082',
      campaign: 'Pengadaan Ambulans Gratis Dhuafa',
      activity: 'Pembayaran Uang Muka Karoseri Medis Ambulans',
      progress: '30% Fisik',
      disbursement: 'Rp 45.000.000',
      receiptHash: '0xe22d...11c9 (DP_Karoseri.pdf)',
      auditor: 'Ustadz Ahmad Fauzi (Nadzir Utama)',
      status: 'VERIFIED',
      date: '04 Agt 2026, 09:30 WIB',
    },
    {
      id: 'LOG-2026-081',
      campaign: 'Waqf Pembangunan Klinik Air Bersih Al-Azhar',
      activity: 'Pengadaan Semen Tiga Roda 50 Sak & Pasir Pasang',
      progress: '58% Fisik',
      disbursement: 'Rp 5.550.000',
      receiptHash: '0xa78f...44b2 (Kuitansi_Semen.jpg)',
      auditor: 'Drs. H. M. Said (BWI Audit)',
      status: 'VERIFIED',
      date: '01 Agt 2026, 16:45 WIB',
    },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    const matchQuery =
      tx.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAkad = filterAkad === 'SEMUA' || tx.jenisAkad === filterAkad;
    return matchQuery && matchAkad;
  });

  const filteredAuditLogs = auditLogs.filter(
    (l) =>
      l.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-800" />
              Transparansi Transaksi & Buku Besar Audit Akuntabilitas
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Catatan publik transaksi donatur real-time dengan pilihan Jenis Akad pasca-pembayaran, serta log audit fisik proyek.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                showToast({
                  title: 'Laporan Transparansi Siap Diunduh',
                  description: 'Dokumen Rekapitulasi Transparansi & Log Audit Akuntabilitas (PDF) berhasil di-generate.',
                  type: 'success',
                })
              }
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Cetak Laporan Transparansi (PDF)
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-1">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Tabel Transparansi Transaksi ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Pencairan & Progres Fisik ({auditLogs.length})</span>
          </button>
        </div>

        {/* Audit Stats */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold flex items-center justify-between">
              <span>Total Penghimpunan Masuk</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {transactions.length} Transaksi
              </span>
            </span>
            <span className="text-xl font-black text-slate-900 mt-1 block">Rp 293.500.000</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Tercatat aman di buku kas publik</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold flex items-center justify-between">
              <span>Saldo Kas & Dana Tersedia</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                68.3% Siap Salur
              </span>
            </span>
            <span className="text-xl font-black text-emerald-800 mt-1 block flex items-center gap-1.5">
              <Wallet className="w-5 h-5 text-emerald-800 shrink-0" />
              <span>Rp 200.450.000</span>
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">Tersimpan aman di Rekening Bank Penampung</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold flex items-center justify-between">
              <span>Realisasi Penyaluran & Audit</span>
              <span className="text-[10px] font-bold text-slate-700 bg-slate-200/80 px-1.5 py-0.5 rounded">
                31.7% Tersalur
              </span>
            </span>
            <span className="text-xl font-black text-slate-900 mt-1 block flex items-center gap-1.5">
              <Receipt className="w-5 h-5 text-emerald-800 shrink-0" />
              <span>Rp 93.050.000</span>
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">{auditLogs.length} Log fisik & kuitansi sah tervalidasi</span>
          </div>
        </div>
      </div>

      {/* TAB 1: TABEL TRANSPARANSI TRANSAKSI DONATUR */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama donatur, ID transaksi, atau program..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              {/* Filter Jenis Akad */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={filterAkad}
                  onChange={(e) => setFilterAkad(e.target.value)}
                  className="bg-white text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  <option value="SEMUA">Semua Jenis Akad</option>
                  <option value="Wakaf Uang">Wakaf Uang</option>
                  <option value="Wakaf Melalui Uang">Wakaf Melalui Uang</option>
                  <option value="Zakat">Zakat</option>
                  <option value="Infaq">Infaq</option>
                  <option value="Sedekah">Sedekah</option>
                </select>
              </div>
            </div>

            <span className="text-xs text-slate-500 font-medium shrink-0">
              Menampilkan <strong className="text-slate-900">{filteredTransactions.length}</strong> transaksi terverifikasi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Nama Donatur & ID</th>
                  <th className="py-3 px-3">Nominal Donasi</th>
                  <th className="py-3 px-3 bg-emerald-50/60 text-emerald-900 font-extrabold border-x border-emerald-200/60">
                    Spesifik Jenis Akad Pasca-Bayar
                  </th>
                  <th className="py-3 px-3">Waktu (Timestamp)</th>
                  <th className="py-3 px-3">Program Tujuan</th>
                  <th className="py-3 px-3">Metode Pembayaran</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => {
                  const isAnon = tx.isAnonymous || tx.donorName === 'Hamba Allah';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isAnon ? (
                          <>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                              <span>Hamba Allah</span>
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded border border-amber-200">
                                Anonim
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono pl-5">{tx.id} • Donatur Anonim</div>
                          </>
                        ) : (
                          <>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                              <span>{tx.donorName}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono pl-5">{tx.id} • {tx.donorType}</div>
                          </>
                        )}
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap font-black text-slate-900 text-sm">
                        {formatRupiah(tx.amount)}
                      </td>

                    <td className="py-3.5 px-3 whitespace-nowrap bg-emerald-50/40 border-x border-emerald-100">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-800 text-white shadow-2xs inline-block">
                        {tx.jenisAkad}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{tx.timestamp}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 max-w-xs">
                      <div className="font-semibold text-slate-800 line-clamp-1">{tx.program}</div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {tx.paymentMethod}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" /> {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT PENCAIRAN & PROGRES FISIK */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ID Log, Program, atau Aktivitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Menampilkan <strong className="text-slate-900">{filteredAuditLogs.length}</strong> log audit terverifikasi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Log ID & Waktu</th>
                  <th className="py-3 px-3">Program Waqf</th>
                  <th className="py-3 px-3">Aktivitas Fisik</th>
                  <th className="py-3 px-3">Progres Fisik</th>
                  <th className="py-3 px-3">Pencairan Dana</th>
                  <th className="py-3 px-3">Hash Bukti Digital</th>
                  <th className="py-3 px-4 text-right">Status Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">{log.id}</div>
                      <div className="text-[10px] text-slate-400">{log.date}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800 max-w-xs">{log.campaign}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-700 max-w-xs">{log.activity}</div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap font-bold text-emerald-900">
                      {log.progress}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap font-extrabold text-slate-900">
                      {log.disbursement}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-[10px] text-slate-500">
                      {log.receiptHash}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" /> AUDITED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
