'use client';

import React, { useState, useEffect } from 'react';
import { ZakatNav } from '@/components/zakat/zakat-nav';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface FitrahConfig {
  id: string;
  jenisBeras: string;
  konversiHargaPerJiwa: string | number;
}

export default function AmilZakatEntriPage() {
  const [jenisZakat, setJenisZakat] = useState<string>('FITRAH');
  const [namaMuzakki, setNamaMuzakki] = useState<string>('');
  const [teleponMuzakki, setTeleponMuzakki] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [bentukZakat, setBentukZakat] = useState<'UANG' | 'BERAS'>('UANG');
  
  // UANG
  const [nominalRp, setNominalRp] = useState<number | ''>('');
  
  // BERAS
  const [jumlahBerasKg, setJumlahBerasKg] = useState<number | ''>('');
  const [fitrahConfigs, setFitrahConfigs] = useState<FitrahConfig[]>([]);
  const [jenisBeras, setJenisBeras] = useState<string>('');
  const [konversiHargaPerKg, setKonversiHargaPerKg] = useState<number | ''>('');

  const [notes, setNotes] = useState<string>('');

  // Confirmation Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    nomorKwitansi: string;
    nominal: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    async function fetchConfigs() {
      try {
        const res = await fetch('/api/zakat-fitrah-config?active=true');
        if (res.ok) {
          const body = await res.json();
          setFitrahConfigs(body.data || []);
          if (body.data && body.data.length > 0) {
            setJenisBeras(body.data[0].jenisBeras);
          }
        }
      } catch (err) {
        console.error('Fetch fitrah config error:', err);
      }
    }
    fetchConfigs();
  }, []);

  const handleOpenConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!namaMuzakki.trim()) {
      setErrorMsg('Nama muzakki wajib diisi');
      return;
    }
    if (bentukZakat === 'UANG' && (!nominalRp || Number(nominalRp) <= 0)) {
      setErrorMsg('Nominal Rp wajib diisi dengan angka positif');
      return;
    }
    if (bentukZakat === 'BERAS' && (!jumlahBerasKg || Number(jumlahBerasKg) <= 0)) {
      setErrorMsg('Jumlah beras (kg) wajib diisi dengan angka positif');
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      jenisZakat,
      namaMuzakki,
      teleponMuzakki: teleponMuzakki || undefined,
      isAnonymous,
      bentukZakat,
      nominalRp: bentukZakat === 'UANG' ? Number(nominalRp) : undefined,
      jumlahBerasKg: bentukZakat === 'BERAS' ? Number(jumlahBerasKg) : undefined,
      jenisBeras: bentukZakat === 'BERAS' ? jenisBeras : undefined,
      konversiHargaPerKg: bentukZakat === 'BERAS' && konversiHargaPerKg ? Number(konversiHargaPerKg) : undefined,
      notes: notes || undefined,
    };

    try {
      const res = await fetch('/api/admin/zakat/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'usr_dummy_amil', // mock amil id
          'x-user-role': 'PETUGAS_LAPANGAN',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Gagal menyimpan entri amil');
        setIsModalOpen(false);
      } else {
        setSuccessResult({
          nomorKwitansi: data.data.nomorKwitansi,
          nominal: data.data.nominal,
          status: data.data.status,
        });
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Submit amil entry error:', err);
      setErrorMsg('Terjadi kesalahan jaringan');
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number | string) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
      Number(val)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <ZakatNav />
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Form Entri Zakat Offline (Amil)</h1>
              <p className="text-xs text-slate-500 mt-0.5">Khusus Petugas Amil & Admin untuk pencatatan penerimaan tunai/beras secara offline.</p>
            </div>
            <span className="inline-flex items-center rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
              Role: Amil / Petugas
            </span>
          </div>

          {successResult ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <div>
                  <h3 className="text-lg font-bold text-emerald-900">Entri Zakat Offline Terverifikasi</h3>
                  <p className="text-xs text-emerald-700">Kwitansi: {successResult.nomorKwitansi}</p>
                </div>
              </div>
              <div className="text-sm text-slate-700 bg-white p-4 rounded-xl border border-emerald-100 space-y-2">
                <p><strong>Nama Muzakki:</strong> {namaMuzakki} {isAnonymous && '(Publik: Hamba Allah)'}</p>
                <p><strong>Status Transaction:</strong> <span className="text-emerald-600 font-semibold">{successResult.status}</span></p>
                <p><strong>Ekuivalen Nominal:</strong> {formatCurrency(successResult.nominal)}</p>
                <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                  Saldo FundPool terkait telah ter-increment secara otomatis secara atomic.
                </p>
              </div>
              <button
                onClick={() => {
                  setSuccessResult(null);
                  setNamaMuzakki('');
                  setTeleponMuzakki('');
                  setNominalRp('');
                  setJumlahBerasKg('');
                  setNotes('');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Catat Transaksi Amil Berikutnya
              </button>
            </div>
          ) : (
            <form onSubmit={handleOpenConfirmation} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Jenis Zakat *</label>
                <select
                  value={jenisZakat}
                  onChange={(e) => setJenisZakat(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="FITRAH">Zakat Fitrah</option>
                  <option value="MAAL_PENGHASILAN">Zakat Maal Penghasilan</option>
                  <option value="EMAS">Zakat Emas & Tabungan</option>
                  <option value="PERUSAHAAN">Zakat Perusahaan</option>
                  <option value="FIDYAH">Fidyah</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Bentuk Zakat Penerimaan *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBentukZakat('UANG')}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-colors ${
                      bentukZakat === 'UANG'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    💵 Uang Tunai / Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setBentukZakat('BERAS')}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-colors ${
                      bentukZakat === 'BERAS'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🌾 Beras Fisik
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Muzakki *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Muzakki"
                    value={namaMuzakki}
                    onChange={(e) => setNamaMuzakki(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="08123456789"
                    value={teleponMuzakki}
                    onChange={(e) => setTeleponMuzakki(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Checkbox Anonim */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="isAnonymousAmil"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded-xs border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="isAnonymousAmil" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                  Muzakki meminta nama disembunyikan (<strong>Hamba Allah</strong>)
                </label>
              </div>

              {bentukZakat === 'UANG' ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nominal Diterima (Rp) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 150000"
                    value={nominalRp}
                    onChange={(e) => setNominalRp(e.target.value ? Number(e.target.value) : '')}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Jumlah Beras (kg) *</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="Contoh: 5.0"
                        value={jumlahBerasKg}
                        onChange={(e) => setJumlahBerasKg(e.target.value ? Number(e.target.value) : '')}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Varian Beras Acuan</label>
                      <select
                        value={jenisBeras}
                        onChange={(e) => setJenisBeras(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      >
                        {fitrahConfigs.map((cfg) => (
                          <option key={cfg.id} value={cfg.jenisBeras}>
                            {cfg.jenisBeras}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Override Harga Beras / kg (Opsional)</label>
                    <input
                      type="number"
                      placeholder="Biarkan kosong untuk memakai acuan SK BAZNAS sistem"
                      value={konversiHargaPerKg}
                      onChange={(e) => setKonversiHargaPerKg(e.target.value ? Number(e.target.value) : '')}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Catatan khusus dari amil penerima..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                  ⚠️ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-xs"
              >
                Simpan Entri Amil
              </button>
            </form>
          )}

          {/* Mandatory Unbypassable Confirmation Modal */}
          <ConfirmationModal
            isOpen={isModalOpen}
            title="Konfirmasi Entri Zakat Offline Amil"
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmSubmit}
            isLoading={loading}
          >
            <div className="space-y-2">
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-md font-medium mb-3">
                ⚠️ Mohon periksa kembali data entri sebelum disimpan. Entri ini akan langsung memutasi saldo FundPool sistem secara permanen.
              </p>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Jenis Zakat:</span>
                <span className="font-semibold text-slate-900">{jenisZakat}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Nama Muzakki:</span>
                <span className="font-semibold text-slate-900">{namaMuzakki}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Privasi:</span>
                <span className="font-semibold text-slate-900">{isAnonymous ? 'Hamba Allah (Anonim)' : 'Publik'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Bentuk Zakat:</span>
                <span className="font-semibold text-slate-900">{bentukZakat}</span>
              </div>
              {bentukZakat === 'UANG' ? (
                <div className="flex justify-between border-b border-slate-200 pb-1 text-emerald-700 font-bold">
                  <span>Nominal Tunai:</span>
                  <span>{formatCurrency(Number(nominalRp))}</span>
                </div>
              ) : (
                <div className="flex justify-between border-b border-slate-200 pb-1 text-emerald-700 font-bold">
                  <span>Berat Beras:</span>
                  <span>{jumlahBerasKg} kg ({jenisBeras})</span>
                </div>
              )}
              {teleponMuzakki && (
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">No. Telepon:</span>
                  <span className="font-medium text-slate-800">{teleponMuzakki}</span>
                </div>
              )}
            </div>
          </ConfirmationModal>
        </div>
      </div>
    </div>
  );
}
