"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Server, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Play
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";

interface BrokerAccount {
  id: string;
  name: string;
  broker: string;
  server: string;
  login: string;
  platform: "MT4" | "MT5";
  syncStatus: "ACTIVE" | "ERROR" | "PENDING";
  lastSync: string | null;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<BrokerAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  // Add Account Dialog State
  const [addOpen, setAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    platform: "MT5",
    server: "",
    login: "",
    password: "",
  });

  useEffect(() => {
    // Mock Fetch
    setTimeout(() => {
      setAccounts([
        {
          id: "1",
          name: "Apex 50k Eval",
          broker: "ApexTraderFunding",
          server: "Apex-Server1",
          login: "88992211",
          platform: "MT5",
          syncStatus: "ACTIVE",
          lastSync: new Date().toISOString()
        },
        {
          id: "2",
          name: "Personal Live",
          broker: "ICMarkets",
          server: "ICMarkets-Live24",
          login: "44556677",
          platform: "MT4",
          syncStatus: "ERROR",
          lastSync: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSync = (id: string) => {
    setIsSyncing(id);
    // Mock sync delay
    setTimeout(() => {
      setIsSyncing(null);
      setAccounts(prev => prev.map(acc => 
        acc.id === id ? { ...acc, syncStatus: "ACTIVE", lastSync: new Date().toISOString() } : acc
      ));
    }, 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAccounts([...accounts, {
      id: Math.random().toString(),
      name: formData.name,
      broker: "Unknown",
      server: formData.server,
      login: formData.login,
      platform: formData.platform as "MT4"|"MT5",
      syncStatus: "PENDING",
      lastSync: null
    }]);
    setAddOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Broker Accounts</h1>
          <p className="text-text-secondary text-sm">Connect your MT4/MT5 accounts for automatic trade syncing.</p>
        </div>
        
        <Dialog.Root open={addOpen} onOpenChange={setAddOpen}>
          <Dialog.Trigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-primary-hover text-white rounded-lg text-sm font-medium shadow-lg glow-blue hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center">
              <Plus className="w-4 h-4" />
              Connect Account
            </button>
          </Dialog.Trigger>
          
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 glass-card border border-white/10 p-6 rounded-3xl shadow-2xl duration-200">
              <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
                <Dialog.Title className="text-xl font-heading font-bold">Connect MetaTrader</Dialog.Title>
                <Dialog.Description className="text-sm text-text-secondary">
                  Enter your read-only (investor) credentials. We use MetaApi for secure connections.
                </Dialog.Description>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Account Nickname</label>
                  <input 
                    required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                    placeholder="e.g. FTMO 100k"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Platform</label>
                  <div className="flex rounded-xl overflow-hidden border border-white/10 p-1 bg-background/50">
                    <button type="button" onClick={() => setFormData({...formData, platform: "MT4"})} className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${formData.platform === "MT4" ? "bg-accent text-white" : "text-text-secondary hover:text-white"}`}>MT4</button>
                    <button type="button" onClick={() => setFormData({...formData, platform: "MT5"})} className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${formData.platform === "MT5" ? "bg-accent text-white" : "text-text-secondary hover:text-white"}`}>MT5</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Broker Server</label>
                  <input 
                    required value={formData.server} onChange={e => setFormData({...formData, server: e.target.value})}
                    className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                    placeholder="e.g. FTMO-Server"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-text-secondary">Login (Account No)</label>
                    <input 
                      required value={formData.login} onChange={e => setFormData({...formData, login: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                      placeholder="12345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-text-secondary">Password (Investor)</label>
                    <input 
                      required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-accent hover:bg-primary-hover text-white text-sm font-medium transition-all shadow-lg glow-blue">Connect</button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <div className="h-48 glass-card border border-white/5 rounded-2xl animate-pulse" />
            <div className="h-48 glass-card border border-white/5 rounded-2xl animate-pulse" />
          </>
        ) : accounts.length === 0 ? (
          <div className="col-span-full glass-card p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center">
            <Server className="w-12 h-12 text-text-secondary mb-4 opacity-50" />
            <h3 className="text-lg font-bold font-heading mb-2">No accounts connected</h3>
            <p className="text-text-secondary text-sm max-w-sm">
              Connect your first MetaTrader account to automatically import trading history and track your performance in real-time.
            </p>
          </div>
        ) : (
          accounts.map(acc => (
            <div key={acc.id} className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold font-heading text-lg">{acc.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-text-secondary">{acc.platform}</span>
                  </div>
                  <p className="text-text-secondary text-sm flex items-center gap-2">
                    <Server className="w-4 h-4" /> {acc.server}
                  </p>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${
                  acc.syncStatus === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' : 
                  acc.syncStatus === 'ERROR' ? 'bg-red/10 text-red border-red/20' : 
                  'bg-gold/10 text-gold border-gold/20'
                }`}>
                  {acc.syncStatus === 'ACTIVE' && <CheckCircle2 className="w-3 h-3" />}
                  {acc.syncStatus === 'ERROR' && <AlertCircle className="w-3 h-3" />}
                  {acc.syncStatus === 'PENDING' && <div className="w-3 h-3 rounded-full border-2 border-gold border-r-transparent animate-spin" />}
                  {acc.syncStatus}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-secondary/30 border border-white/5">
                <div>
                  <p className="text-xs text-text-secondary mb-1">Login</p>
                  <p className="font-mono text-sm">{acc.login}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-1">Last Synced</p>
                  <p className="text-sm">
                    {acc.lastSync ? formatDateTime(acc.lastSync) : 'Never'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <button className="text-sm text-red hover:text-red/80 flex items-center gap-1.5 transition-colors">
                  <Trash2 className="w-4 h-4" /> Disconnect
                </button>
                
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
                    Edit
                  </button>
                  <button 
                    onClick={() => handleSync(acc.id)}
                    disabled={isSyncing === acc.id}
                    className="px-4 py-2 bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing === acc.id ? 'animate-spin' : ''}`} />
                    Sync Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
