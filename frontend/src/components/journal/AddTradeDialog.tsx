"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, X, Upload } from "lucide-react";
import { api } from "@/lib/api";

export function AddTradeDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    ticketId: "",
    symbol: "",
    type: "BUY",
    openTime: new Date().toISOString().slice(0, 16),
    volume: "",
    openPrice: "",
    stopLoss: "",
    takeProfit: "",
    status: "OPEN",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app we would parse floats and pass numbers
      await api.post("/trades", {
        ...formData,
        volume: parseFloat(formData.volume),
        openPrice: parseFloat(formData.openPrice),
        stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : null,
        takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : null,
        openTime: new Date(formData.openTime).toISOString(),
      });
      setOpen(false);
      // Might want to trigger a refresh here via callback or Zustand
    } catch (error) {
      console.error("Failed to add trade", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-primary-hover text-white rounded-lg text-sm font-medium shadow-lg glow-blue hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4" />
          Add Trade
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 glass-card border border-white/10 p-6 rounded-3xl shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
            <Dialog.Title className="text-xl font-heading font-bold">Log New Trade</Dialog.Title>
            <Dialog.Description className="text-sm text-text-secondary">
              Manually enter a trade bypassing the broker sync.
            </Dialog.Description>
          </div>

          <Dialog.Close className="absolute right-6 top-6 rounded-sm opacity-70 border border-white/10 bg-white/5 p-1 hover:opacity-100 transition-opacity">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-medium text-text-secondary">Symbol</label>
                <input 
                  required
                  value={formData.symbol}
                  onChange={e => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                  placeholder="EURUSD"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-medium text-text-secondary">Type</label>
                <div className="flex rounded-xl overflow-hidden border border-white/10 p-1 bg-background/50">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: "BUY"})}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${formData.type === "BUY" ? "bg-success text-white" : "text-text-secondary hover:text-white"}`}
                  >
                    BUY
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: "SELL"})}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${formData.type === "SELL" ? "bg-red text-white" : "text-text-secondary hover:text-white"}`}
                  >
                    SELL
                  </button>
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-xs font-medium text-text-secondary">Lots / Volume</label>
                <input 
                  required type="number" step="0.01"
                  value={formData.volume}
                  onChange={e => setFormData({...formData, volume: e.target.value})}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                  placeholder="1.00"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-medium text-text-secondary">Open Time</label>
                <input 
                  required type="datetime-local"
                  value={formData.openTime}
                  onChange={e => setFormData({...formData, openTime: e.target.value})}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent [color-scheme:dark]"
                />
              </div>

              <div className="space-y-2 col-span-2 lg:col-span-1">
                <label className="text-xs font-medium text-text-secondary">Entry Price</label>
                <input 
                  required type="number" step="0.00001"
                  value={formData.openPrice}
                  onChange={e => setFormData({...formData, openPrice: e.target.value})}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                  placeholder="1.08500"
                />
              </div>

              <div className="space-y-2 col-span-2 lg:col-span-1">
                <label className="text-xs font-medium text-text-secondary flex gap-2">Stop Loss <span className="opacity-50 text-[10px]">(Optional)</span></label>
                <input 
                  type="number" step="0.00001"
                  value={formData.stopLoss}
                  onChange={e => setFormData({...formData, stopLoss: e.target.value})}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                  placeholder="0.00000"
                />
              </div>

              <div className="space-y-2 col-span-2 lg:col-span-1">
                <label className="text-xs font-medium text-text-secondary flex gap-2">Take Profit <span className="opacity-50 text-[10px]">(Optional)</span></label>
                <input 
                  type="number" step="0.00001"
                  value={formData.takeProfit}
                  onChange={e => setFormData({...formData, takeProfit: e.target.value})}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                  placeholder="0.00000"
                />
              </div>

              <div className="space-y-2 col-span-2 lg:col-span-1">
                <label className="text-xs font-medium text-text-secondary flex gap-2">Ticket ID <span className="opacity-50 text-[10px]">(Optional)</span></label>
                <input 
                  value={formData.ticketId}
                  onChange={e => setFormData({...formData, ticketId: e.target.value})}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                  placeholder="#123456"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-text-secondary">Trade Notes / Journal</label>
              <textarea 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                rows={4}
                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent resize-y"
                placeholder="Why did you take this trade? What was the setup? How did you feel?"
              />
            </div>

            <div className="space-y-2 text-xs font-medium text-text-secondary border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-pointer group">
               <Upload className="w-6 h-6 mb-2 text-text-secondary group-hover:text-accent transition-colors" />
               <p>Click or drag to <span className="text-accent group-hover:underline">upload screenshots</span></p>
               <p className="opacity-50 mt-1">Supports PNG, JPG (Max 5MB)</p>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setOpen(false)}
                className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl bg-accent hover:bg-primary-hover text-white text-sm font-medium transition-all shadow-lg glow-blue disabled:opacity-70 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-r-transparent animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Trade"
                )}
              </button>
            </div>
          </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
