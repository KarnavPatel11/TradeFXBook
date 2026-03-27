"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  CalendarDays, 
  Brain,
  Target,
  ShieldAlert,
  Download,
  ThumbsUp,
  ThumbsDown,
  LineChart
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    // Mock Fetch
    setTimeout(() => {
      setReport({
        id: params.id,
        title: "October 2023 Monthly Review",
        type: "MONTHLY",
        period: "Oct 1 - Oct 31, 2023",
        score: 85,
        summary: "Your performance this month reflects a disciplined trader who understands edge. You executed 42 trades with a 58% win rate and an impressive 2.1 profit factor. However, Thursday afternoons consistently proved to be a pain point, where emotional tilt led to outsized losses.",
        sections: [
          {
            title: "Psychology & Discipline",
            icon: "Brain",
            color: "text-accent",
            bg: "bg-accent/10",
            border: "border-accent/20",
            content: "You maintained exceptional patience during the first three weeks. However, after your largest winner on Oct 18th ($1,250), there was a noticeable drop in setup quality for the following 48 hours. This points to 'euphoria trading'.",
            actionable: "Implement a mandatory 24-hour cooling-off period after hitting an outsized winner (>3R)."
          },
          {
            title: "Strategy Execution",
            icon: "Target",
            color: "text-success",
            bg: "bg-success/10",
            border: "border-success/20",
            content: "Your 'London Open Breakout' strategy performed flawlessly (78% WR). But trades marked as 'Counter-Trend Reversal' lost money on aggregate and dragged down your overall expectancy.",
            actionable: "Pause the Counter-Trend strategy for November. Focus size purely on the London Open edge."
          },
          {
            title: "Risk Management",
            icon: "ShieldAlert",
            color: "text-red",
            bg: "bg-red/10",
            border: "border-red/20",
            content: "Stop losses were respected 95% of the time. But on two specific occasions (Oct 12th, Oct 24th), you widened your stop mid-trade, resulting in your two largest losses of the month.",
            actionable: "If you widen a stop loss again, the system should forcefully lock your account for the remainder of the session."
          }
        ],
        stats: {
          tradesAnalyzed: 42,
          mostTraded: "EURUSD",
          bestDay: "Tuesday",
          worstDay: "Thursday"
        },
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      });
      setIsLoading(false);
    }, 800);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-accent border-r-transparent rounded-full animate-spin" />
          <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-accent animate-pulse" />
        </div>
        <p className="text-text-secondary font-medium animate-pulse">Running Institutional Algorithms...</p>
      </div>
    );
  }

  const getIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case "Brain": return <Brain className={className} />;
      case "Target": return <Target className={className} />;
      case "ShieldAlert": return <ShieldAlert className={className} />;
      default: return <LineChart className={className} />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-secondary border border-white/5 flex items-center justify-center text-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4 text-text-secondary" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Card */}
      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
        
        {/* Banner Section */}
        <div className="p-8 md:p-12 border-b border-white/5 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple opacity-10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="px-3 py-1.5 rounded-md text-xs uppercase font-bold tracking-wider bg-white/10 text-white border border-white/10 flex items-center gap-1.5 mb-6">
               <CalendarDays className="w-4 h-4 text-accent" /> {report.type} REPORT • {report.period}
             </div>
             
             <h1 className="text-3xl md:text-5xl font-bold font-heading mb-6">{report.title}</h1>
             
             <div className="flex items-center justify-center gap-8 bg-background/50 backdrop-blur-md border border-white/10 py-4 px-8 rounded-2xl">
                <div className="text-center">
                   <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">AI Score</p>
                   <p className={`text-4xl font-black font-heading ${report.score >= 80 ? 'text-success' : report.score >= 60 ? 'text-gold' : 'text-red'}`}>
                     {report.score}/100
                   </p>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="text-center">
                   <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">Trades Analyzed</p>
                   <p className="text-2xl font-bold font-heading">{report.stats.tradesAnalyzed}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Summary Content */}
        <div className="p-8 md:p-12 text-lg text-text-secondary leading-relaxed space-y-8 bg-secondary/20">
           <p className="first-letter:text-5xl first-letter:font-heading first-letter:font-black first-letter:text-white first-letter:float-left first-letter:mr-2">
             {report.summary}
           </p>

           {/* Quick Stats Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-white/5">
             <div>
                <span className="block text-xs uppercase tracking-wider text-text-secondary font-medium mb-1">Most Traded</span>
                <span className="font-bold text-white">{report.stats.mostTraded}</span>
             </div>
             <div>
                <span className="block text-xs uppercase tracking-wider text-text-secondary font-medium mb-1">Best Day</span>
                <span className="font-bold text-success">{report.stats.bestDay}</span>
             </div>
             <div>
                <span className="block text-xs uppercase tracking-wider text-text-secondary font-medium mb-1">Worst Day</span>
                <span className="font-bold text-red">{report.stats.worstDay}</span>
             </div>
             <div>
                <span className="block text-xs uppercase tracking-wider text-text-secondary font-medium mb-1">Generated</span>
                <span className="font-bold text-white">{formatDateTime(report.createdAt).split(' ')[0]}</span>
             </div>
           </div>

           {/* Dynamic Sections */}
           <div className="space-y-6 pt-4">
             {report.sections.map((section: any, idx: number) => (
                <div key={idx} className="bg-background/80 rounded-2xl border border-white/5 overflow-hidden">
                   <div className={`px-6 py-4 border-b border-white/5 flex items-center gap-3 ${section.bg}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 ${section.color}`}>
                        {getIcon(section.icon, "w-5 h-5")}
                      </div>
                      <h3 className="font-bold font-heading text-lg text-white">{section.title}</h3>
                   </div>
                   
                   <div className="p-6 space-y-4">
                      <p className="text-base text-text-secondary leading-relaxed">
                        {section.content}
                      </p>
                      
                      <div className="p-4 rounded-xl border border-dashed border-white/10 bg-secondary/50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider rounded border border-accent/20 shrink-0">
                          Action Item
                        </div>
                        <p className="text-sm font-medium text-white">{section.actionable}</p>
                      </div>
                   </div>
                </div>
             ))}
           </div>

           {/* Feedback Footer */}
           <div className="pt-8 flex flex-col items-center justify-center text-center">
              <p className="text-sm text-text-secondary mb-4">Was this AI analysis helpful?</p>
              <div className="flex gap-4">
                 <button className="w-12 h-12 rounded-xl border border-white/10 bg-secondary hover:bg-white/5 hover:border-white/20 hover:text-success transition-all flex items-center justify-center group">
                   <ThumbsUp className="w-5 h-5 text-text-secondary group-hover:text-success transition-colors" />
                 </button>
                 <button className="w-12 h-12 rounded-xl border border-white/10 bg-secondary hover:bg-white/5 hover:border-white/20 hover:text-red transition-all flex items-center justify-center group">
                   <ThumbsDown className="w-5 h-5 text-text-secondary group-hover:text-red transition-colors" />
                 </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
