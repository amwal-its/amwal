"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/splash-screen";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-amwal-neutral-light dark:bg-zinc-950 font-jakarta">
      <SplashScreen onFinish={() => router.push("/onboarding")} />
    </div>
  );
}
