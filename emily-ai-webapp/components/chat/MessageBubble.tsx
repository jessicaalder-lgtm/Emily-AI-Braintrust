'use client';

import type { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex items-start space-x-3 mb-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">Y</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">E</span>
          </div>
        )}
      </div>
      <div className={`rounded-lg px-4 py-3 max-w-[80%] ${
        isUser ? 'bg-blue-600' : 'bg-gray-800'
      }`}>
        <p className="text-gray-100 whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
