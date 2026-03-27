"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { 
  Menu, 
  Bell, 
  Search, 
  Plus, 
  User, 
  Settings, 
  RefreshCw 
} from "lucide-react";

interface TopbarProps {
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export function Topbar({ mobileOpen, setMobileOpen }: TopbarProps) {
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Mock notifications
  const notifications = [
    { id: 1, text: "AI Report for last week is ready.", time: "10m ago", read: false },
    { id: 2, text: "Your limit order on EURUSD triggered.", time: "2h ago", read: false },
    { id: 3, text: "UmarPunjabi replied to your post.", time: "5h ago", read: true },
  ];

  return (
    <header className="h-16 bg-background/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
      
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-foreground transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search */}
        <div className="hidden md:flex relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-text-secondary group-focus-within:text-accent transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search trades, pairs, or community..." 
            className="w-80 bg-secondary/50 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent transition-all text-white"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Quick Add Trade Button */}
        <button className="hidden sm:flex px-4 py-2 rounded-full bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/20 text-sm font-medium transition-all items-center gap-2 group">
          <Plus className="w-4 h-4" />
          <span>New Journal</span>
        </button>

        <button className="sm:hidden w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-white/10 hidden sm:block mx-1" />

        {/* Sync Status */}
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-text-secondary bg-secondary px-3 py-1.5 rounded-full border border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          MT5 Synced
          <RefreshCw className="w-3 h-3 ml-1 cursor-pointer hover:text-accent transition-colors" />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-10 h-10 rounded-full border border-white/5 bg-secondary flex items-center justify-center text-text-secondary hover:text-foreground transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red ring-2 ring-background" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-dropdown rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <h3 className="font-bold">Notifications</h3>
                <button className="text-xs text-accent hover:text-accent-blue2 transition-colors">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-accent/5' : ''}`}>
                    <p className={`text-sm ${!notif.read ? 'text-foreground font-medium' : 'text-text-secondary'}`}>{notif.text}</p>
                    <p className="text-xs text-text-secondary mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-white/5 bg-secondary/50">
                <Link href="/app/settings/notifications" className="text-sm font-medium text-text-secondary hover:text-foreground transition-colors">
                  View all
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-accent-blue2 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 glass-dropdown rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-white/5">
                <p className="font-bold truncate">{user?.name}</p>
                <p className="text-xs text-text-secondary truncate">{user?.email}</p>
              </div>
              
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-secondary mb-1">Total P&L</p>
                  <p className={`font-bold ${user?.totalPnl && user.totalPnl >= 0 ? "text-success" : "text-red"}`}>
                    {formatCurrency(user?.totalPnl || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-secondary mb-1">Win Rate</p>
                  <p className="font-bold text-accent">{formatPercent(user?.winRate || 0)}</p>
                </div>
              </div>

              <div className="p-2">
                <Link href="/app/settings" className="flex items-center gap-2 p-2 rounded-lg text-sm text-text-secondary hover:text-foreground hover:bg-white/5 transition-colors">
                  <User className="w-4 h-4" /> Profile Details
                </Link>
                <Link href="/app/settings" className="flex items-center gap-2 p-2 rounded-lg text-sm text-text-secondary hover:text-foreground hover:bg-white/5 transition-colors">
                  <Settings className="w-4 h-4" /> Preferences
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
