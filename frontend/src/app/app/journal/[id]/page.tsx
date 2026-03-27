"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { api } from "@/lib/api";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Target,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Share2
} from "lucide-react";

export default function TradeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trade, setTrade] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In actual implementation we'd fetch trade detail
    // api.get(`/trades/${params.id}`)
    setTimeout(() => {
      setTrade({
        id: params.id,
        ticketId: "948271",
        symbol: "EURUSD",
        type: "BUY",
        volume: 1.5,
        openPrice: 1.05000,
        closePrice: 1.05500,
        stopLoss: 1.04500,
        takeProfit: 1.06000,
        openTime: new Date("2023-10-25T14:30:00Z").toISOString(),
        closeTime: new Date("2023-10-25T16:45:00Z").toISOString(),
        netPnl: 750.00,
        commission: -10.50,
        swap: 0,
        status: "CLOSED",
        tags: ["Trend Follow", "London Session", "A-Setup"],
        notes: "Price swept the London low and accumulated during the NY open. Entered on the 5m choch. Clean run to the Asian high liquidity pool. Felt confident holding through the first pullback.",
        emotionalRating: 4,
        screenshots: [
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
        ],
        drawdown: -12.50
      });
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-accent border-r-transparent animate-spin" />
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-text-secondary">
        <p className="text-xl mb-4">Trade not found</p>
        <button onClick={() => router.back()} className="text-accent hover:underline">Go back</button>
      </div>
    );
  }

  const isWin = trade.netPnl >= 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-secondary border border-white/5 flex items-center justify-center text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold font-heading">{trade.symbol}</h1>
              <span className={`px-3 py-1 rounded-md text-sm font-bold ${
                trade.type === "BUY" ? "bg-success/15 text-success" : "bg-red/15 text-red"
              }`}>
                {trade.type}
              </span>
              <span className="px-3 py-1 bg-white/5 text-text-secondary text-sm font-medium border border-white/10 rounded-md">
                {trade.volume.toFixed(2)} Lots
              </span>
            </div>
            <p className="text-text-secondary text-sm">Ticket ID: #{trade.ticketId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-lg bg-secondary border border-white/5 flex items-center justify-center text-text-secondary hover:text-white transition-colors" title="Edit">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-lg bg-secondary border border-white/5 flex items-center justify-center text-text-secondary hover:text-accent transition-colors" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-lg bg-red/10 border border-red/20 flex items-center justify-center text-red hover:bg-red/20 transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Data */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Main P&L Card */}
          <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden text-center">
            {/* Background Glow */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-40 ${isWin ? 'bg-success' : 'bg-red'}`} />
            
            <p className="text-text-secondary font-medium mb-1 relative z-10">Net Profit / Loss</p>
            <h2 className={`text-5xl font-heading font-bold mb-4 flex items-center justify-center gap-2 relative z-10 ${isWin ? 'text-success' : 'text-red'}`}>
              {isWin ? <ArrowUpRight className="w-8 h-8" /> : <ArrowDownRight className="w-8 h-8" />}
              {formatCurrency(Math.abs(trade.netPnl))}
            </h2>

            <div className="flex justify-between items-center text-sm px-4 py-3 bg-background/50 rounded-xl border border-white/5 relative z-10">
              <span className="text-text-secondary text-xs">Gross: {formatCurrency(trade.netPnl - trade.commission - trade.swap)}</span>
              <span className="text-text-secondary text-xs">Com: {formatCurrency(trade.commission)}</span>
              <span className="text-text-secondary text-xs">Swp: {formatCurrency(trade.swap)}</span>
            </div>
          </div>

          {/* Trade Info Grids */}
          <div className="glass-card p-6 rounded-3xl border border-white/5 text-sm">
            <h3 className="font-bold mb-4 font-heading text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" /> Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-text-secondary">Opened</span>
                <span className="font-medium text-right">{formatDateTime(trade.openTime)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-text-secondary">Closed</span>
                <span className="font-medium text-right">{trade.closeTime ? formatDateTime(trade.closeTime) : "Ongoing"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Duration</span>
                <span className="font-medium">2h 15m</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/5 text-sm">
            <h3 className="font-bold mb-4 font-heading text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" /> Pricing
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-text-secondary">Entry Price</span>
                <span className="font-mono">{trade.openPrice.toFixed(5)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-text-secondary">Exit Price</span>
                <span className="font-mono">{trade.closePrice?.toFixed(5) || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-text-secondary">Stop Loss</span>
                <span className="font-mono text-xs">{trade.stopLoss?.toFixed(5) || "None"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Take Profit</span>
                <span className="font-mono text-xs">{trade.takeProfit?.toFixed(5) || "None"}</span>
              </div>
            </div>
          </div>

        </div>


        {/* Right Column: Journal & Screenshots */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="glass-card rounded-3xl border border-white/5 overflow-hidden flex flex-col min-h-[300px]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-primary/5">
              <h3 className="font-bold font-heading text-lg">Trade Journal</h3>
              <div className="flex gap-1.5">
                {trade.tags.map((tag: string) => (
                  <span key={tag} className="px-2.5 py-1 rounded bg-secondary text-text-secondary text-xs font-medium border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-6 flex-1 text-text-secondary leading-relaxed bg-background/30">
              {trade.notes || "No notes written for this trade."}
            </div>

            {/* Emotional Rating Footer */}
            <div className="p-4 border-t border-white/5 bg-secondary flex items-center justify-between text-sm">
              <span className="text-text-secondary font-medium">Trade Execution Quality</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                   <div key={star} className={`w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold text-xs ${
                     star <= trade.emotionalRating ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-background border border-white/5 text-text-secondary'
                   }`}>
                     {star}
                   </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl border border-white/5 p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold font-heading text-lg flex items-center gap-2">
                 <ImageIcon className="w-5 h-5 text-accent" /> Screenshots
              </h3>
              <button className="text-sm text-accent hover:text-accent-blue2 transition-colors">Add Image</button>
            </div>
            
            {trade.screenshots && trade.screenshots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trade.screenshots.map((img: string, i: number) => (
                  <div key={i} className="aspect-video rounded-xl border border-white/10 overflow-hidden relative group cursor-zoom-in group">
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                       <span className="text-white font-medium text-sm drop-shadow-md">View Fullscreen</span>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="Trade Screenshot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            ) : (
               <div className="w-full h-40 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-text-secondary hover:bg-white/5 transition-colors cursor-pointer">
                 <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                 <p className="text-sm">No screenshots attached.</p>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
