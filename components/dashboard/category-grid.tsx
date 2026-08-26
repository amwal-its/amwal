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
    <div className="mx-5 sm:mx-6 my-5">
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.href}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            {/* Soft Green Pill-Square Icon Box */}
            <div className="w-[62px] h-[62px] sm:w-[68px] sm:h-[68px] rounded-[22px] bg-[#EAF5EB] group-hover:bg-[#DBEEDD] border border-[#D5EBD7] flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all duration-200 shrink-0">
              <Image
                src={cat.iconSrc}
                alt={cat.name}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-[#1E293B] group-hover:text-[#439F46] transition-colors text-center">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

