'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
      {/* Mobile Phone Screen Container for Desktop */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[844px] bg-white shadow-2xl border border-gray-200/80 sm:rounded-[40px] relative flex flex-col justify-between overflow-hidden pt-[36px] px-[20px] pb-[24px]">
        
        {/* Top Section */}
        <div className="overflow-y-auto pr-0.5">
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
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ketik Nama Lengkap"
                disabled={isLoading}
              />
            </div>

            {/* Field 2: Email / Nomor HP */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Email / Nomor HP
              </label>
              <Input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="nama@email.com"
                disabled={isLoading}
              />
            </div>

            {/* Field 3: Kata Sandi */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Kata Sandi
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-800 p-1 cursor-pointer transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 stroke-[2]" />
                    ) : (
                      <Eye className="w-5 h-5 stroke-[2]" />
                    )}
                  </button>
                }
              />
            </div>

            {/* Field 4: Konfirmasi Sandi */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Konfirmasi Sandi
              </label>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-500 hover:text-gray-800 p-1 cursor-pointer transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 stroke-[2]" />
                    ) : (
                      <Eye className="w-5 h-5 stroke-[2]" />
                    )}
                  </button>
                }
              />
            </div>


            {/* Terms & Conditions Row with right-aligned checkbox */}
            <div className="flex items-center justify-between py-2.5 border-t border-b border-gray-50 my-2">
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-gray-900">
                  Saya menyetujui Syarat & Ketentuan
                </span>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-xs text-gray-400 hover:text-[#439F46] transition-colors cursor-pointer mt-0.5"
                >
                  Lihat
                </button>
              </div>

              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 rounded-md border-gray-300 text-[#439F46] focus:ring-[#439F46]/30 accent-[#439F46] cursor-pointer ml-3 shrink-0"
              />
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-7 h-[52px] bg-[#439F46] hover:bg-[#388E3C] text-white font-semibold text-[16px] rounded-xl sm:rounded-2xl text-center active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
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
              </div>

              <div className="text-xs text-gray-600 leading-relaxed max-h-60 overflow-y-auto space-y-2 pr-1 mb-5">
                <p>1. <strong>Kepatuhan Syariah:</strong> Seluruh transaksi wakaf, zakat, infaq, dan qurban disalurkan sesuai aturan syariah Islam dan regulasi Badan Wakaf Indonesia (BWI).</p>
                <p>2. <strong>Keamanan Data:</strong> Data pribadi Anda dilindungi dengan standar enkripsi industri.</p>
                <p>3. <strong>Transparansi:</strong> Amwal menyediakan laporan berkala atas penyaluran dana amal dan status hewan qurban.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-full bg-[#439F46] hover:bg-[#388E3C] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4 text-white stroke-[2.5]" />
                <span>Tutup</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
