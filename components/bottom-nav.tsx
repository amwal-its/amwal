'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Beranda',
      href: '/dashboard',
      activeIcon: '/assets/images/navbar/1-active.png',
      deactiveIcon: '/assets/images/navbar/1-deactivated.png',
      isActive: pathname === '/dashboard' || pathname === '/',
    },
    {
      name: 'Wakaf',
      href: '/wakaf',
      activeIcon: '/assets/images/navbar/2-active.png',
      deactiveIcon: '/assets/images/navbar/2-deactivated.png',
      isActive: pathname.startsWith('/wakaf') || pathname.startsWith('/catalog'),
    },
    {
      name: 'Riwayat',
      href: '/riwayat',
      activeIcon: '/assets/images/navbar/3-active.png',
      deactiveIcon: '/assets/images/navbar/3-deactivated.png',
      isActive: pathname.startsWith('/riwayat') || pathname.startsWith('/dashboard/history'),
    },
    {
      name: 'Edukasi',
      href: '/edukasi',
      activeIcon: '/assets/images/navbar/4-active.png',
      deactiveIcon: '/assets/images/navbar/4-deactivated.png',
      isActive: pathname.startsWith('/edukasi') || pathname.startsWith('/education'),
    },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-[#F3F4F6] shadow-[0px_-4px_12px_rgba(13,26,13,0.06)] h-[72px] sm:rounded-b-[40px] shrink-0">
      <div className="w-full h-full grid grid-cols-4 items-center">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className="flex flex-col items-center justify-center h-full py-2 group cursor-pointer"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <Image
                src={tab.isActive ? tab.activeIcon : tab.deactiveIcon}
                alt={tab.name}
                width={24}
                height={24}
                className="object-contain transition-transform duration-150 group-hover:scale-105"
              />
            </div>
            <span
              className={`text-[12px] leading-[16px] mt-1 transition-colors duration-150 ${
                tab.isActive
                  ? 'text-[#439F46] font-medium'
                  : 'text-[#6B7280] font-normal group-hover:text-gray-700'
              }`}
            >
              {tab.name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

