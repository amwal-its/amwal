'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronDown,
  Calculator,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

type MainTab = 'FITRAH' | 'MAAL';

type MaalCategory =
  | 'Zakat Perusahaan'
  | 'Zakat Penghasilan'
  | 'Zakat Emas & Perak'
  | 'Zakat Tabungan'
  | 'Zakat Perdagangan';

type PerusahaanSubCategory = 'Jasa' | 'Dagang/Industri';

export default function ZakatKalkulatorPage() {
  const router = useRouter();

  // Navigation & Category states
  const [mainTab, setMainTab] = useState<MainTab>('MAAL');
  const [maalCategory, setMaalCategory] = useState<MaalCategory>('Zakat Perusahaan');
  const [perusahaanType, setPerusahaanType] = useState<PerusahaanSubCategory>('Jasa');

  // Input states - Perusahaan Jasa
  const [pendapatanKotor, setPendapatanKotor] = useState<number | ''>('');
  const [biayaOperasional, setBiayaOperasional] = useState<number | ''>('');

  // Input states - Perusahaan Dagang / Industri
  const [aktivaLancar, setAktivaLancar] = useState<number | ''>('');
  const [pasivaLancar, setPasivaLancar] = useState<number | ''>('');

  // Input states - Penghasilan
  const [penghasilanBulan, setPenghasilanBulan] = useState<number | ''>('');
  const [penghasilanLain, setPenghasilanLain] = useState<number | ''>('');
  const [pengeluaranKebutuhan, setPengeluaranKebutuhan] = useState<number | ''>('');

  // Input states - Emas & Perak
  const [beratEmas, setBeratEmas] = useState<number | ''>('');

  // Input states - Fitrah
  const [jumlahJiwa, setJumlahJiwa] = useState<number>(1);
  const [hargaBerasPerKg, setHargaBerasPerKg] = useState<number>(18000); // 2.5 kg * 18.000 = 45.000/jiwa

  // Gold price benchmark
  const [goldPrice, setGoldPrice] = useState<number>(1000000); // Rp 1.000.000 / gr fallback
  const [nisabPerusahaanJasa, setNisabPerusahaanJasa] = useState<number>(85000000); // 85 gr Emas

  useEffect(() => {
    async function fetchGoldPrice() {
      try {
        const res = await fetch('/api/zakat/gold-price/live');
        if (res.ok) {
          const body = await res.json();
          const price = Number(body.data?.pricePerGram) || 1000000;
          setGoldPrice(price);
          setNisabPerusahaanJasa(price * 85);
        }
      } catch (err) {
        console.error('Error fetching live gold price:', err);
      }
    }
    fetchGoldPrice();
  }, []);

  // Format Helper
  const formatCurrency = (val: number) => {
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  // Calculations
  let hartaBersih = 0;
  let nisab = nisabPerusahaanJasa;
  let wajibZakat = false;
  let zakatWajib = 0;

  if (mainTab === 'FITRAH') {
    const nominalPerJiwa = hargaBerasPerKg * 2.5;
    zakatWajib = nominalPerJiwa * jumlahJiwa;
    hartaBersih = zakatWajib;
    wajibZakat = true;
    nisab = 0;
  } else {
    // MAAL
    if (maalCategory === 'Zakat Perusahaan') {
      if (perusahaanType === 'Jasa') {
        const pendapatan = Number(pendapatanKotor) || 0;
        const biaya = Number(biayaOperasional) || 0;
        hartaBersih = Math.max(0, pendapatan - biaya);
        nisab = goldPrice * 85;
        wajibZakat = hartaBersih >= nisab;
        zakatWajib = wajibZakat ? Math.round(hartaBersih * 0.025) : 0;
      } else {
        const aktiva = Number(aktivaLancar) || 0;
        const pasiva = Number(pasivaLancar) || 0;
        hartaBersih = Math.max(0, aktiva - pasiva);
        nisab = goldPrice * 85;
        wajibZakat = hartaBersih >= nisab;
        zakatWajib = wajibZakat ? Math.round(hartaBersih * 0.025) : 0;
      }
    } else if (maalCategory === 'Zakat Penghasilan') {
      const masuk = (Number(penghasilanBulan) || 0) * 12 + (Number(penghasilanLain) || 0);
      const keluar = (Number(pengeluaranKebutuhan) || 0) * 12;
      hartaBersih = Math.max(0, masuk - keluar);
      nisab = goldPrice * 85;
      wajibZakat = hartaBersih >= nisab;
      zakatWajib = wajibZakat ? Math.round(hartaBersih * 0.025) : 0;
    } else if (maalCategory === 'Zakat Emas & Perak') {
      const gram = Number(beratEmas) || 0;
      hartaBersih = gram * goldPrice;
      nisab = goldPrice * 85;
      wajibZakat = gram >= 85;
      zakatWajib = wajibZakat ? Math.round(hartaBersih * 0.025) : 0;
    } else {
      // General Maal 2.5%
      const total = Number(pendapatanKotor) || 0;
      hartaBersih = total;
      nisab = goldPrice * 85;
      wajibZakat = hartaBersih >= nisab;
      zakatWajib = wajibZakat ? Math.round(hartaBersih * 0.025) : 0;
    }
  }

  const handleReset = () => {
    setPendapatanKotor('');
    setBiayaOperasional('');
    setAktivaLancar('');
    setPasivaLancar('');
    setPenghasilanBulan('');
    setPenghasilanLain('');
    setPengeluaranKebutuhan('');
    setBeratEmas('');
    setJumlahJiwa(1);
  };

  const handleTunaikan = () => {
    const queryParams = new URLSearchParams({
      jenis: mainTab === 'FITRAH' ? 'FITRAH' : maalCategory,
      nominal: String(zakatWajib > 0 ? zakatWajib : 0),
    });
    router.push(`/zakat/bayar?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-jakarta antialiased selection:bg-[#439F46] selection:text-white">
      {/* Mobile-first phone screen container matching 430px canvas */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[844px] bg-[#F8FAFC] shadow-2xl border border-gray-200/80 sm:rounded-[40px] relative flex flex-col justify-between overflow-hidden">
        
        {/* Top Header App Bar */}
        <header className="pt-6 px-5 sm:px-6 pb-3 flex items-center gap-3 bg-white z-20 border-b border-gray-100 shrink-0">
          <button
            onClick={() => router.push('/dashboard')}
            aria-label="Kembali"
            className="w-10 h-10 -ml-2 text-emerald-950 hover:bg-slate-100 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft size={24} className="stroke-[2.5]" />
          </button>
          <h1 className="text-lg font-bold text-[#144927] tracking-tight text-center flex-1 pr-8">
            Kalkulator Zakat
          </h1>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 pb-6">
          
          {/* Title Row with Badge */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <h2 className="text-2xl font-extrabold text-[#194E27] tracking-tight">
              Zakat Amwal
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF7EE] text-[#1E743B] text-xs font-bold rounded-full shadow-2xs">
              <Sparkles size={13} className="text-[#1E743B]" />
              <span>2.5% Berkah</span>
            </span>
          </div>

          {/* Hero Blue Banner (Figma 670:994) */}
          <div className="bg-[#1E88E5] rounded-2xl p-4 sm:p-5 text-white shadow-xs flex items-center justify-between gap-3 relative overflow-hidden">
            <div className="flex-1 pr-2">
              <h3 className="text-sm sm:text-[15px] font-bold leading-snug drop-shadow-xs mb-1">
                Zakat Tepat Sasaran bagi 8 Ashnaf
              </h3>
              <p className="text-xs text-white/90 leading-relaxed font-medium drop-shadow-xs">
                Hitung kewajiban zakat harta Anda dengan akurat dan mudah.
              </p>
            </div>
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
              <Calculator size={22} className="text-[#1E88E5]" />
            </div>
          </div>

          {/* Main Tabs (Zakat Fitrah / Zakat Maal) */}
          <div className="grid grid-cols-2 p-1.5 bg-[#ECEFF3] rounded-2xl gap-1.5">
            <button
              onClick={() => setMainTab('FITRAH')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mainTab === 'FITRAH'
                  ? 'bg-white text-[#194E27] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Zakat Fitrah
            </button>
            <button
              onClick={() => setMainTab('MAAL')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mainTab === 'MAAL'
                  ? 'bg-white text-[#194E27] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Zakat Maal
            </button>
          </div>

          {/* Form Fields for ZAKAT MAAL */}
          {mainTab === 'MAAL' && (
            <div className="space-y-3.5">
              {/* Dropdown Jenis Harta */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Jenis Harta
                </label>
                <div className="relative">
                  <select
                    value={maalCategory}
                    onChange={(e) => setMaalCategory(e.target.value as MaalCategory)}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-2xl pl-5 pr-14 py-3.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E743B]/30 focus:border-[#1E743B] transition-all cursor-pointer shadow-2xs leading-relaxed"
                  >
                    <option value="Zakat Perusahaan">Zakat Perusahaan</option>
                    <option value="Zakat Penghasilan">Zakat Penghasilan</option>
                    <option value="Zakat Emas & Perak">Zakat Emas & Perak</option>
                    <option value="Zakat Tabungan">Zakat Tabungan</option>
                    <option value="Zakat Perdagangan">Zakat Perdagangan</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1 pointer-events-none flex items-center justify-center">
                    <ChevronDown
                      size={20}
                      className="text-gray-500 stroke-[2.2]"
                    />
                  </div>
                </div>
              </div>

              {/* Sub-tabs for Zakat Perusahaan */}
              {maalCategory === 'Zakat Perusahaan' && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPerusahaanType('Jasa')}
                    className={`py-2.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                      perusahaanType === 'Jasa'
                        ? 'border-[#1E743B] bg-[#F1F8F2] text-[#194E27]'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Jasa
                  </button>
                  <button
                    onClick={() => setPerusahaanType('Dagang/Industri')}
                    className={`py-2.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                      perusahaanType === 'Dagang/Industri'
                        ? 'border-[#1E743B] bg-[#F1F8F2] text-[#194E27]'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Dagang/Industri
                  </button>
                </div>
              )}

              {/* Input Card Container */}
              <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
                {maalCategory === 'Zakat Perusahaan' && perusahaanType === 'Jasa' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                        Pendapatan Kotor Perusahaan (1 Tahun)
                      </label>
                      <div className="relative flex items-center bg-[#F4F6F8] rounded-2xl border border-gray-200 px-3.5 py-2.5 focus-within:bg-white focus-within:border-[#1E743B] focus-within:ring-2 focus-within:ring-[#1E743B]/20 transition-all">
                        <span className="text-xs font-semibold text-gray-500 mr-2 shrink-0">
                          Rp
                        </span>
                        <input
                          type="number"
                          placeholder="0"
                          value={pendapatanKotor}
                          onChange={(e) =>
                            setPendapatanKotor(
                              e.target.value ? Math.max(0, Number(e.target.value)) : ''
                            )
                          }
                          className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                        Biaya Operasional (1 Tahun)
                      </label>
                      <div className="relative flex items-center bg-[#F4F6F8] rounded-2xl border border-gray-200 px-3.5 py-2.5 focus-within:bg-white focus-within:border-[#1E743B] focus-within:ring-2 focus-within:ring-[#1E743B]/20 transition-all">
                        <span className="text-xs font-semibold text-gray-500 mr-2 shrink-0">
                          Rp
                        </span>
                        <input
                          type="number"
                          placeholder="0"
                          value={biayaOperasional}
                          onChange={(e) =>
                            setBiayaOperasional(
                              e.target.value ? Math.max(0, Number(e.target.value)) : ''
                            )
                          }
                          className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1.5">
                        Gaji, listrik, sewa, dll yang terkait operasional.
                      </p>
                    </div>
                  </>
                )}

                {maalCategory === 'Zakat Perusahaan' && perusahaanType === 'Dagang/Industri' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                        Aktiva Lancar (Kas, Piutang, Stok Barang)
                      </label>
                      <div className="relative flex items-center bg-[#F4F6F8] rounded-2xl border border-gray-200 px-3.5 py-2.5 focus-within:bg-white focus-within:border-[#1E743B] focus-within:ring-2 focus-within:ring-[#1E743B]/20 transition-all">
                        <span className="text-xs font-semibold text-gray-500 mr-2 shrink-0">
                          Rp
                        </span>
                        <input
                          type="number"
                          placeholder="0"
                          value={aktivaLancar}
                          onChange={(e) =>
                            setAktivaLancar(
                              e.target.value ? Math.max(0, Number(e.target.value)) : ''
                            )
                          }
                          className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                        Pasiva Lancar (Hutang Jangka Pendek)
                      </label>
                      <div className="relative flex items-center bg-[#F4F6F8] rounded-2xl border border-gray-200 px-3.5 py-2.5 focus-within:bg-white focus-within:border-[#1E743B] focus-within:ring-2 focus-within:ring-[#1E743B]/20 transition-all">
                        <span className="text-xs font-semibold text-gray-500 mr-2 shrink-0">
                          Rp
                        </span>
                        <input
                          type="number"
                          placeholder="0"
                          value={pasivaLancar}
                          onChange={(e) =>
                            setPasivaLancar(
                              e.target.value ? Math.max(0, Number(e.target.value)) : ''
                            )
                          }
                          className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1.5">
                        Kewajiban segera jatuh tempo dalam tahun berjalan.
                      </p>
                    </div>
                  </>
                )}

                {maalCategory === 'Zakat Penghasilan' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                        Penghasilan per Bulan
                      </label>
                      <div className="relative flex items-center bg-[#F4F6F8] rounded-2xl border border-gray-200 px-3.5 py-2.5 focus-within:bg-white focus-within:border-[#1E743B] focus-within:ring-2 focus-within:ring-[#1E743B]/20 transition-all">
                        <span className="text-xs font-semibold text-gray-500 mr-2 shrink-0">
                          Rp
                        </span>
                        <input
                          type="number"
                          placeholder="0"
                          value={penghasilanBulan}
                          onChange={(e) =>
                            setPenghasilanBulan(
                              e.target.value ? Math.max(0, Number(e.target.value)) : ''
                            )
                          }
                          className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                        Penghasilan Lainnya (Bonus/THR/Tahun)
                      </label>
                      <div className="relative flex items-center bg-[#F4F6F8] rounded-2xl border border-gray-200 px-3.5 py-2.5 focus-within:bg-white focus-within:border-[#1E743B] focus-within:ring-2 focus-within:ring-[#1E743B]/20 transition-all">
                        <span className="text-xs font-semibold text-gray-500 mr-2 shrink-0">
                          Rp
                        </span>
                        <input
                          type="number"
                          placeholder="0"
                          value={penghasilanLain}
                          onChange={(e) =>
                            setPenghasilanLain(
                              e.target.value ? Math.max(0, Number(e.target.value)) : ''
                            )
                          }
                          className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {maalCategory === 'Zakat Emas & Perak' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                      Berat Emas yang Disimpan (Gram)
                    </label>
                    <div className="relative flex items-center bg-[#F4F6F8] rounded-2xl border border-gray-200 px-3.5 py-2.5 focus-within:bg-white focus-within:border-[#1E743B] focus-within:ring-2 focus-within:ring-[#1E743B]/20 transition-all">
                      <input
                        type="number"
                        placeholder="0"
                        value={beratEmas}
                        onChange={(e) =>
                          setBeratEmas(
                            e.target.value ? Math.max(0, Number(e.target.value)) : ''
                          )
                        }
                        className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none"
                      />
                      <span className="text-xs font-semibold text-gray-500 ml-2 shrink-0">
                        gram
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1.5">
                      Nisab 85 gram emas murni yang telah mengendap selama 1 tahun (haul).
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Fields for ZAKAT FITRAH */}
          {mainTab === 'FITRAH' && (
            <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Jumlah Jiwa (Orang)
                </label>
                <input
                  type="number"
                  min="1"
                  value={jumlahJiwa}
                  onChange={(e) => setJumlahJiwa(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#F4F6F8] rounded-2xl border border-gray-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#1E743B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Standar Harga Beras per Kg (Rp)
                </label>
                <input
                  type="number"
                  value={hargaBerasPerKg}
                  onChange={(e) => setHargaBerasPerKg(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full bg-[#F4F6F8] rounded-2xl border border-gray-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#1E743B]"
                />
                <p className="text-[11px] text-gray-500 mt-1.5">
                  Setara 2.5 kg atau 3.5 liter beras per jiwa.
                </p>
              </div>
            </div>
          )}

          {/* Calculation Result Summary Box (Figma 670:994) */}
          <div className="bg-[#EBF7EE] border border-[#CDE9D2] rounded-3xl p-4 sm:p-5 space-y-3 shadow-2xs">
            {mainTab === 'MAAL' && (
              <div className="flex items-center justify-between text-xs sm:text-[13px]">
                <span className="text-gray-600 font-medium">
                  {maalCategory === 'Zakat Perusahaan' && perusahaanType === 'Jasa'
                    ? 'Nisab Zakat Jasa (85gr Emas)'
                    : 'Nisab Acuan (85gr Emas)'}
                </span>
                <span className="text-gray-900 font-semibold">
                  {formatCurrency(nisab)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs sm:text-[13px]">
              <span className="text-gray-600 font-medium">
                {mainTab === 'FITRAH' ? 'Total Kewajiban Fitrah' : 'Jumlah Harta Bersih'}
              </span>
              <span className="text-base sm:text-lg font-bold text-gray-900">
                {formatCurrency(hartaBersih)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-[13px] pt-1">
              <span className="text-gray-600 font-medium">Status Kewajiban</span>
              {wajibZakat ? (
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Wajib Zakat ({formatCurrency(zakatWajib)})
                </span>
              ) : (
                <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#FEECEC] text-[#D92D20]">
                  Belum Wajib Zakat
                </span>
              )}
            </div>
          </div>

          {/* Bottom Actions: Reset & Tunaikan Zakat */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="py-3 px-4 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={handleTunaikan}
              className="py-3 px-4 rounded-2xl bg-[#1A5B2F] hover:bg-[#144927] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <span>Tunaikan Zakat</span>
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
