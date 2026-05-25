"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface OnboardingFlowProps {
  onFinish: () => void;
}

interface StepData {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  renderFallback: () => React.JSX.Element;
}

export function OnboardingFlow({ onFinish }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Triggered when "Daftar" is clicked on Step 3
  const handleFinishOnboarding = () => {
    console.log("handleFinishOnboarding() called.");
    onFinish();
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinishOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const steps: StepData[] = [
    {
      title: "Warisan & Wakaf, Jejak Abadi Setelah Kita Pergi",
      subtitle: "Bangun kebaikan yang terus mengalir meski waktu berhenti.",
      imageSrc: "/assets/images/step1.png",
      imageAlt: "Warisan dan Wakaf Balance Scale",
      renderFallback: () => (
        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
          {/* Ambient light glow */}
          <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent opacity-60" />

          {/* Scales Illustration */}
          <svg className="w-48 h-48 drop-shadow-2xl z-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stand / Base */}
            <path d="M70 170H130M100 170V60M100 60L75 75M100 60L125 75" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <path d="M60 175H140" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />

            {/* Balance Beam (Main hanger) */}
            <path d="M50 78L150 78" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="78" r="6" fill="#F59E0B" />
            <circle cx="50" cy="78" r="4" fill="#F59E0B" />
            <circle cx="150" cy="78" r="4" fill="#F59E0B" />

            {/* Left Hanger Strings & Plate (Feather) */}
            <path d="M50 78L30 130M50 78L70 130" stroke="#94A3B8" strokeWidth="2" />
            <path d="M25 130H75" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
            <path d="M30 130C30 142 70 142 70 130" fill="#F3F4F6" fillOpacity="0.2" />

            {/* Left side Feather asset */}
            <path d="M40 120C44 112 48 110 52 114C56 118 46 128 42 126C40 125 39 122 40 120Z" fill="#E2E8F0" />
            <path d="M35 125C40 115 50 115 55 122" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

            {/* Right Hanger Strings & Plate (Gold) */}
            <path d="M150 78L130 130M150 78L170 130" stroke="#94A3B8" strokeWidth="2" />
            <path d="M125 130H175" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
            <path d="M130 130C130 142 170 142 170 130" fill="#F3F4F6" fillOpacity="0.2" />

            {/* Right side Gold Bars */}
            <rect x="140" y="118" width="18" height="8" rx="1.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
            <rect x="146" y="110" width="18" height="8" rx="1.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
            <rect x="136" y="123" width="22" height="7" rx="1.5" fill="#D97706" />
          </svg>

          <div className="absolute bottom-6 text-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              Ilustrasi Warisan & Wakaf
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Bingung Warisan? Bingung Mulai Wakaf?",
      subtitle: "Kami bantu dengan panduan syariah yang jelas, adil, dan terpercaya.",
      imageSrc: "/assets/images/step2.png",
      imageAlt: "Panduan Syariah Laptop Workspace",
      renderFallback: () => (
        <div className="w-full h-full bg-[#1b2f29] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
          {/* Ambient green glow */}
          <div className="absolute inset-0 bg-radial from-amwal-secondary-teal/30 via-transparent to-transparent opacity-50" />

          {/* Laptop & Workspace Illustration */}
          <svg className="w-48 h-48 drop-shadow-2xl z-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Desk Surface */}
            <path d="M10 160H190" stroke="#111C19" strokeWidth="6" strokeLinecap="round" />

            {/* Laptop Screen */}
            <rect x="50" y="70" width="100" height="64" rx="6" fill="#334155" stroke="#475569" strokeWidth="3" />
            <rect x="56" y="76" width="88" height="50" rx="2" fill="#346062" />

            {/* Code lines on screen */}
            <path d="M64 86H94M64 94H114M64 102H84M64 110H124" stroke="#8DA760" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

            {/* Keyboard / Laptop Base */}
            <path d="M40 134H160L168 152H32L40 134Z" fill="#1E293B" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
            <path d="M85 146H115" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />

            {/* Document Paper */}
            <rect x="22" y="90" width="22" height="32" rx="2" fill="#F8FAFC" transform="rotate(-10 22 90)" />
            <path d="M26 100L38 98M24 108L36 106" stroke="#94A3B8" strokeWidth="2" />

            {/* Pen */}
            <path d="M162 110L172 136" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          </svg>

          <div className="absolute bottom-6 text-center">
            <span className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-bold bg-black/40 px-3 py-1 rounded-full border border-emerald-800/40">
              Panduan Syariah Digital
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Amwal: Solusi Amanah untuk Masa Depan dan Akhirat",
      subtitle: "Atur warisan, salurkan wakaf, semua dalam satu aplikasi.",
      imageSrc: "/assets/images/step3.png",
      imageAlt: "Amanah Keuangan Magnifying Glass & House",
      renderFallback: () => (
        <div className="w-full h-full bg-[#18262E] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
          {/* Ambient blue glow */}
          <div className="absolute inset-0 bg-radial from-sky-500/10 via-transparent to-transparent opacity-60" />

          {/* Assets Illustration */}
          <svg className="w-48 h-48 drop-shadow-2xl z-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Banknote Background Base */}
            <rect x="40" y="125" width="70" height="35" rx="3" fill="#0D9488" fillOpacity="0.4" stroke="#0F766E" strokeWidth="2" transform="rotate(-5 40 125)" />

            {/* Miniature House */}
            <path d="M125 105L155 80L185 105V140H125V105Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
            <path d="M120 105L155 76L190 105" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
            <rect x="145" y="115" width="20" height="25" fill="#78350F" />
            <circle cx="155" cy="94" r="5" fill="#F59E0B" />

            {/* Miniature Car */}
            <path d="M30 115C30 110 35 108 45 108H75C80 108 82 110 85 115L92 125H25L30 115Z" fill="#3B82F6" />
            <rect x="25" y="125" width="72" height="12" rx="3" fill="#1D4ED8" />
            <circle cx="42" cy="137" r="7" fill="#1E293B" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="80" cy="137" r="7" fill="#1E293B" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Gold Coins Stack */}
            <g opacity="0.95">
              <ellipse cx="105" cy="148" rx="14" ry="5" fill="#D97706" />
              <rect x="91" y="142" width="28" height="6" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
              <ellipse cx="105" cy="142" rx="14" ry="5" fill="#FEF08A" />

              <rect x="91" y="134" width="28" height="8" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
              <ellipse cx="105" cy="134" rx="14" ry="5" fill="#FEF08A" />

              <rect x="91" y="126" width="28" height="8" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
              <ellipse cx="105" cy="126" rx="14" ry="5" fill="#FEF08A" />
            </g>

            {/* Magnifying Glass overlay */}
            <circle cx="95" cy="90" r="24" fill="#38BDF8" fillOpacity="0.15" stroke="#F8FAFC" strokeWidth="4" />
            <path d="M112 107L132 127" stroke="#F8FAFC" strokeWidth="6" strokeLinecap="round" />
            <path d="M112 107L132 127" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <div className="absolute bottom-6 text-center">
            <span className="text-[10px] uppercase tracking-widest text-sky-300/80 font-bold bg-black/40 px-3 py-1 rounded-full border border-sky-800/40">
              Integrasi Aset Masa Depan
            </span>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isImageError = imageErrors[currentStep];

  return (
    <div className="flex-1 w-full min-h-screen bg-white flex items-center justify-center p-0 md:p-8 relative overflow-hidden">

      {/* Main Onboarding Container (Wide Card on Desktop, Full screen on Mobile) */}
      <div className="w-full min-h-screen md:min-h-0 md:h-[600px] md:max-w-6xl md:rounded-amwal-lg md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] md:border md:border-slate-200 bg-white flex flex-col md:flex-row md:overflow-hidden relative">

        {/* 1. SISI KIRI: Image / Illustration Area (Full-bleed on mobile, Padded card frame on desktop) */}
        <div className="h-[45vh] md:h-full w-full md:w-1/2 p-0 md:p-8 flex items-center justify-center bg-transparent md:bg-amwal-neutral-light/30 border-b border-slate-100 md:border-b-0 md:border-r md:border-slate-200/50 flex-shrink-0">
          <div className="relative w-full h-full rounded-none md:rounded-amwal-md overflow-hidden shadow-none md:shadow-sm border-0 md:border md:border-slate-200/60 bg-transparent md:bg-white">
            <img
              src={currentStepData.imageSrc}
              alt={currentStepData.imageAlt}
              className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
            />
          </div>
        </div>

        {/* 2. SISI KANAN: Text content, indicator, and action buttons drawer */}
        <div className="flex-1 bg-white z-20 px-6 sm:px-8 md:px-12 pt-6 md:pt-12 pb-6 md:pb-10 flex flex-col justify-between items-center md:items-stretch">

          {/* Middle content section: flex-col parent that holds the elements */}
          <div className="w-full flex flex-col items-center md:items-start my-auto">
            {/* Title (Jakarta font) - Renders second on mobile, first on desktop */}
            <h1 className="order-2 md:order-1 font-jakarta font-extrabold text-amwal-secondary-teal text-[22px] sm:text-[24px] md:text-3xl lg:text-4xl text-center md:text-left leading-snug tracking-tight mb-3 md:mb-6">
              {currentStepData.title}
            </h1>

            {/* Indicator Dots - Renders first on mobile, second on desktop */}
            <div className="order-1 md:order-2 flex gap-2 mb-8 md:mb-6 justify-center md:justify-start items-center h-4 select-none w-full">
              {[0, 1, 2].map((idx) => {
                // Rule: Step 1 (currentStep 0) lights up dot 0.
                // Step 2 (currentStep 1) lights up dot 0 & 1.
                // Step 3 (currentStep 2) lights up dot 0, 1 & 2.
                const isLit = idx <= currentStep;
                return (
                  <div
                    key={idx}
                    className={`h-2.5 rounded-full transition-all duration-300 ease-in-out ${isLit
                        ? "w-6 bg-amwal-secondary-green"
                        : "w-2.5 bg-amwal-neutral-dark/15"
                      }`}
                  />
                );
              })}
            </div>

            {/* Sub-judul (Jakarta font) - Renders third on both */}
            <p className="order-3 font-jakarta text-sm sm:text-base md:text-lg font-medium text-amwal-neutral-dark/70 text-center md:text-left leading-relaxed max-w-[280px] sm:max-w-[320px] md:max-w-none mx-auto md:mx-0">
              {currentStepData.subtitle}
            </p>
          </div>

          {/* 3. BAGIAN BAWAH: Action Buttons (stretches or sits nicely at bottom) */}
          <div className="w-full mt-6 md:mt-8">
            {currentStep === 0 ? (
              /* Step 1: Full-width button "Lanjut" */
              <Button
                className="w-full text-base font-jakarta font-bold tracking-wide cursor-pointer"
                onClick={handleNext}
              >
                Lanjut
              </Button>
            ) : (
              /* Steps 2 & 3: Side-by-side buttons */
              <div className="grid grid-cols-2 gap-3.5 w-full">
                <Button
                  variant="outline"
                  className="w-full text-base font-jakarta font-bold cursor-pointer"
                  onClick={handleBack}
                >
                  Kembali
                </Button>

                <Button
                  className="w-full text-base font-jakarta font-bold tracking-wide cursor-pointer"
                  onClick={handleNext}
                >
                  {currentStep === 2 ? "Daftar" : "Lanjut"}
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
