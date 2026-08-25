'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Email atau nomor HP wajib diisi');
      return;
    }
    if (!password) {
      setErrorMessage('Kata sandi wajib diisi');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal masuk. Periksa email/HP dan kata sandi Anda.');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Terjadi kendala koneksi ke server. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-jakarta antialiased">
      {/* Mobile Container 430px */}
      <div className="w-full max-w-[430px] min-h-[932px] bg-white shadow-sm border border-gray-100 sm:rounded-3xl overflow-hidden pt-[48px] px-[16px] pb-[24px] flex flex-col justify-between">
        
        {/* Top Header */}
        <div>
          {/* Back Button */}
          <Link
            href="/onboarding"
            aria-label="Kembali"
            className="inline-flex items-center justify-center text-[#439F46] hover:text-[#388E3C] active:scale-95 transition-all mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </Link>

          {/* Logo & Title Centered */}
          <div className="flex flex-col items-center text-center mt-2 mb-6">
            <div className="w-[72px] h-[72px] relative mb-4 flex items-center justify-center">
              <Image
                src="/assets/images/logo-amwal.png"
                alt="Amwal Logo"
                width={72}
                height={72}
                className="object-contain"
                priority
              />
            </div>

            <h1 className="text-[24px] font-bold text-gray-900 tracking-tight leading-snug mb-1.5">
              Masuk ke Amwal
            </h1>
            <p className="text-[13px] text-gray-500">
              Kelola amal ibadah Anda dengan mudah
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field 1: Email / Nomor HP */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Email / Nomor HP
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="nama@email.com"
                disabled={isLoading}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all"
              />
            </div>

            {/* Field 2: Kata Sandi */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 pr-11 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/30 focus:border-[#439F46] transition-all"
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

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 h-[52px] bg-[#439F46] hover:bg-[#388E3C] text-white font-semibold text-[16px] rounded-xl sm:rounded-2xl text-center active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight className="w-5 h-5 ml-1 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link (Centered at bottom) */}
        <div className="pt-6 pb-2 text-center">
          <Link
            href="/register"
            className="text-sm font-medium text-[#439F46] hover:underline cursor-pointer"
          >
            Belum punya akun? Daftar
          </Link>
        </div>

      </div>
    </div>
  );
}
