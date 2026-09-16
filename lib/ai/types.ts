export type AIProvider = "gemini" | "openai" | "anthropic";

export interface GenerateRequest {
  provider: AIProvider;
  model: string;
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GenerateUsage {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export interface GenerateResponse {
  text: string;
  provider: AIProvider;
  model: string;
  latencyMs: number;
  usage: GenerateUsage;
}

export interface AIProviderClient {
  generate(request: GenerateRequest): Promise<GenerateResponse>;
}
