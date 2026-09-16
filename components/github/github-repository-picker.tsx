"use client";

import { useEffect, useState } from "react";
import { Github, RefreshCw, ExternalLink, Search, GitBranch } from "lucide-react";

export type GithubRepo = { id: number; name: string; full_name: string; private: boolean; description: string | null; html_url: string; default_branch: string; language: string | null; updated_at: string; owner: { login: string } };

export function GithubRepositoryPicker({ onImport }: { onImport: (repo: GithubRepo) => void }) {
  const [connected, setConnected] = useState(false);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const statusResponse = await fetch("/api/github/status", { cache: "no-store" });
    const status = await statusResponse.json();
    setConnected(Boolean(status.connected));
    if (status.connected) {
      const response = await fetch("/api/github/repos", { cache: "no-store" });
      const data = await response.json();
      setRepos(data.repositories || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  const filtered = repos.filter((repo) => repo.full_name.toLowerCase().includes(query.toLowerCase()) || (repo.description || "").toLowerCase().includes(query.toLowerCase()));

  if (!connected) return null;
  return (
    <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div><h2 className="text-sm font-semibold text-white flex items-center gap-2"><Github className="w-4 h-4" /> Import from GitHub</h2><p className="text-xs text-[#8B95A5] mt-1">Create a VANTOR project from a repository without copying its source.</p></div>
        <button onClick={load} disabled={loading} className="p-2 rounded-lg bg-[#1E2430] border border-white/[0.06] text-[#8B95A5] hover:text-white"><RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /></button>
      </div>
      <div className="relative"><Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#5A6472]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search repositories..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-xs text-white focus:outline-none focus:border-[#7C3AED]" /></div>
      <div className="space-y-2 max-h-72 overflow-auto pr-1">
        {filtered.slice(0, 12).map((repo) => (
          <div key={repo.id} className="p-3 rounded-lg bg-[#1E2430]/50 border border-white/[0.05] flex items-center justify-between gap-3">
            <div className="min-w-0"><div className="flex items-center gap-2"><span className="text-xs font-semibold text-white truncate">{repo.full_name}</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-[#8B95A5]">{repo.private ? "PRIVATE" : "PUBLIC"}</span></div><p className="text-[11px] text-[#8B95A5] truncate mt-1">{repo.description || "No description"}</p><span className="text-[10px] text-[#5A6472] inline-flex items-center gap-1 mt-1"><GitBranch className="w-3 h-3" /> {repo.default_branch}</span></div>
            <div className="flex items-center gap-1.5 shrink-0"><a href={repo.html_url} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-[#8B95A5] hover:text-white hover:bg-white/[0.05]"><ExternalLink className="w-3.5 h-3.5" /></a><button onClick={() => onImport(repo)} className="px-3 py-1.5 rounded-lg bg-[#7C3AED]/15 border border-[#7C3AED]/25 text-[10px] font-semibold text-[#A78BFA] hover:bg-[#7C3AED]/25">Import</button></div>
          </div>
        ))}
        {!filtered.length && <div className="py-8 text-center text-xs text-[#5A6472]">No repositories found.</div>}
      </div>
    </div>
  );
}
