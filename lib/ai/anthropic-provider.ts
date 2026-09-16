import { AIProviderError } from "@/lib/ai/errors";
import { AIProviderClient, GenerateRequest, GenerateResponse } from "@/lib/ai/types";

export class AnthropicProvider implements AIProviderClient {
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new AIProviderError("Claude is not configured. Add ANTHROPIC_API_KEY on the server.", "anthropic");

    const started = Date.now();
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      cache: "no-store",
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxOutputTokens ?? 2048,
        ...(request.systemPrompt ? { system: request.systemPrompt } : {}),
        messages: [{ role: "user", content: request.userPrompt }],
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new AIProviderError(data?.error?.message || `Claude request failed (${response.status}).`, "anthropic", response.status);
    }

    const text = (data?.content || [])
      .filter((block: { type?: string }) => block.type === "text")
      .map((block: { text?: string }) => block.text || "")
      .join("")
      .trim();

    if (!text) throw new AIProviderError("Claude returned an empty response.", "anthropic", response.status);

    const usage = data?.usage || {};
    return {
      text,
      provider: "anthropic",
      model: request.model,
      latencyMs: Date.now() - started,
      usage: {
        inputTokens: usage.input_tokens,
        outputTokens: usage.output_tokens,
        totalTokens: usage.input_tokens !== undefined && usage.output_tokens !== undefined
          ? usage.input_tokens + usage.output_tokens
          : undefined,
      },
    };
  }
}
