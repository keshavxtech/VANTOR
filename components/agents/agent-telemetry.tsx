"use client";

import React from "react";
import { AgentTelemetry } from "@/types/agent";
import { Bot, PlayCircle, Wrench, Activity } from "lucide-react";

interface AgentTelemetryProps {
  telemetry: AgentTelemetry;
}

export function AgentTelemetryComponent({ telemetry }: AgentTelemetryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
            TOTAL AGENTS
          </span>
          <span className="text-xl font-mono-tech font-semibold text-white mt-1 block">
            {telemetry.totalAgents}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/12 border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED]">
          <Bot className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
            ACTIVE INSTANCES
          </span>
          <span className="text-xl font-mono-tech font-semibold text-[#10B981] mt-1 block">
            {telemetry.activeAgents}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#10B981]/12 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
          <PlayCircle className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
            ENABLED TOOL CAPABILITIES
          </span>
          <span className="text-xl font-mono-tech font-semibold text-[#22D3EE] mt-1 block">
            {telemetry.totalToolsEnabled}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/12 border border-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE]">
          <Wrench className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
            TOTAL EXECUTION TASKS
          </span>
          <span className="text-xl font-mono-tech font-semibold text-white mt-1 block">
            {telemetry.totalAgentRuns}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#1E2430] border border-white/[0.06] flex items-center justify-center text-[#8B95A5]">
          <Activity className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
