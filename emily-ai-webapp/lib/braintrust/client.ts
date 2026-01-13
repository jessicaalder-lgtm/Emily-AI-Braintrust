import { initLogger, wrapOpenAI } from 'braintrust';
import OpenAI from 'openai';

let braintrustLogger: ReturnType<typeof initLogger> | null = null;
let wrappedOpenAI: OpenAI | null = null;

export function initBraintrust() {
  if (braintrustLogger) return braintrustLogger;
  
  const projectName = process.env.BRAINTRUST_PROJECT_NAME || 'jessica-emily-ai';
  const apiKey = process.env.BRAINTRUST_API_KEY;
  
  if (!apiKey) {
    console.warn('BRAINTRUST_API_KEY not set, Braintrust logging disabled');
    return null;
  }
  
  try {
    braintrustLogger = initLogger({ 
      projectName,
      apiKey 
    });
    console.log('Braintrust logger initialized successfully');
    return braintrustLogger;
  } catch (error) {
    console.error('Failed to initialize Braintrust:', error);
    return null;
  }
}

export function getWrappedOpenAI(): OpenAI {
  if (wrappedOpenAI) return wrappedOpenAI;
  
  // Initialize logger first
  initBraintrust();
  
  // Create base OpenAI client
  const baseClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  // Wrap with Braintrust if available
  if (braintrustLogger) {
    wrappedOpenAI = wrapOpenAI(baseClient);
    console.log('OpenAI client wrapped with Braintrust');
  } else {
    wrappedOpenAI = baseClient;
    console.log('Using unwrapped OpenAI client (no Braintrust)');
  }
  
  return wrappedOpenAI;
}

export function getBraintrustLogger() {
  if (!braintrustLogger) {
    return initBraintrust();
  }
  return braintrustLogger;
}
