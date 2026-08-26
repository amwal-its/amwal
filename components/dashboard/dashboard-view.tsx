import React from 'react';
import { TopAppBar } from './top-app-bar';
import { XpBanner } from './xp-banner';
import { HeroCarousel } from './hero-carousel';
import { CategoryGrid } from './category-grid';
import { EducationSection } from './education-section';
import { FeaturedPrograms, ProgramItem } from './featured-programs';
import { BottomNav } from '@/components/bottom-nav';

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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-jakarta antialiased">
      {/* Phone Screen Container for Desktop View (430px width, 844px fixed height frame) */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[844px] bg-white shadow-2xl border border-gray-200/80 sm:rounded-[40px] relative flex flex-col justify-between overflow-hidden">
        
        {/* Top Header Section */}
        <TopAppBar />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-[80px]">
          {/* 1. XP Gamification Banner */}
          <XpBanner initialXp={200} />

          {/* 2. Hero Carousel Banners */}
          <HeroCarousel />

          {/* 3. Category Grid Menu (Wakaf, Zakat, Qurban, Lainnya) */}
          <CategoryGrid />

          {/* 4. Berita & Edukasi Section */}
          <EducationSection />

          {/* 5. Program Wakaf Pilihan */}
          <FeaturedPrograms programs={programs} />
        </main>

        {/* Unified Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}









