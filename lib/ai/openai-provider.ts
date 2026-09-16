import { AIProviderError } from "@/lib/ai/errors";
import { AIProviderClient, GenerateRequest, GenerateResponse } from "@/lib/ai/types";

export class OpenAIProvider implements AIProviderClient {
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new AIProviderError("OpenAI is not configured. Add OPENAI_API_KEY on the server.", "openai");

    const started = Date.now();
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
      body: JSON.stringify({
        model: request.model,
        ...(request.systemPrompt ? { instructions: request.systemPrompt } : {}),
        input: request.userPrompt,
        max_output_tokens: request.maxOutputTokens ?? 2048,
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new AIProviderError(data?.error?.message || `OpenAI request failed (${response.status}).`, "openai", response.status);
    }

    const text = typeof data?.output_text === "string"
      ? data.output_text.trim()
      : data?.output?.flatMap((item: { content?: Array<{ type?: string; text?: string }> }) => item.content || [])
          .filter((item: { type?: string }) => item.type === "output_text")
          .map((item: { text?: string }) => item.text || "")
          .join("")
          .trim();

    if (!text) throw new AIProviderError("OpenAI returned an empty response.", "openai", response.status);

    const usage = data?.usage || {};
    return {
      text,
      provider: "openai",
      model: request.model,
      latencyMs: Date.now() - started,
      usage: {
        inputTokens: usage.input_tokens,
        outputTokens: usage.output_tokens,
        totalTokens: usage.total_tokens,
      },
    };
  }
}
