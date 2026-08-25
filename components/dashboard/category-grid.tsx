import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function CategoryGrid() {
  const categories = [
    {
      name: 'Wakaf',
      href: '/wakaf',
      iconSrc: '/assets/images/dashboard/1-menu-icon.png',
    },
    {
      name: 'Zakat',
      href: '/zakat/kalkulator',
      iconSrc: '/assets/images/dashboard/2-menu-icon.png',
    },
    {
      name: 'Qurban',
      href: '/qurban',
      iconSrc: '/assets/images/dashboard/3-menu-icon.png',
    },
    {
      name: 'Lainnya',
      href: '/wakaf',
      iconSrc: '/assets/images/dashboard/4-menu-icon.png',
    },
  ];

  return (
    <div className="mx-4 sm:mx-6 my-5">
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.href}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EEF7EE] hover:bg-[#d8edd8] flex items-center justify-center border border-emerald-100/60 shadow-2xs group-hover:scale-105 active:scale-95 transition-all duration-200">
              <Image
                src={cat.iconSrc}
                alt={cat.name}
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-[#439F46] transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

