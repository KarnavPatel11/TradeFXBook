"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  CalendarDays
} from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { api } from "@/lib/api";
import dynamic from "next/dynamic";
import { RecentTradesTable } from "@/components/dashboard/RecentTradesTable";

const EquityChart = dynamic(() => import("@/components/dashboard/EquityChart").then(mod => mod.EquityChart), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-accent border-r-transparent animate-spin" />
    </div>
  )
});
import { CalendarHeatmap } from "@/components/dashboard/CalendarHeatmap";

interface DashboardStats {
  todayPnl: number;
  totalPnl: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
  bestTrade: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [equityData, setEquityData] = useState<any[]>([
    { date: "2023-10-01", equity: 10000 },
    { date: "2023-10-05", equity: 10250 },
    { date: "2023-10-10", equity: 10100 },
    { date: "2023-10-15", equity: 10500 },
    { date: "2023-10-20", equity: 10400 },
    { date: "2023-10-25", equity: 10900 },
    { date: "2023-10-31", equity: 11200 },
  ]); // Mock data for now
  
  const [recentTrades, setRecentTrades] = useState<any[]>([
    { id: "1", ticketId: "948271", symbol: "EURUSD", type: "BUY", openTime: new Date().toISOString(), closeTime: new Date().toISOString(), volume: 1.0, netPnl: 125.50 },
    { id: "2", ticketId: "948272", symbol: "XAUUSD", type: "SELL", openTime: new Date().toISOString(), closeTime: new Date().toISOString(), volume: 0.5, netPnl: -45.00 },
    { id: "3", ticketId: "948273", symbol: "GBPUSD", type: "BUY", openTime: new Date().toISOString(), closeTime: new Date().toISOString(), volume: 2.0, netPnl: 340.20 },
  ]); // Mock data for now

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    subvalue, 
    trend, 
    icon: Icon,
    colorClass
  }: { 
    title: string; 
    value: string; 
    subvalue?: string; 
    trend?: 'up' | 'down' | 'neutral'; 
    icon: any;
    colorClass: string;
  }) => (
    <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 ${colorClass} opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity`} />
      
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClass.replace("bg-", "bg-opacity-10 text-")}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'up' ? 'text-success bg-success/10' : 
            trend === 'down' ? 'text-red bg-red/10' : 'text-text-secondary bg-white/5'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : 
             trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
            {subvalue}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-text-secondary text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-heading font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Dashboard Overview</h1>
          <p className="text-text-secondary text-sm">Welcome back. Here's what's happening today.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select className="bg-secondary border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent">
            <option>All Accounts</option>
            <option>Apex Funded (MT5)</option>
            <option>ICMarkets Live (MT4)</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors">
            <CalendarDays className="w-4 h-4 text-text-secondary" />
            This Month
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-secondary/50 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Today's P&L" 
            value={formatCurrency(stats?.todayPnl || 0)} 
            subvalue="+2.4%" 
            trend={stats?.todayPnl && stats.todayPnl >= 0 ? "up" : "down"}
            icon={Activity}
            colorClass="bg-accent"
          />
          <StatCard 
            title="Total Net P&L" 
            value={formatCurrency(stats?.totalPnl || 0)} 
            trend="up"
            subvalue="+14.2%"
            icon={Wallet}
            colorClass="bg-success"
          />
          <StatCard 
            title="Win Rate" 
            value={formatPercent(stats?.winRate || 0)} 
            icon={Target}
            colorClass="bg-gold"
          />
          <StatCard 
            title="Profit Factor" 
            value={(stats?.profitFactor || 0).toFixed(2)} 
            icon={TrendingUp}
            colorClass="bg-accent-blue2"
          />
        </div>
      )}

      {/* Main Grid area for charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/5 h-[400px]">
          <h3 className="font-bold mb-4">Cumulative Equity</h3>
          <div className="h-[300px] w-full mt-4">
            <EquityChart data={equityData} isLoading={isLoading} />
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-2xl border border-white/5 h-[400px] flex flex-col">
          <h3 className="font-bold mb-1">Calendar Heatmap</h3>
          <p className="text-xs text-text-secondary mb-2">Last 90 Days P&L</p>
          <div className="flex-1 w-full min-h-0">
             <CalendarHeatmap data={[]} isLoading={isLoading} />
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
         <div className="p-6 border-b border-white/5 flex justify-between items-center">
           <h3 className="font-bold">Recent Trades</h3>
           <button className="text-sm text-accent hover:text-accent-blue2 transition-colors">View All</button>
         </div>
         <RecentTradesTable trades={recentTrades} isLoading={isLoading} />
      </div>
    </div>
  );
}
