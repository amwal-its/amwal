'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

interface BackofficeHeaderProps {
  breadcrumbTitle?: string;
  role?: string;
  userName?: string;
}

export function BackofficeHeader({
  breadcrumbTitle,
  role = 'ADMIN',
  userName = 'Super Admin BWI',
}: BackofficeHeaderProps) {
  const pathname = usePathname();
  const isSuperAdmin = role === 'ADMIN';

  const getBreadcrumb = () => {
    if (breadcrumbTitle) return breadcrumbTitle;

    if (!isSuperAdmin) {
      return 'Nadzir Dashboard › Portofolio Wakaf YMI ITS';
    }

    if (pathname === '/admin') return 'Super Admin › Executive Overview & Monitoring';
    if (pathname === '/admin/wakaf') return 'Super Admin › Manajemen Program Wakaf & Ledger';
    if (pathname === '/admin/approvals') return 'Super Admin › Pusat Persetujuan & Verifikasi';
    if (pathname === '/admin/nadzir-verifikasi') return 'Super Admin › Verifikasi Nadzir & Legalitas BWI';
    if (pathname === '/admin/transparansi') return 'Super Admin › Log Transparansi Transaksi & Audit';
    if (pathname === '/admin/dokumen') return 'Super Admin › Manajemen Dokumen & Arsip Resmi';
    if (pathname === '/admin/berita') return 'Super Admin › Manajemen Berita & Penyaluran';
    if (pathname === '/admin/pengaturan') return 'Super Admin › Pengaturan Rekening & Parameter Sistem';

    return 'Super Admin › Tata Kelola Platform Amwal';
  };

  return (
    <header className="bg-white border-b border-gray-200/90 px-6 py-4 flex items-center justify-between sticky top-0 z-20 font-jakarta">
      {/* Breadcrumb & Subtitle */}
      <div>
        <h1 className="text-sm font-bold text-gray-900 tracking-tight">
          {getBreadcrumb()}
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
              {isSuperAdmin ? 'Super Admin BWI' : 'Nadzir Terverifikasi'}
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
