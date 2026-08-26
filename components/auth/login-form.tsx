'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
      {/* Mobile Phone Screen Container for Desktop */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[844px] bg-white shadow-2xl border border-gray-200/80 sm:rounded-[40px] relative flex flex-col justify-between overflow-hidden pt-[36px] px-[20px] pb-[24px]">
        
        {/* Top Header */}
        <div className="overflow-y-auto pr-0.5">
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
              <Input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="nama@email.com"
                disabled={isLoading}
              />
            </div>

            {/* Field 2: Kata Sandi */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
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

            {/* Divider OR */}
            <div className="flex items-center gap-3 my-3">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-[11px] text-gray-400 font-medium uppercase">atau</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            {/* Google OAuth Button */}
            <a
              href="/api/auth/google"
              className="w-full h-[52px] bg-white hover:bg-gray-50 text-gray-700 font-semibold text-[15px] rounded-xl sm:rounded-2xl border border-gray-200 transition-all flex items-center justify-center gap-3 shadow-2xs cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Masuk dengan Google</span>
            </a>
          </form>
        </div>

        {/* Footer Link (Centered at bottom) */}
        <div className="pt-6 pb-2 text-center max-w-md mx-auto w-full">
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

