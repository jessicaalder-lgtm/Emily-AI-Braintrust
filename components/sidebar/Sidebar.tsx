'use client';

import type { Conversation } from '@/types/chat';
import ConversationItem from './ConversationItem';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({ 
  conversations, 
  activeId, 
  onSelect, 
  onCreate, 
  onDelete 
}: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onCreate}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8">
            No conversations yet
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeId}
                onSelect={() => onSelect(conversation.id)}
                onDelete={() => onDelete(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">E</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-100">Emily AI</p>
            <p className="text-xs text-gray-400">Powered by Braintrust</p>
          </div>
        </div>
      </div>
    </div>
  );
}
