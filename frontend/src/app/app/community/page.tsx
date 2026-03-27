"use client";

import { useState } from "react";
import { 
  Hash, 
  Users, 
  Send, 
  Search, 
  Smile, 
  Paperclip,
  TrendingUp,
  LineChart,
  Megaphone,
  MoreVertical
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

// Mock Data
const CHANNELS = [
  { id: 'general', name: 'general', unread: 0, icon: Hash },
  { id: 'announcements', name: 'announcements', unread: 2, icon: Megaphone },
  { id: 'setups', name: 'trade-setups', unread: 15, icon: LineChart },
  { id: 'wins', name: 'wins-only', unread: 0, icon: TrendingUp },
];

const MEMBERS = [
  { id: '1', name: 'AlexTheTrader', role: 'ADMIN', status: 'online', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'PipsCollector', role: 'PRO', status: 'online', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'SarahFX', role: 'MEMBER', status: 'offline', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'LondonSession', role: 'MEMBER', status: 'online', avatar: 'https://i.pravatar.cc/150?u=4' },
];

const INITIAL_MESSAGES = [
  { id: '1', userId: '1', text: 'Welcome to the TradeFXBook community! Make sure to read the rules.', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', userId: '2', text: 'Just caught a massive 1:4 R on GU 🚀', timestamp: new Date(Date.now() - 1800000).toISOString() },
  { id: '3', userId: '4', text: 'Nice! Was looking at that setup too but missed the entry by 2 pips.', timestamp: new Date(Date.now() - 1700000).toISOString() },
];

export default function CommunityPage() {
  const [activeChannel, setActiveChannel] = useState('setups');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [showMembers, setShowMembers] = useState(true);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, {
      id: Date.now().toString(),
      userId: 'me',
      text: input,
      timestamp: new Date().toISOString()
    }]);
    setInput('');
  };

  const getMember = (id: string) => {
    if (id === 'me') return { name: 'You', role: 'MEMBER', avatar: 'https://i.pravatar.cc/150?u=me' };
    return MEMBERS.find(m => m.id === id) || { name: 'Unknown', role: 'MEMBER', avatar: 'https://i.pravatar.cc/150?u=0' };
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-2xl glass-card border border-white/5 overflow-hidden">
      
      {/* Sidebar: Channels */}
      <div className="w-64 bg-secondary/30 border-r border-white/5 flex flex-col hidden md:flex shrink-0">
        <div className="p-4 border-b border-white/5">
          <h2 className="font-bold font-heading text-lg">TradeFXBook</h2>
          <p className="text-xs text-accent">Exclusive Club</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
           <div>
             <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 px-3">Channels</h3>
             <div className="space-y-0.5">
               {CHANNELS.map(ch => (
                 <button 
                   key={ch.id}
                   onClick={() => setActiveChannel(ch.id)}
                   className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                     activeChannel === ch.id ? 'bg-accent/10 text-accent font-medium' : 'text-text-secondary hover:bg-white/5 hover:text-white'
                   }`}
                 >
                   <div className="flex items-center gap-2">
                     <ch.icon className={`w-4 h-4 ${activeChannel === ch.id ? 'text-accent' : 'opacity-60'}`} />
                     {ch.name}
                   </div>
                   {ch.unread > 0 && (
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeChannel === ch.id ? 'bg-accent text-white' : 'bg-white/10 text-white'}`}>
                       {ch.unread}
                     </span>
                   )}
                 </button>
               ))}
             </div>
           </div>
        </div>
        
        {/* Current User Pod */}
        <div className="p-4 bg-background/50 border-t border-white/5 flex items-center gap-3">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img src="https://i.pravatar.cc/150?u=me" alt="You" className="w-10 h-10 rounded-full bg-secondary border border-white/10" />
           <div className="flex-1 min-w-0">
             <p className="text-sm font-bold truncate">You</p>
             <p className="text-xs text-success flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-success" /> Online
             </p>
           </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-background/30 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold font-heading">
              # {CHANNELS.find(c => c.id === activeChannel)?.name || 'channel'}
            </span>
            <span className="text-xs text-text-secondary border-l border-white/10 pl-3 hidden sm:block">
              Discuss your setups and live trades here.
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                placeholder="Search..." 
                className="bg-secondary/50 border border-white/5 w-48 rounded-xl pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-accent" 
              />
            </div>
            <button 
              onClick={() => setShowMembers(!showMembers)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${showMembers ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-white/5 hover:bg-white/10 text-text-secondary border border-white/5'}`}
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-background/10">
           {messages.map(msg => {
             const member = getMember(msg.userId);
             const isMe = msg.userId === 'me';
             
             return (
               <div key={msg.id} className={`flex gap-4 max-w-3xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border border-white/10 shrink-0 mt-1" />
                 
                 <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                   <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                     <span className="text-sm font-bold">{member.name}</span>
                     {!isMe && (
                       <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                         member.role === 'ADMIN' ? 'bg-red/20 text-red' : 
                         member.role === 'PRO' ? 'bg-gold/20 text-gold' : 
                         'bg-white/10 text-text-secondary'
                       }`}>
                         {member.role}
                       </span>
                     )}
                     <span className="text-xs text-text-secondary opacity-60">
                       {formatDateTime(msg.timestamp).split(' ')[1]}
                     </span>
                   </div>
                   
                   <div className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed relative ${
                     isMe ? 'bg-accent text-white rounded-tr-sm' : 'bg-secondary/60 border border-white/5 rounded-tl-sm'
                   }`}>
                     {msg.text}
                   </div>
                 </div>
               </div>
             );
           })}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background/50 border-t border-white/5 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-end gap-2 bg-secondary/50 border border-white/10 rounded-2xl p-2 focus-within:border-accent/50 focus-within:bg-secondary transition-all">
            <button type="button" className="p-2 text-text-secondary hover:text-white transition-colors shrink-0 rounded-xl hover:bg-white/5">
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message #${CHANNELS.find(c => c.id === activeChannel)?.name}...`}
              className="flex-1 bg-transparent border-none px-2 py-2.5 text-[15px] focus:outline-none focus:ring-0 resize-none min-h-[44px]"
            />
            <button type="button" className="p-2 text-text-secondary hover:text-white transition-colors shrink-0 rounded-xl hover:bg-white/5">
              <Smile className="w-5 h-5" />
            </button>
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="p-2.5 bg-accent hover:bg-primary-hover text-white rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-accent shrink-0 shadow-lg shadow-accent/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar: Members Panel */}
      {showMembers && (
        <div className="w-64 bg-secondary/30 border-l border-white/5 p-4 overflow-y-auto custom-scrollbar shrink-0 hidden lg:block animate-in slide-in-from-right-8 duration-300">
          <h3 className="font-bold font-heading mb-6 flex items-center justify-between">
            Members 
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{MEMBERS.length}</span>
          </h3>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Online - 3</p>
              <div className="space-y-3">
                {MEMBERS.filter(m => m.status === 'online').map(m => (
                  <div key={m.id} className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full border border-white/10" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-background" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium group-hover:text-accent transition-colors truncate" style={{
                        color: m.role === 'ADMIN' ? 'var(--red)' : m.role === 'PRO' ? 'var(--gold)' : undefined
                      }}>
                        {m.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Offline - 1</p>
              <div className="space-y-3 opacity-50">
                {MEMBERS.filter(m => m.status === 'offline').map(m => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full border border-white/10" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-text-secondary rounded-full border-2 border-background" />
                    </div>
                    <p className="text-sm font-medium truncate">{m.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
