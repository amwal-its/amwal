'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TopAppBarProps {
  isLoggedIn?: boolean;
}

export function TopAppBar({ isLoggedIn = true }: TopAppBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsMenuOpen(false);
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <header className="w-full bg-white px-5 sm:px-6 py-3 flex items-center justify-between gap-3 border-b border-gray-100 sticky top-0 z-30 shadow-xs">
      {/* Left: Search Input Bar */}
      <div className="relative flex-1 flex items-center">
        <Search size={16} className="text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari program..."
          className="w-full pl-9 pr-3 py-2 bg-[#E0EDFF]/60 hover:bg-[#E0EDFF]/80 focus:bg-white border border-transparent focus:border-[#439F46] rounded-2xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/20 transition-all font-jakarta"
        />
      </div>

      {/* Right: Action Buttons (Notification Bell + Profile / Login Button) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notification Bell Icon */}
        <button
          aria-label="Notifikasi"
          className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-600 flex items-center justify-center relative cursor-pointer active:scale-95 transition-all shrink-0"
        >
          <Bell size={16} className="text-gray-700 shrink-0" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
        </button>

        {isLoggedIn ? (
          /* Profile Menu Dropdown Container */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Profil Pengguna"
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#439F46] to-emerald-400 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-[#439F46]/20 hover:ring-[#439F46]/50 active:scale-95 transition-all cursor-pointer overflow-hidden shrink-0"
            >
              <User size={16} strokeWidth={2.5} className="text-white shrink-0" />
            </button>

            {/* Popup Menu Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  href="/riwayat"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#439F46] transition-colors"
                >
                  <User size={15} className="text-gray-500" />
                  <span>Profil Saya</span>
                </Link>

                <div className="my-1 border-t border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut size={15} className="text-rose-500" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Masuk Button */
          <Link
            href="/login"
            className="h-9 px-3.5 rounded-full bg-[#439F46] hover:bg-[#388E3C] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <LogIn size={15} className="text-white shrink-0" />
            <span>Masuk</span>
          </Link>
        )}
      </div>
    </header>
  );
}
