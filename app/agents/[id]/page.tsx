"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AgentService } from "@/lib/services/agent-service";
import { Agent } from "@/types/agent";
import {
  ArrowLeft,
  Bot,
  Wrench,
  Trash2,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Activity,
  Terminal,
} from "lucide-react";

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    if (id) {
      const found = AgentService.getAgentById(id);
      if (found) {
        setAgent(found);
      }
    }
  }, [id]);

  if (!agent) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="text-base font-sans font-semibold text-white">Agent Not Found</div>
        <p className="text-xs font-sans text-[#8B95A5]">
          The agent instance with ID <code className="font-mono-tech">{id}</code> does not exist or has been removed.
        </p>
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#1E2430] text-xs font-sans text-white hover:bg-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Agents</span>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete agent "${agent.name}"?`)) {
      AgentService.deleteAgent(agent.id);
      router.push("/agents");
    }
  };

  const handleToggleTool = (toolId: string) => {
    const updatedTools = agent.tools.map((t) => (t.id === toolId ? { ...t, enabled: !t.enabled } : t));
    const updated = AgentService.updateTools(agent.id, updatedTools);
    if (updated) setAgent(updated);
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 text-xs font-sans text-[#8B95A5] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Agents</span>
        </Link>

        <button
          onClick={handleDelete}
          className="px-3 py-1.5 rounded-[8px] bg-red-500/10 border border-red-500/20 text-xs font-sans text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Terminate Agent</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="p-6 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] relative overflow-hidden glow-ambient-violet">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded bg-[#1E2430] border border-white/[0.06] text-[#7C3AED] font-semibold">
                {agent.model}
              </span>
              <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 capitalize">
                {agent.status}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight">
              {agent.name}
            </h1>
            <p className="text-sm font-sans text-[#8B95A5] max-w-3xl leading-relaxed">
              {agent.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans text-[#8B95A5]">
            <div>
              <span className="text-[10px] text-[#5A6472] block uppercase">Project</span>
              <span className="font-mono-tech text-white">{agent.projectName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Agent Details & Tool Config */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
            <h2 className="text-sm font-sans font-semibold text-white">System Instructions</h2>
            <pre className="p-3.5 rounded-lg bg-[#0A0E14] border border-white/[0.06] text-white font-mono-tech text-xs leading-relaxed whitespace-pre-wrap">
              {agent.systemInstructions}
            </pre>
          </div>

          {/* Enabled Tools Manager */}
          <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
            <h2 className="text-sm font-sans font-semibold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#7C3AED]" /> Agent Tool Integration Matrix
            </h2>
            <div className="divide-y divide-white/[0.04]">
              {agent.tools.map((tool) => (
                <div key={tool.id} className="py-3 flex items-center justify-between text-xs font-sans">
                  <div className="space-y-0.5">
                    <span className="text-white font-medium block">{tool.name}</span>
                    <span className="text-[10px] font-mono-tech text-[#5A6472]">{tool.type}</span>
                  </div>
                  <button
                    onClick={() => handleToggleTool(tool.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono-tech border transition-all ${
                      tool.enabled
                        ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                        : "bg-[#1E2430] text-[#5A6472] border-white/[0.06]"
                    }`}
                  >
                    {tool.enabled ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Execution Log Trace */}
        <div className="space-y-6">
          <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
            <h2 className="text-sm font-sans font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#22D3EE]" /> Execution Task Audit Log
            </h2>
            <div className="divide-y divide-white/[0.04]">
              {agent.runHistory && agent.runHistory.length > 0 ? (
                agent.runHistory.map((run) => (
                  <div key={run.id} className="py-3 space-y-1 text-xs font-sans">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{run.task}</span>
                      <span className="text-[10px] font-mono-tech text-[#10B981] capitalize">{run.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#5A6472] font-mono-tech">
                      <span>{run.timestamp}</span>
                      <span>Duration: {run.duration}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-sans text-[#8B95A5] py-2">No execution task history recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
