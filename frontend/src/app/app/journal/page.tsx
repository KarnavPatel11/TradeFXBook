"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { api } from "@/lib/api";
import { 
  Filter, 
  Search, 
  Plus, 
  MoreHorizontal, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Image as ImageIcon
} from "lucide-react";
import { AddTradeDialog } from "@/components/journal/AddTradeDialog";

interface Trade {
  id: string;
  ticketId: string;
  symbol: string;
  type: "BUY" | "SELL";
  openTime: string;
  closeTime: string | null;
  volume: number;
  openPrice: number;
  closePrice: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  netPnl: number;
  commission: number;
  swap: number;
  status: "OPEN" | "CLOSED";
  tags: string[];
}

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTrades();
  }, [page]);

  const fetchTrades = async () => {
    setIsLoading(true);
    try {
      // Add query params as needed: ?page=${page}&limit=20
      const res = await api.get(`/trades?page=${page}&limit=20`);
      // Simulating API mapping if needed, otherwise just set
      setTrades(res.data.data.trades || []);
      setTotalPages(res.data.data.pagination?.pages || 1);
    } catch (error) {
      console.error("Failed to fetch trades", error);
      // Fallback mock data for UI visual check
      setTrades([
        { id: "1", ticketId: "948271", symbol: "EURUSD", type: "BUY", openTime: new Date().toISOString(), closeTime: new Date().toISOString(), volume: 1.0, openPrice: 1.0500, closePrice: 1.0550, stopLoss: 1.0450, takeProfit: 1.0600, netPnl: 500.00, commission: -7.00, swap: 0, status: "CLOSED", tags: ["Trend", "London Session"] },
        { id: "2", ticketId: "948272", symbol: "XAUUSD", type: "SELL", openTime: new Date().toISOString(), closeTime: new Date().toISOString(), volume: 0.5, openPrice: 2020.50, closePrice: 2025.00, stopLoss: 2030.00, takeProfit: 2000.00, netPnl: -225.00, commission: -3.50, swap: -1.2, status: "CLOSED", tags: ["Counter Trend"] },
        { id: "3", ticketId: "948273", symbol: "GBPUSD", type: "BUY", openTime: new Date().toISOString(), closeTime: null, volume: 2.0, openPrice: 1.2600, closePrice: null, stopLoss: 1.2550, takeProfit: 1.2800, netPnl: 140.20, commission: -14.00, swap: 0, status: "OPEN", tags: ["Breakout"] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`px-2 py-1 rounded text-xs font-bold ${
      status === "OPEN" ? "bg-accent-blue2/20 text-accent-blue2 border border-accent-blue2/30" : "bg-white/5 text-text-secondary border border-white/10"
    }`}>
      {status}
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Trade Journal</h1>
          <p className="text-text-secondary text-sm">Review, tag, and analyze your individual trades.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4 text-text-secondary" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <AddTradeDialog />
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-text-secondary group-focus-within:text-accent transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search by symbol, ticket ID, or tag..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent transition-all text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select className="bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent">
            <option value="">All Accounts</option>
            <option value="1">Apex Funded</option>
            <option value="2">ICMarkets Live</option>
          </select>
          <select className="bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent">
            <option value="">Status: All</option>
            <option value="CLOSED">Closed Only</option>
            <option value="OPEN">Open Only</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors">
            <Filter className="w-4 h-4 text-text-secondary" />
            More Filters
          </button>
        </div>
      </div>

      {/* Journal Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-text-secondary border-b border-white/10 uppercase text-xs tracking-wider">
              <tr>
                <th className="py-4 px-6 font-medium">Ticket / Pair</th>
                <th className="py-4 px-6 font-medium">Type</th>
                <th className="py-4 px-6 font-medium">Open Time</th>
                <th className="py-4 px-6 font-medium">Prices (O/C)</th>
                <th className="py-4 px-6 font-medium">Size</th>
                <th className="py-4 px-6 font-medium">Tags</th>
                <th className="py-4 px-6 font-medium text-right">Net P&L</th>
                <th className="py-4 px-4 font-medium text-center"></th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-secondary">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-8 h-8 rounded-full border-2 border-accent border-r-transparent animate-spin" />
                      Loading trades...
                    </div>
                  </td>
                </tr>
              ) : trades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-text-secondary">
                    No trades found matching your criteria.
                  </td>
                </tr>
              ) : (
                trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-bold text-base flex items-center gap-2">
                        {trade.symbol}
                        <StatusBadge status={trade.status} />
                      </div>
                      <div className="text-xs text-text-secondary mt-0.5">#{trade.ticketId}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        trade.type === "BUY" ? "bg-success/10 text-success" : "bg-red/10 text-red"
                      }`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-text-secondary">
                      <div>{formatDateTime(trade.openTime)}</div>
                      {trade.closeTime && <div className="text-xs opacity-60 mt-0.5">{formatDateTime(trade.closeTime)}</div>}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs">
                      <div className="text-text-secondary">Open: <span className="text-foreground">{trade.openPrice}</span></div>
                      {trade.closePrice && <div>Close: <span className="text-foreground">{trade.closePrice}</span></div>}
                    </td>
                    <td className="py-4 px-6 font-mono">
                      {trade.volume.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-1 flex-wrap max-w-[150px]">
                        {trade.tags.length > 0 ? trade.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded bg-tertiary text-text-secondary text-[10px] border border-white/5">
                            {tag}
                          </span>
                        )) : (
                          <span className="text-text-secondary text-xs italic opacity-50">No tags</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className={`font-bold flex items-center justify-end gap-1 text-base ${
                        trade.netPnl >= 0 ? "text-success" : "text-red"
                      }`}>
                        {trade.netPnl >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {formatCurrency(Math.abs(trade.netPnl))}
                      </div>
                      <div className="text-xs text-text-secondary mt-0.5 flex justify-end gap-2">
                         {trade.commission !== 0 && <span>Com: {trade.commission.toFixed(2)}</span>}
                         {trade.swap !== 0 && <span>Swp: {trade.swap.toFixed(2)}</span>}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-end gap-2">
                         <button className="p-1.5 rounded-lg hover:bg-white/10 text-text-secondary hover:text-white transition-colors" title="View Screenshots">
                           <ImageIcon className="w-4 h-4" />
                         </button>
                         <button className="p-1.5 rounded-lg hover:bg-white/10 text-text-secondary hover:text-white transition-colors">
                           <MoreHorizontal className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              Showing page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded bg-secondary border border-white/10 disabled:opacity-50 hover:bg-white/5 transition-colors"
              >
                Previous
              </button>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded bg-secondary border border-white/10 disabled:opacity-50 hover:bg-white/5 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
