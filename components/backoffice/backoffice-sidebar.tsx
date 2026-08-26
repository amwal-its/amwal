'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Landmark,
  ShieldCheck,
  Calculator,
  HeartHandshake,
  DollarSign,
  FileText,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface BackofficeSidebarProps {
  role?: 'ADMIN' | 'NADZIR' | string;
  userName?: string;
}

export function BackofficeSidebar({ role = 'ADMIN', userName = 'Super Admin' }: BackofficeSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = role === 'ADMIN';

  const menuItems = [
    {
      title: 'Ringkasan Utama',
      href: isAdmin ? '/admin/wakaf' : '/nadzir/dashboard',
      icon: LayoutDashboard,
      isActive: pathname === '/admin/wakaf' || pathname === '/nadzir/dashboard',
    },
    {
      title: 'Program Wakaf & Ledger',
      href: isAdmin ? '/admin/wakaf' : '/nadzir/dashboard',
      icon: Landmark,
      isActive: pathname.includes('/wakaf'),
    },
    {
      title: 'Verifikasi Nadzir & Legalitas',
      href: '#',
      icon: ShieldCheck,
      badge: isAdmin ? '2 Menunggu' : 'Terverifikasi BWI',
      isActive: false,
    },
    {
      title: 'Zakat & Asnaf Mustahiq',
      href: '#',
      icon: Calculator,
      isActive: false,
    },
    {
      title: 'Qurban & Distribusi',
      href: '#',
      icon: HeartHandshake,
      isActive: false,
    },
    {
      title: 'Rekonsiliasi Finansial',
      href: '#',
      icon: DollarSign,
      isActive: false,
    },
    {
      title: 'Audit Log & Transparansi',
      href: '#',
      icon: FileText,
      isActive: false,
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200/90 flex flex-col justify-between h-screen sticky top-0 shrink-0 font-jakarta">
      {/* Brand Header */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#1B5E20] text-white flex items-center justify-center font-black text-lg shadow-xs">
            A
          </div>
          <div>
            <span className="font-extrabold text-gray-900 tracking-wider block text-sm">
              AMWAL
            </span>
            <span className="text-[11px] text-gray-400 font-medium block">
              Social Finance Platform
            </span>
          </div>
        </div>

        {/* Menu Section */}
        <div className="p-3 space-y-1">
          <span className="block px-3 py-2 text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">
            Menu Utama {isAdmin ? '(Admin BWI)' : '(Nadzir YMI)'}
          </span>

          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  item.isActive
                    ? 'bg-[#1B5E20] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      item.isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="p-3 border-t border-gray-100 bg-[#F8FAFC]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar / Ganti Akun Role</span>
        </button>

        <div className="px-3 pt-2 text-[10px] text-gray-400 text-center font-medium">
          Amwal Sys v2.8 Syariah
        </div>
      </div>
    </aside>
  );
}
