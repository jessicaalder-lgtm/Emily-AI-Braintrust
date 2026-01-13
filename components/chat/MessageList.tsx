'use client';

import type { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import StreamingMessage from './StreamingMessage';
import TypingIndicator from './TypingIndicator';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';

interface MessageListProps {
  messages: Message[];
  streamingContent?: string;
  isStreaming: boolean;
}

export default function MessageList({ messages, streamingContent, isStreaming }: MessageListProps) {
  const scrollRef = useScrollToBottom<HTMLDivElement>(messages.length + (streamingContent || ''));
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isStreaming && !streamingContent && <TypingIndicator isVisible={true} />}
      
      {streamingContent && (
        <StreamingMessage content={streamingContent} isComplete={false} />
      )}
      
      <div ref={scrollRef} />
    </div>
  );
}
