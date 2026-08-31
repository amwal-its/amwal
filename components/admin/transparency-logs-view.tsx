'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  CheckCircle2,
  Clock,
  Filter,
  User,
  CreditCard,
  Building2,
  TrendingUp,
  Wallet,
  Landmark,
  ExternalLink,
  Award,
  Calendar,
} from 'lucide-react';

export interface TransparencyTransactionItem {
  id: string;
  nomorKwitansi: string;
  jenisTransaksi: 'WAKAF' | 'ZAKAT' | 'QURBAN' | string;
  donorName: string;
  isAnonymous: boolean;
  programTitle: string;
  amount: number;
  paymentMethod: string;
  statusPembayaran: string;
  createdAt: string;
  certificate?: {
    nomorInternalAmwal: string;
    nomorRegistrasiBwi?: string | null;
    pdfUrl?: string | null;
  } | null;
}

interface TransparencyLogsViewProps {
  transactions: TransparencyTransactionItem[];
  summary: {
    totalVolume: number;
    totalLunasCount: number;
    wakafVolume: number;
    zakatVolume: number;
    qurbanVolume: number;
  };
}

export function TransparencyLogsView({ transactions, summary }: TransparencyLogsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('SEMUA');
  const [filterStatus, setFilterStatus] = useState<string>('SEMUA');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredTransactions = transactions.filter((t) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      t.nomorKwitansi.toLowerCase().includes(term) ||
      t.donorName.toLowerCase().includes(term) ||
      t.programTitle.toLowerCase().includes(term) ||
      t.paymentMethod.toLowerCase().includes(term);

    const matchesType = filterType === 'SEMUA' || t.jenisTransaksi === filterType;
    const matchesStatus = filterStatus === 'SEMUA' || t.statusPembayaran === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 px-6 py-6 max-w-7xl mx-auto font-jakarta">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Audit & Akuntabilitas Publik
            </span>
            <span className="text-xs text-gray-500">Transparansi Dana Sosial Islam</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="w-7 h-7 text-[#1B5E20]" />
            Log Transparansi Transaksi & Audit Dana Masuk
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Rekam jejak seluruh transaksi wakaf, zakat, dan qurban yang terverifikasi dan tercatat pada ledger resmi.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#E8F5E9] border border-green-200 px-5 py-3 rounded-2xl shrink-0">
          <Wallet className="w-6 h-6 text-[#1B5E20]" />
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Total Dana Terhimpun
            </span>
            <span className="text-lg font-black text-[#1B5E20]">
              {formatRupiah(summary.totalVolume)}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-card space-y-1">
          <span className="text-[11px] font-bold text-gray-400 block uppercase">Penghimpunan Wakaf</span>
          <span className="text-xl font-black text-[#1B5E20] block">
            {formatRupiah(summary.wakafVolume)}
          </span>
          <span className="text-[11px] text-gray-500 font-medium">Wakaf Uang & Melalui Uang</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-card space-y-1">
          <span className="text-[11px] font-bold text-gray-400 block uppercase">Penghimpunan Zakat</span>
          <span className="text-xl font-black text-blue-700 block">
            {formatRupiah(summary.zakatVolume)}
          </span>
          <span className="text-[11px] text-gray-500 font-medium">Zakat Fitrah & Zakat Maal</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-card space-y-1">
          <span className="text-[11px] font-bold text-gray-400 block uppercase">Penghimpunan Qurban</span>
          <span className="text-xl font-black text-amber-700 block">
            {formatRupiah(summary.qurbanVolume)}
          </span>
          <span className="text-[11px] text-gray-500 font-medium">Kolektif Sapi & Kambing</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {['SEMUA', 'WAKAF', 'ZAKAT', 'QURBAN'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}

          <div className="h-4 w-px bg-gray-300 mx-1 hidden sm:block" />

          {['SEMUA', 'LUNAS', 'PENDING'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === s
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari no. kwitansi / donatur / program..."
            className="w-full pl-9.5 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20]"
          />
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            <Clock className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            Tidak ada data transaksi yang sesuai dengan filter pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200 uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Waktu & No. Kwitansi</th>
                  <th className="px-5 py-3.5">Donatur / Wakif</th>
                  <th className="px-5 py-3.5">Akad & Program</th>
                  <th className="px-5 py-3.5">Nominal</th>
                  <th className="px-5 py-3.5">Metode Bayar</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Sertifikat / Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredTransactions.map((tx) => {
                  const isLunas = tx.statusPembayaran === 'LUNAS';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-gray-900 block text-xs">
                          {tx.nomorKwitansi}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(tx.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-bold text-gray-900 block">
                          {tx.isAnonymous ? 'Hamba Allah (Anonim)' : tx.donorName}
                        </span>
                        {tx.isAnonymous && (
                          <span className="text-[10px] text-gray-400 italic">Donasi Terenkripsi</span>
                        )}
                      </td>

                      <td className="px-5 py-4 max-w-xs">
                        <span
                          className={`inline-block text-[9px] font-black px-2 py-0.5 rounded mb-1 ${
                            tx.jenisTransaksi === 'WAKAF'
                              ? 'bg-emerald-100 text-[#1B5E20]'
                              : tx.jenisTransaksi === 'ZAKAT'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {tx.jenisTransaksi}
                        </span>
                        <span className="text-xs font-semibold text-gray-900 block truncate">
                          {tx.programTitle}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-bold text-gray-900 text-xs">
                          {formatRupiah(tx.amount)}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                          <CreditCard className="w-3 h-3 text-gray-400" />
                          {tx.paymentMethod}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isLunas
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isLunas ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          {tx.statusPembayaran}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        {tx.certificate ? (
                          <div className="inline-flex flex-col items-end gap-0.5">
                            <span className="text-[10px] font-mono text-gray-500">
                              {tx.certificate.nomorInternalAmwal}
                            </span>
                            {tx.certificate.pdfUrl ? (
                              <a
                                href={tx.certificate.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                              >
                                <Award className="w-3 h-3" />
                                <span>PDF Sertifikat</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-[10px] text-gray-400">Sertifikat Terbit</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
