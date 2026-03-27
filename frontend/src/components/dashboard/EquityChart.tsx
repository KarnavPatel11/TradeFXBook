"use client";

import { useMemo } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EquityDataPoint {
  date: string;
  equity: number;
}

interface EquityChartProps {
  data: EquityDataPoint[];
  isLoading?: boolean;
}

export function EquityChart({ data, isLoading }: EquityChartProps) {
  const minEquity = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return Math.min(...data.map(d => d.equity)) * 0.99; // 1% padding below min
  }, [data]);

  const maxEquity = useMemo(() => {
    if (!data || data.length === 0) return 10000;
    return Math.max(...data.map(d => d.equity)) * 1.01; // 1% padding above max
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-r-transparent animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-text-secondary">
        <p>No equity data available for the selected period.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
        <XAxis 
          dataKey="date" 
          tickFormatter={(val) => formatDate(val, "MMM d")}
          stroke="var(--text-secondary)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis 
          domain={[minEquity, maxEquity]}
          tickFormatter={(val) => `$${val.toLocaleString()}`}
          stroke="var(--text-secondary)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dx={-10}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="custom-recharts-tooltip">
                  <p className="text-text-secondary mb-1">{formatDate(label)}</p>
                  <p className="font-bold text-lg text-accent">
                    {formatCurrency(payload[0].value as number)}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="equity"
          stroke="var(--accent-blue)"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorEquity)"
          activeDot={{ r: 6, strokeWidth: 0, fill: "var(--accent-blue)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
