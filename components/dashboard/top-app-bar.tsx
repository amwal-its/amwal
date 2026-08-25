'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, User, LogIn } from 'lucide-react';

interface TopAppBarProps {
  userName?: string;
  isLoggedIn?: boolean;
}

export function TopAppBar({ userName = 'Ahmad Abdullah', isLoggedIn = true }: TopAppBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="w-full bg-white px-4 sm:px-6 pt-4 pb-3 flex items-center justify-between gap-3 border-b border-slate-100 sticky top-0 z-30 shadow-2xs">
      {/* Search Input Bar */}
      <div className="relative flex-1">
        <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari program wakaf, zakat, qurban..."
          className="w-full pl-11 pr-4 py-2 sm:py-2.5 bg-[#E0EDFF]/50 hover:bg-[#E0EDFF]/70 focus:bg-white border border-transparent focus:border-[#439F46] rounded-2xl text-xs sm:text-sm text-gray-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/20 transition-all"
        />
      </div>

      {/* Action Icons & Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notification Bell */}
        <button
          aria-label="Notifikasi"
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 border border-slate-200/60 text-gray-600 flex items-center justify-center shrink-0 relative cursor-pointer active:scale-95 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-600 shrink-0" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2.5 right-2.5 ring-2 ring-white" />
        </button>

        {/* User Profile or Login Button */}
        {isLoggedIn ? (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-[#E0EDFF]/60 hover:bg-[#E0EDFF] border border-blue-100 text-gray-800 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#439F46] to-emerald-400 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-bold text-gray-800 hidden xs:inline max-w-[100px] truncate">
              {userName ? userName.split(' ')[0] : 'User'}
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-full bg-[#439F46] hover:bg-[#388E3C] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk</span>
          </Link>
        )}
      </div>
    </header>
  );
}
