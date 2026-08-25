import React from 'react';
import { OnboardingView } from '@/components/auth/onboarding-view';

export const metadata = {
  title: 'Selamat Datang | Amwal',
  description: 'Kelola zakat, wakaf, infak & qurban dalam satu aplikasi yang mudah dan transparan.',
};

export default function OnboardingPage() {
  return <OnboardingView />;
}
