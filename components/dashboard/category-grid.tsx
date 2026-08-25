import React from 'react';
import Link from 'next/link';
import { Landmark, Calculator, ShieldCheck, Grid } from 'lucide-react';

export function CategoryGrid() {
  const categories = [
    {
      name: 'Wakaf',
      href: '/wakaf',
      icon: Landmark,
      color: 'bg-[#EEF7EE] text-[#439F46] hover:bg-[#d8edd8] border-emerald-100',
    },
    {
      name: 'Zakat',
      href: '/zakat/kalkulator',
      icon: Calculator,
      color: 'bg-[#EEF7EE] text-[#439F46] hover:bg-[#d8edd8] border-emerald-100',
    },
    {
      name: 'Qurban',
      href: '/qurban',
      icon: ShieldCheck,
      color: 'bg-[#EEF7EE] text-[#439F46] hover:bg-[#d8edd8] border-emerald-100',
    },
    {
      name: 'Lainnya',
      href: '/wakaf',
      icon: Grid,
      color: 'bg-[#EEF7EE] text-[#439F46] hover:bg-[#d8edd8] border-emerald-100',
    },
  ];

  return (
    <div className="mx-4 sm:mx-6 my-5">
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <Link
              key={idx}
              href={cat.href}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border shadow-2xs group-hover:scale-105 active:scale-95 transition-all duration-200 ${cat.color}`}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-[#439F46] transition-colors">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
