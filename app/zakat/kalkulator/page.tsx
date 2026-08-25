'use client';

import React, { useState, useEffect } from 'react';
import { GoldPriceBadge } from '@/components/zakat/gold-price-badge';
import { ZakatNav } from '@/components/zakat/zakat-nav';

interface FitrahConfig {
  id: string;
  jenisBeras: string;
  konversiHargaPerJiwa: string | number;
}

export default function ZakatKalkulatorPage() {
  const [activeTab, setActiveTab] = useState<'FITRAH' | 'MAAL_PENGHASILAN' | 'MAAL_EMAS' | 'PERUSAHAAN'>('FITRAH');
  
  // Gold price state
  const [goldPrice, setGoldPrice] = useState<string | null>(null);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [fetchedAt, setFetchedAt] = useState<string | undefined>(undefined);
  const [loadingGold, setLoadingGold] = useState<boolean>(true);

  // Fitrah configs state
  const [fitrahConfigs, setFitrahConfigs] = useState<FitrahConfig[]>([]);
  const [selectedBeras, setSelectedBeras] = useState<string>('');
  const [jumlahJiwa, setJumlahJiwa] = useState<number>(1);

  // Penghasilan state
  const [penghasilanBulan, setPenghasilanBulan] = useState<number | ''>('');
  const [penghasilanLain, setPenghasilanLain] = useState<number | ''>('');

  // Emas state
  const [beratEmas, setBeratEmas] = useState<number | ''>('');

  // Perusahaan state
  const [aktivaLancar, setAktivaLancar] = useState<number | ''>('');
  const [pasivaLancar, setPasivaLancar] = useState<number | ''>('');

  // Result state
  const [calcResult, setCalcResult] = useState<{
    mencapaiNisab: boolean;
    nisabDigunakan: string | null;
    hasilKewajiban: string;
  } | null>(null);
  const [loadingCalc, setLoadingCalc] = useState<boolean>(false);
  const [calcError, setCalcError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingGold(true);
        const resGold = await fetch('/api/zakat/gold-price/live');
        if (resGold.ok) {
          const bodyGold = await resGold.json();
          setGoldPrice(bodyGold.data.pricePerGram);
          setIsStale(bodyGold.data.isStale);
          setFetchedAt(bodyGold.data.fetchedAt);
        }

        const resFitrah = await fetch('/api/zakat-fitrah-config?active=true');
        if (resFitrah.ok) {
          const bodyFitrah = await resFitrah.json();
          setFitrahConfigs(bodyFitrah.data || []);
          if (bodyFitrah.data && bodyFitrah.data.length > 0) {
            setSelectedBeras(bodyFitrah.data[0].jenisBeras);
          }
        }
      } catch (err) {
        console.error('Error loading calculator parameters:', err);
      } finally {
        setLoadingGold(false);
      }
    }
    fetchData();
  }, []);

  const handleCalculate = async () => {
    setLoadingCalc(true);
    setCalcError(null);
    setCalcResult(null);

    let bodyPayload: Record<string, unknown> = { jenisZakat: activeTab };

    if (activeTab === 'FITRAH') {
      bodyPayload = {
        jenisZakat: 'FITRAH',
        jumlahJiwa: Number(jumlahJiwa),
        jenisBeras: selectedBeras,
      };
    } else if (activeTab === 'MAAL_PENGHASILAN') {
      bodyPayload = {
        jenisZakat: 'MAAL_PENGHASILAN',
        penghasilanPerBulan: Number(penghasilanBulan) || 0,
        penghasilanLain: Number(penghasilanLain) || 0,
      };
    } else if (activeTab === 'MAAL_EMAS') {
      bodyPayload = {
        jenisZakat: 'EMAS',
        beratEmasGram: Number(beratEmas) || 0,
      };
    } else if (activeTab === 'PERUSAHAAN') {
      bodyPayload = {
        jenisZakat: 'PERUSAHAAN',
        aktivaLancar: Number(aktivaLancar) || 0,
        pasivaLancar: Number(pasivaLancar) || 0,
      };
    }

    try {
      const res = await fetch('/api/zakat/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        setCalcError(data.error || 'Gagal menghitung zakat');
      } else {
        setCalcResult(data.data);
      }
    } catch (err) {
      console.error('Calculate error:', err);
      setCalcError('Terjadi kesalahan jaringan saat menghitung zakat');
    } finally {
      setLoadingCalc(false);
    }
  };

  const formatCurrency = (val: string | number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
      Number(val)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Kalkulator Zakat Interactive</h1>
              <p className="text-sm text-slate-500 mt-1">
                Hitung kewajiban zakat secara akurat sesuai kaidah fiqih dan acuan harga emas/beras terkini.
              </p>
            </div>
            <GoldPriceBadge pricePerGram={goldPrice} isStale={isStale} fetchedAt={fetchedAt} loading={loadingGold} />
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <ZakatNav />

          {/* Calculator Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-6">
            {[
              { id: 'FITRAH', label: 'Zakat Fitrah' },
              { id: 'MAAL_PENGHASILAN', label: 'Zakat Penghasilan' },
              { id: 'MAAL_EMAS', label: 'Zakat Emas & Tabungan' },
              { id: 'PERUSAHAAN', label: 'Zakat Perusahaan' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  setCalcResult(null);
                  setCalcError(null);
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {activeTab === 'FITRAH' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Varian Beras</label>
                  <select
                    value={selectedBeras}
                    onChange={(e) => setSelectedBeras(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    {fitrahConfigs.map((cfg) => (
                      <option key={cfg.id} value={cfg.jenisBeras}>
                        {cfg.jenisBeras} - {formatCurrency(cfg.konversiHargaPerJiwa)} / jiwa
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Jumlah Jiwa</label>
                  <input
                    type="number"
                    min="1"
                    value={jumlahJiwa}
                    onChange={(e) => setJumlahJiwa(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {activeTab === 'MAAL_PENGHASILAN' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Penghasilan per Bulan (Rp)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 10000000"
                    value={penghasilanBulan}
                    onChange={(e) => setPenghasilanBulan(e.target.value ? Number(e.target.value) : '')}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Penghasilan Lain / Bonus (Rp)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 2000000"
                    value={penghasilanLain}
                    onChange={(e) => setPenghasilanLain(e.target.value ? Number(e.target.value) : '')}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {activeTab === 'MAAL_EMAS' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Berat Emas yang Dimiliki (gram)</label>
                <input
                  type="number"
                  placeholder="Contoh: 90"
                  value={beratEmas}
                  onChange={(e) => setBeratEmas(e.target.value ? Number(e.target.value) : '')}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <p className="text-xs text-slate-500 mt-1">Nisab zakat emas adalah 85 gram emas murni (haul 1 tahun).</p>
              </div>
            )}

            {activeTab === 'PERUSAHAAN' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Aktiva Lancar (Rp)</label>
                  <input
                    type="number"
                    placeholder="Kas, Piutang, Persediaan"
                    value={aktivaLancar}
                    onChange={(e) => setAktivaLancar(e.target.value ? Number(e.target.value) : '')}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Hutang Jangka Pendek (Rp)</label>
                  <input
                    type="number"
                    placeholder="Kewajiban segera jatuh tempo"
                    value={pasivaLancar}
                    onChange={(e) => setPasivaLancar(e.target.value ? Number(e.target.value) : '')}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleCalculate}
              disabled={loadingCalc}
              className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-xs disabled:opacity-50"
            >
              {loadingCalc ? 'Menghitung Zakat...' : 'Hitung Zakat Sekarang'}
            </button>
          </div>

          {/* Error display */}
          {calcError && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              ⚠️ {calcError}
            </div>
          )}

          {/* Result Card */}
          {calcResult && (
            <div className="mt-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <h3 className="text-lg font-bold text-emerald-900">Hasil Hitung Zakat</h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm text-emerald-700">Status Nisab:</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    calcResult.mencapaiNisab ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {calcResult.mencapaiNisab ? '✅ Mencapai Nisab' : 'ℹ️ Belum Wajib Zakat (Dibawah Nisab)'}
                </span>
              </div>

              {calcResult.nisabDigunakan && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-slate-600 border-t border-emerald-200/60 pt-2">
                  <span>Nisab Acuan:</span>
                  <span className="font-medium text-slate-900">{formatCurrency(calcResult.nisabDigunakan)}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-base font-bold text-emerald-950 border-t border-emerald-200 pt-2">
                <span>Kewajiban Zakat:</span>
                <span className="text-2xl text-emerald-700">{formatCurrency(calcResult.hasilKewajiban)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
