"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function Home() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after hydration is complete
    if (!isHydrated) return;

    if (isAuthenticated) {
      // If user is authenticated, redirect to dashboard
      router.push("/dashboard");
    } else {
      // If user is not authenticated, redirect to login
      router.push("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  // Show loading state while hydrating or redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {!isHydrated ? "Loading..." : "Redirecting..."}
        </p>
      </div>
    </div>
  );
}
