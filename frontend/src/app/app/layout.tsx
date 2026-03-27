"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />
      
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300`}>
        <Topbar 
          mobileOpen={mobileOpen} 
          setMobileOpen={setMobileOpen} 
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background/50 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
