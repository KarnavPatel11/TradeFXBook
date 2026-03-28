"use client";

import { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from "lightweight-charts";

interface BacktestChartProps {
  isPlaying: boolean;
  speed: number;
  onEquityChange: (change: number) => void;
}

export default function BacktestChart({ isPlaying, speed, onEquityChange }: BacktestChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  // Initialize TradingView Lightweight Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor: "rgba(255, 255, 255, 0.5)",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.05)" },
        horzLines: { color: "rgba(255, 255, 255, 0.05)" },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: "rgba(255, 255, 255, 0.2)", width: 1, style: 1 },
        horzLine: { color: "rgba(255, 255, 255, 0.2)", width: 1, style: 1 },
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
    });

    const series = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    // Generate mock initial data
    const mockData: CandlestickData[] = [];
    let time = new Date("2023-01-01T00:00:00Z").getTime() / 1000;
    let c = 1.0500;
    for (let i = 0; i < 100; i++) {
      const o = c;
      const h = o + Math.random() * 0.0050;
      const l = o - Math.random() * 0.0050;
      c = o + (Math.random() - 0.5) * 0.0060;
      mockData.push({
        time: time as Time,
        open: o,
        high: Math.max(o, c, h),
        low: Math.min(o, c, l),
        close: c,
      });
      time += 3600; // 1H
    }
    
    series.setData(mockData);

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // Mock playback simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && seriesRef.current) {
      interval = setInterval(() => {
        const dataLength = seriesRef.current!.data().length;
        const lastData = seriesRef.current!.dataByIndex(dataLength - 1) as CandlestickData;
        const o = lastData ? lastData.close : 1.0500;
        const h = o + Math.random() * 0.0020;
        const l = o - Math.random() * 0.0020;
        const c = o + (Math.random() - 0.5) * 0.0040;
        
        seriesRef.current!.update({
          time: (Number(lastData.time) + 3600) as Time,
          open: o,
          high: Math.max(o, c, h),
          low: Math.min(o, c, l),
          close: c,
        });

        // Wiggle equity
        onEquityChange((Math.random() - 0.5) * 50);

      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, onEquityChange]);

  return <div ref={chartContainerRef} className="flex-1 w-full rounded-2xl overflow-hidden" />;
}
