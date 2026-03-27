"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";

export function Hero() {
  const testimonials = [
    { author: "Umar Punjabi", text: "Easy to use backtesting and journaling software with best features along with AI." },
    { author: "Trading Katta Dubai", text: "Perfect tool to become professional trader." },
    { author: "Gold Magicians", text: "Powerful insights that transformed our gold trading strategy." },
    { author: "Top G Traders", text: "Best Software for you to go from Beginner to Advanced trader." },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-20 bg-accent rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-[8s]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-accent/20 mb-8 max-w-fit mx-auto text-accent text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              All premium features unlocked for everyone
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-8 leading-tight">
              Track Trades. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-blue2">Analyze PnL.</span> Master Markets.
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
              Sync your trades, journal every setup, backtest ideas, and let AI do the analysis — 
              <span className="text-foreground font-semibold"> completely free.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                href="/register" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent hover:bg-primary-hover text-white text-lg font-medium transition-all shadow-xl glow-blue hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card hover:bg-white/5 text-foreground text-lg font-medium transition-all flex items-center justify-center gap-2 group"
              >
                <Play className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-text-secondary">
              <div className="flex items-center gap-1.5 glass-card px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                +$2,847.50 today
              </div>
              <div className="flex items-center gap-1.5 glass-card px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                67.8% Win Rate
              </div>
              <div className="flex items-center gap-1.5 glass-card px-4 py-2 rounded-full">
                <span className="text-foreground font-bold">2,000+</span> traders
              </div>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative max-w-6xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20 pointer-events-none rounded-2xl" />
          <div className="relative rounded-2xl border border-white/10 bg-secondary/50 shadow-2xl overflow-hidden glass-card glow-blue">
            <div className="h-10 border-b border-white/10 bg-secondary flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red/80" />
              <div className="w-3 h-3 rounded-full bg-gold/80" />
              <div className="w-3 h-3 rounded-full bg-success/80" />
            </div>
            <div className="aspect-[16/9] bg-[url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-70 mix-blend-luminosity"></div>
            {/* Real app would use an interface mockup image here but using an abstract placeholder for code generation */}
          </div>
        </motion.div>

        {/* Testimonial Strip */}
        <div className="mt-24 max-w-6xl mx-auto overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            className="flex gap-6 w-max"
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl w-80 flex-shrink-0 border-white/5">
                <div className="flex gap-1 mb-3 text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-text-secondary mb-4 italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs uppercase">
                    {t.author.substring(0, 2)}
                  </div>
                  <span className="font-medium text-sm">{t.author}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
