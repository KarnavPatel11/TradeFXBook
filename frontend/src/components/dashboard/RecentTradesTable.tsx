"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface Trade {
  id: string;
  ticketId: string;
  symbol: string;
  type: "BUY" | "SELL";
  openTime: string;
  closeTime: string | null;
  volume: number;
  netPnl: number;
}

interface RecentTradesTableProps {
  trades: Trade[];
  isLoading?: boolean;
}

export function RecentTradesTable({ trades, isLoading }: RecentTradesTableProps) {
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="w-6 h-6 rounded-full border-2 border-accent border-r-transparent animate-spin" />
      </div>
    );
  }

  if (!trades || trades.length === 0) {
    return (
      <div className="w-full text-center py-8 text-text-secondary">
        <p>No recent trades found.</p>
        <Link href="/app/journal/new" className="text-accent hover:underline mt-2 inline-block">
          Add your first trade
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="text-text-secondary border-b border-white/10 uppercase text-xs tracking-wider">
          <tr>
            <th className="pb-3 px-4 font-medium">Ticket / Pair</th>
            <th className="pb-3 px-4 font-medium">Type</th>
            <th className="pb-3 px-4 font-medium">Open Time</th>
            <th className="pb-3 px-4 font-medium">Lots</th>
            <th className="pb-3 px-4 font-medium text-right">Net P&L</th>
            <th className="pb-3 px-4 font-medium text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {trades.map((trade) => (
            <tr key={trade.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
              <td className="py-3 px-4">
                <div className="font-bold">{trade.symbol}</div>
                <div className="text-xs text-text-secondary">#{trade.ticketId}</div>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  trade.type === "BUY" ? "bg-success/10 text-success" : "bg-red/10 text-red"
                }`}>
                  {trade.type}
                </span>
              </td>
              <td className="py-3 px-4 text-text-secondary">
                {formatDateTime(trade.openTime)}
              </td>
              <td className="py-3 px-4">
                {trade.volume.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-right">
                <div className={`font-bold flex items-center justify-end gap-1 ${
                  trade.netPnl >= 0 ? "text-success" : "text-red"
                }`}>
                  {trade.netPnl >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {formatCurrency(trade.netPnl)}
                </div>
              </td>
              <td className="py-3 px-4 text-center">
                <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
