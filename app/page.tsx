"use client";

import React, { useState } from "react";
import { SplashScreen } from "@/components/splash-screen";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { AuthFlow } from "@/components/auth-flow";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type AppView = "splash" | "onboarding" | "auth" | "dashboard";

export default function Home() {
  const [view, setView] = useState<AppView>("splash");

  // Logika ketika onboarding selesai (Step 3: "Daftar" di-klik)
  const handleFinishOnboarding = () => {
    console.log("Onboarding Flow Finished. Switched to Auth View.");
    setView("auth");
  };

  // Logika ketika login autentikasi sukses
  const handleAuthSuccess = () => {
    console.log("Authentication successful! Switched to App Dashboard.");
    setView("dashboard");
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-100 dark:bg-zinc-950">
      
      {/* 1. SPLASH SCREEN (Fixed, full viewport) */}
      {view === "splash" && (
        <SplashScreen onFinish={() => setView("onboarding")} />
      )}

      {/* 2. ONBOARDING FLOW (Fluid responsive split-screen / vertical list) */}
      {view === "onboarding" && (
        <OnboardingFlow onFinish={handleFinishOnboarding} />
      )}

      {/* 3. AUTHENTICATION FLOW (Register & Login with desktop split-screen) */}
      {view === "auth" && (
        <AuthFlow onSuccess={handleAuthSuccess} />
      )}

      {/* 4. DASHBOARD (Full screen fluid web app layout) */}
      {view === "dashboard" && (
        <div className="flex-1 flex flex-col bg-[#F5F7F6] p-6 sm:p-10 animate-fade-in transition-all duration-500 min-h-screen w-full">
          
          {/* Main Navigation Header */}
          <div className="flex justify-between items-center mb-10 w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center border border-emerald-100 p-0.5">
                <Image
                  src="/assets/images/logo.png"
                  alt="Amwal Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-[10px] text-amwal-gray font-bold uppercase tracking-wider">Aplikasi Syariah</h2>
                <h1 className="text-xl font-extrabold text-amwal-green mt-[-2px]">Amwal</h1>
              </div>
            </div>
            
            {/* Profile Info & Quick Log out */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm font-semibold text-amwal-gray">Bara Ardiwinata</span>
              <div className="w-10 h-10 rounded-full bg-amwal-green-muted border border-amwal-green/10 flex items-center justify-center font-bold text-sm text-amwal-green shadow-inner cursor-pointer hover:bg-amwal-green/10 transition-colors">
                BA
              </div>
            </div>
          </div>

          {/* Desktop Responsive Content Grid */}
          <div className="flex-1 flex flex-col justify-center items-center text-center px-4 max-w-7xl mx-auto w-full">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 relative animate-bounce">
              <div className="absolute inset-0 bg-emerald-500/5 rounded-full scale-125 animate-ping" />
              <svg className="w-12 h-12 text-amwal-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-amwal-green tracking-tight leading-tight mb-4">
              Selamat Datang di Portal Amwal!
            </h2>
            <p className="text-base font-medium text-amwal-gray leading-relaxed max-w-md mb-8">
              Autentikasi Anda berhasil diselesaikan secara aman. Sekarang Anda memiliki akses penuh ke sistem manajemen warisan Islam dan penyaluran wakaf modern kami.
            </p>

            {/* Quick action card grid mockup to show high premium quality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-10">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 text-left hover:shadow-md transition-all">
                <span className="text-amwal-lime text-2xl">⚖️</span>
                <h3 className="font-extrabold text-amwal-green text-lg mt-2">Kalkulator Warisan</h3>
                <p className="text-xs text-amwal-gray font-medium mt-1">Hitung pembagian ahli waris secara otomatis & adil.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 text-left hover:shadow-md transition-all">
                <span className="text-amwal-lime text-2xl">🕌</span>
                <h3 className="font-extrabold text-amwal-green text-lg mt-2">Manajemen Wakaf</h3>
                <p className="text-xs text-amwal-gray font-medium mt-1">Salurkan dana wakaf langsung untuk berbagai kemaslahatan.</p>
              </div>
            </div>

            <Button 
              onClick={() => setView("splash")} 
              className="w-full max-w-[200px] font-bold py-3.5 text-sm shadow-md cursor-pointer"
            >
              Ulangi Flow
            </Button>
          </div>

          {/* Footer */}
          <div className="text-xs text-center text-amwal-gray/60 font-semibold mt-auto pt-8 w-full max-w-7xl mx-auto border-t border-slate-100">
            Amwal Syariah © 2026. Hak Cipta Dilindungi.
          </div>
        </div>
      )}

    </div>
  );
}
