'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2, X } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Nama lengkap wajib diisi');
      return;
    }
    if (!identifier.trim()) {
      setErrorMessage('Email atau nomor HP wajib diisi');
      return;
    }
    if (!password) {
      setErrorMessage('Kata sandi wajib diisi');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal harus 6 karakter');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Anda wajib menyetujui Syarat & Ketentuan untuk melanjutkan');
      return;
    }

    setIsLoading(true);

    const isEmail = identifier.includes('@');
    const payload = {
      name: name.trim(),
      email: isEmail ? identifier.trim() : undefined,
      phone: !isEmail ? identifier.trim() : undefined,
      password,
      role: 'WAKIF',
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Pendaftaran gagal. Silakan periksa kembali data Anda.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Pendaftaran akun berhasil! Mengalihkan ke halaman masuk...');

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      console.error('Register error:', err);
      setErrorMessage('Terjadi kendala koneksi ke server. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-jakarta antialiased">
      {/* Mobile Container 430px */}
      <div className="w-full max-w-[430px] min-h-[932px] bg-white shadow-sm border border-gray-100 sm:rounded-3xl overflow-hidden pt-[48px] px-[16px] pb-[24px] flex flex-col justify-between">
        
        {/* Top Section */}
        <div>
          {/* Back button */}
          <Link
            href="/onboarding"
            aria-label="Kembali"
            className="inline-flex items-center justify-center text-[#439F46] hover:text-[#388E3C] active:scale-95 transition-all mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </Link>

          {/* Title & Subtitle Centered */}
          <div className="flex flex-col items-center text-center mt-1 mb-5">
            <h1 className="text-[24px] font-bold text-gray-900 tracking-tight leading-snug mb-1">
              Daftar Akun
            </h1>
            <p className="text-[13px] text-gray-500">
              Buat akun untuk mulai beramal
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Field 1: Nama Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ketik Nama Lengkap"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all"
              />
            </div>

            {/* Field 2: Email / Nomor HP */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Email / Nomor HP
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="nama@email.com"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all"
              />
            </div>

            {/* Field 3: Kata Sandi */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-11 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Field 4: Konfirmasi Sandi */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Konfirmasi Sandi
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-11 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Switch Toggle Row: Syarat & Ketentuan */}
            <div className="flex items-center justify-between py-2 border-t border-b border-gray-50 my-1">
              <div>
                <p className="text-xs font-semibold text-gray-900">
                  Saya menyetujui Syarat & Ketentuan
                </p>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-xs text-gray-400 hover:text-[#439F46] transition-colors cursor-pointer"
                >
                  Lihat
                </button>
              </div>

              {/* iOS style switch */}
              <button
                type="button"
                role="switch"
                aria-checked={agreeTerms}
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                  agreeTerms ? 'bg-[#439F46]' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                    agreeTerms ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 h-[52px] bg-[#439F46] hover:bg-[#388E3C] text-white font-semibold text-[16px] rounded-xl sm:rounded-2xl text-center active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <span>Daftar</span>
                  <ArrowRight className="w-5 h-5 ml-1 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link (Centered at bottom) */}
        <div className="pt-6 pb-2 text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-[#439F46] hover:underline cursor-pointer"
          >
            Sudah punya akun? Masuk
          </Link>
        </div>

        {/* Terms Modal */}
        {showTermsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">Syarat & Ketentuan Amwal</h3>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-gray-600 leading-relaxed max-h-60 overflow-y-auto space-y-2 pr-1 mb-5">
                <p>1. <strong>Kepatuhan Syariah:</strong> Seluruh transaksi wakaf, zakat, infaq, dan qurban disalurkan sesuai aturan syariah Islam dan regulasi Badan Wakaf Indonesia (BWI).</p>
                <p>2. <strong>Keamanan Data:</strong> Data pribadi Anda dilindungi dengan standar enkripsi industri.</p>
                <p>3. <strong>Transparansi:</strong> Amwal menyediakan laporan berkala atas penyaluran dana amal dan status hewan qurban.</p>
              </div>

              <button
                onClick={() => {
                  setAgreeTerms(true);
                  setShowTermsModal(false);
                }}
                className="w-full bg-[#439F46] hover:bg-[#388E3C] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all cursor-pointer"
              >
                Saya Paham & Setuju
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
