"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

interface DataPoint {
  session: string;
  winRate: number; // percentage 0-100
  trades: number;
}

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"];

export function PieChartSession({ data }: { data?: DataPoint[] }) {
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    // Mock data
    return [
      { session: "London", winRate: 72, trades: 65 },
      { session: "New York", winRate: 64, trades: 45 },
      { session: "Asian", winRate: 45, trades: 20 },
      { session: "Overlap", winRate: 58, trades: 12 },
    ];
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-recharts-tooltip">
          <p className="font-bold mb-1" style={{ color: payload[0].color }}>{data.session} Session</p>
          <p className="text-sm text-text-secondary mb-1">Win Rate <span className="text-foreground font-bold">{data.winRate}%</span></p>
          <p className="text-sm text-text-secondary">Trades <span className="text-foreground font-bold">{data.trades}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="trades"
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value, entry: any) => <span className="text-text-secondary text-sm ml-1">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
