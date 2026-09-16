import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "vantor",
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
      timestamp: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
