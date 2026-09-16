"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Command, ChevronDown, Layers, Search, ArrowRight } from "lucide-react";

const searchItems = [
  { label: "Projects", href: "/projects", keywords: "project workspace repository" },
  { label: "Models", href: "/models", keywords: "model llm gemini openai claude" },
  { label: "Experiments", href: "/experiments", keywords: "experiment run training benchmark" },
  { label: "Datasets", href: "/datasets", keywords: "dataset data csv jsonl parquet" },
  { label: "Prompt Lab", href: "/prompt-lab", keywords: "prompt playground system prompt" },
  { label: "Agents", href: "/agents", keywords: "agent autonomous tool" },
  { label: "Evaluations", href: "/evaluations", keywords: "evaluation eval score benchmark" },
  { label: "Deployments", href: "/deployments", keywords: "deployment endpoint production" },
  { label: "Settings", href: "/settings", keywords: "settings github api keys" },
];

export function Header() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    searchRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = searchItems.filter((item) => {
    const q = query.trim().toLowerCase();
    return !q || `${item.label} ${item.keywords}`.toLowerCase().includes(q);
  });

  const go = (href: string) => {
    setSearchOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <header className="h-14 border-b border-white/[0.06] bg-[#0A0E14] px-5 flex items-center justify-between select-none z-30 shrink-0">
      <div className="flex items-center gap-4">
        <Logo />
        <span className="text-white/20 font-mono-tech text-xs">/</span>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#161B22] border border-white/[0.06] text-xs font-sans font-medium text-white hover:border-white/[0.12] hover:bg-[#1E2430] transition-all active:scale-[0.98]"
        >
          <Layers className="w-3.5 h-3.5 text-[#8B95A5]" />
          <span>workspace-main</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#5A6472]" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-[310px] flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#161B22] border border-white/[0.06] text-xs font-sans text-[#8B95A5] hover:border-white/[0.12] hover:text-white transition-all text-left"
          >
            <Search className="w-3.5 h-3.5 text-[#5A6472]" />
            <span className="flex-1">Search models, agents, logs...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-[#1E2430] border border-white/[0.06] rounded text-white font-mono-tech">
              ⌘K
            </kbd>
          </button>

          {searchOpen && (
            <div className="absolute right-0 top-11 w-[360px] rounded-[12px] bg-[#161B22] border border-white/[0.08] shadow-2xl overflow-hidden z-50">
              <div className="p-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 px-2.5 rounded-[8px] bg-[#0A0E14] border border-white/[0.06]">
                  <Search className="w-3.5 h-3.5 text-[#5A6472]" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && results[0]) go(results[0].href);
                    }}
                    placeholder="Search VANTOR..."
                    className="w-full bg-transparent py-2.5 text-xs text-white outline-none placeholder:text-[#5A6472]"
                  />
                  <kbd className="text-[9px] text-[#5A6472]">ESC</kbd>
                </div>
              </div>
              <div className="p-1.5 max-h-80 overflow-y-auto">
                {results.length ? results.map((item) => (
                  <button
                    type="button"
                    key={item.href}
                    onClick={() => go(item.href)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-left hover:bg-white/[0.04] group"
                  >
                    <div className="w-7 h-7 rounded-md bg-[#1E2430] flex items-center justify-center text-[#8B95A5] group-hover:text-[#7C3AED]">
                      <Command className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-xs text-[#D7DCE3]">{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#5A6472] group-hover:text-white" />
                  </button>
                )) : (
                  <div className="px-3 py-6 text-center text-xs text-[#5A6472]">No VANTOR module found.</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] border border-white/[0.06] bg-[#161B22] text-xs font-mono-tech text-[#8B9298]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="tracking-wider text-white">CLUSTER // READY</span>
        </div>

        <div className="flex items-center px-3 py-1.5 rounded-[8px] bg-[#161B22] border border-white/[0.06]">
          <Logo showWordmark={true} />
        </div>
      </div>
    </header>
  );
}
