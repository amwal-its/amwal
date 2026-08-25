import React from 'react';
import { LoginForm } from '@/components/auth/login-form';

export const metadata = {
  title: 'Masuk | Amwal',
  description: 'Masuk ke akun Amwal Anda untuk mengelola amal ibadah dengan mudah.',
};

export default function LoginPage() {
  return <LoginForm />;
}
