import { NextResponse } from "next/server";
import { generateWithAI, resolveProvider } from "@/lib/ai";
import { AIProviderError } from "@/lib/ai/errors";
import type { AIProvider } from "@/lib/ai/types";

export const runtime = "nodejs";

const validProviders: AIProvider[] = ["gemini", "openai", "anthropic"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userPrompt = typeof body?.userPrompt === "string" ? body.userPrompt.trim() : "";
    const model = typeof body?.model === "string" && body.model.trim() ? body.model.trim() : "gemini-3.6-flash";
    const requestedProvider = typeof body?.provider === "string" ? body.provider : undefined;
    const provider = validProviders.includes(requestedProvider as AIProvider)
      ? requestedProvider as AIProvider
      : resolveProvider(model);

    if (!userPrompt) return NextResponse.json({ error: "userPrompt is required." }, { status: 400 });

    const result = await generateWithAI({
      provider,
      model,
      systemPrompt: typeof body?.systemPrompt === "string" ? body.systemPrompt : undefined,
      userPrompt,
      temperature: typeof body?.temperature === "number" ? body.temperature : undefined,
      maxOutputTokens: typeof body?.maxOutputTokens === "number" ? body.maxOutputTokens : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AIProviderError) {
      return NextResponse.json({ error: error.message, provider: error.provider }, { status: error.status && error.status >= 400 ? error.status : 503 });
    }
    console.error("VANTOR AI generation error", error);
    return NextResponse.json({ error: "AI generation failed unexpectedly." }, { status: 500 });
  }
}
