'use client';

import React, { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';

export function TopAppBar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="w-full bg-white px-4 py-3 flex items-center justify-between gap-3 border-b border-gray-100 sticky top-0 z-30 shadow-2xs">
      {/* Left: Search Input Bar */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari program..."
          className="w-full pl-9.5 pr-3.5 py-2 bg-[#E0EDFF]/60 hover:bg-[#E0EDFF]/80 focus:bg-white border border-transparent focus:border-[#439F46] rounded-2xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#439F46]/20 transition-all font-jakarta"
        />
      </div>

      {/* Right: Action Buttons (Notification Bell + Profile Image Circle Button) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notification Bell Icon */}
        <button
          aria-label="Notifikasi"
          className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-600 flex items-center justify-center relative cursor-pointer active:scale-95 transition-all"
        >
          <Bell className="w-4 h-4 text-gray-700" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
        </button>

        {/* Profile Image Circle Button (Dummy) */}
        <button
          aria-label="Profil Pengguna"
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#439F46] to-emerald-400 text-white font-bold text-xs flex items-center justify-center shadow-2xs ring-2 ring-[#439F46]/20 hover:ring-[#439F46]/50 active:scale-95 transition-all cursor-pointer overflow-hidden"
        >
          <User className="w-4 h-4 text-white stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
}
