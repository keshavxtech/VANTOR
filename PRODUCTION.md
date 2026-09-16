# VANTOR Production / Vercel Runbook

## 1. Deploy

VANTOR is a Next.js application and can be deployed to Vercel with the repository root as the project root.

Recommended build settings:
- Framework: Next.js
- Install command: `npm ci`
- Build command: `npm run build`

Do not commit `.env.local`, provider API keys, GitHub private keys, or Supabase service-role credentials.

## 2. Environment variables

Set these in the Vercel project settings:

### Required for authentication
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Optional AI providers
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

### Optional GitHub App
- `GITHUB_APP_ID`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_PRIVATE_KEY`
- `GITHUB_APP_SLUG`
- `GITHUB_CALLBACK_URL`

For production, set `GITHUB_CALLBACK_URL` to:
`https://<your-domain>/api/github/callback`

## 3. Supabase

Run `supabase/schema.sql` against the Supabase project before enabling production authentication.

The application uses the browser/server SSR clients and middleware session refresh. Keep the service-role key out of Vercel unless a future server-only feature explicitly requires it.

## 4. Health check

`GET /api/health` is intentionally public so deployment monitors can verify that the Next.js runtime is responding without an authenticated browser session.

## 5. Zero-cost behavior

Leaving optional AI and GitHub environment variables empty keeps those integrations disabled. VANTOR does not silently create paid infrastructure.

Note: external provider usage is never inherently free. If a provider key is configured, its own account limits and billing rules apply. Keep keys unset when the project must remain strictly ₹0.

## 6. Current persistence boundary

The UI control-plane modules still use browser `localStorage` for their current project/model/dataset/experiment/agent/evaluation/deployment workspace data. Supabase currently provides authentication and workspace identity.

A future persistence migration should move these domain records to Supabase/Postgres before claiming multi-device/team production persistence. Do not describe the current localStorage layer as a multi-user production database.

## 7. Final pre-release checklist

- [ ] Supabase schema applied
- [ ] Production redirect URLs configured in Supabase
- [ ] GitHub App callback points to production domain
- [ ] Required environment variables configured
- [ ] No secrets committed
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `/api/health` returns `{ ok: true }`
- [ ] Login/signup/callback/logout verified
- [ ] Prompt Lab provider behavior verified with intentionally configured keys only
- [ ] GitHub connect/import verified
- [ ] Observability verified after real runs
