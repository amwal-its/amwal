'use client';

import React, { useState } from 'react';
import { ZakatNav } from '@/components/zakat/zakat-nav';

export default function BayarZakatPage() {
  const [jenisZakat, setJenisZakat] = useState<string>('MAAL_PENGHASILAN');
  const [metodePembayaran, setMetodePembayaran] = useState<string>('TRANSFER_MANUAL');
  const [namaMuzakki, setNamaMuzakki] = useState<string>('');
  const [namaDizakatkan, setNamaDizakatkan] = useState<string>('');
  const [noTelepon, setNoTelepon] = useState<string>('');
  const [alamat, setAlamat] = useState<string>('');
  const [nominal, setNominal] = useState<number | ''>('');
  const [beratBerasKg, setBeratBerasKg] = useState<number | ''>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    id: string;
    nomorKwitansi: string;
    isAnonymous: boolean;
    status: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      jenisZakat,
      metodePembayaran,
      namaMuzakki,
      namaDizakatkan: namaDizakatkan || undefined,
      noTelepon: noTelepon || undefined,
      alamat: alamat || undefined,
      nominal: metodePembayaran === 'BERAS' ? undefined : Number(nominal),
      beratBerasKg: metodePembayaran === 'BERAS' ? Number(beratBerasKg) : undefined,
      isAnonymous,
    };

    try {
      const res = await fetch('/api/zakat/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'usr_dummy_wakif', // mock authenticated wakif id
          'x-user-role': 'WAKIF',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Gagal memproses donasi zakat');
      } else {
        setSuccessResult(data.data);
      }
    } catch (err) {
      console.error('Submit order error:', err);
      setErrorMsg('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <ZakatNav />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Form Bayar Zakat Digital</h1>
          <p className="text-sm text-slate-500 mb-6">
            Salurkan kewajiban zakat Anda secara aman, cepat, dan transparan melalui platform Amwal.
          </p>

          {successResult ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <h3 className="text-lg font-bold text-emerald-900">Transaksi Zakat Berhasil Dibuat</h3>
                  <p className="text-xs text-emerald-700">Nomor Kwitansi: {successResult.nomorKwitansi}</p>
                </div>
              </div>
              <div className="text-sm text-slate-700 bg-white p-4 rounded-xl border border-emerald-100 space-y-2">
                <p><strong>Status:</strong> {successResult.status}</p>
                <p><strong>Label Tampilan Publik:</strong> {successResult.isAnonymous ? 'Hamba Allah (Anonim)' : namaMuzakki}</p>
                <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                  Simpan nomor kwitansi ini untuk verifikasi atau lacak status penyaluran di dashboard donatur.
                </p>
              </div>
              <button
                onClick={() => {
                  setSuccessResult(null);
                  setNamaMuzakki('');
                  setNominal('');
                  setBeratBerasKg('');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Buat Transaksi Zakat Baru
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Jenis Zakat *</label>
                <select
                  value={jenisZakat}
                  onChange={(e) => setJenisZakat(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="MAAL_PENGHASILAN">Zakat Maal Penghasilan</option>
                  <option value="FITRAH">Zakat Fitrah</option>
                  <option value="EMAS">Zakat Emas & Tabungan</option>
                  <option value="PERUSAHAAN">Zakat Perusahaan</option>
                  <option value="FIDYAH">Fidyah</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Metode Pembayaran *</label>
                <select
                  value={metodePembayaran}
                  onChange={(e) => setMetodePembayaran(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="TRANSFER_MANUAL">Transfer Bank / Manual</option>
                  <option value="QRIS">QRIS / E-Wallet</option>
                  <option value="BERAS">Beras (Khusus Fitrah)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Muzakki (Sesuai KTP) *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Pembayar Zakat"
                  value={namaMuzakki}
                  onChange={(e) => setNamaMuzakki(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Checkbox Anonim / Hamba Allah */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded-xs border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="isAnonymous" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                  Sembunyikan nama saya di tampilan publik (ditampilkan sebagai <strong>Hamba Allah</strong>)
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Atas Nama (Opsional)</label>
                <input
                  type="text"
                  placeholder="Nama anggota keluarga / kerabat yang dizakatkan"
                  value={namaDizakatkan}
                  onChange={(e) => setNamaDizakatkan(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor Telepon / WA</label>
                  <input
                    type="text"
                    placeholder="08123456789"
                    value={noTelepon}
                    onChange={(e) => setNoTelepon(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  {metodePembayaran === 'BERAS' ? (
                    <>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Jumlah Beras (kg) *</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="Contoh: 2.5"
                        value={beratBerasKg}
                        onChange={(e) => setBeratBerasKg(e.target.value ? Number(e.target.value) : '')}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </>
                  ) : (
                    <>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Nominal Zakat (Rp) *</label>
                      <input
                        type="number"
                        required
                        placeholder="Contoh: 250000"
                        value={nominal}
                        onChange={(e) => setNominal(e.target.value ? Number(e.target.value) : '')}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                  ⚠️ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-xs disabled:opacity-50"
              >
                {loading ? 'Memproses Transaksi...' : 'Bayar Zakat Sekarang'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
