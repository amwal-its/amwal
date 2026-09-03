'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Bell,
  ShieldCheck,
  Building2,
  ChevronDown,
  LogOut,
  Check,
} from 'lucide-react';

interface BackofficeHeaderProps {
  breadcrumbTitle?: string;
  role?: string;
  userName?: string;
  onToggleMobileMenu?: () => void;
}

export function BackofficeHeader({
  breadcrumbTitle,
  role = 'ADMIN',
  userName = 'Super Admin BWI',
  onToggleMobileMenu,
}: BackofficeHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isSuperAdmin = role === 'ADMIN';

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const roleSwitcherRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setShowNotifications(false);
      }
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(target)) {
        setShowRoleSwitcher(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getPageTitle = () => {
    if (breadcrumbTitle) return breadcrumbTitle;

    if (!isSuperAdmin) {
      if (pathname === '/nadzir/dashboard') return 'Manajemen & Kelola Program Wakaf';
      return 'Portofolio Wakaf YMI ITS';
    }

    if (pathname === '/admin') return 'Ringkasan Utama & Analitik RFM-D';
    if (pathname === '/admin/approvals') return 'Pusat Persetujuan & Verifikasi Terpadu';
    if (pathname === '/admin/wakaf') return 'Manajemen Program Wakaf & Progres Fisik';
    if (pathname === '/admin/wakaf/baru') return 'Modul Wakaf (Buat Program Langsung)';
    if (pathname === '/admin/nadzir-verifikasi') return 'Verifikasi & Pendaftaran Lembaga Nazhir (BWI)';
    if (pathname === '/admin/transparansi') return 'Catatan Transparansi & Log Realisasi Dana';
    if (pathname === '/admin/dokumen') return 'Dokumen Transparansi & Log Audit Sistem';
    if (pathname === '/admin/berita') return 'Edukasi & Berita (Manajemen Berita & Kegiatan)';
    if (pathname === '/admin/pengaturan') return 'Pengaturan Konfigurasi Platform';
    if (pathname === '/admin/qurban') return 'Pengelolaan Qurban, Patungan 1/7 & RPH';

    return 'Tata Kelola Platform Amwal';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 min-h-[64px] w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 sm:px-8 backdrop-blur-md font-jakarta">
      {/* Left: Mobile Toggle & Breadcrumb / Subtitle 2-Baris */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            aria-label="Buka Menu"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col justify-center min-w-0">
          <h1 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight truncate">
            {isSuperAdmin ? 'Super Admin' : 'Portal Nazhir'}
            <span className="text-slate-400 font-normal mx-1.5">›</span>
            <span className="text-emerald-950 font-bold">{getPageTitle()}</span>
          </h1>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 truncate">
            <span>Platform Islamic Social Finance</span>
            <span>•</span>
            <span className="font-semibold text-emerald-800">
              {isSuperAdmin
                ? 'Badan Pengawas Platform Amwal & BWI Hub'
                : 'Yayasan Manarul Ilmi ITS (YMI ITS)'}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Role Switcher Pill + Notifications + Profile Avatar */}
      <div className="flex items-center gap-3 shrink-0 mr-1">
        {/* Dropdown 1: Role Switcher (Pill Style) */}
        <div className="relative shrink-0" ref={roleSwitcherRef}>
          <button
            type="button"
            onClick={() => {
              setShowRoleSwitcher(!showRoleSwitcher);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer hover:shadow-xs shrink-0 ${
              pathname.startsWith('/nazhir')
                ? 'border-teal-200/80 bg-teal-50 text-teal-800'
                : pathname.startsWith('/amil')
                ? 'border-amber-200/80 bg-amber-50 text-amber-900'
                : 'border-emerald-200/80 bg-emerald-50 text-emerald-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>
              {pathname.startsWith('/nazhir')
                ? 'Nazhir Wakaf (Pengelola)'
                : pathname.startsWith('/amil')
                ? 'Amil ZISWAF (Pengelola)'
                : 'Super Admin (Badan Pengawas)'}
            </span>
            <ChevronDown className="w-3 h-3 opacity-70 shrink-0" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Ganti Role Pengguna
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Pilih akun role untuk beralih perspektif:
                </div>
              </div>

              <div className="p-1 space-y-1">
                {/* Role 1: Super Admin */}
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleSwitcher(false);
                    router.push('/admin');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between cursor-pointer ${
                    !pathname.startsWith('/nazhir') && !pathname.startsWith('/amil')
                      ? 'bg-emerald-50 text-emerald-950 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold border bg-emerald-100 text-emerald-800 border-emerald-300 shrink-0">
                      SA
                    </span>
                    <div>
                      <div className="text-xs leading-tight">Super Admin (Badan Pengawas)</div>
                      <div className="text-[10px] text-slate-500 font-normal truncate max-w-[170px]">
                        Ahmad Nadzir, S.Kom., M.E.Sy.
                      </div>
                    </div>
                  </div>
                  {!pathname.startsWith('/nazhir') && !pathname.startsWith('/amil') && (
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  )}
                </button>

                {/* Role 2: Nazhir Wakaf */}
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleSwitcher(false);
                    router.push('/nazhir');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between cursor-pointer ${
                    pathname.startsWith('/nazhir')
                      ? 'bg-teal-50 text-teal-950 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold border bg-teal-100 text-teal-800 border-teal-300 shrink-0">
                      NZ
                    </span>
                    <div>
                      <div className="text-xs leading-tight font-semibold">Nazhir Wakaf (Pengelola)</div>
                      <div className="text-[10px] text-slate-500 font-normal truncate max-w-[170px]">
                        Ustadz Ridwan Malik, Lc., M.A.
                      </div>
                    </div>
                  </div>
                  {pathname.startsWith('/nazhir') && (
                    <Check className="w-4 h-4 text-teal-700 shrink-0" />
                  )}
                </button>

                {/* Role 3: Amil ZISWAF */}
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleSwitcher(false);
                    router.push('/amil');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between cursor-pointer ${
                    pathname.startsWith('/amil')
                      ? 'bg-amber-50 text-amber-950 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold border bg-amber-100 text-amber-900 border-amber-300 shrink-0">
                      AZ
                    </span>
                    <div>
                      <div className="text-xs leading-tight font-semibold">Amil ZISWAF (Pengelola)</div>
                      <div className="text-[10px] text-slate-500 font-normal truncate max-w-[170px]">
                        H. Bambang Sugiarto, S.E. (Amil Pen...)
                      </div>
                    </div>
                  </div>
                  {pathname.startsWith('/amil') && (
                    <Check className="w-4 h-4 text-amber-700 shrink-0" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dropdown 2: Notification Bell */}
        <div className="relative shrink-0" ref={notificationRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowProfileMenu(false);
              setShowRoleSwitcher(false);
            }}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5 min-w-[20px] min-h-[20px] text-slate-600 shrink-0" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 min-w-[8px] min-h-[8px] bg-amber-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Log Audit & Notifikasi</span>
                <span className="text-[10px] text-emerald-800 font-bold">Terhubung Real-time</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {/* Item 1 */}
                <div className="p-3 hover:bg-slate-50 transition cursor-pointer text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">SUPER ADMIN</span>
                    <span className="text-[9px] text-slate-400">10:45</span>
                  </div>
                  <div className="font-semibold text-slate-900 leading-snug">
                    Verifikasi Kuitansi Belanja: Waqf Pembangunan Klinik Air Bersih Al-Azhar (Pipa Galvanis Rp 18.500.000)
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">
                    Kesesuaian fisik dan harga pasar terverifikasi dengan hasil audit dokumen belanja.
                  </div>
                </div>

                {/* Item 2 */}
                <div className="p-3 hover:bg-slate-50 transition cursor-pointer text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">SUPER ADMIN</span>
                    <span className="text-[9px] text-slate-400">10:15</span>
                  </div>
                  <div className="font-semibold text-slate-900 leading-snug">
                    Persetujuan Program Wakaf: Waqf Renovasi Gedung Sekolah Tahfidz & Asrama Yatim
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">
                    Kelayakan teknis, legalitas lahan, dan RAB telah disetujui sesuai regulasi BWI.
                  </div>
                </div>

                {/* Item 3 */}
                <div className="p-3 hover:bg-slate-50 transition cursor-pointer text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">SUPER ADMIN</span>
                    <span className="text-[9px] text-slate-400">09:30</span>
                  </div>
                  <div className="font-semibold text-slate-900 leading-snug">
                    Penerbitan STBPN Nazhir: Yayasan Dompet Wakaf Sinergi Nusantara (BWI.3.2.0055/2024)
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">
                    Sertifikat pendaftaran nazhir resmi diterbitkan dan akun platform telah aktif.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dropdown 3: User Avatar & Profile Dropdown */}
        <div className="relative shrink-0" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu((prev) => !prev);
              setShowNotifications(false);
              setShowRoleSwitcher(false);
            }}
            className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-[#1B5E20] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
            aria-label="Menu Profil"
          >
            SA
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-5 py-2 border-b border-slate-100 space-y-0.5">
                <div className="text-xs font-bold text-slate-900">
                  Ahmad Nadzir, S.Kom., M.E.Sy.
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  superadmin@amwal.id
                </div>
                <div className="pt-1">
                  <span className="text-[10px] font-mono font-semibold text-emerald-800">
                    BWI.SYS.0001/2026
                  </span>
                </div>
              </div>

              <div className="p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl flex items-center gap-2 cursor-pointer transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar / Ganti Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
