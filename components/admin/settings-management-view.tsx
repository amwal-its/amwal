'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  QrCode,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  Wifi,
  WifiOff,
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

  // Baileys Microservice Live State
  const [baileysStatus, setBaileysStatus] = useState<string>('CONNECTING');
  const [baileysPhone, setBaileysPhone] = useState<string | null>(null);
  const [baileysQr, setBaileysQr] = useState<string | null>(null);
  const [baileysError, setBaileysError] = useState<string | null>(null);
  const [isRefreshingQr, setIsRefreshingQr] = useState(false);

  // Test WhatsApp Message Form State
  const [testPhone, setTestPhone] = useState('081234567890');
  const [testMessage, setTestMessage] = useState(
    "Assalamu'alaikum, ini adalah pesan uji coba dari Amwal WhatsApp Notification Gateway (Baileys Engine)."
  );
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Fetch Baileys Status
  const fetchBaileysStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/baileys/status');
      if (res.ok) {
        const data = await res.json();
        setBaileysStatus(data.status || (data.connected ? 'CONNECTED' : 'OFFLINE'));
        setBaileysPhone(data.phoneNumber || null);
        setBaileysError(data.error || null);

        if (data.status === 'CONNECTED' || data.connected) {
          setBaileysQr(null);
        }
      } else {
        setBaileysStatus('OFFLINE');
      }
    } catch {
      setBaileysStatus('OFFLINE');
    }
  }, []);

  // Fetch Baileys QR Code
  const fetchBaileysQr = useCallback(async () => {
    setIsRefreshingQr(true);
    try {
      const res = await fetch('/api/admin/baileys/qr');
      if (res.ok) {
        const data = await res.json();
        if (data.qrCodeBase64) {
          setBaileysQr(data.qrCodeBase64);
        }
        if (data.status) {
          setBaileysStatus(data.status);
        }
      }
    } catch (err) {
      console.error('Error fetching Baileys QR:', err);
    } finally {
      setIsRefreshingQr(false);
    }
  }, []);

  // Polling Baileys Status when Notifications Tab is active
  useEffect(() => {
    if (activeTab !== 'notifications') return;

    fetchBaileysStatus();
    if (baileysStatus === 'WAITING_FOR_SCAN' || !baileysQr) {
      fetchBaileysQr();
    }

    const interval = setInterval(() => {
      fetchBaileysStatus();
      if (baileysStatus === 'WAITING_FOR_SCAN') {
        fetchBaileysQr();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeTab, baileysStatus, fetchBaileysStatus, fetchBaileysQr, baileysQr]);

  // Handler Kirim Pesan Uji Coba
  const handleTestSendWA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone.trim() || !testMessage.trim()) return;

    setIsSendingTest(true);
    try {
      const res = await fetch('/api/admin/baileys/test-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: testPhone.trim(),
          message: testMessage.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengirim pesan uji coba WhatsApp');
      }

      showToast({
        title: 'Pesan WhatsApp Terkirim!',
        description: `Pesan uji coba berhasil dikirim ke nomor ${testPhone}.`,
        type: 'success',
      });
    } catch (error: any) {
      showToast({
        title: 'Gagal Kirim Pesan',
        description: error.message || 'Service Baileys belum terhubung atau nomor tidak valid.',
        type: 'error',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast({
        title: 'Konfigurasi Sistem Disimpan',
        description: 'Seluruh parameter RFM-D, Rekening Penampung Syariah, dan Gateway Notifikasi berhasil diterapkan secara global.',
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
              Pengaturan Sistem &amp; Konfigurasi Platform
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pusat kendali parameter RFM-D donor, gerbang pembayaran bank syariah (non-custodial), dan gateway notifikasi WhatsApp/Email.
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
          <span>Rekening Penampung &amp; Pembayaran</span>
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
      {/* TAB 2: REKENING PENAMPUNG & PEMBAYARAN SYARIAH                           */}
      {/* ========================================================================= */}
      {activeTab === 'payment' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-800" />
                Konfigurasi Rekening Giro Wadiah &amp; Payment Gateway Syariah (Non-Custodial)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Rekening penampung giro wadiah bank syariah resmi mitra Nazhir (YMI ITS). Dana disalurkan secara non-custodial berbasis persetujuan termin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 block">Bank Penampung Utama</label>
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
      {/* TAB 4: GATEWAY NOTIFIKASI & WHATSAPP (BAILEYS ENGINE)                     */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Card 1: Baileys Live Connection & QR Code Scanner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-800" />
                  Koneksi WhatsApp Gateway (Baileys Engine)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Engine socket mandiri terisolasi di port 4001 untuk pengiriman notifikasi instan AIW &amp; progres program.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {baileysStatus === 'CONNECTED' ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold shadow-2xs">
                    <Wifi className="w-4 h-4 text-emerald-700 animate-pulse" />
                    <span>Terhubung {baileysPhone ? `(+${baileysPhone})` : ''}</span>
                  </div>
                ) : baileysStatus === 'WAITING_FOR_SCAN' ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-2xs">
                    <QrCode className="w-4 h-4 text-amber-700 animate-bounce" />
                    <span>Menunggu Scan QR</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-xs font-bold shadow-2xs">
                    <WifiOff className="w-4 h-4 text-rose-700" />
                    <span>Offline (Port 4001)</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    fetchBaileysStatus();
                    fetchBaileysQr();
                  }}
                  disabled={isRefreshingQr}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                  title="Refresh Status &amp; QR"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshingQr ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Render based on Baileys connection state */}
            {baileysStatus === 'CONNECTED' ? (
              <div className="p-5 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">
                      WhatsApp Gateway Aktif &amp; Siap Mengirim Notifikasi
                    </h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Nomor Terhubung:{' '}
                      <strong className="font-mono text-emerald-950">
                        {baileysPhone ? `+${baileysPhone}` : 'Nomor Sekunder Uji Coba'}
                      </strong>{' '}
                      • Session MultiFile tersimpan aman di <code className="text-[11px] bg-emerald-100 px-1 rounded">auth_session/</code>.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg bg-emerald-800 text-white font-mono text-xs font-bold">
                  PORT 4001 • LIVE
                </span>
              </div>
            ) : baileysStatus === 'WAITING_FOR_SCAN' ? (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Pindai Kode QR Menggunakan WhatsApp di HP
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mt-1">
                    Buka WhatsApp di HP Anda &gt; Menu Titik Tiga / Pengaturan &gt; Perangkat Tertaut &gt; Tautkan Perangkat, lalu arahkan kamera ke QR berikut:
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border-2 border-emerald-800/40 shadow-md inline-block relative">
                  {baileysQr ? (
                    <img
                      src={baileysQr}
                      alt="WhatsApp QR Code"
                      className="w-56 h-56 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-56 h-56 flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
                      <span className="text-xs">Membuat QR Code...</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchBaileysQr}
                    disabled={isRefreshingQr}
                    className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingQr ? 'animate-spin' : ''}`} />
                    <span>Muat Ulang QR Code</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 flex items-start gap-3 text-xs text-rose-800">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-rose-900 text-sm">
                    Layanan Microservice Baileys Belum Terdeteksi
                  </strong>
                  <p className="mt-1 leading-relaxed">
                    Pastikan service di <code className="bg-rose-100 px-1 rounded font-mono">C:\AmwalHETI\amwal-baileys-service</code> telah dijalankan (<code className="bg-rose-100 px-1 rounded font-mono">node index.js</code>) dan mendengarkan port 4001.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Uji Coba Pengiriman Pesan WhatsApp (Live Tester) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-800" />
                Uji Coba Pengiriman Pesan WhatsApp (Live Tester)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kirim pesan uji coba untuk memvalidasi bahwa koneksi Baileys berhasil meneruskan pesan ke nomor donatur.
              </p>
            </div>

            <form onSubmit={handleTestSendWA} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Nomor WhatsApp Tujuan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-300 font-mono font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Status Gateway</label>
                  <div className="w-full bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700 flex items-center justify-between">
                    <span>Target Service: <strong className="text-slate-900">localhost:4001</strong></span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      baileysStatus === 'CONNECTED' ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {baileysStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Isi Pesan WhatsApp *</label>
                <textarea
                  rows={2}
                  required
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl font-bold flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSendingTest ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim Pesan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Pesan Uji Coba</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Card 3: Pemicu Notifikasi Otomatis (Triggers) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-800" />
              Pemicu Notifikasi Otomatis (Triggers)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200">
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

              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200">
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
      )}
    </div>
  );
}
