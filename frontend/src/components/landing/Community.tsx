"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, Crown, Trophy } from "lucide-react";

export function Community() {
  return (
    <section id="community" className="py-24 relative bg-secondary/30">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Trade Together, <span className="text-accent">Grow Together</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Join thousands of traders improving their edges every day. Share setups, climb the leaderboard, and unlock the Traders Lounge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Real-time Chat Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-3xl border-white/5 relative overflow-hidden group hover:border-accent/30 transition-colors"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-accent/10 rounded-xl text-accent">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">Real-Time Community</h3>
            </div>
            
            <p className="text-text-secondary mb-8">
              Discuss markets live, share chart markups, and review trades with peers in specialized channels from Forex Majors to AI Signals.
            </p>

            {/* Chat Mockup */}
            <div className="bg-background rounded-xl p-4 border border-white/5 space-y-4 relative">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent shrink-0 flex items-center justify-center text-xs font-bold">UP</div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm">UmarPunjabi</span>
                    <span className="text-xs text-text-secondary">Today at 10:45 AM</span>
                  </div>
                  <p className="text-sm mt-1">Just caught a +3R setup on Gold based on that NY open sweep! 📈</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-success shrink-0 flex items-center justify-center text-xs font-bold">TK</div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm">TradingKatta</span>
                    <span className="text-xs text-text-secondary">Today at 10:47 AM</span>
                  </div>
                  <p className="text-sm mt-1">Nice! I was watching that same level but got stopped out at breakeven.</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 rounded bg-secondary text-xs flex items-center gap-1 border border-white/5">🔥 3</span>
                    <span className="px-2 py-1 rounded bg-secondary text-xs flex items-center gap-1 border border-white/5">👀 5</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Traders Lounge & Leaderboard */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <div className="glass-card p-8 rounded-3xl border-white/5 flex-1 relative overflow-hidden group hover:border-gold/30 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gold/10 rounded-xl text-gold">
                  <Crown className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">The Traders Lounge</h3>
              </div>
              <p className="text-text-secondary mb-4">
                An exclusive channel unlocked only for traders maintaining a top 10% win rate. Read insights from the best.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl border-white/5 flex-1 relative overflow-hidden group hover:border-success/30 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-success/10 rounded-xl text-success">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">Global Leaderboards</h3>
              </div>
              <p className="text-text-secondary mb-4">
                Earn badges for consistency, climb the daily, weekly, and monthly ranks, and generate beautiful share cards for your socials.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
