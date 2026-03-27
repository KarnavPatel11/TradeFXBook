"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  LayoutDashboard, 
  BookOpen, 
  LineChart, 
  Settings, 
  History, 
  MessageSquare, 
  Trophy, 
  BrainCircuit, 
  Calendar,
  LogOut,
  ChevronLeft
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const navItems = [
    { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
    { name: "Trades & Journal", href: "/app/journal", icon: BookOpen },
    { name: "Analytics", href: "/app/analytics", icon: LineChart },
    { name: "Backtesting", href: "/app/backtest", icon: History },
    { name: "AI Reports", href: "/app/reports", icon: BrainCircuit },
  ];

  const communityItems = [
    { name: "Traders Lounge", href: "/app/community", icon: MessageSquare },
    { name: "Leaderboard", href: "/app/leaderboard", icon: Trophy },
    { name: "Economic Calendar", href: "/app/calendar", icon: Calendar },
  ];

  const bottomItems = [
    { name: "Settings", href: "/app/settings", icon: Settings },
  ];

  const NavGroup = ({ items, title }: { items: any[], title?: string }) => (
    <div className="mb-6">
      {title && !collapsed && (
        <h4 className="px-4 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
          {title}
        </h4>
      )}
      {title && collapsed && (
        <div className="w-8 border-b border-white/10 mx-auto mb-4" />
      )}
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                  isActive 
                    ? "bg-accent/15 text-accent" 
                    : "text-text-secondary hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-accent" />
                )}
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-accent drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}`} />
                {!collapsed && <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-tertiary text-foreground text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
                    {item.name}
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen bg-secondary border-r border-white/5 z-50 flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header / Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
          <Link href="/app/dashboard" className="flex items-center gap-2 overflow-hidden flex-1">
            <div className={`w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 ${!collapsed && "glow-blue"}`}>
              <Activity className="w-5 h-5 text-accent" />
            </div>
            {!collapsed && (
              <span className="font-heading font-bold text-lg tracking-tight text-foreground truncate">
                TradeFXBook
              </span>
            )}
          </Link>

          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-6 h-6 rounded border border-white/10 bg-background items-center justify-center text-text-secondary hover:text-foreground transition-colors absolute -right-3 top-5 z-10"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar">
          <NavGroup items={navItems} />
          <NavGroup items={communityItems} title="Community" />
          <NavGroup items={bottomItems} title="System" />
        </div>

        {/* Footer / User Area */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <button
            onClick={() => logout()}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red hover:bg-red/10 transition-colors group relative ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
            {!collapsed && <span className="font-medium text-sm">Logout</span>}
            
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-tertiary text-red text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
