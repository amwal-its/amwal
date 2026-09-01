'use client';

import React, { useState } from 'react';
import {
  Settings,
  Save,
  Sliders,
  Bell,
  Smartphone,
  Mail,
  CreditCard,
  Key,
  AlertTriangle,
  Info,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface SettingsSectionProps {
  onNavigateTab?: (tab: string) => void;
}

export function SettingsManagementView({ onNavigateTab }: SettingsSectionProps = {}) {
  const { showToast } = useToast();

  // Active Settings Tab
  const [activeTab, setActiveTab] = useState<'rfmd' | 'payment' | 'notifications'>('rfmd');

  // 1. RFM-D Settings State
  const [rfmdParams, setRfmdParams] = useState({
    championRecency: 30,
    loyalRecency: 60,
    atRiskRecency: 90,
    lapsedRecency: 180,
    minMonetaryChampion: 10000000,
    minMonetaryLoyal: 2500000,
    frequencyThreshold: 3,
    weightRecency: 35,
    weightFrequency: 25,
    weightMonetary: 25,
    weightDuration: 15,
  });

  // 2. Payment & Escrow Bank Settings State
  const [paymentParams, setPaymentParams] = useState({
    escrowBankName: 'Bank Syariah Indonesia (BSI)',
    escrowAccountNumber: '711-889-2234-001',
    escrowAccountHolder: 'Escrow Amwal Waqf DSN-MUI',
    qrisProvider: 'QRIS Syariah Indonesia (ASPI)',
    merchantGateway: 'Xendit Syariah & Midtrans',
    operationalCutPercent: 10, // Maks 10% hak nazhir UU 41/2004
    minWakafNominal: 10000,
    autoDisbursementReview: true,
  });

  // 3. Notification Gateway Settings State
  const [notifParams, setNotifParams] = useState({
    waGateway: 'Fonnte Enterprise API (Official)',
    waSenderNumber: '+62 811-2233-4455',
    waApiKey: 'fnt_live_98a72b11c03498fe',
    autoSendAiwWhatsapp: true,
    autoSendProgressBroadcast: true,
    emailSmtpHost: 'smtp.amwal.id',
    emailSmtpPort: '587',
    emailSenderAddress: 'notifikasi@amwal.id',
    smsFallbackEnabled: true,
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast({
        title: 'Konfigurasi Sistem Disimpan',
        description: 'Seluruh parameter RFM-D, Bank Escrow, dan Gateway Notifikasi berhasil diterapkan secara global.',
        type: 'success',
      });
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-800" />
              Pengaturan Sistem & Konfigurasi Platform
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pusat kendali parameter RFM-D donor, gerbang pembayaran escrow bank syariah, dan gateway notifikasi WhatsApp/Email.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSaveAll()}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl bg-[#1B5E20] hover:bg-[#144716] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-emerald-200" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Konfigurasi'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-1.5 shadow-2xs flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('rfmd')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'rfmd'
              ? 'bg-[#1B5E20] text-white shadow-2xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Ambang Batas RFM-D</span>
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'payment'
              ? 'bg-[#1B5E20] text-white shadow-2xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Bank Escrow & Pembayaran</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-[#1B5E20] text-white shadow-2xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Gateway Notifikasi & WA</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AMBANG BATAS RFM-D & SEGMENTASI DONOR                              */}
      {/* ========================================================================= */}
      {activeTab === 'rfmd' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-800" />
                  Konfigurasi Parameter Matriks RFM-D (Recency, Frequency, Monetary, Duration)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Atur ambang batas hari dan nominal transaksi untuk segmentasi otomatis kelompok donatur (Champion, Loyal, Potential, At-Risk, Lapsed).
                </p>
              </div>
            </div>

            {/* Recency Thresholds */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span>1. Ambang Batas Waktu Terakhir Donasi (Recency - Hari)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Segmen Champion (&lt; X Hari)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rfmdParams.championRecency}
                      onChange={(e) =>
                        setRfmdParams({ ...rfmdParams, championRecency: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 font-extrabold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                    <span className="text-xs font-bold text-slate-500">Hari</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Donasi terakhir dalam 30 hari terakhir.
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Segmen Loyal (&lt; X Hari)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rfmdParams.loyalRecency}
                      onChange={(e) =>
                        setRfmdParams({ ...rfmdParams, loyalRecency: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 font-extrabold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                    <span className="text-xs font-bold text-slate-500">Hari</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Donasi aktif dalam 60 hari terakhir.
                  </span>
                </div>

                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                  <label className="text-xs font-bold text-amber-900 block">
                    Segmen At-Risk (&gt; X Hari)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rfmdParams.atRiskRecency}
                      onChange={(e) =>
                        setRfmdParams({ ...rfmdParams, atRiskRecency: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-white px-3 py-2 rounded-lg border border-amber-300 font-extrabold text-amber-950 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="text-xs font-bold text-amber-800">Hari</span>
                  </div>
                  <span className="text-[10px] text-amber-700 block">
                    Peringatan intervensi silaturahmi sebelum donatur churn.
                  </span>
                </div>

                <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 space-y-2">
                  <label className="text-xs font-bold text-rose-900 block">
                    Segmen Lapsed (&gt; X Hari)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rfmdParams.lapsedRecency}
                      onChange={(e) =>
                        setRfmdParams({ ...rfmdParams, lapsedRecency: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-white px-3 py-2 rounded-lg border border-rose-300 font-extrabold text-rose-950 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <span className="text-xs font-bold text-rose-800">Hari</span>
                  </div>
                  <span className="text-[10px] text-rose-700 block">
                    Tidak berdonasi lebih dari 6 bulan berturut-turut.
                  </span>
                </div>
              </div>
            </div>

            {/* Monetary & Frequency Thresholds */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span>2. Ambang Batas Nilai Donasi & Frekuensi (Monetary & Frequency)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Min. Kumulatif Champion (Rp)
                  </label>
                  <input
                    type="number"
                    value={rfmdParams.minMonetaryChampion}
                    onChange={(e) =>
                      setRfmdParams({
                        ...rfmdParams,
                        minMonetaryChampion: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 font-extrabold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Rp {rfmdParams.minMonetaryChampion.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Min. Kumulatif Loyal (Rp)
                  </label>
                  <input
                    type="number"
                    value={rfmdParams.minMonetaryLoyal}
                    onChange={(e) =>
                      setRfmdParams({
                        ...rfmdParams,
                        minMonetaryLoyal: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 font-extrabold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Rp {rfmdParams.minMonetaryLoyal.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Min. Frekuensi Transaksi (Kali)
                  </label>
                  <input
                    type="number"
                    value={rfmdParams.frequencyThreshold}
                    onChange={(e) =>
                      setRfmdParams({
                        ...rfmdParams,
                        frequencyThreshold: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 font-extrabold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Minimal {rfmdParams.frequencyThreshold} transaksi donasi tercatat.
                  </span>
                </div>
              </div>
            </div>

            {/* Bobot Skor RFM-D */}
            <div className="p-5 bg-gradient-to-r from-emerald-50/70 to-slate-50 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-800" />
                  Distribusi Bobot Skor RFM-D Total: 100%
                </h4>
                <span className="text-[11px] font-bold text-emerald-800">
                  Total:{' '}
                  {rfmdParams.weightRecency +
                    rfmdParams.weightFrequency +
                    rfmdParams.weightMonetary +
                    rfmdParams.weightDuration}
                  %
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 text-[10px] block">Recency (R)</span>
                  <span className="font-extrabold text-slate-900 text-sm">{rfmdParams.weightRecency}%</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 text-[10px] block">Frequency (F)</span>
                  <span className="font-extrabold text-slate-900 text-sm">{rfmdParams.weightFrequency}%</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 text-[10px] block">Monetary (M)</span>
                  <span className="font-extrabold text-slate-900 text-sm">{rfmdParams.weightMonetary}%</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 text-[10px] block">Duration (D)</span>
                  <span className="font-extrabold text-slate-900 text-sm">{rfmdParams.weightDuration}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BANK ESCROW & PEMBAYARAN SYARIAH                                   */}
      {/* ========================================================================= */}
      {activeTab === 'payment' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-800" />
                Konfigurasi Rekening Escrow Giro Wadiah & Payment Gateway Syariah
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Rekening penampung dana wakaf terikat fatwa DSN-MUI & BWI. Dana hanya dapat dicairkan melalui mekanisme persetujuan termin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 block">Bank Penampung Escrow Utama</label>
                <input
                  type="text"
                  value={paymentParams.escrowBankName}
                  onChange={(e) =>
                    setPaymentParams({ ...paymentParams, escrowBankName: e.target.value })
                  }
                  className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 font-semibold text-slate-900"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 block">Nomor Rekening Giro Wadiah</label>
                <input
                  type="text"
                  value={paymentParams.escrowAccountNumber}
                  onChange={(e) =>
                    setPaymentParams({ ...paymentParams, escrowAccountNumber: e.target.value })
                  }
                  className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 block">Nama Pemegang Rekening Resmi</label>
                <input
                  type="text"
                  value={paymentParams.escrowAccountHolder}
                  onChange={(e) =>
                    setPaymentParams({ ...paymentParams, escrowAccountHolder: e.target.value })
                  }
                  className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 font-semibold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    Batas Maksimal Hak Pengelola / Nazhir (UU 41/2004)
                  </label>
                  <span className="font-mono font-bold text-emerald-800">
                    {paymentParams.operationalCutPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={paymentParams.operationalCutPercent}
                  onChange={(e) =>
                    setPaymentParams({
                      ...paymentParams,
                      operationalCutPercent: parseFloat(e.target.value) || 10,
                    })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B5E20]"
                />
                <span className="text-[10px] text-slate-500 block">
                  Sesuai UU No. 41 Tahun 2004 Pasal 12, imbalan operasional nazhir maksimal 10% dari hasil pengelolaan.
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 block">
                  Minimal Nominal Wakaf Tunai / Transaksi (Rp)
                </label>
                <input
                  type="number"
                  value={paymentParams.minWakafNominal}
                  onChange={(e) =>
                    setPaymentParams({
                      ...paymentParams,
                      minWakafNominal: parseInt(e.target.value) || 10000,
                    })
                  }
                  className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 font-extrabold text-slate-900"
                />
                <span className="text-[10px] text-slate-500 block">
                  Minimal Rp {paymentParams.minWakafNominal.toLocaleString('id-ID')} via QRIS & Virtual Account.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: GATEWAY NOTIFIKASI & WHATSAPP                                      */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-800" />
                Integrasi Gateway WhatsApp, SMS Fallback & Email Laporan
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Layanan silaturahmi otomatis untuk mengirimkan update progres pembangunan proyek dan Akta Ikrar Wakaf (AIW) langsung ke nomor HP wakif.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  Provider WhatsApp Gateway
                </label>
                <input
                  type="text"
                  value={notifParams.waGateway}
                  onChange={(e) => setNotifParams({ ...notifParams, waGateway: e.target.value })}
                  className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 font-semibold text-slate-900"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-emerald-700" />
                  WhatsApp API Key Token
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={notifParams.waApiKey}
                    onChange={(e) => setNotifParams({ ...notifParams, waApiKey: e.target.value })}
                    className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-900 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <span className="font-bold text-slate-900 block">Pemicu Notifikasi Otomatis (Triggers):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifParams.autoSendAiwWhatsapp}
                    onChange={(e) =>
                      setNotifParams({ ...notifParams, autoSendAiwWhatsapp: e.target.checked })
                    }
                    className="rounded text-emerald-800 focus:ring-emerald-600"
                  />
                  <span className="text-slate-800 font-semibold">
                    Kirim Otomatis Akta AIW saat Donasi Terverifikasi
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifParams.autoSendProgressBroadcast}
                    onChange={(e) =>
                      setNotifParams({
                        ...notifParams,
                        autoSendProgressBroadcast: e.target.checked,
                      })
                    }
                    className="rounded text-emerald-800 focus:ring-emerald-600"
                  />
                  <span className="text-slate-800 font-semibold">
                    Siarkan Kabar WA saat Slider Progres Fisik Naik
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
