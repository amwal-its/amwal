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
  LogIn,
  User,
  ShieldCheck,
  UserCheck,
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

type IdentityMode = 'UNSELECTED' | 'LOGGED_IN' | 'GUEST' | 'ANONYMOUS';

export function WakafDonateForm({ program, currentUser }: WakafDonateFormProps) {
  const router = useRouter();

  // Pre-donation choice state (Task 8.2)
  const [identityMode, setIdentityMode] = useState<IdentityMode>(
    currentUser ? 'LOGGED_IN' : 'UNSELECTED'
  );

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

  const handleSelectOptionGuest = () => {
    setIdentityMode('GUEST');
    setIsAnonymous(false);
    setNamaWakif('');
  };

  const handleSelectOptionAnonymous = () => {
    setIdentityMode('ANONYMOUS');
    setIsAnonymous(true);
    setNamaWakif('Hamba Allah');
    setIdentifier('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (effectiveNominal < 10000) {
      setErrorMessage('Nominal wakaf minimal Rp 10.000');
      return;
    }

    if (!isAnonymous && identityMode === 'GUEST' && !namaWakif.trim()) {
      setErrorMessage('Nama wakif wajib diisi atau pilih opsi Hamba Allah');
      return;
    }

    setIsLoading(true);

    try {
      const isEmail = identifier.includes('@');
      const isPhone = !isEmail && identifier.trim().length > 0;

      const payload = {
        waqfProgramId: program.id,
        nominal: effectiveNominal,
        namaWakif: isAnonymous || identityMode === 'ANONYMOUS' ? 'Hamba Allah' : namaWakif.trim(),
        email: isEmail ? identifier.trim() : undefined,
        noTelepon: isPhone ? identifier.trim() : undefined,
        isAnonymous: isAnonymous || identityMode === 'ANONYMOUS',
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
          <div className="bg-[#F8F9FA] border border-gray-100 rounded-2xl p-3.5 mb-4 flex items-center gap-3">
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

          {/* Identity Status Pill Banner */}
          <div className="mb-5 p-2.5 rounded-xl border bg-slate-50 border-gray-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              {identityMode === 'LOGGED_IN' ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-gray-800 truncate">
                    Akun: {currentUser?.name || currentUser?.email}
                  </span>
                </>
              ) : identityMode === 'ANONYMOUS' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold text-gray-800">
                    Mode: Hamba Allah (Anonim Total)
                  </span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-gray-800">
                    Mode: Donatur Tamu (Guest)
                  </span>
                </>
              )}
            </div>
            {!currentUser && (
              <button
                type="button"
                onClick={() => setIdentityMode('UNSELECTED')}
                className="text-[11px] font-bold text-[#439F46] hover:underline shrink-0 ml-2 cursor-pointer"
              >
                Ganti Opsi
              </button>
            )}
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
            {identityMode !== 'ANONYMOUS' ? (
              <div className="space-y-3 pt-1">
                {/* Toggle Hamba Allah HANYA untuk User Terdaftar / Logged In */}
                {identityMode === 'LOGGED_IN' && (
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
                )}

                {/* Nama Wakif */}
                {(!isAnonymous || identityMode === 'GUEST') && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                      Nama Lengkap Wakif {identityMode === 'GUEST' && <span className="text-rose-500">*</span>}
                    </label>
                    <input
                      type="text"
                      required={identityMode === 'GUEST'}
                      value={namaWakif}
                      onChange={(e) => setNamaWakif(e.target.value)}
                      placeholder={identityMode === 'GUEST' ? 'Ketik nama lengkap Anda' : 'Ketik nama lengkap'}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all"
                    />
                  </div>
                )}

                {/* Email / No HP */}
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Email / Nomor WhatsApp (Opsional)
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
            ) : (
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl">
                <div className="flex items-center gap-2 mb-1 text-amber-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Donasi Anonim Terpilih</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Data pribadi Anda tidak akan disimpan. Transaksi akan langsung diproses atas nama <strong>Hamba Allah</strong>.
                </p>
              </div>
            )}

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
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedMethod === 'QRIS'
                      ? 'border-[#439F46] bg-[#EEF7EE] shadow-2xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#439F46] shadow-xs">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-900">
                        QRIS (GoPay, OVO, ShopeePay, Dana)
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Verifikasi otomatis real-time
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'QRIS'
                        ? 'border-[#439F46] bg-[#439F46]'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedMethod === 'QRIS' && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                </button>

                {/* Option 2: Transfer Bank */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('TRANSFER')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedMethod === 'TRANSFER'
                      ? 'border-[#439F46] bg-[#EEF7EE] shadow-2xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#439F46] shadow-xs">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-900">
                        Transfer Bank Syariah (BSI / Mandiri Syariah)
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Virtual Account & Manual Transfer
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'TRANSFER'
                        ? 'border-[#439F46] bg-[#439F46]'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedMethod === 'TRANSFER' && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Sticky Bottom Summary & CTA */}
        <div className="fixed sm:absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg z-20 sm:rounded-b-3xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-medium">
              Total Pembayaran
            </span>
            <span className="text-base sm:text-lg font-bold text-[#439F46]">
              {formatRupiah(effectiveNominal)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || effectiveNominal < 10000}
            className="w-full h-[52px] bg-[#439F46] hover:bg-[#388E3C] disabled:bg-gray-300 text-white font-semibold text-[15px] rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memproses Pesanan...</span>
              </>
            ) : (
              <>
                <span>Lanjut Pembayaran</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TASK 8.2: MODAL PRE-DONASI 3-OPSI (Login / Guest / Anonim)    */}
        {/* ------------------------------------------------------------- */}
        {identityMode === 'UNSELECTED' && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 relative animate-in slide-in-from-bottom-6">
              
              <div className="text-center pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#439F46] flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Pilih Identitas Donasi
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Pilih cara bertransaksi wakaf yang paling nyaman untuk Anda:
                </p>
              </div>

              <div className="space-y-3 mt-5">
                {/* Opsi 1: Masuk / Login Akun */}
                <button
                  type="button"
                  onClick={() => router.push(`/login?redirect=/wakaf/${program.id}/donate`)}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-left transition-all group cursor-pointer active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#439F46] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#439F46] transition-colors">
                      1. Masuk Akun Amwal
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      Riwayat & sertifikat tersimpan permanen
                    </p>
                  </div>
                </button>

                {/* Opsi 2: Lanjut sebagai Guest */}
                <button
                  type="button"
                  onClick={handleSelectOptionGuest}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-left transition-all group cursor-pointer active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      2. Lanjut sebagai Tamu (Guest)
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      Isi nama & WhatsApp tanpa password
                    </p>
                  </div>
                </button>

                {/* Opsi 3: Hamba Allah (Anonim Total) */}
                <button
                  type="button"
                  onClick={handleSelectOptionAnonymous}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 text-left transition-all group cursor-pointer active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-amber-800 transition-colors">
                      3. Hamba Allah (Anonim Total)
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      Donasi cepat tanpa mengisi identitas
                    </p>
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSelectOptionGuest}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-4 font-medium"
              >
                Tutup & Lanjut ke Form →
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PAYMENT INSTRUCTION MODAL (Sandbox Simulation)                */}
        {/* ------------------------------------------------------------- */}
        {paymentResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 relative">
              
              <div className="text-center pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#439F46] flex items-center justify-center mx-auto mb-2">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Instruksi Pembayaran
                </h3>
                <p className="text-xs text-gray-500">
                  No. Invoice: <span className="font-mono font-bold text-gray-800">{paymentResult.nomorKwitansi}</span>
                </p>
              </div>

              <div className="py-4 space-y-3">
                {/* Nominal Row */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="text-xs text-gray-500">Nominal Wakaf</span>
                  <span className="text-sm font-bold text-[#439F46]">
                    {formatRupiah(paymentResult.nominal)}
                  </span>
                </div>

                {/* QR Code Container Simulation */}
                <div className="p-4 bg-slate-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center">
                  <div className="w-36 h-36 bg-white rounded-xl p-2 border border-gray-200 flex items-center justify-center relative shadow-2xs">
                    <QrCode className="w-28 h-28 text-gray-900" />
                  </div>
                  <span className="text-[11px] text-gray-500 mt-2 font-medium">
                    Pindai QRIS via aplikasi e-wallet Anda
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 mt-2">
                <button
                  type="button"
                  onClick={handleFinishPayment}
                  disabled={isVerifying}
                  className="w-full h-[48px] bg-[#439F46] hover:bg-[#388E3C] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Saya Sudah Bayar (Selesai)</span>
                    </>
                  )}
                </button>

                {paymentResult.transactionId && (
                  <a
                    href={`/api/certificates/${paymentResult.transactionId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-[42px] bg-emerald-50 hover:bg-emerald-100 text-[#439F46] font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Lihat / Unduh Sertifikat PDF</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
