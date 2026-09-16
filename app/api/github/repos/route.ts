import { NextResponse } from "next/server";
import { listRepositories } from "@/lib/github/client";

export async function GET() {
  try {
    const result = await listRepositories();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load GitHub repositories." }, { status: 400 });
  }
}
