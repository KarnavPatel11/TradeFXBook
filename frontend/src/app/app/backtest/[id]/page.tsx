"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  CalendarDays,
  Target,
  BarChart4
} from "lucide-react";
import { formatCurrency, formatPercent, formatDateTime } from "@/lib/utils";
import { AreaChartDrawdown } from "@/components/analytics/AreaChartDrawdown";
import { BarChartDayOfWeek } from "@/components/analytics/BarChartDayOfWeek";

export default function BacktestResultsPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Mock Fetch
    setTimeout(() => {
      setSession({
        id: params.id,
        name: "EURUSD Trend Strategy V2",
        symbol: "EURUSD",
        timeframe: "1H",
        startDate: "2023-01-01",
        endDate: "2023-06-30",
        startingBalance: 10000,
        endingBalance: 12450.50,
        winRate: 0.58,
        profitFactor: 1.85,
        totalTrades: 124,
        maxDrawdown: -450.20,
        averageWin: 125.00,
        averageLoss: -65.00,
        expectancy: 42.50,
        status: "COMPLETED",
        createdAt: new Date().toISOString(),
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

  const pnl = session.endingBalance - session.startingBalance;
  const isProfitable = pnl >= 0;

  const StatBox = ({ label, value, positive }: { label: string, value: string | number, positive?: boolean }) => (
    <div className="p-4 rounded-2xl bg-secondary/30 border border-white/5 flex flex-col justify-center">
      <span className="text-text-secondary text-xs mb-1 font-medium">{label}</span>
      <span className={`text-xl font-heading font-bold ${positive === true ? 'text-success' : positive === false ? 'text-red' : ''}`}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-secondary border border-white/5 flex items-center justify-center text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
              {session.name}
            </h1>
            <p className="text-text-secondary text-sm">
              <span className="font-bold text-foreground">{session.symbol}</span> • {session.timeframe} • {session.startDate} to {session.endDate}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4 text-text-secondary" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
         <div className={`absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 ${isProfitable ? 'bg-success' : 'bg-red'}`} />
         
         <div className="relative z-10 flex-1 w-full flex flex-col items-center md:items-start text-center md:text-left">
           <p className="text-text-secondary font-medium mb-1">Total Net Return</p>
           <div className="flex items-baseline gap-3 mb-2">
             <h2 className={`text-5xl font-heading font-bold ${isProfitable ? 'text-success' : 'text-red'}`}>
                {isProfitable ? '+' : '-'}{formatCurrency(Math.abs(pnl))}
             </h2>
             <span className={`text-xl font-bold flex items-center ${isProfitable ? 'text-success' : 'text-red'}`}>
               {isProfitable ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
               {((pnl / session.startingBalance) * 100).toFixed(2)}%
             </span>
           </div>
           <p className="text-sm text-text-secondary">
             Starting Balance: {formatCurrency(session.startingBalance)} ➝ Ending: {formatCurrency(session.endingBalance)}
           </p>
         </div>

         <div className="relative z-10 grid grid-cols-2 gap-x-12 gap-y-6 w-full md:w-auto">
            <div>
               <p className="text-xs text-text-secondary font-medium mb-1">Win Rate</p>
               <p className="text-2xl font-bold">{(session.winRate * 100).toFixed(1)}%</p>
            </div>
            <div>
               <p className="text-xs text-text-secondary font-medium mb-1">Profit Factor</p>
               <p className="text-2xl font-bold">{session.profitFactor.toFixed(2)}</p>
            </div>
            <div>
               <p className="text-xs text-text-secondary font-medium mb-1">Total Trades</p>
               <p className="text-2xl font-bold">{session.totalTrades}</p>
            </div>
            <div>
               <p className="text-xs text-text-secondary font-medium mb-1">Expectancy</p>
               <p className={`text-2xl font-bold ${session.expectancy > 0 ? "text-success" : "text-red"}`}>
                 {formatCurrency(session.expectancy)}
               </p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Average Win" value={formatCurrency(session.averageWin)} positive={true} />
        <StatBox label="Average Loss" value={formatCurrency(session.averageLoss)} positive={false} />
        <StatBox label="Max Drawdown" value={formatCurrency(session.maxDrawdown)} positive={false} />
        <StatBox label="Avg R:R" value="1:1.9" positive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/5 h-[350px] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red" />
            <h3 className="font-bold font-heading">Simulation Drawdown Curve</h3>
          </div>
          <div className="flex-1 w-full min-h-0 pt-2">
            <AreaChartDrawdown />
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-2xl border border-white/5 h-[350px] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <BarChart4 className="w-5 h-5 text-accent" />
            <h3 className="font-bold font-heading">Simulation Day of Week</h3>
          </div>
          <div className="flex-1 w-full min-h-0 pt-2">
            <BarChartDayOfWeek />
          </div>
        </div>
      </div>

    </div>
  );
}
