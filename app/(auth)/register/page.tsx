import React from 'react';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata = {
  title: 'Daftar Akun | Amwal',
  description: 'Daftar akun Amwal untuk mulai beramal zakat, wakaf, infak & qurban dengan amanah.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
