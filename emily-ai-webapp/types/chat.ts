export interface Message {
  id: string;
  conversationId: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  createdAt: Date;
  metadata?: Record<string, unknown>; // For Braintrust trace IDs, tool calls, etc.
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
