"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Play, 
  Pause, 
  SkipForward, 
  FastForward, 
  ArrowLeft,
  Settings,
  TrendingDown,
  TrendingUp,
  Maximize2
} from "lucide-react";
import dynamic from "next/dynamic";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const BacktestChart = dynamic(() => import("@/components/dashboard/BacktestChart"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-accent border-r-transparent animate-spin" />
    </div>
  )
});

export default function BacktestSessionPage() {
  const router = useRouter();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [balance, setBalance] = useState(10000);
  const [equity, setEquity] = useState(10000);
  
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [lots, setLots] = useState("1.00");
  const [sl, setSl] = useState("");
  const [tp, setTp] = useState("");

  const handleEquityChange = (change: number) => {
    setEquity(prev => prev + change);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      
      {/* Top Toolbar */}
      <div className="glass-card px-4 py-3 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-secondary border border-white/5 flex items-center justify-center text-text-secondary hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:block">
            <h2 className="font-bold font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              EURUSD • 1H
            </h2>
            <p className="text-xs text-text-secondary">Simulating: 2023-01-05 14:00</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-background/50 p-1.5 rounded-xl border border-white/5">
           <button 
             onClick={() => setIsPlaying(!isPlaying)}
             className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
               isPlaying ? 'bg-accent/20 text-accent' : 'bg-white/5 hover:bg-white/10 text-white'
             }`}
           >
             {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
           </button>
           <button 
             onClick={() => {}}
             className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all"
           >
             <SkipForward className="w-5 h-5" />
           </button>
           
           <div className="w-px h-6 bg-white/10 mx-1" />
           
           <div className="flex bg-secondary rounded-lg p-0.5 border border-white/5">
             {[1, 5, 10, 50].map(s => (
               <button 
                 key={s}
                 onClick={() => setSpeed(s)}
                 className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                   speed === s ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-white'
                 }`}
               >
                 {s}x
               </button>
             ))}
           </div>
        </div>

        {/* Global Account Stats */}
        <div className="flex items-center gap-6">
          <div className="text-right">
             <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider mb-0.5">Balance</p>
             <p className="font-mono font-bold">{formatCurrency(balance)}</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider mb-0.5">Equity</p>
             <p className={`font-mono font-bold ${equity > balance ? 'text-success' : equity < balance ? 'text-red' : ''}`}>
               {formatCurrency(equity)}
             </p>
          </div>
          <button className="w-10 h-10 rounded-xl bg-secondary border border-white/5 flex items-center justify-center text-text-secondary hover:text-white transition-colors shrink-0">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Area Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        
        {/* Chart View */}
        <div className="flex-1 glass-card rounded-2xl border border-white/5 relative flex flex-col min-h-[400px]">
           <div className="absolute top-4 right-4 z-10 flex gap-2">
             <button className="w-8 h-8 rounded bg-background/80 backdrop-blur border border-white/5 flex items-center justify-center text-text-secondary hover:text-white transition-colors">
               <Maximize2 className="w-4 h-4" />
             </button>
           </div>
           
           {/* Chart Container Hook */}
           <BacktestChart isPlaying={isPlaying} speed={speed} onEquityChange={handleEquityChange} />
        </div>

        {/* Sidebar Order Panel */}
        <div className="w-full lg:w-80 glass-card rounded-2xl border border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          
          {/* Order Entry */}
          <div className="mb-6">
            <h3 className="font-bold font-heading mb-4 pb-2 border-b border-white/5">Order Entry</h3>
            
            <div className="flex bg-background/50 rounded-xl p-1 mb-4 border border-white/5">
              <button 
                onClick={() => setOrderType("MARKET")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${orderType === "MARKET" ? 'bg-secondary text-white shadow-md' : 'text-text-secondary'}`}
              >
                Market
              </button>
              <button 
                onClick={() => setOrderType("LIMIT")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${orderType === "LIMIT" ? 'bg-secondary text-white shadow-md' : 'text-text-secondary'}`}
              >
                Limit
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Lots / Size</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setLots((Number(lots)-0.1).toFixed(2))} className="w-8 h-8 rounded bg-secondary border border-white/5 flex items-center justify-center hover:bg-white/10">-</button>
                  <input 
                    type="number" step="0.01" value={lots} onChange={e => setLots(e.target.value)}
                    className="flex-1 bg-background/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:border-accent"
                  />
                  <button onClick={() => setLots((Number(lots)+0.1).toFixed(2))} className="w-8 h-8 rounded bg-secondary border border-white/5 flex items-center justify-center hover:bg-white/10">+</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Stop Loss</label>
                  <input 
                    placeholder="Price" value={sl} onChange={e => setSl(e.target.value)}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Take Profit</label>
                  <input 
                    placeholder="Price" value={tp} onChange={e => setTp(e.target.value)}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              
              <div className="pt-2 grid grid-cols-2 gap-3">
                <button className="py-3 rounded-xl bg-success/10 hover:bg-success/20 border border-success/30 text-success text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                  <TrendingUp className="w-4 h-4" /> BUY
                </button>
                <button className="py-3 rounded-xl bg-red/10 hover:bg-red/20 border border-red/30 text-red text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <TrendingDown className="w-4 h-4" /> SELL
                </button>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="font-bold font-heading mb-4 pb-2 border-b border-white/5 sticky top-0 bg-tertiary">Open Positions (1)</h3>
            
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pb-4">
               {/* Mock Position Card */}
               <div className="p-3 bg-background/50 rounded-xl border border-white/5 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-full bg-success" />
                 
                 <div className="flex justify-between items-start mb-2">
                   <div>
                     <span className="text-xs font-bold text-success mr-2">BUY</span>
                     <span className="font-bold text-sm">EURUSD</span>
                   </div>
                   <button className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-white pb-1">×</button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary mb-2">
                    <div>Size: <span className="text-foreground">1.00</span></div>
                    <div>Open: <span className="text-foreground">1.05020</span></div>
                    <div>SL: <span className="text-foreground">{sl || "None"}</span></div>
                    <div>TP: <span className="text-foreground">{tp || "None"}</span></div>
                 </div>

                 <div className="flex justify-between items-center pt-2 border-t border-white/5">
                   <span className="text-xs font-medium">Float P&L</span>
                   <span className="font-mono font-bold text-success">+$45.20</span>
                 </div>
               </div>
            </div>

            <button className="w-full mt-auto py-3 rounded-xl bg-secondary hover:bg-white/5 border border-white/10 text-text-secondary hover:text-white text-sm font-bold transition-colors">
              Finish Session
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
