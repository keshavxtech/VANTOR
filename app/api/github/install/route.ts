import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/user";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/auth/login?next=/settings", request.url));
  const clientId = process.env.GITHUB_CLIENT_ID;
  const callback = process.env.GITHUB_CALLBACK_URL || new URL("/api/github/callback", request.url).toString();
  if (!clientId) return NextResponse.redirect(new URL("/settings?github=not-configured", request.url));

  const state = randomBytes(24).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set("vantor_github_oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 600, path: "/" });

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", callback);
  url.searchParams.set("state", state);
  url.searchParams.set("allow_signup", "false");
  return NextResponse.redirect(url);
}
