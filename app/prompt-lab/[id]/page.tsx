"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PromptService } from "@/lib/services/prompt-service";
import { Prompt } from "@/types/prompt";
import { PromptTester } from "@/components/prompt-lab/prompt-tester";
import {
  ArrowLeft,
  Terminal,
  Trash2,
  GitCommit,
  Sparkles,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [promptItem, setPromptItem] = useState<Prompt | null>(null);

  useEffect(() => {
    if (id) {
      const found = PromptService.getPromptById(id);
      if (found) {
        setPromptItem(found);
      }
    }
  }, [id]);

  if (!promptItem) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="text-base font-sans font-semibold text-white">Prompt Template Not Found</div>
        <p className="text-xs font-sans text-[#8B95A5]">
          The prompt template with ID <code className="font-mono-tech">{id}</code> does not exist or has been removed.
        </p>
        <Link
          href="/prompt-lab"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#1E2430] text-xs font-sans text-white hover:bg-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Prompt Lab</span>
        </Link>
      </div>
    );
  }

  const currentVersion = promptItem.versions[0];

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete prompt "${promptItem.name}"?`)) {
      PromptService.deletePrompt(promptItem.id);
      router.push("/prompt-lab");
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/prompt-lab"
          className="inline-flex items-center gap-2 text-xs font-sans text-[#8B95A5] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Prompt Lab</span>
        </Link>

        <button
          onClick={handleDelete}
          className="px-3 py-1.5 rounded-[8px] bg-red-500/10 border border-red-500/20 text-xs font-sans text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Template</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="p-6 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] relative overflow-hidden glow-ambient-violet">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded bg-[#7C3AED]/12 border border-[#7C3AED]/20 text-[#7C3AED] font-semibold">
                {promptItem.category}
              </span>
              <span className="text-xs font-mono-tech text-[#5A6472]">
                {promptItem.currentVersion} ({promptItem.versions.length} revisions)
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight">
              {promptItem.name}
            </h1>
            <p className="text-sm font-sans text-[#8B95A5] max-w-3xl leading-relaxed">
              {promptItem.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Prompt Editor & Version Details */}
        <div className="space-y-6">
          <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
            <h2 className="text-sm font-sans font-semibold text-white">System Instructions</h2>
            <pre className="p-3 rounded-lg bg-[#0A0E14] border border-white/[0.06] text-white font-mono-tech text-xs leading-relaxed whitespace-pre-wrap">
              {currentVersion.systemPrompt}
            </pre>
          </div>

          <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
            <h2 className="text-sm font-sans font-semibold text-white">User Prompt Template</h2>
            <pre className="p-3 rounded-lg bg-[#0A0E14] border border-white/[0.06] text-[#22D3EE] font-mono-tech text-xs leading-relaxed whitespace-pre-wrap">
              {currentVersion.userPrompt}
            </pre>
          </div>

          {/* Revisions History */}
          <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-3">
            <h2 className="text-sm font-sans font-semibold text-white">Revision Commit Log</h2>
            <div className="divide-y divide-white/[0.04]">
              {promptItem.versions.map((ver) => (
                <div key={ver.version} className="py-2.5 flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <GitCommit className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span className="font-mono-tech text-white font-semibold">{ver.version}</span>
                    <span className="text-[#8B95A5]">Model: {ver.model}</span>
                  </div>
                  <span className="text-[11px] font-mono-tech text-[#5A6472]">{ver.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Sandbox Playground */}
        <div>
          <PromptTester versionItem={currentVersion} />
        </div>
      </div>
    </div>
  );
}
