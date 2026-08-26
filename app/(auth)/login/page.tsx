import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { LoginForm } from '@/components/auth/login-form';

export const metadata = {
  title: 'Masuk | Amwal',
  description: 'Masuk ke akun Amwal Anda untuk mengelola amal ibadah dengan mudah.',
};

export default async function LoginPage() {
  const session = await getSession();
  if (session?.userId) {
    redirect('/dashboard');
  }

  return <LoginForm />;
}
