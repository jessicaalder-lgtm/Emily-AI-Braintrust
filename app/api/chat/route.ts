import { NextRequest } from 'next/server';
import { createStreamingResponse } from '@/lib/ai/streaming';
import { buildMessages } from '@/lib/ai/completion';
import { getEmilyConfig } from '@/lib/ai/emily';
import { createMessage, updateConversationTimestamp } from '@/lib/db/schema';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const { conversationId, message } = await request.json();
    
    if (!conversationId || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing conversationId or message' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get Emily's configuration
    const config = getEmilyConfig();
    
    // Save user message to database
    createMessage(conversationId, 'user', message);
    
    // Build message history with system prompt
    const messages = await buildMessages(conversationId, message, config);
    
    // Create streaming response
    const stream = await createStreamingResponse(messages, config);
    
    // Collect the full response in the background to save to database
    const messageId = nanoid();
    let fullContent = '';
    
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        // Forward the chunk to the client
        controller.enqueue(chunk);
        
        // Parse the chunk to accumulate content
        const text = new TextDecoder().decode(chunk);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'text') {
                fullContent += data.content;
              } else if (data.type === 'done') {
                // Save complete assistant message to database
                createMessage(conversationId, 'assistant', fullContent);
                updateConversationTimestamp(conversationId);
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      },
    });
    
    return new Response(stream.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
