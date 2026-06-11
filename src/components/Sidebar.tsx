import { MessageCirclePlus, History, Settings, Bot, HeartPulse, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  onNewChat: () => void;
  className?: string;
  activeTab: 'chat' | 'dashboard' | 'forms';
  setActiveTab: (tab: 'chat' | 'dashboard' | 'forms') => void;
}

export function Sidebar({ onNewChat, className, activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className={cn("w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full", className)}>
      <div className="p-4 flex items-center gap-3 border-b border-zinc-800/60">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <HeartPulse className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-semibold text-zinc-100 font-sans tracking-tight">MediAssist AI</h1>
          <p className="text-xs text-zinc-500 font-light">Pro Edition</p>
        </div>
      </div>
      
      <div className="p-3">
        <button 
          onClick={() => {
            onNewChat();
            setActiveTab('chat');
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors"
        >
          <MessageCirclePlus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 mt-4">Menu</p>
        <button 
          onClick={() => setActiveTab('chat')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
            activeTab === 'chat' 
              ? "bg-zinc-800/50 text-zinc-100 font-medium" 
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
          )}
        >
          <Bot className="w-4 h-4" />
          Triage Chat
        </button>
        <button 
          onClick={() => setActiveTab('forms')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
            activeTab === 'forms' 
              ? "bg-zinc-800/50 text-zinc-100 font-medium" 
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
          )}
        >
          <FileText className="w-4 h-4" />
          Intake Forms
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
            activeTab === 'dashboard' 
              ? "bg-zinc-800/50 text-zinc-100 font-medium" 
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
          )}
        >
          <History className="w-4 h-4" />
          Analytics & Logs
        </button>
      </nav>

      <div className="p-4 border-t border-zinc-800/60">
        <button className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors w-full px-2">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
