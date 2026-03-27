"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, Mail, Lock, User as UserIcon } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simple password strength calculator
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(formData.password);
  const strengthColors = ["bg-white/10", "bg-red", "bg-gold", "bg-accent-blue2", "bg-success"];
  const strengthText = ["", "Weak", "Fair", "Good", "Strong"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", formData);
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      router.push("/app/dashboard");
    } catch (err: any) {
      let errorMessage = "Registration failed. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = Array.isArray(err.response.data.message) 
          ? err.response.data.message[0]?.message || JSON.stringify(err.response.data.message)
          : err.response.data.message;
      }
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <Link href="/" className="flex items-center gap-2 mb-8 relative z-10 group">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center glow-blue-hover">
          <Activity className="w-6 h-6 text-accent" />
        </div>
        <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
          TradeFXBook
        </span>
      </Link>

      <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-white/10 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Create Account</h1>
          <p className="text-text-secondary">Join 2,000+ traders mastering the markets today.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red/10 border border-red/20 text-red text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary pl-1" htmlFor="name">Full Name</label>
              <div className="relative">
                <input 
                  id="name"
                  type="text" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-white"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary pl-1" htmlFor="username">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="w-4 h-4 text-text-secondary" />
                </div>
                <input 
                  id="username"
                  type="text" 
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-background/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-white"
                  placeholder="jtrader"
                />
              </div>
            </div>
          </div>

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
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-background/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-white"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary pl-1" htmlFor="password">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-text-secondary" />
              </div>
              <input 
                id="password"
                type="password" 
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-background/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-white"
                placeholder="••••••••"
              />
            </div>
            
            {/* Password Strength Meter */}
            {formData.password.length > 0 && (
              <div className="pt-2 px-1">
                <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden mb-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level} 
                      className={`h-full flex-1 transition-colors duration-300 ${
                        level <= strength ? strengthColors[strength] : "bg-white/5"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs text-right font-medium ${
                  strength === 0 ? "text-text-secondary" : 
                  strength === 1 ? "text-red" : 
                  strength === 2 ? "text-gold" : 
                  strength === 3 ? "text-accent-blue2" : "text-success"
                }`}>
                  {strengthText[strength]}
                </p>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading || formData.password.length < 8}
            className="w-full py-4 mt-2 rounded-xl bg-accent hover:bg-primary-hover text-white font-bold transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground font-semibold hover:text-accent transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
