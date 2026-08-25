import React from 'react';

export default function WakafDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start antialiased animate-pulse">
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl bg-white shadow-xl min-h-screen relative flex flex-col">
        {/* Banner Skeleton */}
        <div className="w-full h-[260px] sm:h-[320px] bg-slate-200" />

        {/* Content Skeleton */}
        <div className="relative -mt-6 rounded-t-3xl bg-white z-10 px-5 pt-6 pb-28 sm:px-6 md:px-8 flex-1 space-y-4">
          {/* Badge Skeleton */}
          <div className="flex gap-2">
            <div className="w-28 h-6 rounded-full bg-slate-200" />
            <div className="w-24 h-6 rounded-full bg-slate-200" />
          </div>

          {/* Title Skeleton */}
          <div className="w-3/4 h-8 rounded-lg bg-slate-200" />
          <div className="w-1/2 h-8 rounded-lg bg-slate-200" />

          {/* Progress Card Skeleton */}
          <div className="w-full h-32 rounded-2xl bg-slate-100 border border-slate-200" />

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 rounded-2xl bg-slate-100 border border-slate-200" />
            <div className="h-20 rounded-2xl bg-slate-100 border border-slate-200" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2 pt-2">
            <div className="w-24 h-5 rounded bg-slate-200" />
            <div className="w-full h-4 rounded bg-slate-100" />
            <div className="w-full h-4 rounded bg-slate-100" />
            <div className="w-4/5 h-4 rounded bg-slate-100" />
          </div>

          {/* Nazhir Card Skeleton */}
          <div className="w-full h-20 rounded-2xl bg-slate-100 border border-slate-200" />
        </div>
      </div>
    </div>
  );
}
