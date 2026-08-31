import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata = {
  title: 'Daftar Akun | Amwal',
  description: 'Daftar akun Amwal untuk mulai beramal zakat, wakaf, infak & qurban dengan amanah.',
};

export default async function RegisterPage() {
  const session = await getSession();
  if (session?.userId) {
    redirect('/dashboard');
  }

  return <RegisterForm />;
}
