"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "What is TradeFXBook?",
      answer: "A trading journal that syncs your MT4/MT5 trades automatically, tracks P&L, lets you journal and backtest, and uses AI to show what you're doing right and wrong. Works for forex, stocks, crypto — anything on MetaTrader. Completely free."
    },
    {
      question: "How does the MT5 sync work?",
      answer: "Connect using your investor password (read-only — it can never touch your funds). Trades sync in real time. Every position, every close — automatic."
    },
    {
      question: "Which brokers are supported?",
      answer: "Any broker running MT4 or MT5 — ICMarkets, Pepperstone, XM, Exness, FP Markets, FXTM, Tickmill, Fusion Markets, and hundreds more."
    },
    {
      question: "What do AI reports actually tell me?",
      answer: "Your win rate, profit factor, risk habits, emotional patterns, blind spots, revenge trading tendencies. You get a letter grade and a specific improvement plan."
    },
    {
      question: "How does backtesting work?",
      answer: "Pick a symbol, timeframe, and date range. The chart replays candle by candle. Open/close positions as if live, complete with SL and TP. Get full stats at the end."
    },
    {
      question: "Is my data safe?",
      answer: "Yes. AES-256 encryption and read-only broker credentials. We can never place, modify, or close trades. Your data is yours."
    },
    {
      question: "Is it really free?",
      answer: "100% free. No credit card required. No hidden charges. No feature limits. Everything is unlocked for every user."
    },
    {
      question: "Can I share my performance?",
      answer: "Yes. Generate share cards (story/post/landscape formats) and share to social media, or share read-only access to your account."
    },
    {
      question: "Can I import past trade history?",
      answer: "Yes. Connect your MT4/MT5 account and select a date range to import your full historical trade data automatically."
    },
    {
      question: "How does AI detect revenge trading?",
      answer: "It analyzes patterns like trade frequency spikes after losses, increased lot sizes after losing streaks, and trades placed outside your normal trading hours."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative bg-secondary/20">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-text-secondary">
            Everything you need to know about the platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-2xl border border-white/5 overflow-hidden"
            >
              <button
                className="flex items-center justify-between w-full p-6 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium pr-8">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-text-secondary leading-relaxed border-t border-white/5 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
