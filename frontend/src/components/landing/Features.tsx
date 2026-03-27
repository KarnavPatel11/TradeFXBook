"use client";

import { motion } from "framer-motion";
import { LineChart, BookOpen, BarChart3, RefreshCcw, BrainCircuit, Users } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Strategy Backtesting",
      description: "Test your strategy on real historical data before risking real money. Pick a symbol, choose your timeframe, and replay the market candle by candle.",
      bullets: [
        "Replay trades on real market data",
        "Win rate, expectancy & risk analysis",
        "Multiple timeframes from 1m to 1W"
      ],
      icon: <LineChart className="w-8 h-8 text-accent" />,
      align: "left"
    },
    {
      title: "Rich Trade Journaling",
      description: "Every trade tells a story. Add notes, tag your strategy, attach screenshots, and track how you felt emotionally.",
      bullets: [
        "Notes, tags & screenshot attachments",
        "Emotional tracking & trade ratings (1–5)",
        "Pre-trade checklists & custom templates"
      ],
      icon: <BookOpen className="w-8 h-8 text-accent" />,
      align: "right"
    },
    {
      title: "Powerful Analytics",
      description: "See your performance laid out clearly. Everything is calculated automatically so you can focus on improving.",
      bullets: [
        "Equity curves & drawdown charts",
        "Calendar heatmap with daily P&L",
        "Breakdowns by session, symbol & tag"
      ],
      icon: <BarChart3 className="w-8 h-8 text-accent" />,
      align: "left"
    },
    {
      title: "MT4/MT5 Real-Time Sync",
      description: "Link your MetaTrader 4 or 5 account and your trades show up automatically. No copy-pasting. Just connect and go.",
      bullets: [
        "Real-time sync with ANY MT4/MT5 broker",
        "Auto-import trades, positions & full history",
        "Supports unlimited accounts simultaneously"
      ],
      icon: <RefreshCcw className="w-8 h-8 text-accent" />,
      align: "right"
    },
    {
      title: "AI-Powered Reports",
      description: "Our AI reads your entire trade history and gives you a full breakdown — what's working, what's not, and what to fix.",
      bullets: [
        "Personalized performance analysis & letter grade",
        "Blind spot & revenge trading detection",
        "Actionable step-by-step improvement plan"
      ],
      icon: <BrainCircuit className="w-8 h-8 text-accent" />,
      align: "left"
    },
    {
      title: "Community & Leaderboard",
      description: "Trade alongside thousands of others. Share setups, climb the leaderboard, and learn from traders getting results.",
      bullets: [
        "Real-time chat & trade idea sharing",
        "Daily, weekly & monthly leaderboards",
        "Traders Lounge for mentoring & signals"
      ],
      icon: <Users className="w-8 h-8 text-accent" />,
      align: "right"
    }
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Everything You Need to <span className="text-accent">Master Your Trading</span>
          </h2>
          <p className="text-xl text-text-secondary">
            All features. Completely free. No subscriptions.
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${feature.align === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}
            >
              {/* Content Side */}
              <div className="flex-1 space-y-8">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center glow-blue">
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-heading font-bold">{feature.title}</h3>
                <p className="text-lg text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-4">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-foreground font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mockup Side */}
              <div className="flex-1 w-full max-w-xl">
                <div className="aspect-[4/3] rounded-2xl glass-card overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent z-10" />
                  <div className="absolute inset-0 border border-white/10 rounded-2xl z-20" />
                  
                  {/* Abstract placeholder for the feature screenshot */}
                  <div className="absolute inset-4 rounded-xl bg-background/50 border border-white/5 p-4 overflow-hidden">
                    <div className="w-full h-8 flex gap-2 mb-4">
                      <div className="w-8 h-8 rounded shrink-0 bg-white/5" />
                      <div className="w-full h-8 rounded bg-white/5" />
                    </div>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-full h-12 rounded mt-2 bg-white/5" />
                    ))}
                    
                    {/* Glowing Accent */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent opacity-20 blur-[50px]" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
