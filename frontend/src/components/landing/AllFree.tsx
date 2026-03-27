"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function AllFree() {
  const freeFeatures = [
    "Unlimited trades",
    "Unlimited MT4/MT5 broker accounts",
    "Real-time broker sync",
    "Full analytics dashboard (15+ charts)",
    "AI-powered trade reports",
    "Strategy backtesting engine",
    "Trade journaling with screenshots",
    "Emotional tracking",
    "Pre-trade checklists",
    "Economic calendar & news",
    "Community chat & Traders Lounge",
    "Leaderboard & social share cards",
    "CSV/Excel export",
    "Priority support",
    "All future features"
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Everything Is Free. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Forever.</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            No credit card. No hidden fees. No subscription plans. No feature limits. Just powerful tools built for traders, by traders.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-[2rem] border border-accent/20 glow-blue overflow-hidden"
        >
          <div className="bg-gradient-to-br from-accent/10 to-transparent p-8 md:p-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {freeFeatures.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                  <span className="font-medium text-text-primary">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 md:p-8 rounded-2xl bg-background/50 border border-white/5">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready to level up?</h3>
                <p className="text-text-secondary">Join 2,000+ traders mastering the markets.</p>
              </div>
              <Link 
                href="/register" 
                className="w-full sm:w-auto px-10 py-5 rounded-xl bg-accent hover:bg-primary-hover text-white text-lg font-bold transition-all shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                Get Started — It's Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
