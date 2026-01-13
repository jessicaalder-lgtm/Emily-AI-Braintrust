import type { Message } from '@/types/chat';
import type { AgentConfig } from '@/types/agent';
import { getMessages } from '@/lib/db/schema';
import { getWrappedOpenAI } from '@/lib/braintrust/client';
import OpenAI from 'openai';

// Get Braintrust-wrapped OpenAI client for automatic logging
const openai = getWrappedOpenAI();

export async function buildMessages(
  conversationId: string,
  userMessage: string,
  config: AgentConfig
): Promise<OpenAI.Chat.ChatCompletionMessageParam[]> {
  // Get message history from database
  const history = getMessages(conversationId);
  
  // Build messages array for OpenAI
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  
  // Add system message from history, or use config if none exists
  const systemMessage = history.find(msg => msg.role === 'system');
  if (systemMessage) {
    messages.push({
      role: 'system',
      content: systemMessage.content,
    });
  } else {
    // Fallback to config if no system message in database
    messages.push({
      role: 'system',
      content: config.systemPrompt,
    });
  }
  
  // Add conversation history (skip system messages since we already added it)
  history.forEach(msg => {
    if (msg.role !== 'system') {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  });
  
  // Add new user message
  messages.push({
    role: 'user',
    content: userMessage,
  });
  
  return messages;
}

export async function createCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  config: AgentConfig
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: config.model,
    messages,
    temperature: config.temperature,
    max_completion_tokens: 512,
  });
  
  return completion.choices[0]?.message?.content || '';
}
