import React, { useState, useRef, useEffect } from 'react';
import { SendHorizonal } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { type Message } from '../hooks/useChat';
import { motion } from 'motion/react';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  onSend: (text: string) => void;
}

export function ChatWindow({ messages, isTyping, onSend }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 max-h-screen relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <h2 className="text-xl font-medium text-zinc-100 mb-2">How can MediAssist help today?</h2>
            <p className="text-sm text-zinc-400 max-w-sm">
              Describe symptoms, register a volunteer, or ask medical queries.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-zinc-500 text-sm py-2 pl-1"
              >
                <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900 shrink-0">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
                <span>AI is thinking...</span>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-950 border-t border-zinc-800 relative z-10 w-full max-w-4xl mx-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-zinc-700 focus-within:border-zinc-700 transition-all shadow-sm"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none py-4 pl-4 pr-12 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg transition-colors flex items-center justify-center"
          >
             <SendHorizonal className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-xs text-zinc-600 mt-3 font-medium">
          MediAssist AI can make mistakes. Consider verifying critical medical advice.
        </p>
      </div>
    </div>
  );
}
