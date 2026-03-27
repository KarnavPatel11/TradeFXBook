"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Activity } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Re-hydrate auth state on load
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password');
      const isProtectedRoute = pathname.startsWith('/app');

      if (isProtectedRoute && !isAuthenticated) {
        router.push("/login");
      } else if (isAuthRoute && isAuthenticated) {
        router.push("/app/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center animate-pulse glow-blue">
          <Activity className="w-8 h-8 text-accent animate-bounce" />
        </div>
      </div>
    );
  }

  // If on a protected route and not auth'd, don't render children while redirecting
  if (pathname.startsWith('/app') && !isAuthenticated) {
    return null; 
  }

  return <>{children}</>;
}
