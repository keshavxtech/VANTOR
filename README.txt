
OPENAI / CLAUDE PROVIDERS
- Gemini remains supported through GEMINI_API_KEY.
- OpenAI uses OPENAI_API_KEY and the Responses API.
- Claude uses ANTHROPIC_API_KEY and the Messages API.
- Keys are server-side only and are never exposed through NEXT_PUBLIC_ variables.
- If a provider key is missing, VANTOR returns a clear Not Configured response and makes no provider call.
- Prompt Lab now routes live runs through the shared VANTOR AI Core.


GITHUB INTEGRATION
------------------
VANTOR uses a GitHub App + OAuth installation flow. No GitHub access token is stored in VANTOR. After a user connects GitHub, VANTOR stores only the GitHub App installation ID and account metadata in Supabase, then mints short-lived installation access tokens server-side when it needs repository data.

Required server environment variables:
- GITHUB_APP_ID
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- GITHUB_PRIVATE_KEY

Optional:
- GITHUB_CALLBACK_URL (defaults to /api/github/callback on the current deployment)
- GITHUB_APP_SLUG (for documentation / installation URL reference)

Recommended GitHub App permissions for the current phase:
- Repository contents: Read-only
- Metadata: Read-only
Enable Request user authorization (OAuth) during installation and use the VANTOR callback URL. The Projects page exposes repository discovery and local project import after connection.

OBSERVABILITY
- Added /observability as a dedicated telemetry control-plane view without changing the locked 10-item sidebar.
- Unified local telemetry events cover AI requests, experiments, agents, evaluations, and deployments.
- Prompt Lab records successful/failed real AI requests with provider, model, latency, and token usage.
- Domain run history is synchronized into the observability event stream on refresh.
- Provider/model performance tables and recent activity stream are derived from recorded events.
- Telemetry is intentionally local in this phase; no paid monitoring vendor, cloud APM, or external telemetry service is required.

VANTOR Gemini API update:
- Default Gemini model: gemini-3.6-flash
- Gemini requests use Google's Interactions API (/v1beta/interactions).
- GEMINI_API_KEY remains server-side only.
- Existing localStorage model records using gemini-2.5-flash are migrated automatically.
