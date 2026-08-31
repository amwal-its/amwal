'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export function SettingsManagementView() {
  const [activeTab, setActiveTab] = useState<'rekening' | 'lembaga' | 'notifikasi'>('rekening');
  const [feedback, setFeedback] = useState<string | null>(null);

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
    </div>
  );
}
