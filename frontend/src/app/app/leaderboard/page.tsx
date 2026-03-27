"use client";

import { useState } from "react";
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Medal, 
  Share2,
  Twitter,
  Instagram,
  Download
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { formatCurrency, formatPercent } from "@/lib/utils";

// Mock Data
const LEADERBOARD = [
  { rank: 1, name: "AlphaFund", type: "MT5", pnl: 45020.50, winRate: 0.78, streak: 12, avatar: "https://i.pravatar.cc/150?u=12" },
  { rank: 2, name: "LondonSession", type: "MT4", pnl: 38150.00, winRate: 0.65, streak: 3, avatar: "https://i.pravatar.cc/150?u=4" },
  { rank: 3, name: "PipsCollector", type: "MT4", pnl: 29400.25, winRate: 0.72, streak: 8, avatar: "https://i.pravatar.cc/150?u=2" },
  { rank: 4, name: "TradeBeast", type: "MT5", pnl: 15200.00, winRate: 0.58, streak: 1, avatar: "https://i.pravatar.cc/150?u=8" },
  { rank: 5, name: "You", type: "MT5", pnl: 10450.00, winRate: 0.68, streak: 5, avatar: "https://i.pravatar.cc/150?u=me", isCurrent: true },
  { rank: 6, name: "ScalpingKing", type: "MT4", pnl: 8150.00, winRate: 0.82, streak: 21, avatar: "https://i.pravatar.cc/150?u=9" },
  { rank: 7, name: "SwingTraderX", type: "MT5", pnl: 5400.00, winRate: 0.45, streak: 0, avatar: "https://i.pravatar.cc/150?u=5" },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("monthly");
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold font-heading mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-gold" />
            Global Hall of Fame
          </h1>
          <p className="text-text-secondary text-base leading-relaxed">
            See how you rank against other traders globally. Compete for the top spot, unlock unique badges, and share your verified results.
          </p>
        </div>
        
        <Dialog.Root open={shareOpen} onOpenChange={setShareOpen}>
          <Dialog.Trigger asChild>
            <button className="relative z-10 flex shrink-0 items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-bold transition-all h-full">
              <Share2 className="w-5 h-5" />
              Share My Card
            </button>
          </Dialog.Trigger>
          
          {/* Share Card Modal */}
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-6 glass-card border border-white/10 p-6 rounded-3xl shadow-2xl duration-200 text-center">
              
              <div className="flex flex-col items-center mb-2">
                <Dialog.Title className="text-xl font-heading font-bold mb-1">Generated Share Card</Dialog.Title>
                <Dialog.Description className="text-sm text-text-secondary">
                  Post this on Instagram or Twitter to verify your stats.
                </Dialog.Description>
              </div>

              {/* Verified Card Preview */}
              <div className="w-full aspect-[4/5] bg-gradient-to-br from-secondary via-background to-secondary rounded-2xl border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-20 blur-[50px] rounded-full" />
                 
                 <div className="flex justify-between items-start relative z-10">
                   <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="https://i.pravatar.cc/150?u=me" alt="You" className="w-12 h-12 rounded-full border-2 border-accent" />
                      <div className="text-left">
                        <p className="font-bold font-heading">You</p>
                        <p className="text-xs text-accent font-medium">Verified Trader</p>
                      </div>
                   </div>
                   <Trophy className="w-6 h-6 text-gold" />
                 </div>

                 <div className="space-y-6 relative z-10">
                    <div className="text-left">
                      <p className="text-sm text-text-secondary font-medium uppercase tracking-wider mb-1">Monthly Return</p>
                      <p className="text-5xl font-black font-heading text-success">+$10,450</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <p className="text-xs text-text-secondary mb-1">Win Rate</p>
                        <p className="text-xl font-bold">68.0%</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <p className="text-xs text-text-secondary mb-1">Global Rank</p>
                        <p className="text-xl font-bold">#5</p>
                      </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between text-[10px] text-text-secondary font-medium uppercase tracking-widest relative z-10">
                   <span>Powered by TradeFXBook</span>
                   <span>Verify at tradefxbook.com/u/you</span>
                 </div>
              </div>

              <div className="flex gap-2 w-full pt-2">
                 <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors">
                   <Download className="w-4 h-4" /> Save
                 </button>
                 <button className="flex-1 py-3 bg-[#1D9BF0]/10 hover:bg-[#1D9BF0]/20 border border-[#1D9BF0]/20 text-[#1D9BF0] rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors">
                   <Twitter className="w-4 h-4" /> Share
                 </button>
                 <button className="flex-1 py-3 bg-[#E1306C]/10 hover:bg-[#E1306C]/20 border border-[#E1306C]/20 text-[#E1306C] rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors">
                   <Instagram className="w-4 h-4" /> Story
                 </button>
              </div>

            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

      </div>

      {/* Leaderboard Filters */}
      <div className="flex items-center justify-between">
        <div className="flex bg-background/50 border border-white/10 rounded-xl p-1">
           <button 
             onClick={() => setPeriod("weekly")}
             className={`px-4 py-2 text-sm font-bold transition-all rounded-lg ${period === 'weekly' ? 'bg-secondary text-white shadow-md' : 'text-text-secondary'}`}
           >
             Weekly
           </button>
           <button 
             onClick={() => setPeriod("monthly")}
             className={`px-4 py-2 text-sm font-bold transition-all rounded-lg ${period === 'monthly' ? 'bg-secondary text-white shadow-md' : 'text-text-secondary'}`}
           >
             Monthly
           </button>
           <button 
             onClick={() => setPeriod("allTime")}
             className={`px-4 py-2 text-sm font-bold transition-all rounded-lg ${period === 'allTime' ? 'bg-secondary text-white shadow-md' : 'text-text-secondary'}`}
           >
             All Time
           </button>
        </div>
        
        <div className="text-sm text-text-secondary">
          Next snapshot in: <span className="font-bold text-white">4d 12h</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-secondary/30 text-xs uppercase tracking-wider text-text-secondary">
                <th className="px-6 py-4 font-bold">Rank</th>
                <th className="px-6 py-4 font-bold">Trader</th>
                <th className="px-6 py-4 font-bold">Return ($)</th>
                <th className="px-6 py-4 font-bold">Win Rate</th>
                <th className="px-6 py-4 font-bold">Best Streak</th>
                <th className="px-6 py-4 font-bold text-right">View Stats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {LEADERBOARD.map((trader) => (
                <tr 
                  key={trader.rank} 
                  className={`group hover:bg-white/5 transition-colors ${trader.isCurrent ? 'bg-accent/10 border-l-[3px] border-l-accent' : ''}`}
                >
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      {trader.rank === 1 && <Trophy className="w-5 h-5 text-gold" />}
                      {trader.rank === 2 && <Award className="w-5 h-5 text-zinc-300" />}
                      {trader.rank === 3 && <Award className="w-5 h-5 text-amber-600" />}
                      {trader.rank > 3 && <span className="w-5 text-center text-text-secondary">#{trader.rank}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={trader.avatar} alt={trader.name} className="w-10 h-10 rounded-full border border-white/10" />
                        {trader.isCurrent && (
                          <div className="absolute -bottom-1 -right-1 bg-accent text-[8px] font-bold px-1.5 py-0.5 rounded border border-background">YOU</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm group-hover:text-accent transition-colors">{trader.name}</p>
                        <p className="text-xs text-text-secondary flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-success inline-block mt-0.5" />
                          {trader.type} Verified
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-success font-mono">{formatCurrency(trader.pnl)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 w-32">
                      <span className="text-sm font-bold w-12">{formatPercent(trader.winRate)}</span>
                      <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden">
                         <div className="h-full bg-accent rounded-full" style={{ width: `${trader.winRate * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gold/10 text-gold border border-gold/20 rounded-md text-xs font-bold flex w-fit items-center gap-1.5">
                      🔥 {trader.streak} Wins
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-4 py-2 bg-secondary hover:bg-white/10 border border-white/5 rounded-lg text-sm font-medium transition-colors">
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
