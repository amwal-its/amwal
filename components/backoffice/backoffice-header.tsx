'use client';

import React from 'react';
import { Bell, ShieldCheck } from 'lucide-react';

interface BackofficeHeaderProps {
  breadcrumbTitle?: string;
  role?: string;
  userName?: string;
}

export function BackofficeHeader({
  breadcrumbTitle = 'Super Admin › Manajemen Program Wakaf & Progres Fisik',
  role = 'ADMIN',
  userName = 'Super Admin BWI',
}: BackofficeHeaderProps) {
  const isSuperAdmin = role === 'ADMIN';

  return (
    <header className="bg-white border-b border-gray-200/90 px-6 py-4 flex items-center justify-between sticky top-0 z-20 font-jakarta">
      {/* Breadcrumb & Subtitle */}
      <div>
        <h1 className="text-sm font-bold text-gray-900 tracking-tight">
          {breadcrumbTitle}
        </h1>
        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
          <span>Platform Islamic Social Finance</span>
          <span>•</span>
          <strong className="text-emerald-800 font-semibold">
            {isSuperAdmin ? 'Badan Pengawas Amwal Platform & BWI Hub' : 'Yayasan Manarul Ilmi ITS (YMI ITS)'}
          </strong>
        </p>
      </div>

      {/* Right User Bar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifikasi"
          className="w-9 h-9 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-gray-900 block leading-tight">
              {userName}
            </span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
              {isSuperAdmin ? 'Admin Platform' : 'Nadzir Terverifikasi'}
            </span>
          </div>

          <div className="w-9 h-9 rounded-xl bg-[#1B5E20] text-white font-black text-xs flex items-center justify-center shadow-2xs">
            {isSuperAdmin ? 'SA' : 'NZ'}
          </div>
        </div>
      </div>
    </header>
  );
}
