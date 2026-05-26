"use client";

import { OnboardingFlow } from "@/components/onboarding-flow";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-amwal-neutral-light dark:bg-zinc-950 font-jakarta">
      <OnboardingFlow onFinish={() => router.push("/login")} />
    </div>
  );
}
