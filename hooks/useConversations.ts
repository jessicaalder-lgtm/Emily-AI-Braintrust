'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Conversation } from '@/types/chat';

interface UseConversationsReturn {
  conversations: Conversation[];
  createConversation: (title?: string) => Promise<Conversation | null>;
  deleteConversation: (id: string) => Promise<void>;
  isLoading: boolean;
  refreshConversations: () => Promise<void>;
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const refreshConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/conversations');
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      // Convert date strings to Date objects
      const conversationsWithDates = data.map((conv: { id: string; title: string; createdAt: string; updatedAt: string }) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
      }));
      setConversations(conversationsWithDates);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load conversations on mount
  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);
  
  const createConversation = useCallback(async (title?: string): Promise<Conversation | null> => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title || 'New Conversation' }),
      });
      
      if (!response.ok) throw new Error('Failed to create conversation');
      
      const newConversation = await response.json();
      const conversationWithDates = {
        ...newConversation,
        createdAt: new Date(newConversation.createdAt),
        updatedAt: new Date(newConversation.updatedAt),
      };
      
      setConversations(prev => [conversationWithDates, ...prev]);
      return conversationWithDates;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }, []);
  
  const deleteConversation = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/conversations?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete conversation');
      
      setConversations(prev => prev.filter(conv => conv.id !== id));
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }, []);
  
  return {
    conversations,
    createConversation,
    deleteConversation,
    isLoading,
    refreshConversations,
  };
}
