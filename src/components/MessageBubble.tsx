import { motion } from 'motion/react';
import { Bot, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { type Message } from '../hooks/useChat';

interface MessageBubbleProps {
  key?: string | number;
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.role === 'model';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full mb-6",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "flex max-w-[80%] md:max-w-[70%] gap-3 items-start",
        isAI ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={cn(
          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1",
          isAI ? "bg-zinc-800 border border-zinc-700" : "bg-blue-600"
        )}>
          {isAI ? (
            <Bot className="w-4 h-4 text-zinc-300" />
          ) : (
            <User className="w-4 h-4 text-zinc-100" />
          )}
        </div>
        
        <div className={cn(
          "px-4 py-3 rounded-2xl text-sm leading-relaxed",
          isAI 
            ? "bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-sm shadow-sm" 
            : "bg-blue-600 text-zinc-100 rounded-tr-sm shadow-sm"
        )}>
          {message.text}
        </div>
      </div>
    </motion.div>
  );
}
