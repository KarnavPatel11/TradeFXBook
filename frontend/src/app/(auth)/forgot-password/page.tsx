"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setIsSent(true);
    } catch (err: any) {
      // In a real app we might genericize this error to prevent email enumeration
      setError(err.response?.data?.message || "Failed to process request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

      <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-white/10 relative z-10 shadow-2xl">
        {!isSent ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-heading font-bold mb-2">Reset Password</h1>
              <p className="text-text-secondary text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red/10 border border-red/20 text-red text-sm font-medium text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary pl-1" htmlFor="email">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-text-secondary" />
                  </div>
                  <input 
                    id="email"
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-white"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-4 mt-4 rounded-xl bg-accent hover:bg-primary-hover text-white font-bold transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending Link..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Check your email</h2>
            <p className="text-text-secondary text-sm mb-8">
              We've sent a password reset link to <span className="text-white font-medium">{email}</span>. 
              The link will expire in 1 hour.
            </p>
            <button 
              onClick={() => setIsSent(false)}
              className="px-6 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors"
            >
              Try another email
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
