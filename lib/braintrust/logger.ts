import { getBraintrustLogger } from './client';

/**
 * Custom logging utilities for Braintrust
 * Note: Most logging is automatic via wrapOpenAI, but these can be used for custom events
 */

export function logCustomEvent(
  eventName: string,
  data: {
    input?: unknown;
    output?: unknown;
    metadata?: Record<string, unknown>;
    tags?: string[];
  }
): void {
  const logger = getBraintrustLogger();
  if (!logger) return;
  
  try {
    logger.log({
      input: data.input,
      output: data.output,
      metadata: {
        eventName,
        ...data.metadata,
      },
      tags: data.tags,
    });
  } catch (error) {
    console.error('Failed to log custom event to Braintrust:', error);
  }
}

export function logError(error: Error, context: Record<string, unknown>): void {
  const logger = getBraintrustLogger();
  if (!logger) return;
  
  try {
    logger.log({
      input: context,
      error: error.message,
      metadata: {
        errorType: error.name,
        errorStack: error.stack,
      },
      tags: ['error'],
    });
  } catch (logError) {
    console.error('Failed to log error to Braintrust:', logError);
  }
}
