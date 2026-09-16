"use client";

import React from "react";
import Link from "next/link";
import { Prompt } from "@/types/prompt";
import { Terminal, GitCommit, Sparkles, Sliders } from "lucide-react";

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const current = prompt.versions[0];

  return (
    <Link href={`/prompt-lab/${prompt.id}`} className="block group">
      <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1A2029] hover:-translate-y-0.5 transition-all duration-150 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full space-y-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#7C3AED]/12 border border-[#7C3AED]/20 text-[#7C3AED] font-semibold">
                  {prompt.category}
                </span>
                <span className="text-[10px] font-mono-tech text-[#5A6472]">
                  {prompt.currentVersion} ({prompt.versions.length} revs)
                </span>
              </div>
              <h3 className="text-base font-sans font-semibold text-white group-hover:text-[#7C3AED] transition-colors leading-snug pt-1">
                {prompt.name}
              </h3>
            </div>
          </div>

          <p className="text-xs font-sans text-[#8B95A5] line-clamp-2 leading-relaxed">
            {prompt.description}
          </p>
        </div>

        <div className="space-y-3">
          {current && (
            <div className="p-2.5 rounded-lg bg-[#1E2430]/60 border border-white/[0.04] space-y-1.5 font-mono-tech text-[11px]">
              <div className="flex items-center justify-between text-[#8B95A5]">
                <span>Model: <span className="text-white">{current.model}</span></span>
                <span>Temp: <span className="text-[#22D3EE]">{current.temperature}</span></span>
              </div>
              {current.variables && current.variables.length > 0 && (
                <div className="flex items-center gap-1.5 text-[#5A6472] pt-0.5">
                  <span>Vars:</span>
                  {current.variables.map((v) => (
                    <span key={v} className="px-1.5 py-0.2 rounded bg-[#161B22] border border-white/[0.06] text-[#7C3AED]">
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-sans text-[#8B95A5]">
            <span className="text-[11px] font-sans text-[#5A6472]">{prompt.projectName || "Global System Prompt"}</span>
            <span className="flex items-center gap-1 text-[11px] font-mono-tech text-[#10B981]">
              <Sparkles className="w-3 h-3" />
              <span>Test Template</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
