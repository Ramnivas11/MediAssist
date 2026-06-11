import { useState, useCallback } from 'react';

export type Role = 'user' | 'model';

export type Message = {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
};

export type AIInsight = {
  intent: string;
  urgency: string;
  reply: string;
  action: string;
  risk_notes: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<AIInsight | null>(null);
  
  // Dashboard Metrics
  const [metrics, setMetrics] = useState({
    totalChats: 0,
    emergencyCases: 0,
    volunteerRequests: 0,
    patientSupport: 0
  });

  const sendMessage = useCallback(async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to fetch from API');
      }
      
      const data: AIInsight = await res.json();
      
      setCurrentInsight(data);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply,
        timestamp: new Date()
      }]);

      setMetrics(prev => ({
        ...prev,
        totalChats: prev.totalChats + 1,
        emergencyCases: prev.emergencyCases + (data.urgency === 'Emergency' ? 1 : 0),
        volunteerRequests: prev.volunteerRequests + (data.intent === 'Volunteer Registration' ? 1 : 0),
        patientSupport: prev.patientSupport + (data.intent === 'Patient Support' || data.intent === 'Medical Query' ? 1 : 0)
      }));

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I encountered an error. Please try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentInsight(null);
  }, []);

  const addSystemMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'model',
      text,
      timestamp: new Date()
    }]);
  }, []);

  return {
    messages,
    isTyping,
    currentInsight,
    sendMessage,
    clearChat,
    addSystemMessage,
    metrics
  };
}
