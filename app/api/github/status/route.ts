import { NextResponse } from "next/server";
import { getGithubConnection } from "@/lib/github/client";

export async function GET() {
  try {
    const connection = await getGithubConnection();
    return NextResponse.json({ configured: Boolean(process.env.GITHUB_APP_ID && process.env.GITHUB_PRIVATE_KEY && process.env.GITHUB_CLIENT_ID), connected: Boolean(connection?.github_installation_id), connection });
  } catch (error) {
    return NextResponse.json({ configured: false, connected: false, error: error instanceof Error ? error.message : "GitHub status unavailable." }, { status: 500 });
  }
}
