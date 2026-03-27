"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password. The link might be expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-white/10 relative z-10 shadow-2xl">
      {!isSuccess ? (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">New Password</h1>
            <p className="text-text-secondary text-sm">
              Enter your new password below to regain access to your account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red/10 border border-red/20 text-red text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary pl-1" htmlFor="password">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-text-secondary" />
                </div>
                <input 
                  id="password"
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary pl-1" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-text-secondary" />
                </div>
                <input 
                  id="confirmPassword"
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading || !token}
              className="w-full py-4 mt-4 rounded-xl bg-accent hover:bg-primary-hover text-white font-bold transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 transition-all scale-110">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Password Reset Complete</h2>
          <p className="text-text-secondary text-sm mb-8">
            Your password has been successfully updated. You will be redirected to the login page momentarily.
          </p>
          <Link 
            href="/login"
            className="w-full inline-block py-3 rounded-xl bg-accent hover:bg-primary-hover text-white font-medium transition-colors"
          >
            Go to Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <Link href="/" className="flex items-center gap-2 mb-12 relative z-10 group">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center glow-blue-hover">
          <Activity className="w-6 h-6 text-accent" />
        </div>
        <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
          TradeFXBook
        </span>
      </Link>

      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
