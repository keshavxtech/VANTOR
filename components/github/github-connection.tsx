"use client";

import { useEffect, useState } from "react";
import { Github, ExternalLink, RefreshCw, Unplug, CheckCircle2, AlertCircle } from "lucide-react";

type Status = { configured: boolean; connected: boolean; connection?: { github_login?: string | null; github_avatar_url?: string | null; github_connected_at?: string | null } | null };

export function GithubConnection() {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const response = await fetch("/api/github/status", { cache: "no-store" });
    setStatus(await response.json());
  };

  useEffect(() => { load(); }, []);

  const disconnect = async () => {
    if (!confirm("Disconnect GitHub from this VANTOR account?")) return;
    setBusy(true);
    await fetch("/api/github/disconnect", { method: "POST" });
    await load();
    setBusy(false);
  };

  if (!status) return <div className="h-24 rounded-[12px] bg-[#1E2430]/40 animate-pulse" />;

  return (
    <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1E2430] border border-white/[0.06] flex items-center justify-center"><Github className="w-5 h-5 text-white" /></div>
          <div>
            <h2 className="text-sm font-semibold text-white">GitHub Integration</h2>
            <p className="text-xs text-[#8B95A5] mt-1 max-w-xl">Connect VANTOR to your GitHub repositories for repository discovery and project import.</p>
          </div>
        </div>
        {status.connected && <span className="text-[10px] uppercase tracking-wider text-[#10B981] flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Connected</span>}
      </div>

      {!status.configured ? (
        <div className="p-3 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-xs text-[#F59E0B] flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>GitHub App credentials are not configured yet. Add the GitHub environment variables before connecting.</span></div>
      ) : status.connected ? (
        <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#10B981]/[0.06] border border-[#10B981]/15">
          <div className="text-xs text-white">Connected as <span className="font-semibold">@{status.connection?.github_login}</span></div>
          <button onClick={disconnect} disabled={busy} className="px-3 py-2 rounded-lg bg-[#1E2430] border border-white/[0.06] text-xs text-[#8B95A5] hover:text-white inline-flex items-center gap-2 disabled:opacity-50"><Unplug className="w-3.5 h-3.5" />{busy ? "Disconnecting..." : "Disconnect"}</button>
        </div>
      ) : (
        <a href="/api/github/install" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-xs font-semibold text-white shadow-md shadow-[#7C3AED]/20"><Github className="w-4 h-4" /> Connect GitHub <ExternalLink className="w-3.5 h-3.5" /></a>
      )}
    </div>
  );
}
