import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, AlertTriangle, AlertCircle, Info, Stethoscope, Activity, CheckCircle2, Loader2, Check } from 'lucide-react';
import { type AIInsight } from '../hooks/useChat';
import { cn } from '../lib/utils';

interface AIInsightPanelProps {
  insight: AIInsight | null;
  className?: string;
  onExecute?: (action: string) => void;
}

export function AIInsightPanel({ insight, className, onExecute }: AIInsightPanelProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false);

  useEffect(() => {
    setIsExecuted(false);
  }, [insight]);

  const handleExecute = () => {
    if (isExecuted) return;
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setIsExecuted(true);
      if (onExecute && insight) {
        onExecute(insight.action);
      }
    }, 1500);
  };

  
  if (!insight) {
    return (
      <div className={cn("w-80 bg-zinc-950 border-l border-zinc-800 p-6 hidden lg:flex flex-col", className)}>
        <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider mb-6">Triage Insights</h2>
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
          <Activity className="w-10 h-10 mb-4 text-zinc-500" />
          <p className="text-sm text-zinc-400">Waiting for query to begin triage analysis...</p>
        </div>
      </div>
    );
  }

  const getUrgencyConfig = (urgency: string) => {
    switch(urgency.toLowerCase()) {
      case 'emergency': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: ShieldAlert };
      case 'high': return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertTriangle };
      case 'medium': return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: AlertCircle };
      default: return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Info };
    }
  };

  const config = getUrgencyConfig(insight.urgency);
  const UrgencyIcon = config.icon;

  return (
    <div className={cn("w-80 bg-zinc-950 border-l border-zinc-800 p-5 hidden lg:flex flex-col h-full overflow-y-auto", className)}>
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-5">AI Triage Insights</h2>
      
      <motion.div 
        key={insight.urgency} // Re-animate on change
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        {/* Urgency Badge */}
        <div className={cn("p-4 rounded-xl border flex items-start gap-3 backdrop-blur-sm", config.bg, config.border)}>
          <UrgencyIcon className={cn("w-5 h-5 shrink-0 mt-0.5", config.color)} />
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-wide mb-1", config.color)}>
              {insight.urgency} Urgency
            </p>
            <p className="text-sm text-zinc-300 font-medium">
              {insight.intent}
            </p>
          </div>
        </div>

        {/* Risk Notes */}
        {insight.risk_notes && (
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
             <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-200">Clinical / Risk Notes</h3>
             </div>
             <p className="text-xs text-zinc-400 leading-relaxed">
               {insight.risk_notes}
             </p>
          </div>
        )}

        {/* Suggested Action */}
         <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
             <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-200">Suggested Action</h3>
             </div>
             <p className="text-sm text-zinc-300 mb-4 bg-zinc-950 p-3 rounded-lg border border-zinc-800/50">
               {insight.action}
             </p>
             <button 
               onClick={handleExecute}
               disabled={isExecuting || isExecuted}
               className={cn(
                 "w-full py-2 text-sm font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2",
                 isExecuted 
                   ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/20" 
                   : "bg-zinc-100 hover:bg-white text-zinc-900",
                 isExecuting && "opacity-80 cursor-not-allowed"
               )}
             >
               {isExecuting ? (
                 <>
                   <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                   Executing...
                 </>
               ) : isExecuted ? (
                 <>
                   <Check className="w-4 h-4 shrink-0" />
                   Action Executed
                 </>
               ) : (
                 "Execute Action"
               )}
             </button>
          </div>

      </motion.div>
    </div>
  );
}
