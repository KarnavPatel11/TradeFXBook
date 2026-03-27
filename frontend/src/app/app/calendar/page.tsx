"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/utils";
import { 
  CalendarDays, 
  Clock, 
  Filter, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

// Mock Data
const EVENTS = [
  {
    id: "1",
    time: "2023-10-26T08:30:00Z",
    currency: "USD",
    impact: 3, // 1: Low, 2: Med, 3: High
    title: "Core PCE Price Index m/m",
    actual: "0.3%",
    forecast: "0.3%",
    previous: "0.2%",
  },
  {
    id: "2",
    time: "2023-10-26T08:30:00Z",
    currency: "USD",
    impact: 3,
    title: "Unemployment Claims",
    actual: "210K",
    forecast: "214K",
    previous: "205K",
  },
  {
    id: "3",
    time: "2023-10-26T08:30:00Z",
    currency: "USD",
    impact: 3,
    title: "Advance GDP q/q",
    actual: "4.9%",
    forecast: "4.3%",
    previous: "2.1%",
  },
  {
    id: "4",
    time: "2023-10-26T12:00:00Z",
    currency: "EUR",
    impact: 3,
    title: "ECB Main Refinancing Rate",
    actual: "4.50%",
    forecast: "4.50%",
    previous: "4.50%",
  },
  {
    id: "5",
    time: "2023-10-26T12:30:00Z",
    currency: "EUR",
    impact: 3,
    title: "ECB Press Conference",
    actual: null,
    forecast: null,
    previous: null,
  },
  {
    id: "6",
    time: "2023-10-26T23:30:00Z",
    currency: "JPY",
    impact: 2,
    title: "Tokyo Core CPI y/y",
    actual: null,
    forecast: "2.5%",
    previous: "2.5%",
  },
  {
    id: "7",
    time: "2023-10-27T08:30:00Z",
    currency: "USD",
    impact: 2,
    title: "Core PCE Price Index y/y",
    actual: null,
    forecast: "3.7%",
    previous: "3.9%",
  }
];

export default function CalendarPage() {
  const [filter, setFilter] = useState("high"); // all, med-high, high
  const [dateStr, setDateStr] = useState("Thursday, October 26, 2023");

  const getImpactColor = (impact: number) => {
    if (impact === 3) return "bg-red";
    if (impact === 2) return "bg-gold";
    return "bg-success";
  };

  const renderImpactRating = (impact: number) => {
    return (
      <div className="flex gap-1" title={`${impact === 3 ? 'High' : impact === 2 ? 'Medium' : 'Low'} Impact`}>
        {[1, 2, 3].map(i => (
          <span 
            key={i} 
            className={`w-2 h-2 rounded-full ${i <= impact ? getImpactColor(impact) : 'bg-white/10'}`} 
          />
        ))}
      </div>
    );
  };

  const getActualColor = (actual: string | null, forecast: string | null, preventInverse: boolean = false) => {
    if (!actual || !forecast) return "text-text-secondary";
    const a = parseFloat(actual);
    const f = parseFloat(forecast);
    if (isNaN(a) || isNaN(f)) return "text-text-secondary";
    
    // Simplistic color logic just for demo mockup purposes:
    if (a > f) return preventInverse ? "text-red" : "text-success";
    if (a < f) return preventInverse ? "text-success" : "text-red";
    return "text-text-secondary";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
             <CalendarDays className="w-6 h-6 text-accent" />
             Economic Calendar
          </h1>
          <p className="text-text-secondary text-sm">Track tier-1 fundamental events and news to navigate market volatility.</p>
        </div>
      </div>

      {/* Date & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-card p-2 pr-4 rounded-2xl border border-white/5 shadow-sm sticky top-20 z-20">
         
         <div className="flex items-center">
            <button className="p-3 hover:bg-white/5 rounded-xl transition-colors text-text-secondary hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-6 py-2 text-sm font-bold w-64 text-center">
              {dateStr}
            </div>
            <button className="p-3 hover:bg-white/5 rounded-xl transition-colors text-text-secondary hover:text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="ml-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors hidden sm:block">
              Today
            </button>
         </div>

         <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-text-secondary font-medium uppercase tracking-wider hidden lg:block mr-2">Filter Impact:</span>
            <div className="flex bg-background/50 border border-white/10 rounded-xl p-1 w-full md:w-auto">
               <button 
                 onClick={() => setFilter("all")}
                 className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold transition-all rounded-lg ${filter === 'all' ? 'bg-secondary text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
               >
                 All
               </button>
               <button 
                 onClick={() => setFilter("med-high")}
                 className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold transition-all rounded-lg ${filter === 'med-high' ? 'bg-secondary text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
               >
                 Med / High
               </button>
               <button 
                 onClick={() => setFilter("high")}
                 className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold transition-all rounded-lg ${filter === 'high' ? 'bg-red/20 text-red shadow-md' : 'text-text-secondary hover:text-red'}`}
               >
                 High Only
               </button>
            </div>
            <button className="p-2 bg-secondary hover:bg-white/10 border border-white/10 rounded-xl transition-colors shrink-0">
               <Filter className="w-4 h-4 text-text-secondary" />
            </button>
         </div>

      </div>

      {/* Calendar List */}
      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-secondary/30 text-[10px] uppercase font-bold tracking-wider text-text-secondary">
                <th className="px-6 py-4 w-24">Time</th>
                <th className="px-6 py-4 w-24">Cur</th>
                <th className="px-6 py-4 w-32">Impact</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4 w-28 text-right">Actual</th>
                <th className="px-6 py-4 w-28 text-right">Forecast</th>
                <th className="px-6 py-4 w-28 text-right">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {EVENTS.filter(e => {
                if (filter === 'high') return e.impact === 3;
                if (filter === 'med-high') return e.impact >= 2;
                return true;
              }).map((event) => (
                <tr key={event.id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-text-secondary group-hover:text-white transition-colors flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5 opacity-50" />
                       {event.time.substring(11, 16)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-xs border ${
                      event.currency === 'USD' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      event.currency === 'EUR' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      event.currency === 'GBP' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                      'bg-white/10 text-text-secondary border-white/10'
                    }`}>
                      {event.currency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {renderImpactRating(event.impact)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium group-hover:text-accent transition-colors">{event.title}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold font-mono ${getActualColor(event.actual, event.forecast, event.title.includes("Unemployment"))}`}>
                      {event.actual || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-text-secondary">{event.forecast || "-"}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-text-secondary opacity-60">{event.previous}</span>
                  </td>
                </tr>
              ))}
              
              {/* Empty State if filter hides all */}
              {EVENTS.filter(e => {
                if (filter === 'high') return e.impact === 3;
                if (filter === 'med-high') return e.impact >= 2;
                return true;
              }).length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-secondary">
                    <div className="flex flex-col items-center justify-center">
                       <AlertTriangle className="w-8 h-8 opacity-20 mb-3" />
                       <p className="font-medium">No events found matching your filter criteria.</p>
                       <p className="text-xs mt-1">Try changing the impact filter or date.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
