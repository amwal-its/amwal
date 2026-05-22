import React from "react";

interface MobilePreviewProps {
  children: React.ReactNode;
}

export function MobilePreview({ children }: MobilePreviewProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-radial from-slate-100 to-slate-200 dark:from-zinc-900 dark:to-black p-0 sm:p-8 min-h-screen">
      {/* Device Wrapper */}
      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] sm:rounded-[50px] sm:border-[10px] sm:border-zinc-900 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] sm:ring-1 sm:ring-zinc-900/10 overflow-hidden bg-white flex flex-col transition-all duration-300">
        
        {/* Dynamic Island / Notch - Desktop Only */}
        <div className="hidden sm:block absolute top-3.5 left-1/2 -translate-x-1/2 w-[110px] h-[28px] bg-black rounded-full z-50 pointer-events-none transition-all duration-300 hover:w-[120px] hover:h-[30px]" />

        {/* Status Bar - Desktop Only */}
        <div className="hidden sm:flex absolute top-0 left-0 right-0 h-12 px-6 justify-between items-center text-black font-semibold text-xs z-40 select-none pointer-events-none">
          {/* Time (matches design exactly) */}
          <div className="pl-1">11:30</div>
          
          {/* Icons */}
          <div className="flex items-center gap-1.5 pr-1">
            {/* Cellular */}
            <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 19h2v-3H2v3zm4 0h2v-6H6v6zm4 0h2v-9h-2v9zm4 0h2V6h-2v13zm4 0h2V2h-2v17z" />
            </svg>
            {/* Wifi */}
            <svg className="w-4.5 h-4.5 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21l-1.4-1.4C6.9 15.9 4.3 12.9 4.3 9.4c0-2.8 2.2-5 5-5 1.6 0 3.1.8 4 2 .9-1.2 2.4-2 4-2 2.8 0 5 2.2 5 5 0 3.5-2.6 6.5-6.3 10.2L12 21z" className="hidden" />
              <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19C2.89 17.15 2 14.68 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10c0 2.68-.89 5.15-2.35 7l-1.62-1.39C19.26 16.07 20 14.12 20 12c0-4.97-4.03-9-9-9zM12 6c-3.31 0-6 2.69-6 6 0 1.4.48 2.69 1.28 3.72l1.49-1.28C8.28 13.72 8 12.89 8 12c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .89-.28 1.72-.77 2.44l1.49 1.28C17.52 14.69 18 13.4 18 12c0-3.31-2.69-6-6-6zM12 9c-1.66 0-3 1.34-3 3 0 .66.22 1.27.59 1.76l1.62-1.39C11.08 12.25 11 12.13 11 12c0-.55.45-1 1-1s1 .45 1 1c0 .13-.08.25-.21.37l1.62 1.39c.37-.49.59-1.1.59-1.76 0-1.66-1.34-3-3-3z" />
            </svg>
            {/* Battery */}
            <div className="relative w-5.5 h-3 border-1.5 border-black rounded-[4px] p-[1px] flex items-center">
              <div className="h-full w-full bg-black rounded-[2px]" />
              <div className="absolute -right-[3px] top-[3px] w-[2px] h-[4px] bg-black rounded-r-[1px]" />
            </div>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden selection:bg-amwal-green/10">
          {children}
        </div>

        {/* Home Indicator - Desktop Only */}
        <div className="hidden sm:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[130px] h-[5px] bg-black rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
}
