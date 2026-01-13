'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Message } from '@/types/chat';

interface UseChatReturn {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;
  isLoading: boolean;
}

export function useChat(conversationId: string): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/messages?conversationId=${conversationId}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error('Error loading messages:', err);
        setError('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;
    
    setError(null);
    setStreamingContent('');
    
    // Add user message optimistically
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId,
      role: 'user',
      content,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Start streaming
    setIsStreaming(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          message: content,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }
      
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'text') {
                accumulatedContent += data.content;
                // Immediately update state - no delays
                setStreamingContent(accumulatedContent);
              } else if (data.type === 'done') {
                // Finalize the message
                const assistantMessage: Message = {
                  id: `msg-${Date.now()}`,
                  conversationId,
                  role: 'assistant',
                  content: accumulatedContent,
                  createdAt: new Date(),
                };
                setMessages(prev => [...prev, assistantMessage]);
                setStreamingContent('');
                setIsStreaming(false);
              } else if (data.type === 'error') {
                setError(data.content);
                setIsStreaming(false);
              }
            } catch (parseError) {
              // Ignore parse errors
              console.error('Parse error:', parseError);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setIsStreaming(false);
    }
  }, [conversationId, isStreaming]);
  
  return {
    messages,
    sendMessage,
    isStreaming,
    streamingContent,
    error,
    isLoading,
  };
}
