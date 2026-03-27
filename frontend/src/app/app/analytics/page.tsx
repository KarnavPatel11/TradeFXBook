"use client";

import { useState } from "react";
import { 
  Filter, 
  CalendarDays, 
  Download,
  Activity,
  Target,
  TrendingDown,
  TrendingUp,
  Clock,
  Wallet,
  PieChart as PieChartIcon,
  BarChart4
} from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { BarChartDayOfWeek } from "@/components/analytics/BarChartDayOfWeek";
import { PieChartSession } from "@/components/analytics/PieChartSession";
import { BarChartSymbol } from "@/components/analytics/BarChartSymbol";
import { AreaChartDrawdown } from "@/components/analytics/AreaChartDrawdown";

// Mock Data for Charts
const MOCK_STATS = {
// ... existing Mock Stats ...
  totalTrades: 142,
  winRate: 0.68,
  profitFactor: 2.15,
  longWinRate: 0.72,
  shortWinRate: 0.64,
  averageWin: 345.50,
  averageLoss: -160.20,
  maxDrawdown: -850.00,
  expectancy: 145.20,
  bestTrade: 1250.00,
  worstTrade: -450.00,
};

export default function AnalyticsPage() {
// ... existing code ...
  const [dateRange, setDateRange] = useState("This Month");

  const StatBox = ({ label, value, sub, positive }: { label: string, value: string | number, sub?: string, positive?: boolean }) => (
    <div className="p-4 rounded-2xl bg-secondary/30 border border-white/5 flex flex-col justify-center">
      <span className="text-text-secondary text-xs mb-1 font-medium">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className={`text-xl font-heading font-bold ${positive === true ? 'text-success' : positive === false ? 'text-red' : ''}`}>
          {value}
        </span>
        {sub && <span className="text-xs text-text-secondary">{sub}</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Advanced Analytics</h1>
          <p className="text-text-secondary text-sm">Deep dive into your trading performance metrics.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4 text-text-secondary" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-wrap gap-4 items-center justify-between shadow-sm sticky top-20 z-20">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select className="bg-background/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent">
            <option>All Accounts</option>
            <option>Apex Funded (MT5)</option>
            <option>ICMarkets Live (MT4)</option>
          </select>
          <select 
             className="bg-background/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
             value={dateRange}
             onChange={e => setDateRange(e.target.value)}
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
            <option>All Time</option>
            <option>Custom Range...</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-background/50 hover:bg-white/5 border border-white/10 rounded-lg text-sm transition-colors">
            <Filter className="w-4 h-4 text-text-secondary" />
            More Filters
          </button>
        </div>
        
        <div className="text-sm font-medium px-4 py-2 rounded-lg bg-accent/10 text-accent border border-accent/20">
          Showing 142 Trades
        </div>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatBox label="Total Trades" value={MOCK_STATS.totalTrades} />
        <StatBox label="Win Rate" value={formatPercent(MOCK_STATS.winRate)} positive={MOCK_STATS.winRate > 0.5} />
        <StatBox label="Profit Factor" value={MOCK_STATS.profitFactor.toFixed(2)} positive={MOCK_STATS.profitFactor > 1} />
        <StatBox label="Expectancy" value={formatCurrency(MOCK_STATS.expectancy)} positive={MOCK_STATS.expectancy > 0} />
        <StatBox label="Max Drawdown" value={formatCurrency(MOCK_STATS.maxDrawdown)} positive={false} />
        <StatBox label="Avg RR" value="1:2.1" positive={true} />
        
        <StatBox label="Average Win" value={formatCurrency(MOCK_STATS.averageWin)} positive={true} />
        <StatBox label="Average Loss" value={formatCurrency(MOCK_STATS.averageLoss)} positive={false} />
        <StatBox label="Long Win Rate" value={formatPercent(MOCK_STATS.longWinRate)} sub={`${MOCK_STATS.totalTrades * 0.6} trades`} />
        <StatBox label="Short Win Rate" value={formatPercent(MOCK_STATS.shortWinRate)} sub={`${MOCK_STATS.totalTrades * 0.4} trades`} />
        <StatBox label="Best Trade" value={formatCurrency(MOCK_STATS.bestTrade)} positive={true} />
        <StatBox label="Worst Trade" value={formatCurrency(MOCK_STATS.worstTrade)} positive={false} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* P&L By Day of Week */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 h-[350px] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <BarChart4 className="w-5 h-5 text-accent" />
            <h3 className="font-bold font-heading">P&L by Day of Week</h3>
          </div>
          <div className="flex-1 w-full min-h-0 pt-2">
            <BarChartDayOfWeek />
          </div>
        </div>

        {/* Win Rate by Session */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 h-[350px] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-accent" />
            <h3 className="font-bold font-heading">Performance by Session</h3>
          </div>
          <div className="flex-1 w-full min-h-0">
            <PieChartSession />
          </div>
        </div>

        {/* P&L By Pair */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 h-[350px] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-accent" />
            <h3 className="font-bold font-heading">Net P&L by Symbol</h3>
          </div>
          <div className="flex-1 w-full min-h-0 pt-2">
            <BarChartSymbol />
          </div>
        </div>

        {/* Drawdown Curve */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 h-[350px] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red" />
            <h3 className="font-bold font-heading">Drawdown Curve</h3>
          </div>
          <div className="flex-1 w-full min-h-0 pt-2">
            <AreaChartDrawdown />
          </div>
        </div>

      </div>
    </div>
  );
}
