"use client";

import React from "react";
import Link from "next/link";
import { Agent } from "@/types/agent";
import { Bot, Cpu, Wrench, Activity, CheckCircle2, Clock } from "lucide-react";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const getStatusBadge = (status: Agent["status"]) => {
    switch (status) {
      case "active":
        return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
      case "idle":
        return "bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/20";
      case "paused":
        return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
      case "training":
        return "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20 animate-pulse";
    }
  };

  const enabledTools = agent.tools?.filter((t) => t.enabled) || [];

  return (
    <Link href={`/agents/${agent.id}`} className="block group">
      <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1A2029] hover:-translate-y-0.5 transition-all duration-150 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full space-y-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#1E2430] border border-white/[0.06] text-[#7C3AED] font-semibold">
                  {agent.model}
                </span>
              </div>
              <h3 className="text-base font-sans font-semibold text-white group-hover:text-[#7C3AED] transition-colors leading-snug pt-1">
                {agent.name}
              </h3>
            </div>
            <span className={`text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full border capitalize shrink-0 ${getStatusBadge(agent.status)}`}>
              {agent.status}
            </span>
          </div>

          <p className="text-xs font-sans text-[#8B95A5] line-clamp-2 leading-relaxed">
            {agent.description}
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-2.5 rounded-lg bg-[#1E2430]/60 border border-white/[0.04] space-y-1.5 font-mono-tech text-[11px]">
            <div className="flex items-center justify-between text-[#8B95A5]">
              <span>Active Tools ({enabledTools.length}):</span>
              <span className="text-white">{enabledTools.map((t) => t.name).join(", ") || "None"}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-sans text-[#8B95A5]">
            <span className="text-[11px] font-sans text-[#5A6472]">{agent.projectName}</span>
            <span className="flex items-center gap-1 text-[11px] font-mono-tech text-[#10B981]">
              <Activity className="w-3 h-3" />
              <span>{agent.runHistory?.length || 0} tasks executed</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
