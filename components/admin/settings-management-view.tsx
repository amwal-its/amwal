'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Settings,
  Building2,
  Landmark,
  Bell,
  CheckCircle2,
  Save,
  Shield,
  Phone,
  Mail,
  MapPin,
  Check,
  AlertCircle,
  MessageSquare,
  QrCode,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertTriangle,
} from 'lucide-react';

export function SettingsManagementView() {
  const [activeTab, setActiveTab] = useState<'rekening' | 'lembaga' | 'notifikasi' | 'whatsapp'>('rekening');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Baileys WhatsApp Gateway State
  const [waStatus, setWaStatus] = useState<{
    connected: boolean;
    phoneNumber?: string | null;
    status: string;
    error?: string;
  }>({
    connected: false,
    phoneNumber: null,
    status: 'INITIALIZING',
  });
  const [waQrBase64, setWaQrBase64] = useState<string | null>(null);
  const [isWaLoading, setIsWaLoading] = useState<boolean>(false);

  const fetchBaileysStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/baileys/status', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setWaStatus(data);
        if (data.connected) {
          setWaQrBase64(null);
        }
      }
    } catch {
      setWaStatus({
        connected: false,
        status: 'OFFLINE',
        error: 'Microservice tidak terjangkau',
      });
    }
  }, []);

  const fetchBaileysQr = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/baileys/qr', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.qrCodeBase64) {
          setWaQrBase64(data.qrCodeBase64);
        }
        if (data.status) {
          setWaStatus((prev) => ({
            ...prev,
            status: data.status,
            connected: data.status === 'CONNECTED',
            phoneNumber: data.phoneNumber || prev.phoneNumber,
          }));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const refreshAllWa = useCallback(async () => {
    setIsWaLoading(true);
    await Promise.all([fetchBaileysStatus(), fetchBaileysQr()]);
    setIsWaLoading(false);
  }, [fetchBaileysStatus, fetchBaileysQr]);

  // Polling effect when on WhatsApp tab and not connected
  useEffect(() => {
    if (activeTab === 'whatsapp') {
      refreshAllWa();
      const interval = setInterval(() => {
        if (!waStatus.connected) {
          fetchBaileysStatus();
          fetchBaileysQr();
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, waStatus.connected, refreshAllWa, fetchBaileysStatus, fetchBaileysQr]);

  // Rekening Bank Operasional State
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 'acc-1',
      bankName: 'Bank Syariah Indonesia (BSI)',
      accountNumber: '7141234567',
      accountHolder: 'Yayasan Manarul Ilmi ITS - Wakaf Produktif',
      isPrimary: true,
    },
    {
      id: 'acc-2',
      bankName: 'Bank Muamalat',
      accountNumber: '1010987654',
      accountHolder: 'Yayasan Manarul Ilmi ITS - ZISWAF',
      isPrimary: false,
    },
  ]);

  // Lembaga Info State
  const [institutionConfig, setInstitutionConfig] = useState({
    institutionName: 'Yayasan Manarul Ilmi ITS',
    shortName: 'YMI ITS',
    emailContact: 'layanan@manarulilmi.its.ac.id',
    phoneContact: '+62 811-3333-1945',
    address: 'Gedung Pusat Informasi & Dakwah Manarul Ilmi, Kampus ITS Sukolilo, Surabaya 60111',
    skBwiNumber: '3.3.00192/BWI/2021',
  });

  // Notification Preferences
  const [notifConfig, setNotifConfig] = useState({
    emailAlerts: true,
    waReceipts: true,
    reportReminders: true,
    orderExpiryHours: 24,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('Pengaturan konfigurasi operasional berhasil disimpan ke sistem.');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 px-6 py-6 max-w-7xl mx-auto font-jakarta">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Konfigurasi Sistem
            </span>
            <span className="text-xs text-gray-500">Parameter Operasional Platform</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-[#1B5E20]" />
            Pengaturan Rekening & Parameter Lembaga
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Pengelolaan rekening penampung yayasan, identitas kelembagaan, dan preferensi notifikasi transaksi.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-xs text-gray-600">
          <Shield className="w-4 h-4 text-[#1B5E20]" />
          <span>Security Guard Active</span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('rekening')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'rekening'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Rekening Bank Yayasan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lembaga')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'lembaga'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Profil & Kontak Lembaga</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifikasi')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'notifikasi'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Preferensi Notifikasi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'whatsapp'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Gateway (Baileys)</span>
          {waStatus.connected ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>
      </div>

      {/* TAB 1: REKENING BANK YAYASAN */}
      {activeTab === 'rekening' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Daftar Rekening Penampung Resmi (LKS-PWU)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Rekening yang digunakan untuk menerima transfer donasi wakaf, zakat, dan qurban yang terafiliasi bank syariah.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {bankAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-4 rounded-2xl border border-gray-200 bg-slate-50/60 space-y-2 text-xs relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{acc.bankName}</span>
                    {acc.isPrimary && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-[#1B5E20]">
                        UTAMA
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-base font-black text-gray-900">
                    {acc.accountNumber}
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Atas Nama: <strong>{acc.accountHolder}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROFIL & KONTAK LEMBAGA */}
      {activeTab === 'lembaga' && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 space-y-4 text-xs">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Identitas Resmi Yayasan & Badan Pengelola
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Data yang ditampilkan pada header sertifikat digital, kwitansi resmi, dan footer platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-bold text-gray-900 mb-1">Nama Lembaga Lengkap</label>
              <input
                type="text"
                value={institutionConfig.institutionName}
                onChange={(e) => setInstitutionConfig({ ...institutionConfig, institutionName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-900 mb-1">Nomor Registrasi SK BWI</label>
              <input
                type="text"
                value={institutionConfig.skBwiNumber}
                onChange={(e) => setInstitutionConfig({ ...institutionConfig, skBwiNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-900 mb-1">Email Layanan Donatur</label>
              <input
                type="email"
                value={institutionConfig.emailContact}
                onChange={(e) => setInstitutionConfig({ ...institutionConfig, emailContact: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-900 mb-1">Nomor Telepon / WhatsApp Helpdesk</label>
              <input
                type="text"
                value={institutionConfig.phoneContact}
                onChange={(e) => setInstitutionConfig({ ...institutionConfig, phoneContact: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-900 mb-1">Alamat Kantor Operasional</label>
              <textarea
                rows={2}
                value={institutionConfig.address}
                onChange={(e) => setInstitutionConfig({ ...institutionConfig, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] resize-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1B5E20] hover:bg-[#144718] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil Lembaga</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: PREFERENSI NOTIFIKASI */}
      {activeTab === 'notifikasi' && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 space-y-4 text-xs">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Pengaturan Pemicu Notifikasi & Transparansi
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Konfigurasi pengiriman notifikasi otomatis saat donasi terkonfirmasi atau laporan progres terbit.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={notifConfig.emailAlerts}
                onChange={(e) => setNotifConfig({ ...notifConfig, emailAlerts: e.target.checked })}
                className="rounded text-[#1B5E20] focus:ring-[#1B5E20]"
              />
              <div>
                <span className="font-bold text-gray-900 block">Kirim Notifikasi Email ke Donatur</span>
                <span className="text-[11px] text-gray-500">Kirimkan link sertifikat digital otomatis setelah pembayaran lunas terverifikasi.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={notifConfig.waReceipts}
                onChange={(e) => setNotifConfig({ ...notifConfig, waReceipts: e.target.checked })}
                className="rounded text-[#1B5E20] focus:ring-[#1B5E20]"
              />
              <div>
                <span className="font-bold text-gray-900 block">Kirim Notifikasi WhatsApp Kwitansi</span>
                <span className="text-[11px] text-gray-500">Kirimkan ringkasan akad dan kwitansi resmi ke nomor WhatsApp wakif/muzakki.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={notifConfig.reportReminders}
                onChange={(e) => setNotifConfig({ ...notifConfig, reportReminders: e.target.checked })}
                className="rounded text-[#1B5E20] focus:ring-[#1B5E20]"
              />
              <div>
                <span className="font-bold text-gray-900 block">Pengingat Laporan Progres Nadzir</span>
                <span className="text-[11px] text-gray-500">Kirimkan alert pengingat berkala ke Nadzir untuk mengunggah kuitansi belanja fisik.</span>
              </div>
            </label>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1B5E20] hover:bg-[#144718] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Preferensi</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: WHATSAPP GATEWAY (BAILEYS) */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#1B5E20]" />
                  WhatsApp Gateway Engine (Baileys Service)
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Koneksi microservice perpesanan otomatis untuk pengiriman kwitansi akad, sertifikat wakaf, dan notifikasi setoran.
                </p>
              </div>

              <button
                type="button"
                onClick={refreshAllWa}
                disabled={isWaLoading}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isWaLoading ? 'animate-spin text-[#1B5E20]' : ''}`} />
                <span>Segarkan Status</span>
              </button>
            </div>

            {/* Status Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-gray-200 bg-slate-50/60 space-y-2">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                  Status Koneksi
                </span>
                <div className="flex items-center gap-2">
                  {waStatus.connected ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-[#1B5E20] flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5" />
                      TERHUBUNG
                    </span>
                  ) : waStatus.status === 'OFFLINE' ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 flex items-center gap-1.5">
                      <WifiOff className="w-3.5 h-3.5" />
                      SERVICE OFFLINE
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5" />
                      MENUNGGU SCAN
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-gray-200 bg-slate-50/60 space-y-2">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                  Nomor WhatsApp Aktif
                </span>
                <div className="font-mono text-sm font-bold text-gray-900">
                  {waStatus.phoneNumber ? `+${waStatus.phoneNumber}` : '— Belum Tersambung —'}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-gray-200 bg-slate-50/60 space-y-2">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                  Port Microservice
                </span>
                <div className="font-mono text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>Port 4001</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-sans font-semibold">Standalone</span>
                </div>
              </div>
            </div>

            {/* QR Code / Connection Box */}
            {!waStatus.connected ? (
              <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-amber-900">
                      Instruksi Pairing WhatsApp Web
                    </h3>
                    <p className="text-[11px] text-amber-800">
                      Buka aplikasi WhatsApp di ponsel, pilih <strong>Perangkat Tertaut (Linked Devices)</strong>, lalu scan QR Code di bawah.
                    </p>
                    <p className="text-[11px] font-bold text-amber-900 pt-1">
                      ⚠️ PENTING: Gunakan nomor WhatsApp SEKUNDER/UJI untuk pengujian awal. JANGAN gunakan nomor resmi utama yayasan.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-amber-200 max-w-sm mx-auto shadow-2xs">
                  {waQrBase64 ? (
                    <div className="space-y-3 text-center">
                      <div className="relative p-2 bg-white rounded-xl border border-gray-200 inline-block shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={waQrBase64}
                          alt="WhatsApp Scan QR"
                          className="w-56 h-56 object-contain rounded-lg"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#1B5E20] animate-ping" />
                        <span>QR Code aktif, siap dipindai...</span>
                      </div>
                    </div>
                  ) : waStatus.status === 'OFFLINE' ? (
                    <div className="py-8 text-center space-y-2">
                      <WifiOff className="w-10 h-10 text-red-400 mx-auto" />
                      <p className="text-xs font-bold text-red-700">Service Baileys Tidak Aktif</p>
                      <p className="text-[11px] text-gray-500 max-w-xs">
                        Jalankan <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[10px]">node index.js</code> di direktori <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[10px]">C:\AmwalHETI\amwal-baileys-service</code>.
                      </p>
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-2">
                      <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
                      <p className="text-xs font-semibold text-gray-600">Menghubungkan ke Baileys & Menyiapkan QR...</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-emerald-200 bg-[#E8F5E9]/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1B5E20] text-white flex items-center justify-center font-bold shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">
                    WhatsApp Gateway Siap Digunakan
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Sesi terautentikasi untuk nomor <strong>+{waStatus.phoneNumber}</strong>. Semua webhook pembayaran Midtrans yang lunas akan mengirimkan notifikasi kwitansi otomatis ke nomor donatur.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
