"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface DataPoint {
  symbol: string;
  pnl: number;
}

export function BarChartSymbol({ data }: { data?: DataPoint[] }) {
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    // Mock data
    return [
      { symbol: "EURUSD", pnl: 1450.50 },
      { symbol: "XAUUSD", pnl: 850.20 },
      { symbol: "GBPUSD", pnl: -320.00 },
      { symbol: "US30", pnl: 1210.40 },
      { symbol: "NAS100", pnl: -145.00 },
    ].sort((a, b) => b.pnl - a.pnl);
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={chartData} 
        layout="vertical"
        margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
        <XAxis 
          type="number"
          tickFormatter={(val) => `$${val}`}
          stroke="var(--text-secondary)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dx={-10}
        />
        <YAxis 
          dataKey="symbol"
          type="category"
          stroke="var(--text-secondary)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.05)" }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const val = payload[0].value as number;
              return (
                <div className="custom-recharts-tooltip">
                  <p className="text-text-secondary mb-1">{label}</p>
                  <p className={`font-bold text-lg ${val >= 0 ? 'text-success' : 'text-red'}`}>
                    {formatCurrency(val)}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="pnl" radius={[0, 4, 4, 0]} maxBarSize={30}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "var(--accent)" : "var(--red)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
