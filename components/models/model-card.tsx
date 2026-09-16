"use client";

import React from "react";
import Link from "next/link";
import { Model } from "@/types/model";
import { Cpu, Layers, FolderGit2, CheckCircle2, Clock, Activity } from "lucide-react";

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  const getStatusBadge = (status: Model["status"]) => {
    switch (status) {
      case "ready":
        return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
      case "preview":
        return "bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/20";
      case "deprecated":
        return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
      case "offline":
        return "bg-[#1E2430] text-[#5A6472] border-white/[0.06]";
    }
  };

  return (
    <Link href={`/models/${model.id}`} className="block group">
      <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1A2029] hover:-translate-y-0.5 transition-all duration-150 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#1E2430] border border-white/[0.06] text-[#7C3AED] font-semibold">
                  {model.provider}
                </span>
                <span className="text-[10px] font-mono-tech text-[#5A6472]">{model.version}</span>
              </div>
              <h3 className="text-base font-sans font-semibold text-white group-hover:text-[#7C3AED] transition-colors leading-snug pt-1">
                {model.name}
              </h3>
            </div>
            <span className={`text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full border capitalize shrink-0 ${getStatusBadge(model.status)}`}>
              {model.status}
            </span>
          </div>

          <p className="text-xs font-sans text-[#8B95A5] line-clamp-2 leading-relaxed">
            {model.description}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-[#1E2430] border border-white/[0.06] text-white">
              {model.type}
            </span>
            <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-[#1E2430]/60 border border-white/[0.04] text-[#8B95A5]">
              {model.contextWindow}
            </span>
          </div>

          <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-sans text-[#8B95A5]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5" title="Projects">
                <FolderGit2 className="w-3.5 h-3.5 text-[#5A6472]" />
                <span className="font-mono-tech text-[11px]">{model.associatedProjectsCount} projects</span>
              </span>
            </div>

            {model.evalScore && (
              <span className="flex items-center gap-1 text-[11px] font-mono-tech text-[#10B981]">
                <Activity className="w-3 h-3" />
                <span>Score: {model.evalScore}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
