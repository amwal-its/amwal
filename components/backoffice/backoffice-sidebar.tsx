'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Landmark,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  FileText,
  Newspaper,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

interface BackofficeSidebarProps {
  role?: 'ADMIN' | 'NADZIR' | string;
  userName?: string;
}

interface MenuItem {
  title: string;
  href: string;
  icon: any;
  isActive: boolean;
  badge?: string;
}

export function BackofficeSidebar({ role = 'ADMIN', userName = 'Super Admin' }: BackofficeSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = role === 'ADMIN';
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetch('/api/admin/approvals/pending')
        .then((res) => res.json())
        .then((json) => {
          if (json?.data?.counts?.total !== undefined) {
            setPendingCount(json.data.counts.total);
          }
        })
        .catch(() => {});
    }
  }, [isAdmin, pathname]);

  const menuItems: MenuItem[] = isAdmin
    ? [
        {
          title: 'Dashboard Overview',
          href: '/admin',
          icon: LayoutDashboard,
          isActive: pathname === '/admin',
        },
        {
          title: 'Program Wakaf & Ledger',
          href: '/admin/wakaf',
          icon: Landmark,
          isActive: pathname === '/admin/wakaf',
        },
        {
          title: 'Pusat Persetujuan',
          href: '/admin/approvals',
          icon: ShieldCheck,
          badge: pendingCount && pendingCount > 0 ? `${pendingCount} Menunggu` : undefined,
          isActive: pathname === '/admin/approvals',
        },
        {
          title: 'Verifikasi Nadzir BWI',
          href: '/admin/nadzir-verifikasi',
          icon: Building2,
          isActive: pathname === '/admin/nadzir-verifikasi',
        },
        {
          title: 'Log Transparansi',
          href: '/admin/transparansi',
          icon: FileSpreadsheet,
          isActive: pathname === '/admin/transparansi',
        },
        {
          title: 'Manajemen Dokumen',
          href: '/admin/dokumen',
          icon: FileText,
          isActive: pathname === '/admin/dokumen',
        },
        {
          title: 'Berita & Penyaluran',
          href: '/admin/berita',
          icon: Newspaper,
          isActive: pathname === '/admin/berita',
        },
        {
          title: 'Pengaturan Sistem',
          href: '/admin/pengaturan',
          icon: Settings,
          isActive: pathname === '/admin/pengaturan',
        },
      ]
    : [
        {
          title: 'Dashboard Nadzir',
          href: '/nadzir/dashboard',
          icon: LayoutDashboard,
          isActive: pathname === '/nadzir/dashboard',
        },
        {
          title: 'Program Wakaf',
          href: '/nadzir/dashboard',
          icon: Landmark,
          isActive: pathname.includes('/nadzir'),
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
    <aside className="w-64 bg-white border-r border-gray-200/90 flex flex-col justify-between h-screen sticky top-0 shrink-0 font-jakarta z-30 shadow-2xs">
      {/* Brand Header */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-2xl bg-[#1B5E20] text-white flex items-center justify-center font-black text-lg shadow-xs">
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
                className="block"
              >
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.15 }}
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
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="p-3 border-t border-gray-100 bg-[#F8FAFC]">
        <button
          type="button"
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
