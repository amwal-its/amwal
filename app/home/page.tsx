"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs items-center justify-center font-sans">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="w-10 h-10 border-4 border-teal-650 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-400 font-bold tracking-wide">Mengalihkan ke Dashboard...</p>
      </div>
    </div>
  );
}
