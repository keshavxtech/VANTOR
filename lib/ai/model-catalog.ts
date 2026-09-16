import type { AIProvider } from "@/lib/ai/types";

export interface AIModelOption {
  id: string;
  name: string;
  provider: AIProvider;
  contextWindow: string;
}

export const AI_MODEL_CATALOG: AIModelOption[] = [
  { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash", provider: "gemini", contextWindow: "1M" },
  { id: "gpt-5.6-luna", name: "GPT-5.6 Luna", provider: "openai", contextWindow: "1.05M" },
  { id: "claude-sonnet-5", name: "Claude Sonnet 5", provider: "anthropic", contextWindow: "Provider catalog" },
];

export function findAIModel(value: string): AIModelOption | undefined {
  const normalized = value.trim().toLowerCase();
  return AI_MODEL_CATALOG.find((model) => model.id.toLowerCase() === normalized || model.name.toLowerCase() === normalized);
}
