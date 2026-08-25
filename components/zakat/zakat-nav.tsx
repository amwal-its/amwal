'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ZakatNav() {
  const pathname = usePathname();

  const links = [
    { href: '/zakat/kalkulator', label: '🧮 Kalkulator Zakat' },
    { href: '/zakat/bayar', label: '💳 Bayar Zakat Digital' },
    { href: '/amil/zakat-entri', label: '📝 Entri Amil (Offline)' },
  ];

  return (
    <nav className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
