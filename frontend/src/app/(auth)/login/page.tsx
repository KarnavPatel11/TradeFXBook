"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, Mail, Lock } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      
      router.push("/app/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Welcome Back</h1>
          <p className="text-text-secondary">Enter your credentials to access your terminal.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red/10 border border-red/20 text-red text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary pl-1" htmlFor="email">Email</label>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between pl-1 pr-1">
              <label className="text-sm font-medium text-text-secondary" htmlFor="password">Password</label>
              <Link href="/forgot-password" className="text-sm text-accent hover:text-accent-blue2 transition-colors">
                Forgot password?
              </Link>
            </div>
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

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-white/10 bg-background accent-accent" />
            <label htmlFor="remember" className="text-sm text-text-secondary">Remember my device</label>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-4 rounded-xl bg-accent hover:bg-primary-hover text-white font-bold transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-text-secondary">
          Don't have an account?{" "}
          <Link href="/register" className="text-foreground font-semibold hover:text-accent transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
