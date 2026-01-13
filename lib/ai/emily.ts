import type { AgentConfig } from '@/types/agent';
import { getSystemPrompt } from './prompts';

export function getEmilyConfig(): AgentConfig {
  return {
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    systemPrompt: getSystemPrompt(),
    temperature: 1,
    maxTurns: 50,
  };
}
