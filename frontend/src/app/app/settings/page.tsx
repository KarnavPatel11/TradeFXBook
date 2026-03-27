"use client";

import { useState } from "react";
import { 
  User, 
  Settings, 
  Lock, 
  Download, 
  Upload, 
  Moon, 
  Sun,
  Monitor,
  Bell,
  Trash2,
  CheckCircle2
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState<"system"|"dark"|"light">("dark");
  const [currency, setCurrency] = useState("USD");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Settings</h1>
          <p className="text-text-secondary text-sm">Manage your account, preferences, and data.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-2 relative">
          <div className="sticky top-20 glass-card p-2 rounded-2xl border border-white/5 space-y-1">
             <button 
               onClick={() => setActiveTab("profile")}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
             >
                <User className="w-4 h-4" /> Profile Info
             </button>
             <button 
               onClick={() => setActiveTab("preferences")}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'preferences' ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
             >
                <Settings className="w-4 h-4" /> Preferences
             </button>
             <button 
               onClick={() => setActiveTab("security")}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
             >
                <Lock className="w-4 h-4" /> Security
             </button>
             <button 
               onClick={() => setActiveTab("data")}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'data' ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
             >
                <Download className="w-4 h-4" /> Data & Export
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* ----- PROFILE TAB ----- */}
          {activeTab === "profile" && (
             <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h2 className="text-xl font-bold font-heading mb-1">Public Profile</h2>
                  <p className="text-sm text-text-secondary">This information will be displayed on the Leaderboard and Community.</p>
                </div>

                <div className="flex items-center gap-6 pb-6 border-b border-white/5">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src="https://i.pravatar.cc/150?u=me" alt="Avatar" className="w-24 h-24 rounded-full border-2 border-white/10" />
                   <div className="space-y-2">
                     <div className="flex gap-2">
                       <button className="px-4 py-2 bg-secondary hover:bg-white/10 border border-white/5 rounded-xl text-sm font-medium transition-colors">
                         Change Avatar
                       </button>
                       <button className="px-4 py-2 hover:bg-white/5 text-red rounded-xl text-sm font-medium transition-colors">
                         Remove
                       </button>
                     </div>
                     <p className="text-xs text-text-secondary">JPG, GIF or PNG. 1MB max.</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Username</label>
                       <input 
                         defaultValue="AlexTheTrader"
                         className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Email Address</label>
                       <input 
                         type="email"
                         readOnly
                         defaultValue="alex@example.com"
                         className="w-full bg-background/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-text-secondary cursor-not-allowed"
                       />
                       <p className="text-[10px] text-text-secondary flex items-center gap-1 mt-1">
                         <CheckCircle2 className="w-3 h-3 text-success" /> Email verified
                       </p>
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Bio</label>
                     <textarea 
                       rows={3}
                       defaultValue="Full-time prop firm funded trader. SMC/ICT concepts."
                       className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent resize-y"
                     />
                   </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                   <button className="px-6 py-3 rounded-xl bg-accent hover:bg-primary-hover text-white text-sm font-medium transition-all shadow-lg glow-blue">
                     Save Profile
                   </button>
                </div>
             </div>
          )}

          {/* ----- PREFERENCES TAB ----- */}
          {activeTab === "preferences" && (
             <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h2 className="text-xl font-bold font-heading mb-1">App Preferences</h2>
                  <p className="text-sm text-text-secondary">Customize your TradeFXBook experience.</p>
                </div>

                <div className="space-y-6 pb-6 border-b border-white/5">
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                     <Monitor className="w-4 h-4 text-text-secondary" /> Theme
                   </h3>
                   
                   <div className="grid grid-cols-3 gap-4">
                      <button 
                        onClick={() => setTheme("dark")} 
                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-background/50 border-white/5 hover:border-white/10 text-text-secondary'}`}
                      >
                         <Moon className="w-6 h-6" />
                         <span className="text-xs font-bold">Dark Mode</span>
                      </button>
                      <button 
                        onClick={() => setTheme("light")} 
                        disabled
                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all opacity-50 cursor-not-allowed ${theme === 'light' ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-background/50 border-white/5 hover:border-white/10 text-text-secondary'}`}
                      >
                         <Sun className="w-6 h-6" />
                         <span className="text-xs font-bold flex flex-col items-center gap-1">
                           Light Mode
                           <span className="px-1.5 rounded-sm bg-red/20 text-red text-[8px] uppercase tracking-wider">Coming Soon</span>
                         </span>
                      </button>
                      <button 
                        onClick={() => setTheme("system")} 
                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-background/50 border-white/5 hover:border-white/10 text-text-secondary'}`}
                      >
                         <Monitor className="w-6 h-6" />
                         <span className="text-xs font-bold">System Default</span>
                      </button>
                   </div>
                </div>

                <div className="space-y-6 pb-6 border-b border-white/5">
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider">Localization</h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Base Currency</label>
                       <select 
                         value={currency} 
                         onChange={e => setCurrency(e.target.value)}
                         className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                       >
                         <option value="USD">USD ($)</option>
                         <option value="EUR">EUR (€)</option>
                         <option value="GBP">GBP (£)</option>
                         <option value="AUD">AUD ($)</option>
                         <option value="CAD">CAD ($)</option>
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Timezone</label>
                       <select 
                         className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                       >
                         <option>UTC - Coordinated Universal Time</option>
                         <option>EST - Eastern Standard Time</option>
                         <option>GMT - Greenwich Mean Time</option>
                       </select>
                     </div>
                   </div>
                </div>
                
                <div className="flex justify-end pt-2">
                   <button className="px-6 py-3 rounded-xl bg-accent hover:bg-primary-hover text-white text-sm font-medium transition-all shadow-lg glow-blue">
                     Save Preferences
                   </button>
                </div>
             </div>
          )}

          {/* ----- SECURITY TAB ----- */}
          {activeTab === "security" && (
             <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h2 className="text-xl font-bold font-heading mb-1">Security Settings</h2>
                  <p className="text-sm text-text-secondary">Keep your account and trading data secure.</p>
                </div>

                <div className="space-y-6 pb-6 border-b border-white/5">
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider">Change Password</h3>
                   
                   <div className="space-y-4 max-w-sm">
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Current Password</label>
                       <input 
                         type="password"
                         className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">New Password</label>
                       <input 
                         type="password"
                         className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Confirm New Password</label>
                       <input 
                         type="password"
                         className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                       />
                     </div>
                     <button className="px-6 py-3 mt-4 rounded-xl bg-secondary hover:bg-white/5 border border-white/10 text-white text-sm font-medium transition-all">
                       Update Password
                     </button>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-sm font-bold text-red uppercase tracking-wider">Danger Zone</h3>
                   
                   <div className="p-6 rounded-2xl border border-red/20 bg-red/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div>
                        <h4 className="font-bold text-red">Delete Account</h4>
                        <p className="text-sm text-text-secondary mt-1">
                          Permanently delete your account and all associated trading data. This action cannot be undone.
                        </p>
                      </div>
                      <button className="px-6 py-3 text-sm font-bold text-white bg-red hover:bg-red/80 rounded-xl transition-colors shrink-0">
                         Delete Account
                      </button>
                   </div>
                </div>
             </div>
          )}

          {/* ----- DATA & EXPORT TAB ----- */}
          {activeTab === "data" && (
             <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h2 className="text-xl font-bold font-heading mb-1">Data Management</h2>
                  <p className="text-sm text-text-secondary">Export your trades to CSV or import history from another platform.</p>
                </div>

                <div className="space-y-6 pb-6 border-b border-white/5">
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider">Export Data</h3>
                   
                   <div className="p-6 rounded-2xl border border-white/5 bg-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div>
                        <h4 className="font-bold">Export All Trades (CSV)</h4>
                        <p className="text-sm text-text-secondary mt-1">
                          Download a complete history of all your synced and manually entered trades as a spreadsheet.
                        </p>
                      </div>
                      <button className="px-6 py-3 text-sm font-bold text-white bg-accent hover:bg-primary-hover rounded-xl shadow-lg glow-blue transition-colors flex items-center gap-2 shrink-0">
                         <Download className="w-4 h-4" /> Export CSV
                      </button>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider">Import Data</h3>
                   
                   <div className="p-6 rounded-2xl border border-dashed border-white/20 bg-background/50 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group py-12">
                      <div className="w-12 h-12 rounded-full bg-secondary border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                         <Upload className="w-6 h-6 text-accent" />
                      </div>
                      <h4 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">Click to Upload CSV</h4>
                      <p className="text-sm text-text-secondary max-w-sm">
                        Import historical trade data exported from standard MT4/MT5 HTML reports or CSV formats.
                      </p>
                   </div>
                </div>

             </div>
          )}

        </div>
      </div>
    </div>
  );
}
