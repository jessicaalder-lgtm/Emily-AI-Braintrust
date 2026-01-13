export interface BraintrustConfig {
  apiKey: string;
  projectName: string;
  enableLogging: boolean;
  enableTracing: boolean;
}

export interface TraceMetadata {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs?: number;
}
