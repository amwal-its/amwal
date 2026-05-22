"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AuthFlowProps {
  onSuccess: () => void;
}

export function AuthFlow({ onSuccess }: AuthFlowProps) {
  const [mode, setMode] = useState<"login" | "register">("register");

  // Registration Form States
  const [regEmail, setRegEmail] = useState("");
  const [regNama, setRegNama] = useState("");
  const [regSandi, setRegSandi] = useState("");
  const [regUlangSandi, setRegUlangSandi] = useState("");

  const [showRegSandi, setShowRegSandi] = useState(false);
  const [showRegUlangSandi, setShowRegUlangSandi] = useState(false);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSandi, setLoginSandi] = useState("");
  const [showLoginSandi, setShowLoginSandi] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Toggle modes with clean visual reset
  const switchMode = (targetMode: "login" | "register") => {
    setRegErrors({});
    setLoginErrors({});
    setMode(targetMode);
  };

  // Validation & Register Action
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!regEmail.trim()) {
      errors.email = "Email atau telepon tidak boleh kosong";
    } else if (
      !regEmail.includes("@") &&
      !/^\+?[0-9]{8,15}$/.test(regEmail.replace(/\s+/g, ""))
    ) {
      errors.email = "Masukkan format email atau nomor telepon yang benar";
    }

    if (!regNama.trim()) {
      errors.nama = "Nama tidak boleh kosong";
    }

    if (!regSandi) {
      errors.sandi = "Sandi tidak boleh kosong";
    } else if (regSandi.length < 6) {
      errors.sandi = "Sandi minimal harus 6 karakter";
    }

    if (!regUlangSandi) {
      errors.ulangSandi = "Ulangi sandi tidak boleh kosong";
    } else if (regSandi !== regUlangSandi) {
      errors.ulangSandi = "Sandi yang Anda masukkan tidak cocok";
    }

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }

    setRegErrors({});
    console.log("handleRegister() called with:", { regEmail, regNama });
    
    // Simulate successful registration and switch to login
    switchMode("login");
  };

  // Validation & Login Action
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!loginEmail.trim()) {
      errors.email = "Email atau telepon tidak boleh kosong";
    }

    if (!loginSandi) {
      errors.sandi = "Sandi tidak boleh kosong";
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginErrors({});
    setIsLoggingIn(true);

    console.log("handleLogin() called with:", { loginEmail });

    // Mock API delays to demonstrate loading state
    setTimeout(() => {
      setIsLoggingIn(false);
      onSuccess();
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-[#F4F7F9]">
      
      {/* ================= PANEL KIRI (Desktop Only - Branding banner) ================= */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-amwal-green to-[#1C3E34] flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        
        {/* Glow ambient background lights */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amwal-lime/10 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
        
        <div className="max-w-md text-center flex flex-col items-center z-10">
          {/* Glowing Brand Emblem */}
          <div className="relative w-36 h-36 mb-8 rounded-[32px] bg-white/5 border border-white/10 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-md flex items-center justify-center">
            <Image
              src="/assets/images/logo.png"
              alt="Amwal Logo"
              width={100}
              height={100}
              className="object-contain filter brightness-110 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]"
            />
          </div>

          <h1 className="text-3xl font-black tracking-tight leading-tight mb-4">
            Keuangan Syariah Lebih Berkah
          </h1>
          <p className="text-base text-emerald-100/80 font-medium leading-relaxed max-w-sm">
            Kelola pembagian warisan, salurkan wakaf jariyah, dan rancang rencana finansial masa depan Anda secara amanah sesuai tuntunan syariat.
          </p>
        </div>

        {/* Decorative footer details on desktop banner */}
        <div className="absolute bottom-8 left-12 text-xs text-emerald-200/50 font-semibold tracking-wide">
          Amwal Syariah Platform
        </div>
      </div>

      {/* ================= PANEL KANAN (Form Container - Fully responsive) ================= */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-6 md:w-1/2">
        <div className="w-full h-screen sm:h-auto sm:max-w-[430px] bg-white sm:rounded-[36px] px-6 sm:px-8 py-8 flex flex-col justify-between md:justify-center md:gap-8 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border-0 sm:border border-slate-100/50 overflow-y-auto">
          
          {/* Header (Logo centered) */}
          <div className="flex flex-col items-center mt-6 sm:mt-0 select-none">
            <div className="relative w-28 h-28 mb-3 transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/assets/images/logo.png"
                alt="Amwal Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 flex flex-col justify-center sm:flex-initial my-6 sm:my-0">
            {mode === "register" ? (
              /* ================= REGISTER FORM ================= */
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                
                {/* Email atau Telepon */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-amwal-green">Email atau telepon</label>
                  <input
                    type="text"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Masukkan email atau nomor yang benar"
                    className={`w-full h-[50px] px-4 rounded-xl border bg-transparent text-sm font-medium outline-none transition-all ${
                      regErrors.email
                        ? "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-slate-200 focus:border-amwal-green focus:ring-1 focus:ring-amwal-green/30"
                    }`}
                  />
                  {regErrors.email && (
                    <span className="text-[11px] font-bold text-red-500 pl-1">{regErrors.email}</span>
                  )}
                </div>

                {/* Nama */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-amwal-green">Nama</label>
                  <input
                    type="text"
                    value={regNama}
                    onChange={(e) => setRegNama(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className={`w-full h-[50px] px-4 rounded-xl border bg-transparent text-sm font-medium outline-none transition-all ${
                      regErrors.nama
                        ? "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-slate-200 focus:border-amwal-green focus:ring-1 focus:ring-amwal-green/30"
                    }`}
                  />
                  {regErrors.nama && (
                    <span className="text-[11px] font-bold text-red-500 pl-1">{regErrors.nama}</span>
                  )}
                </div>

                {/* Sandi */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-amwal-green">Sandi</label>
                  <div className="relative">
                    <input
                      type={showRegSandi ? "text" : "password"}
                      value={regSandi}
                      onChange={(e) => setRegSandi(e.target.value)}
                      placeholder="Masukkan sandi yang kuat"
                      className={`w-full h-[50px] pl-4 pr-11 rounded-xl border bg-transparent text-sm font-medium outline-none transition-all ${
                        regErrors.sandi
                          ? "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-slate-200 focus:border-amwal-green focus:ring-1 focus:ring-amwal-green/30"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegSandi(!showRegSandi)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amwal-green transition-colors focus:outline-none cursor-pointer"
                    >
                      {showRegSandi ? (
                        /* Eye Open */
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        /* Eye Closed */
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.076m5.875-.59A3 3 0 0014 8a3 3 0 00-1.875-2.825M3 3l18 18" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {regErrors.sandi && (
                    <span className="text-[11px] font-bold text-red-500 pl-1">{regErrors.sandi}</span>
                  )}
                </div>

                {/* Ulangi Sandi */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-amwal-green">Ulangi sandi</label>
                  <div className="relative">
                    <input
                      type={showRegUlangSandi ? "text" : "password"}
                      value={regUlangSandi}
                      onChange={(e) => setRegUlangSandi(e.target.value)}
                      placeholder="Masukkan ulang sandi"
                      className={`w-full h-[50px] pl-4 pr-11 rounded-xl border bg-transparent text-sm font-medium outline-none transition-all ${
                        regErrors.ulangSandi
                          ? "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-slate-200 focus:border-amwal-green focus:ring-1 focus:ring-amwal-green/30"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegUlangSandi(!showRegUlangSandi)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amwal-green transition-colors focus:outline-none cursor-pointer"
                    >
                      {showRegUlangSandi ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.076m5.875-.59A3 3 0 0014 8a3 3 0 00-1.875-2.825M3 3l18 18" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {regErrors.ulangSandi && (
                    <span className="text-[11px] font-bold text-red-500 pl-1">{regErrors.ulangSandi}</span>
                  )}
                </div>

                {/* Submit Register */}
                <Button type="submit" className="w-full text-base font-bold mt-2 cursor-pointer">
                  Daftar
                </Button>
              </form>
            ) : (
              /* ================= LOGIN FORM ================= */
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                
                {/* Email atau Telepon */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-amwal-green">Email atau telepon</label>
                  <input
                    type="text"
                    value={loginEmail}
                    disabled={isLoggingIn}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Masukkan email atau nomor yang benar"
                    className={`w-full h-[50px] px-4 rounded-xl border bg-transparent text-sm font-medium outline-none transition-all ${
                      loginErrors.email
                        ? "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-slate-200 focus:border-amwal-green focus:ring-1 focus:ring-amwal-green/30"
                    } ${isLoggingIn ? "opacity-50 select-none" : ""}`}
                  />
                  {loginErrors.email && (
                    <span className="text-[11px] font-bold text-red-500 pl-1">{loginErrors.email}</span>
                  )}
                </div>

                {/* Sandi */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-amwal-green">Sandi</label>
                  <div className="relative">
                    <input
                      type={showLoginSandi ? "text" : "password"}
                      value={loginSandi}
                      disabled={isLoggingIn}
                      onChange={(e) => setLoginSandi(e.target.value)}
                      placeholder="Masukkan sandi yang kuat"
                      className={`w-full h-[50px] pl-4 pr-11 rounded-xl border bg-transparent text-sm font-medium outline-none transition-all ${
                        loginErrors.sandi
                          ? "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-slate-200 focus:border-amwal-green focus:ring-1 focus:ring-amwal-green/30"
                      } ${isLoggingIn ? "opacity-50 select-none" : ""}`}
                    />
                    <button
                      type="button"
                      disabled={isLoggingIn}
                      onClick={() => setShowLoginSandi(!showLoginSandi)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amwal-green transition-colors focus:outline-none cursor-pointer"
                    >
                      {showLoginSandi ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.076m5.875-.59A3 3 0 0014 8a3 3 0 00-1.875-2.825M3 3l18 18" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {loginErrors.sandi && (
                    <span className="text-[11px] font-bold text-red-500 pl-1">{loginErrors.sandi}</span>
                  )}
                </div>

                {/* Submit Login with spinner loader wheel */}
                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full text-base font-bold mt-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoggingIn ? (
                    <>
                      {/* Loading Spinner */}
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Menghubungkan...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Footer Navigation Toggle (Sudah punya akun? Masuk / Daftar) */}
          <div className="text-center mt-6 text-sm font-medium text-slate-500 select-none pb-6 sm:pb-0">
            {mode === "register" ? (
              <>
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-amwal-green font-bold ml-1 hover:underline focus:outline-none cursor-pointer"
                >
                  Masuk
                </button>
              </>
            ) : (
              <>
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="text-amwal-green font-bold ml-1 hover:underline focus:outline-none cursor-pointer"
                >
                  Daftar
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
