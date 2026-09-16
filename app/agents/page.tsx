"use client";

import React, { useState, useEffect } from "react";
import { AgentTelemetryComponent } from "@/components/agents/agent-telemetry";
import { AgentFilters } from "@/components/agents/agent-filters";
import { AgentCard } from "@/components/agents/agent-card";
import { CreateAgentModal } from "@/components/agents/create-agent-modal";
import { AgentService } from "@/lib/services/agent-service";
import { Agent, AgentStatus, CreateAgentInput } from "@/types/agent";
import { Plus, Bot } from "lucide-react";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [telemetry, setTelemetry] = useState(AgentService.getTelemetry());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AgentStatus | "ALL">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setAgents(AgentService.getAgents());
    setTelemetry(AgentService.getTelemetry());
  }, []);

  const handleCreateAgent = (input: CreateAgentInput) => {
    AgentService.createAgent(input);
    setAgents(AgentService.getAgents());
    setTelemetry(AgentService.getTelemetry());
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#7C3AED]" />
            <h1 className="text-xl font-sans font-bold text-white tracking-tight">Agents</h1>
          </div>
          <p className="text-xs font-sans text-[#8B95A5] mt-1">
            Autonomous agent workers, AST refactoring tools, RAG ingesters, and execution loop monitors.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-sans font-medium transition-all shadow-[0_2px_10px_rgba(124,58,237,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy Agent</span>
        </button>
      </div>

      <AgentTelemetryComponent telemetry={telemetry} />

      <AgentFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {filteredAgents.length === 0 ? (
        <div className="p-12 rounded-[14px] bg-[#161B22] border border-white/[0.06] text-center space-y-3">
          <Bot className="w-10 h-10 text-[#5A6472] mx-auto" />
          <h3 className="text-sm font-sans font-medium text-white">No agents found</h3>
          <p className="text-xs font-sans text-[#8B95A5] max-w-sm mx-auto">
            Try adjusting search or status filters to discover active agent instances.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}

      <CreateAgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleCreateAgent}
      />
    </div>
  );
}
