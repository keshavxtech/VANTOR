import { createSign } from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const API = "https://api.github.com";
const API_VERSION = "2026-03-10";

function base64Url(input: string | Uint8Array) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function createAppJwt() {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!appId || !privateKey) throw new Error("GitHub App is not configured.");

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({ iat: now - 60, exp: now + 540, iss: appId }));
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  return `${unsigned}.${base64Url(signer.sign(privateKey))}`;
}

async function githubFetch<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": API_VERSION,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.message === "string" ? body.message : `GitHub API error (${response.status})`;
    throw new Error(message);
  }
  return body as T;
}

export async function getInstallationToken(installationId: number) {
  const jwt = createAppJwt();
  const result = await githubFetch<{ token: string }>(
    `/app/installations/${installationId}/access_tokens`,
    { method: "POST", headers: { Authorization: `Bearer ${jwt}` } },
  );
  return result.token;
}

export async function getGithubConnection() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("github_installation_id, github_login, github_avatar_url, github_connected_at")
    .eq("id", user.id)
    .maybeSingle();
  return data || null;
}

export async function requireGithubToken() {
  const connection = await getGithubConnection();
  if (!connection?.github_installation_id) throw new Error("GitHub is not connected to this VANTOR account.");
  return { connection, token: await getInstallationToken(Number(connection.github_installation_id)) };
}

export type GithubRepository = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  html_url: string;
  default_branch: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  owner: { login: string };
};

export async function listRepositories() {
  const { token } = await requireGithubToken();
  return githubFetch<{ total_count: number; repositories: GithubRepository[] }>(
    "/installation/repositories?per_page=100",
    {},
    token,
  );
}

export async function getRepository(owner: string, repo: string) {
  const { token } = await requireGithubToken();
  return githubFetch<GithubRepository>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {}, token);
}

export async function disconnectGithub() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");
  const { error } = await supabase
    .from("profiles")
    .update({ github_installation_id: null, github_login: null, github_avatar_url: null, github_connected_at: null })
    .eq("id", user.id);
  if (error) throw new Error(error.message);
}
