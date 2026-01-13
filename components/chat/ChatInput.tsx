'use client';

import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  
  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSubmit(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  return (
    <div className="border-t border-gray-700 p-4">
      <div className="flex space-x-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Emily..."
          disabled={disabled}
          className="flex-1 bg-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          rows={1}
          style={{
            minHeight: '48px',
            maxHeight: '200px',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
