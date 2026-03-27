"use client";

import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
  tradeNumber: number;
  drawdown: number;
}

export function AreaChartDrawdown({ data }: { data?: DataPoint[] }) {
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    // Walk down
    let dd = 0;
    return Array.from({ length: 50 }).map((_, i) => {
      dd = dd - Math.random() * 50;
      if (Math.random() > 0.7) dd = dd + Math.random() * 80;
      if (dd > 0) dd = 0;
      
      return {
        tradeNumber: i + 1,
        drawdown: dd
      };
    });
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--red)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--red)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
        <XAxis 
          dataKey="tradeNumber" 
          stroke="var(--text-secondary)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dy={10}
          tickFormatter={(val) => `#${val}`}
        />
        <YAxis 
          tickFormatter={(val) => `$${val}`}
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
                <div className="custom-recharts-tooltip border-red/20 bg-background/90 text-red">
                  <p className="text-text-secondary text-xs mb-1">Trade #{label}</p>
                  <p className="font-bold text-lg">
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
          dataKey="drawdown"
          stroke="var(--red)"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorDrawdown)"
          activeDot={{ r: 6, strokeWidth: 0, fill: "var(--red)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
