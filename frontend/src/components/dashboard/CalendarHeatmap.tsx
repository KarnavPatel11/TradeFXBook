"use client";

import { useMemo } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";

interface HeatmapData {
  date: string;
  pnl: number;
}

interface CalendarHeatmapProps {
  data: HeatmapData[];
  isLoading?: boolean;
}

export function CalendarHeatmap({ data, isLoading }: CalendarHeatmapProps) {
  // Simple mock implementation of a calendar heatmap
  // Real implementation would use D3, Nivo, or a custom CSS grid mapping to actual calendar dates
  
  const days = useMemo(() => {
    if (!data || data.length === 0) {
      // Generate some dummy squares if no data
      return Array.from({ length: 90 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (90 - i));
        return {
          date: d.toISOString().split('T')[0],
          pnl: (Math.random() - 0.4) * 500, // biased slightly positive
        };
      });
    }
    return data;
  }, [data]);

  const getColorClass = (pnl: number) => {
    if (pnl === 0) return "bg-white/5";
    if (pnl > 0) {
      if (pnl > 500) return "bg-success";
      if (pnl > 100) return "bg-success/70";
      return "bg-success/40";
    }
    if (pnl < -500) return "bg-red";
    if (pnl < -100) return "bg-red/70";
    return "bg-red/40";
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-accent border-r-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full pb-6 pt-2 flex flex-col justify-between">
      <TooltipProvider delayDuration={100}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(14px,1fr))] gap-1.5 auto-rows-min mt-4">
          {days.map((day, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div 
                  className={`aspect-square rounded-sm ${getColorClass(day.pnl)} hover:ring-2 hover:ring-white/50 transition-all cursor-crosshair`}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="custom-recharts-tooltip z-50">
                <p className="text-text-secondary text-xs">{formatDate(day.date)}</p>
                <p className={`font-bold text-sm ${day.pnl >= 0 ? 'text-success' : 'text-red'}`}>
                  {formatCurrency(day.pnl)}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <div className="flex items-center justify-end gap-2 text-xs text-text-secondary mt-4">
        <span>Loss</span>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red" />
          <div className="w-3 h-3 rounded-sm bg-red/60" />
          <div className="w-3 h-3 rounded-sm bg-white/5" />
          <div className="w-3 h-3 rounded-sm bg-success/60" />
          <div className="w-3 h-3 rounded-sm bg-success" />
        </div>
        <span>Profit</span>
      </div>
    </div>
  );
}
