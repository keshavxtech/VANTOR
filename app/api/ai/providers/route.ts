import { NextResponse } from "next/server";
import { isProviderConfigured } from "@/lib/ai";
import { AI_MODEL_CATALOG } from "@/lib/ai/model-catalog";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    providers: {
      gemini: { configured: isProviderConfigured("gemini") },
      openai: { configured: isProviderConfigured("openai") },
      anthropic: { configured: isProviderConfigured("anthropic") },
    },
    models: AI_MODEL_CATALOG,
  });
}
