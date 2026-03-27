"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Community", href: "#community" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-secondary/80 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center glow-blue-hover">
            <Activity className="w-6 h-6 text-accent" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
            TradeFXBook
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-text-secondary hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-lg bg-accent hover:bg-primary-hover text-white text-sm font-medium transition-all shadow-lg glow-blue hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-text-secondary hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dropdown border-t border-white/5 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-text-secondary hover:text-accent py-2 border-b border-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/login"
                  className="w-full py-3 text-center rounded-lg border border-white/10 hover:bg-white/5 text-foreground font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full py-3 text-center rounded-lg bg-accent hover:bg-primary-hover text-white font-medium transition-colors"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
