export interface AgentConfig {
  model: string;
  systemPrompt: string;
  tools?: ToolDefinition[];
  maxTurns?: number;
  temperature?: number;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  handler: (params: unknown) => Promise<unknown>;
}
