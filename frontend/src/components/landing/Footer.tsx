import Link from "next/link";
import { Activity, Twitter, Instagram, Github, Youtube } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary/20 pt-20 pb-10 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-foreground">
                TradeFXBook
              </span>
            </Link>
            <p className="text-text-secondary text-sm mb-6 max-w-sm leading-relaxed">
              Track your edge, analyze PnL, journal trades, backtest strategies, and leverage AI reporting. Built for Traders, by Traders.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white text-text-secondary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white text-text-secondary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white text-text-secondary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white text-text-secondary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-foreground">Platform</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><Link href="#features" className="hover:text-accent transition-colors">Journaling</Link></li>
              <li><Link href="#features" className="hover:text-accent transition-colors">Analytics</Link></li>
              <li><Link href="#features" className="hover:text-accent transition-colors">Backtesting</Link></li>
              <li><Link href="#features" className="hover:text-accent transition-colors">MT4/MT5 Sync</Link></li>
              <li><Link href="#features" className="hover:text-accent transition-colors">AI Reports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-foreground">Community</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><Link href="#community" className="hover:text-accent transition-colors">Traders Lounge</Link></li>
              <li><Link href="#community" className="hover:text-accent transition-colors">Leaderboards</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Discord Server</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Blog & Guides</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-foreground">Company</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><Link href="#" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="#contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="/login" className="hover:text-accent transition-colors">Login</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">
            © {year} TradeFXBook. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>Built by Traders, for Traders.</span>
            <span className="text-accent text-xl leading-none">&hearts;</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
