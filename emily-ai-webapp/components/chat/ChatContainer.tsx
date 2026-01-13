'use client';

import { useChat } from '@/hooks/useChat';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

interface ChatContainerProps {
  conversationId: string;
}

export default function ChatContainer({ conversationId }: ChatContainerProps) {
  const { messages, sendMessage, isStreaming, streamingContent, error, isLoading } = useChat(conversationId);
  
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">Loading conversation...</div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col h-full">
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 m-4 rounded">
          {error}
        </div>
      )}
      
      <MessageList 
        messages={messages} 
        streamingContent={streamingContent}
        isStreaming={isStreaming}
      />
      
      <ChatInput 
        onSubmit={sendMessage} 
        disabled={isStreaming}
      />
    </div>
  );
}
