"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, HandHeart, Clock, BookOpen } from 'lucide-react';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Beranda', icon: Home, path: '/dashboard' },
    { label: 'Wakaf', icon: HandHeart, path: '/catalog' },
    { label: 'Riwayat', icon: Clock, path: '/dashboard/history' },
    { label: 'Edukasi', icon: BookOpen, path: '/education' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] pb-safe">
      {navItems.map((item) => {
        // Highlight active if path matches or if pathname starts with path (except for /dashboard root)
        const isActive = item.path === '/dashboard' 
          ? pathname === '/dashboard' 
          : pathname.startsWith(item.path);

        const Icon = item.icon;
        return (
          <button 
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition duration-150 cursor-pointer ${
              isActive ? 'text-amwal-secondary-teal' : 'text-gray-400 hover:text-amwal-secondary-teal'
            }`}
          >
            <Icon size={22} className={isActive ? 'text-amwal-secondary-teal' : 'text-gray-400'} />
            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-semibold'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
