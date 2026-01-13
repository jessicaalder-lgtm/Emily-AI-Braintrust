export interface StreamChunk {
  type: 'text' | 'tool_call' | 'tool_result' | 'done' | 'error';
  content: string;
  metadata?: {
    toolName?: string;
    toolCallId?: string;
    traceId?: string;
  };
}

export interface StreamingState {
  isStreaming: boolean;
  currentMessageId: string | null;
  buffer: string;
  error: string | null;
}
