import { wrapTraced, traced as braintrustTraced } from 'braintrust';
import { getBraintrustLogger } from './client';

// Type for Braintrust span object
interface BraintrustSpan {
  log(data: {
    input?: unknown;
    output?: unknown;
    metadata?: Record<string, unknown>;
    tags?: string[];
  }): void;
}

/**
 * Wraps an async function with Braintrust tracing for automatic IO tracking
 * Best for functions that make OpenAI calls or other instrumented operations
 * 
 * Usage: const tracedFn = traced('functionName', async (args) => { ... });
 */
export function traced<T extends (...args: never[]) => Promise<unknown>>(
  name: string,
  fn: T
): T {
  const logger = getBraintrustLogger();
  
  if (!logger) {
    // If no logger, return the original function
    return fn;
  }
  
  try {
    // wrapTraced with default asyncFlush: true returns the same function type
    return wrapTraced(fn, { name, asyncFlush: true });
  } catch (error) {
    console.error('Failed to wrap function with tracing:', error);
    return fn;
  }
}

/**
 * Wraps a function with Braintrust tracing and provides direct span access
 * Use this when you need to add custom metadata, tags, or log events
 * 
 * Usage: 
 * const fn = tracedWithSpan('functionName', async (span, arg1, arg2) => {
 *   span.log({ metadata: { key: 'value' } });
 *   return result;
 * });
 */
export function tracedWithSpan<Args extends unknown[], Result>(
  name: string,
  fn: (span: BraintrustSpan | null, ...args: Args) => Promise<Result>
): (...args: Args) => Promise<Result> {
  const logger = getBraintrustLogger();
  
  if (!logger) {
    // If no logger, return wrapper that calls fn without span
    return async (...args: Args) => fn(null, ...args);
  }
  
  try {
    // Use braintrust's traced() for callback-based span access
    return async (...args: Args) => {
      return braintrustTraced(
        async (span) => fn(span as BraintrustSpan, ...args),
        { name }
      );
    };
  } catch (error) {
    console.error('Failed to wrap function with span tracing:', error);
    return async (...args: Args) => fn(null, ...args);
  }
}

/**
 * Example: Traced message processing function with custom metadata
 * Demonstrates how to use tracedWithSpan for adding custom logging
 */
export const tracedMessageProcessing = tracedWithSpan(
  'processMessage',
  async (span, conversationId: string, message: string) => {
    // Add custom metadata to the span
    if (span) {
      span.log({
        metadata: {
          conversationId,
          messageLength: message.length,
        },
        tags: ['message-processing', 'chat'],
      });
    }
    
    return { conversationId, message };
  }
);
