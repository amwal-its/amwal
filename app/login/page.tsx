"use client";

import { AuthFlow } from "@/components/auth-flow";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs font-jakarta">
      <AuthFlow onSuccess={() => router.push("/dashboard")} />
    </div>
  );
}
