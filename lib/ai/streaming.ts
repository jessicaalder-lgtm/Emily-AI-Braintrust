import type { AgentConfig } from '@/types/agent';
import { getWrappedOpenAI } from '@/lib/braintrust/client';
import OpenAI from 'openai';

// Get Braintrust-wrapped OpenAI client for automatic logging
const openai = getWrappedOpenAI();

export async function createStreamingResponse(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  config: AgentConfig
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  
  return new ReadableStream({
    async start(controller) {
      try {
        const stream = await openai.chat.completions.create({
          model: config.model,
          messages,
          temperature: config.temperature,
          max_completion_tokens: 512,
          stream: true,
        });
        
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          
          if (content) {
            const data = {
              type: 'text',
              content,
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            );
          }
        }
        
        // Send done event
        const doneData = { type: 'done', content: '' };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(doneData)}\n\n`)
        );
        
        controller.close();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorData = { type: 'error', content: errorMessage };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`)
        );
        controller.close();
      }
    },
  });
}

export function parseStreamChunk(chunk: string): { type: string; content: string } | null {
  try {
    if (chunk.startsWith('data: ')) {
      const jsonStr = chunk.slice(6);
      return JSON.parse(jsonStr);
    }
    return null;
  } catch {
    return null;
  }
}
