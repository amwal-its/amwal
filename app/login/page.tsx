"use client";

import { AuthFlow } from "@/components/auth-flow";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-amwal-neutral-light dark:bg-zinc-950 font-jakarta">
      <AuthFlow onSuccess={() => router.push("/dashboard")} />
    </div>
  );
}
