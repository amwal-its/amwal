import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Masuk | Amwal',
  description: 'Masuk ke akun Amwal Anda untuk mengelola amal ibadah dengan mudah.',
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#439F46]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
