import { AIProviderError } from "@/lib/ai/errors";
import { AIProviderClient, GenerateRequest, GenerateResponse } from "@/lib/ai/types";

interface GeminiInteractionStep {
  type?: string;
  content?: Array<{ type?: string; text?: string }>;
}

export class GeminiProvider implements AIProviderClient {
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new AIProviderError(
        "Gemini is not configured. Add GEMINI_API_KEY on the server.",
        "gemini",
      );
    }

    const started = Date.now();

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        cache: "no-store",
        body: JSON.stringify({
          model: request.model || "gemini-3.6-flash",
          input: request.userPrompt,
          ...(request.systemPrompt
            ? { system_instruction: request.systemPrompt }
            : {}),
          store: false,
          generation_config: {
            temperature: Math.max(0, Math.min(request.temperature ?? 0.2, 2)),
            max_output_tokens: request.maxOutputTokens ?? 2048,
          },
        }),
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new AIProviderError(
        data?.error?.message ||
          `Gemini request failed (${response.status}).`,
        "gemini",
        response.status,
      );
    }

    const stepText = Array.isArray(data?.steps)
      ? (data.steps as GeminiInteractionStep[])
          .filter((step) => step.type === "model_output")
          .flatMap((step) => step.content ?? [])
          .filter((content) => content.type === "text" && content.text)
          .map((content) => content.text as string)
          .join("")
          .trim()
      : "";

    const text =
      (typeof data?.output_text === "string"
        ? data.output_text
        : stepText) || "";

    if (!text) {
      throw new AIProviderError(
        "Gemini returned an empty response.",
        "gemini",
        response.status,
      );
    }

    const usage = data?.usage || {};

    return {
      text,
      provider: "gemini",
      model: request.model || "gemini-3.6-flash",
      latencyMs: Date.now() - started,
      usage: {
        inputTokens: usage.total_input_tokens,
        outputTokens: usage.total_output_tokens,
        totalTokens: usage.total_tokens,
      },
    };
  }
}
