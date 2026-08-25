'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, User } from 'lucide-react';

interface TopAppBarProps {
  userName?: string;
}

export function TopAppBar({ userName = 'Ahmad Abdullah' }: TopAppBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="w-full bg-white px-4 sm:px-6 pt-4 pb-3 flex items-center justify-between gap-3 border-b border-slate-100 sticky top-0 z-30 shadow-2xs">
      {/* Search Input Bar */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari program..."
          className="w-full pl-9.5 pr-4 py-2 sm:py-2.5 bg-[#E0EDFF]/50 hover:bg-[#E0EDFF]/70 focus:bg-white border border-transparent focus:border-[#439F46] rounded-2xl text-xs sm:text-sm text-gray-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/20 transition-all"
        />
      </div>

      {/* Action Icons & Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notification Bell */}
        <button
          aria-label="Notifikasi"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-gray-600 flex items-center justify-center relative cursor-pointer active:scale-95 transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
        </button>

        {/* User Profile Badge */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-[#E0EDFF]/60 hover:bg-[#E0EDFF] border border-blue-100 text-gray-800 transition-all cursor-pointer"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#439F46] to-emerald-400 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-bold text-gray-800 hidden xs:inline max-w-[100px] truncate">
            {userName.split(' ')[0]}
          </span>
        </Link>
      </div>
    </header>
  );
}
