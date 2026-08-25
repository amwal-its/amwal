import React from 'react';
import { TopAppBar } from './top-app-bar';
import { XpBanner } from './xp-banner';
import { HeroCarousel } from './hero-carousel';
import { CategoryGrid } from './category-grid';
import { EducationSection } from './education-section';
import { FeaturedPrograms, ProgramItem } from './featured-programs';
import { BottomNav } from './bottom-nav';

interface DashboardViewProps {
  userName?: string;
  programs?: ProgramItem[];
  isLoggedIn?: boolean;
}

export function DashboardView({
  userName = 'Ahmad Abdullah',
  programs = [],
  isLoggedIn = true,
}: DashboardViewProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start font-jakarta antialiased selection:bg-[#439F46] selection:text-white">
      {/* Central responsive card container: mobile-first max-w-md, expanding gracefully on desktop */}
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl bg-white shadow-xl min-h-screen relative flex flex-col pb-20">
        
        {/* Top App Bar with Search & Profile */}
        <TopAppBar userName={userName} isLoggedIn={isLoggedIn} />

        {/* Main Content Area */}
        <main className="flex-1">
          {/* 1. XP Gamification Banner (or welcome banner) */}
          <XpBanner initialXp={isLoggedIn ? 200 : 0} />

          {/* 2. Hero Carousel Banners */}
          <HeroCarousel />

          {/* 3. Category Grid Menu (Wakaf, Zakat, Qurban, Lainnya) */}
          <CategoryGrid />

          {/* 4. Berita & Edukasi Section */}
          <EducationSection />

          {/* 5. Program Wakaf Pilihan */}
          <FeaturedPrograms programs={programs} />
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
