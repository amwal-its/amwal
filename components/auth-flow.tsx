"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
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
  const [isRegistering, setIsRegistering] = useState(false);

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
  const handleRegister = async (e: React.FormEvent) => {
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
    setIsRegistering(true);

    const isEmail = regEmail.includes("@");
    const payload = {
      name: regNama,
      password: regSandi,
      email: isEmail ? regEmail : undefined,
      phone: !isEmail ? regEmail : undefined,
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setIsRegistering(false);
        setRegErrors({ email: data.error || "Gagal mendaftar" });
        return;
      }

      setIsRegistering(false);
      switchMode("login");
    } catch (err) {
      setIsRegistering(false);
      setRegErrors({ email: "Terjadi kesalahan koneksi" });
    }
  };

  // Validation & Login Action
  const handleLogin = async (e: React.FormEvent) => {
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

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: loginEmail,
          password: loginSandi,
        }),
      });

      const data = await res.json();
      setIsLoggingIn(false);

      if (!res.ok) {
        setLoginErrors({ email: data.error || "Login gagal" });
        return;
      }

      // Save token (e.g. to localStorage)
      localStorage.setItem("token", data.token);
      onSuccess();
    } catch (err) {
      setIsLoggingIn(false);
      setLoginErrors({ email: "Terjadi kesalahan koneksi" });
    }
  };

  return (
    <div className="w-full flex-grow flex flex-col justify-center bg-white font-jakarta px-6 py-8">
      <div className="w-full max-w-sm mx-auto flex flex-col justify-between">
        
        {/* Header (Logo centered) */}
        <div className="flex flex-col items-center select-none mb-6">
          <div className="relative w-36 h-36 mb-2">
            <Image
              src="/assets/images/logo.png"
              alt="Amwal Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          {mode === "register" && (
            <p className="text-slate-500 font-medium text-sm">Buat Akun Baru Amwal</p>
          )}
        </div>

        {/* Form Content Area */}
        <div className="flex flex-col">
          {mode === "register" ? (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegister} className="flex flex-col gap-4">

              {/* Nama Lengkap */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={regNama}
                  disabled={isRegistering}
                  onChange={(e) => setRegNama(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className={`w-full h-12 px-4 rounded-xl border bg-transparent text-sm font-medium outline-none transition-all ${
                    regErrors.nama
                      ? "border-amwal-status-danger bg-amwal-status-danger/5 focus:border-amwal-status-danger"
                      : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                  } ${isRegistering ? "opacity-50 select-none" : ""}`}
                />
                {regErrors.nama && (
                  <span className="text-[11px] font-bold text-amwal-status-danger pl-1">{regErrors.nama}</span>
                )}
              </div>

              {/* Email atau Nomor Telepon */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Email atau Nomor Telepon</label>
                <input
                  type="text"
                  value={regEmail}
                  disabled={isRegistering}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Masukkan email atau nomor yang benar"
                  className={`w-full h-12 px-4 rounded-xl border bg-transparent text-sm font-medium outline-none transition-all ${
                    regErrors.email
                      ? "border-amwal-status-danger bg-amwal-status-danger/5 focus:border-amwal-status-danger"
                      : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                  } ${isRegistering ? "opacity-50 select-none" : ""}`}
                />
                {regErrors.email && (
                  <span className="text-[11px] font-bold text-amwal-status-danger pl-1">{regErrors.email}</span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showRegSandi ? "text" : "password"}
                    value={regSandi}
                    disabled={isRegistering}
                    onChange={(e) => setRegSandi(e.target.value)}
                    placeholder="Masukkan sandi yang kuat"
                    className={`w-full h-12 pl-4 pr-11 rounded-xl border bg-transparent text-sm font-medium outline-none transition-all ${
                      regErrors.sandi
                        ? "border-amwal-status-danger bg-amwal-status-danger/5 focus:border-amwal-status-danger"
                        : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                    } ${isRegistering ? "opacity-50 select-none" : ""}`}
                  />
                  <button
                    type="button"
                    disabled={isRegistering}
                    onClick={() => setShowRegSandi(!showRegSandi)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showRegSandi ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {regErrors.sandi && (
                  <span className="text-[11px] font-bold text-amwal-status-danger pl-1">{regErrors.sandi}</span>
                )}
              </div>

              {/* Ulangi Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Ulangi Password</label>
                <div className="relative">
                  <input
                    type={showRegUlangSandi ? "text" : "password"}
                    value={regUlangSandi}
                    disabled={isRegistering}
                    onChange={(e) => setRegUlangSandi(e.target.value)}
                    placeholder="Masukkan ulang sandi"
                    className={`w-full h-12 pl-4 pr-11 rounded-xl border bg-transparent text-sm font-medium outline-none transition-all ${
                      regErrors.ulangSandi
                        ? "border-amwal-status-danger bg-amwal-status-danger/5 focus:border-amwal-status-danger"
                        : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                    } ${isRegistering ? "opacity-50 select-none" : ""}`}
                  />
                  <button
                    type="button"
                    disabled={isRegistering}
                    onClick={() => setShowRegUlangSandi(!showRegUlangSandi)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showRegUlangSandi ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {regErrors.ulangSandi && (
                  <span className="text-[11px] font-bold text-amwal-status-danger pl-1">{regErrors.ulangSandi}</span>
                )}
              </div>

              {/* Submit Register */}
              <Button
                type="submit"
                disabled={isRegistering}
                className="w-full text-sm font-bold h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl mt-2 flex items-center justify-center gap-2 cursor-pointer transition-colors border-none"
              >
                {isRegistering ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Mendaftar...
                  </>
                ) : (
                  "Daftar"
                )}
              </Button>
            </form>
          ) : (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLogin} className="flex flex-col gap-4">

              {/* Email atau Nomor Telepon */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Email atau Nomor Telepon</label>
                <input
                  type="text"
                  value={loginEmail}
                  disabled={isLoggingIn}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Masukkan email atau nomor Anda"
                  className={`w-full h-12 px-4 rounded-xl border bg-transparent text-sm font-medium outline-none transition-all ${
                    loginErrors.email
                      ? "border-amwal-status-danger bg-amwal-status-danger/5 focus:border-amwal-status-danger"
                      : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                  } ${isLoggingIn ? "opacity-50 select-none" : ""}`}
                />
                {loginErrors.email && (
                  <span className="text-[11px] font-bold text-amwal-status-danger pl-1">{loginErrors.email}</span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showLoginSandi ? "text" : "password"}
                    value={loginSandi}
                    disabled={isLoggingIn}
                    onChange={(e) => setLoginSandi(e.target.value)}
                    placeholder="Masukkan password"
                    className={`w-full h-12 pl-4 pr-11 rounded-xl border bg-transparent text-sm font-medium outline-none transition-all ${
                      loginErrors.sandi
                        ? "border-amwal-status-danger bg-amwal-status-danger/5 focus:border-amwal-status-danger"
                        : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                    } ${isLoggingIn ? "opacity-50 select-none" : ""}`}
                  />
                  <button
                    type="button"
                    disabled={isLoggingIn}
                    onClick={() => setShowLoginSandi(!showLoginSandi)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showLoginSandi ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {loginErrors.sandi && (
                  <span className="text-[11px] font-bold text-amwal-status-danger pl-1">{loginErrors.sandi}</span>
                )}
                <div className="text-right mt-1">
                  <button
                    type="button"
                    className="text-xs text-emerald-600 font-bold hover:underline focus:outline-none cursor-pointer bg-transparent border-none p-0"
                  >
                    Lupa password?
                  </button>
                </div>
              </div>

              {/* Submit Login */}
              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full text-sm font-bold h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl mt-2 flex items-center justify-center gap-2 cursor-pointer transition-colors border-none"
              >
                {isLoggingIn ? (
                  <>
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

          {/* ================= SOCIAL LOGIN SECTION (Shared) ================= */}
          <div className="w-full mt-6 flex items-center">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-xs text-slate-400 font-bold select-none uppercase tracking-wider">Atau</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center space-x-6 mt-5">
            <button
              type="button"
              className="w-12 h-12 rounded-full border border-gray-200 shadow-xs flex items-center justify-center bg-white hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label={mode === "register" ? "Daftar dengan Google" : "Masuk dengan Google"}
            >
              <svg viewBox="0 0 24 24" className="w-5.5 h-5.5">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
            </button>
            <button
              type="button"
              className="w-12 h-12 rounded-full border border-gray-200 shadow-xs flex items-center justify-center bg-white hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label={mode === "register" ? "Daftar dengan Facebook" : "Masuk dengan Facebook"}
            >
              <svg viewBox="0 0 24 24" className="w-5.5 h-5.5">
                <circle cx="12" cy="12" r="11" fill="#1877F2" />
                <path d="M14.5 9H13V7.5C13 6.67 13.67 6 14.5 6H15.5V3H13.5C11.57 3 10 4.57 10 6.5V9H8.5V12H10V21H13V12H14.5L15.5 9Z" fill="white" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer Navigation Toggle */}
        <div className="text-center mt-8 text-sm font-semibold text-slate-500 select-none">
          {mode === "register" ? (
            <>
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-emerald-600 font-bold ml-1 hover:underline focus:outline-none cursor-pointer bg-transparent border-none"
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
                className="text-emerald-600 font-bold ml-1 hover:underline focus:outline-none cursor-pointer bg-transparent border-none"
              >
                Daftar
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
