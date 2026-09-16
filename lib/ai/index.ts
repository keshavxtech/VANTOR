import { AnthropicProvider } from "@/lib/ai/anthropic-provider";
import { AIProviderError } from "@/lib/ai/errors";
import { GeminiProvider } from "@/lib/ai/gemini-provider";
import { OpenAIProvider } from "@/lib/ai/openai-provider";
import { AIProvider, GenerateRequest, GenerateResponse } from "@/lib/ai/types";

const providers = {
  gemini: new GeminiProvider(),
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
} as const;

export function isProviderConfigured(provider: AIProvider): boolean {
  if (provider === "gemini") return Boolean(process.env.GEMINI_API_KEY);
  if (provider === "openai") return Boolean(process.env.OPENAI_API_KEY);
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function resolveProvider(model: string): AIProvider {
  const normalized = model.toLowerCase();
  if (normalized.startsWith("gpt-") || normalized.startsWith("o1") || normalized.startsWith("o3") || normalized.startsWith("o4")) return "openai";
  if (normalized.startsWith("claude-")) return "anthropic";
  return "gemini";
}

export async function generateWithAI(request: GenerateRequest): Promise<GenerateResponse> {
  if (!isProviderConfigured(request.provider)) {
    throw new AIProviderError(`${request.provider} provider is not configured. No API call was made.`, request.provider);
  }
  return providers[request.provider].generate(request);
}

export { type AIProvider, type GenerateRequest, type GenerateResponse } from "@/lib/ai/types";
