'use client';

import { useState, useEffect } from 'react';
import { useConversations } from '@/hooks/useConversations';
import Sidebar from '@/components/sidebar/Sidebar';
import ChatContainer from '@/components/chat/ChatContainer';

export default function Home() {
  const { conversations, createConversation, deleteConversation, isLoading } = useConversations();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  // Auto-create first conversation and set it active
  useEffect(() => {
    const initializeApp = async () => {
      if (!isLoading && conversations.length === 0) {
        const newConv = await createConversation('Welcome to Emily AI');
        if (newConv) {
          setActiveConversationId(newConv.id);
        }
      } else if (conversations.length > 0 && !activeConversationId) {
        setActiveConversationId(conversations[0].id);
      }
    };
    
    initializeApp();
  }, [conversations, isLoading, activeConversationId, createConversation]);
  
  const handleCreateConversation = async () => {
    const newConv = await createConversation();
    if (newConv) {
      setActiveConversationId(newConv.id);
    }
  };
  
  const handleDeleteConversation = async (id: string) => {
    await deleteConversation(id);
    if (id === activeConversationId) {
      // Switch to another conversation or null
      const remaining = conversations.filter(c => c.id !== id);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
        onCreate={handleCreateConversation}
        onDelete={handleDeleteConversation}
      />
      
      <div className="flex-1 flex flex-col">
        {activeConversationId ? (
          <ChatContainer conversationId={activeConversationId} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-semibold">E</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Welcome to Emily AI</h1>
              <p className="text-gray-400 mb-6">Start a new conversation to begin chatting</p>
              <button
                onClick={handleCreateConversation}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
              >
                Start Chatting
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
