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
  day: string;
  pnl: number;
}

export function BarChartDayOfWeek({ data }: { data?: DataPoint[] }) {
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    // Mock data if none provided
    return [
      { day: "Mon", pnl: -125.50 },
      { day: "Tue", pnl: 450.20 },
      { day: "Wed", pnl: 810.00 },
      { day: "Thu", pnl: -35.00 },
      { day: "Fri", pnl: 210.40 },
    ];
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
        <XAxis 
          dataKey="day" 
          stroke="var(--text-secondary)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dy={10}
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
        <Bar dataKey="pnl" radius={[4, 4, 4, 4]} maxBarSize={40}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "var(--success)" : "var(--red)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
