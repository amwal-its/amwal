'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Landmark, History, BookOpen } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Beranda',
      href: '/dashboard',
      icon: Home,
      isActive: pathname === '/dashboard' || pathname === '/',
    },
    {
      name: 'Wakaf',
      href: '/wakaf',
      icon: Landmark,
      isActive: pathname.startsWith('/wakaf'),
    },
    {
      name: 'Riwayat',
      href: '/riwayat',
      icon: History,
      isActive: pathname.startsWith('/riwayat'),
    },
    {
      name: 'Edukasi',
      href: '/edukasi',
      icon: BookOpen,
      isActive: pathname.startsWith('/edukasi'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-2 px-6 shadow-lg">
      <div className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto flex items-center justify-around">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          return (
            <Link
              key={idx}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                tab.isActive
                  ? 'text-[#439F46] font-bold'
                  : 'text-gray-400 hover:text-gray-600 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${tab.isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
