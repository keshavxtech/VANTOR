import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("vantor_github_oauth_state")?.value;
  cookieStore.delete("vantor_github_oauth_state");

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/settings?github=invalid-state", request.url));
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/auth/login?next=/settings", request.url));

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) throw new Error("GitHub App OAuth is not configured.");

    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, state }),
    });
    const token = await tokenResponse.json();
    if (!tokenResponse.ok || !token.access_token) throw new Error(token.error_description || "GitHub authorization failed.");

    const apiHeaders = {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token.access_token}`,
      "X-GitHub-Api-Version": "2026-03-10",
    };
    const githubUserResponse = await fetch("https://api.github.com/user", { headers: apiHeaders, cache: "no-store" });
    const githubUser = await githubUserResponse.json();
    if (!githubUserResponse.ok) throw new Error(githubUser.message || "Could not read GitHub account.");

    const installationsResponse = await fetch("https://api.github.com/user/installations?per_page=100", { headers: apiHeaders, cache: "no-store" });
    const installations = await installationsResponse.json();
    if (!installationsResponse.ok) throw new Error(installations.message || "Could not read GitHub App installations.");

    const installationId = url.searchParams.get("installation_id") || installations.installations?.[0]?.id;
    if (!installationId) throw new Error("GitHub authorization succeeded, but no VANTOR GitHub App installation was found. Install the VANTOR GitHub App and try again.");

    const installation = installations.installations?.find((item: { id: number }) => String(item.id) === String(installationId));
    if (!installation) throw new Error("The selected GitHub App installation is not available to this GitHub account.");

    const { error } = await supabase.from("profiles").update({
      github_installation_id: Number(installation.id),
      github_login: githubUser.login || installation.account?.login || null,
      github_avatar_url: githubUser.avatar_url || installation.account?.avatar_url || null,
      github_connected_at: new Date().toISOString(),
    }).eq("id", user.id);
    if (error) throw new Error(error.message);

    return NextResponse.redirect(new URL("/settings?github=connected", request.url));
  } catch (error) {
    const message = error instanceof Error ? error.message : "GitHub connection failed.";
    return NextResponse.redirect(new URL(`/settings?github=error&message=${encodeURIComponent(message)}`, request.url));
  }
}
