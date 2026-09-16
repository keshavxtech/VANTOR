import { NextResponse } from "next/server";
import { disconnectGithub } from "@/lib/github/client";

export async function POST() {
  try {
    await disconnectGithub();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not disconnect GitHub." }, { status: 400 });
  }
}
