'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  QrCode,
  CreditCard,
  Wallet,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Clock,
  Sparkles,
  Building2,
  Heart,
  Download,
  X,
} from 'lucide-react';

interface WakafDonateFormProps {
  program: {
    id: string;
    judul: string;
    kategori?: string | null;
    bannerUrl?: string | null;
    nadzirProfile?: {
      namaLembaga?: string | null;
    } | null;
  };
  currentUser?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
}

const PRESET_AMOUNTS = [25000, 50000, 100000, 250000, 500000, 1000000];

export function WakafDonateForm({ program, currentUser }: WakafDonateFormProps) {
  const router = useRouter();

  const [selectedNominal, setSelectedNominal] = useState<number>(100000);
  const [customNominal, setCustomNominal] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [namaWakif, setNamaWakif] = useState<string>(currentUser?.name || '');
  const [identifier, setIdentifier] = useState<string>(currentUser?.email || currentUser?.phone || '');
  const [pesanDoa, setPesanDoa] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<'QRIS' | 'TRANSFER' | 'VA' | 'TUNAI'>('QRIS');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<any | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFinishPayment = async () => {
    if (!paymentResult?.orderId) {
      setPaymentResult(null);
      router.push(`/wakaf/${program.id}`);
      router.refresh();
      return;
    }

    setIsVerifying(true);
    try {
      await fetch(`/api/wakaf/orders/${paymentResult.orderId}/verify`, {
        method: 'POST',
      });
    } catch (err) {
      console.error('Error verifying order simulation:', err);
    } finally {
      setIsVerifying(false);
      setPaymentResult(null);
      router.push(`/wakaf/${program.id}`);
      router.refresh();
    }
  };

  const effectiveNominal = customNominal ? parseInt(customNominal.replace(/\D/g, ''), 10) || 0 : selectedNominal;

  const handleSelectPreset = (amount: number) => {
    setSelectedNominal(amount);
    setCustomNominal('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCustomNominal(raw ? parseInt(raw, 10).toLocaleString('id-ID') : '');
    if (raw) {
      setSelectedNominal(0);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (effectiveNominal < 10000) {
      setErrorMessage('Nominal wakaf minimal Rp 10.000');
      return;
    }

    if (!isAnonymous && !namaWakif.trim()) {
      setErrorMessage('Nama wakif wajib diisi atau pilih opsi Hamba Allah');
      return;
    }

    setIsLoading(true);

    try {
      const isEmail = identifier.includes('@');
      const payload = {
        waqfProgramId: program.id,
        nominal: effectiveNominal,
        namaWakif: isAnonymous ? 'Hamba Allah' : namaWakif.trim(),
        noTelepon: !isEmail ? identifier.trim() : undefined,
        email: isEmail ? identifier.trim() : undefined,
        isAnonymous,
        pesanDoa: pesanDoa.trim() || undefined,
        metodePembayaran: selectedMethod,
      };

      const res = await fetch('/api/wakaf/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error || 'Gagal memproses donasi wakaf.');
        setIsLoading(false);
        return;
      }

      setPaymentResult(json.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Donation error:', err);
      setErrorMessage('Terjadi kendala jaringan saat menghubungi payment server.');
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-jakarta antialiased">
      {/* Mobile-first central card */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[932px] bg-white shadow-sm border border-gray-100 sm:rounded-3xl overflow-hidden pt-6 px-4 pb-28 flex flex-col justify-between relative">
        
        {/* Top Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Link
              href={`/wakaf/${program.id}`}
              aria-label="Kembali"
              className="w-10 h-10 -ml-2 text-gray-700 flex items-center justify-center hover:text-gray-900 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">
              Pembayaran Wakaf
            </h1>
          </div>

          {/* Program Summary Card */}
          <div className="bg-[#F8F9FA] border border-gray-100 rounded-2xl p-3.5 mb-5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden relative shrink-0">
              <Image
                src={program.bannerUrl || '/assets/images/wakaf/wakaf-dana-abadi-untuk-pendidikan-agama-islam.png'}
                alt={program.judul}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-block text-[10px] font-bold text-[#439F46] uppercase tracking-wider">
                {program.kategori || 'Wakaf Produktif'}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
                {program.judul}
              </h2>
              <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3" />
                <span>{program.nadzirProfile?.namaLembaga || 'Badan Pengelola Wakaf'}</span>
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Pilihan Nominal Cepat */}
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-2">
                Pilih Nominal Wakaf
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2.5">
                {PRESET_AMOUNTS.map((amount) => {
                  const isSelected = selectedNominal === amount && !customNominal;
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleSelectPreset(amount)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#EEF7EE] border-[#439F46] text-[#439F46] shadow-2xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {formatRupiah(amount).replace(',00', '')}
                    </button>
                  );
                })}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                  Rp
                </span>
                <input
                  type="text"
                  value={customNominal}
                  onChange={handleCustomChange}
                  placeholder="Nominal lainnya (min. 10.000)"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all"
                />
              </div>
            </div>

            {/* 2. Opsi Anonim & Data Wakif */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between py-2 border-y border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Hamba Allah
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Sembunyikan nama saya dari daftar wakif publik
                  </p>
                </div>

                {/* iOS switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isAnonymous}
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                    isAnonymous ? 'bg-[#439F46]' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ${
                      isAnonymous ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Nama Wakif */}
              {!isAnonymous && (
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Nama Lengkap Wakif
                  </label>
                  <input
                    type="text"
                    value={namaWakif}
                    onChange={(e) => setNamaWakif(e.target.value)}
                    placeholder="Ketik nama lengkap"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all"
                  />
                </div>
              )}

              {/* Email / No HP */}
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Email / Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Untuk pengiriman sertifikat & bukti wakaf"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all"
                />
              </div>

              {/* Pesan / Doa Kebaikan */}
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Doa / Niat Kebaikan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={pesanDoa}
                  onChange={(e) => setPesanDoa(e.target.value)}
                  placeholder="Tuliskan doa kebaikan untuk diri sendiri atau keluarga tercinta..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all resize-none"
                />
              </div>
            </div>

            {/* 3. Pilihan Metode Pembayaran */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-900 mb-2">
                Metode Pembayaran
              </label>

              <div className="space-y-2">
                {/* Option 1: QRIS */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('QRIS')}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    selectedMethod === 'QRIS'
                      ? 'bg-[#EEF7EE]/80 border-[#439F46] text-gray-900'
                      : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#EEF7EE] text-[#439F46] flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">QRIS</span>
                        <span className="bg-[#439F46] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                          Rekomendasi
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 block">
                        Gojek, OVO, Dana, LinkAja, ShopeePay, BCA, dll.
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedMethod === 'QRIS'
                        ? 'border-[#439F46] bg-[#439F46] text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedMethod === 'QRIS' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                {/* Option 2: Virtual Account / Bank Transfer */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('VA')}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    selectedMethod === 'VA'
                      ? 'bg-[#EEF7EE]/80 border-[#439F46] text-gray-900'
                      : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Virtual Account</span>
                      <span className="text-[11px] text-gray-400 block">
                        BCA, Mandiri, BNI, BRI, BSI, CIMB
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedMethod === 'VA'
                        ? 'border-[#439F46] bg-[#439F46] text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedMethod === 'VA' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                {/* Option 3: Manual Transfer */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('TRANSFER')}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    selectedMethod === 'TRANSFER'
                      ? 'bg-[#EEF7EE]/80 border-[#439F46] text-gray-900'
                      : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Transfer Bank Manual</span>
                      <span className="text-[11px] text-gray-400 block">
                        Konfirmasi bukti transfer ke amil
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedMethod === 'TRANSFER'
                        ? 'border-[#439F46] bg-[#439F46] text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedMethod === 'TRANSFER' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 shadow-lg">
          <div className="max-w-[430px] mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                Total Wakaf
              </span>
              <span className="text-base sm:text-lg font-extrabold text-[#439F46]">
                {formatRupiah(effectiveNominal)}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || effectiveNominal < 10000}
              className="h-[52px] px-6 bg-[#439F46] hover:bg-[#388E3C] text-white font-semibold text-[16px] rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Bayar Sekarang</span>
                  <ArrowRight className="w-5 h-5 ml-1 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Payment Confirmation / QRIS Modal */}
        {paymentResult && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#E8F5E9] text-[#439F46] flex items-center justify-center mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Instruksi Pembayaran
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Nomor Kwitansi: <strong className="text-gray-800">{paymentResult.nomorKwitansi}</strong>
              </p>

              {/* QRIS Dummy / Details Container */}
              <div className="w-full bg-[#F8F9FA] border border-gray-200/80 rounded-2xl p-4 mb-4 text-center">
                {selectedMethod === 'QRIS' ? (
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 bg-white border border-gray-200 rounded-xl p-2 flex items-center justify-center mb-2 shadow-xs">
                      {/* Simulated QR Pattern */}
                      <QrCode className="w-32 h-32 text-gray-900" />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">
                      Pindai QRIS dengan e-wallet atau m-banking Anda
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="block text-[11px] text-gray-400 uppercase font-bold mb-1">
                      Nomor Virtual Account (BSI / Mandiri)
                    </span>
                    <div className="flex items-center justify-center gap-2 my-1">
                      <span className="text-lg font-mono font-bold text-gray-900 tracking-wider">
                        8808 0812 9948 102
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy('880808129948102')}
                        className="p-1.5 bg-white border rounded-lg text-gray-600 hover:text-[#439F46] cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {copied && <span className="text-[10px] text-emerald-600 font-bold">Tersalin!</span>}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-200/80 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Total Tagihan:</span>
                  <span className="font-bold text-[#439F46] text-sm">
                    {formatRupiah(paymentResult.nominal)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={handleFinishPayment}
                  className="w-full h-[52px] bg-[#439F46] hover:bg-[#388E3C] text-white font-semibold text-[15px] rounded-xl sm:rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-70"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memverifikasi Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <span>Saya Sudah Bayar (Selesai)</span>
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>

                <a
                  href={`/api/certificates/${paymentResult.orderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#1B5E20] border border-emerald-200 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs text-center"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Lihat & Unduh Sertifikat Digital (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
