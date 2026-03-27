"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { 
  Play, 
  History, 
  Settings, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  LineChart
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface BacktestSession {
  id: string;
  name: string;
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  startingBalance: number;
  endingBalance: number;
  winRate: number;
  totalTrades: number;
  status: "COMPLETED" | "IN_PROGRESS";
  createdAt: string;
}

export default function BacktestListPage() {
  const [sessions, setSessions] = useState<BacktestSession[]>([
    {
      id: "1",
      name: "EURUSD Trend Strategy V2",
      symbol: "EURUSD",
      timeframe: "1H",
      startDate: "2023-01-01",
      endDate: "2023-06-30",
      startingBalance: 10000,
      endingBalance: 12450.50,
      winRate: 0.58,
      totalTrades: 124,
      status: "COMPLETED",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "2",
      name: "NAS100 Opening Range",
      symbol: "NAS100",
      timeframe: "15m",
      startDate: "2023-08-01",
      endDate: "2023-10-31",
      startingBalance: 50000,
      endingBalance: 48100.00,
      winRate: 0.42,
      totalTrades: 68,
      status: "COMPLETED",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "current",
      name: "XAUUSD Supply Demand",
      symbol: "XAUUSD",
      timeframe: "4H",
      startDate: "2022-01-01",
      endDate: "2022-12-31",
      startingBalance: 100000,
      endingBalance: 104500.00,
      winRate: 0.65,
      totalTrades: 12,
      status: "IN_PROGRESS",
      createdAt: new Date().toISOString(),
    }
  ]);

  const [setupOpen, setSetupOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "New Strategy Test",
    symbol: "EURUSD",
    timeframe: "1H",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    startingBalance: 10000,
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple opacity-10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold font-heading mb-2">Backtesting Engine</h1>
          <p className="text-text-secondary text-base leading-relaxed">
            Replay historical market data, test your strategies in a simulated risk-free environment, and automatically generate detailed analytics from your backtested trades. All Premium features unlocked.
          </p>
        </div>
        
        <Dialog.Root open={setupOpen} onOpenChange={setSetupOpen}>
          <Dialog.Trigger asChild>
            <button className="relative z-10 flex shrink-0 items-center gap-2 px-6 py-4 bg-accent hover:bg-primary-hover text-white rounded-xl text-sm font-bold shadow-lg glow-blue hover:-translate-y-0.5 transition-all text-center justify-center">
              <Play className="w-5 h-5 fill-current" />
              New Backtest Session
            </button>
          </Dialog.Trigger>
          
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 glass-card border border-white/10 p-6 rounded-3xl shadow-2xl duration-200">
              <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-2">
                <Dialog.Title className="text-xl font-heading font-bold">Configure Simulator</Dialog.Title>
                <Dialog.Description className="text-sm text-text-secondary">
                  Set up your historical simulation parameters.
                </Dialog.Description>
              </div>

              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Session Name</label>
                  <input 
                    required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-text-secondary">Instrument</label>
                     <select 
                       value={formData.symbol} onChange={e => setFormData({...formData, symbol: e.target.value})}
                       className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                     >
                       <option value="EURUSD">EURUSD</option>
                       <option value="GBPUSD">GBPUSD</option>
                       <option value="XAUUSD">XAUUSD</option>
                       <option value="NAS100">NAS100</option>
                       <option value="US30">US30</option>
                       <option value="BTCUSD">BTCUSD</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-text-secondary">Timeframe</label>
                     <select 
                       value={formData.timeframe} onChange={e => setFormData({...formData, timeframe: e.target.value})}
                       className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                     >
                       <option value="1m">1 Minute</option>
                       <option value="5m">5 Minutes</option>
                       <option value="15m">15 Minutes</option>
                       <option value="1H">1 Hour</option>
                       <option value="4H">4 Hours</option>
                       <option value="1D">Daily</option>
                     </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-text-secondary">Start Date</label>
                    <input 
                      required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-text-secondary">End Date</label>
                    <input 
                      required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Starting Balance ($)</label>
                  <input 
                    required type="number" min="10" step="1" value={formData.startingBalance} onChange={e => setFormData({...formData, startingBalance: Number(e.target.value)})}
                    className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                  />
                </div>

                <div className="pt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setSetupOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors">Cancel</button>
                  <Link 
                    href={`/app/backtest/new-session`}
                    className="px-6 py-3 rounded-xl bg-accent hover:bg-primary-hover text-white text-sm font-medium transition-all shadow-lg glow-blue flex items-center gap-2"
                  >
                    Start Simulation <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

      </div>

      <div className="flex items-center gap-2 pb-2 border-b border-white/5">
        <History className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-bold font-heading">Recent Sessions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map(session => {
          const pnl = session.endingBalance - session.startingBalance;
          const percentage = (pnl / session.startingBalance) * 100;
          const isProfitable = pnl >= 0;

          return (
            <Link 
              key={session.id} 
              href={`/app/backtest/${session.id}`}
              className="glass-card p-6 rounded-3xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group flex flex-col h-[280px]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                  session.status === "IN_PROGRESS" ? "bg-gold/20 text-gold border border-gold/30" : "bg-white/10 text-text-secondary border border-white/10"
                }`}>
                  {session.status === "IN_PROGRESS" ? "In Progress" : "Completed"}
                </div>
                <div className="text-xs text-text-secondary font-medium flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" />
                  {session.symbol} • {session.timeframe}
                </div>
              </div>

              <h3 className="font-bold text-lg leading-tight mb-auto group-hover:text-accent transition-colors line-clamp-2">
                {session.name}
              </h3>

              <div className="space-y-4 mb-4">
                <div>
                  <p className="text-xs text-text-secondary mb-1">Ending Balance</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-heading font-bold">{formatCurrency(session.endingBalance)}</p>
                    {session.status === "COMPLETED" && (
                      <span className={`text-xs font-bold flex items-center ${isProfitable ? 'text-success' : 'text-red'}`}>
                        {isProfitable ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                        {Math.abs(percentage).toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5">
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Win Rate</p>
                    <p className="font-bold text-sm">{(session.winRate * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Total Trades</p>
                    <p className="font-bold text-sm">{session.totalTrades}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-text-secondary mt-auto">
                <span>{formatDateTime(session.createdAt).split(' ')[0]}</span>
                <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                  View Results <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
