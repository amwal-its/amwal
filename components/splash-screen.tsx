"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Fade in the logo shortly after mount
    const entryTimeout = setTimeout(() => {
      setVisible(true);
    }, 100);

    // Trigger exit transition after 2.2 seconds
    const exitTimeout = setTimeout(() => {
      setExiting(true);
    }, 2200);

    // Call onFinish callback after 2.6 seconds (giving time for exit animation)
    const finishTimeout = setTimeout(() => {
      onFinish();
    }, 2600);

    return () => {
      clearTimeout(entryTimeout);
      clearTimeout(exitTimeout);
      clearTimeout(finishTimeout);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-amwal-neutral-light transition-all duration-700 ease-in-out z-50 w-screen h-screen overflow-hidden ${
        exiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-amwal-secondary-teal/5 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-amwal-secondary-green/5 rounded-full filter blur-3xl pointer-events-none animate-pulse delay-1000" />

      {/* Main Logo Container */}
      <div
        className={`flex flex-col items-center justify-center transition-all duration-1000 ease-out transform ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"
        }`}
      >
        <div className="relative w-44 h-44 md:w-56 md:h-56 mb-6 drop-shadow-md hover:drop-shadow-lg transition-all duration-300">
          <Image
            src="/assets/images/logo.png"
            alt="Amwal Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Custom premium loading indicator dot */}
        <div className="flex gap-1.5 mt-8 justify-center items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-amwal-secondary-teal animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-amwal-secondary-green animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-amwal-secondary-teal/40 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
