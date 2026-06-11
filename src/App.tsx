/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { AIInsightPanel } from './components/AIInsightPanel';
import { Dashboard } from './components/Dashboard';
import { RegistrationForm } from './components/RegistrationForm';
import { useChat } from './hooks/useChat';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'forms'>('chat');
  const { messages, isTyping, currentInsight, sendMessage, clearChat, addSystemMessage, metrics } = useChat();

  return (
    <div className="flex h-screen bg-zinc-950 font-sans text-zinc-100 overflow-hidden">
      <Toaster theme="dark" position="top-right" />
      <Sidebar 
        onNewChat={clearChat} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="flex-1 flex flex-col md:flex-row min-w-0">
        {activeTab === 'chat' ? (
          <>
            <ChatWindow 
              messages={messages} 
              isTyping={isTyping} 
              onSend={sendMessage} 
            />
            <AIInsightPanel 
              insight={currentInsight} 
              onExecute={(action) => {
                const actionRefId = Math.random().toString(36).substring(7).toUpperCase();
                addSystemMessage(`System Action Processed: ${action} (Ref: ${actionRefId})`);
                toast.success('Action Executed Successfully', {
                  description: `Executed: "${action}" \nReference ID: ${actionRefId}`,
                });
              }}
            />
          </>
        ) : activeTab === 'dashboard' ? (
          <Dashboard metrics={metrics} />
        ) : (
          <RegistrationForm 
            onSubmit={(msg) => {
              setActiveTab('chat');
              sendMessage(msg);
              toast.success('Form Submitted', { 
                description: 'Your request has been forwarded to the AI Triage assistant.' 
              });
            }} 
          />
        )}
      </main>
    </div>
  );
}

