"use client";

import React from "react";
import { AgentStatus } from "@/types/agent";
import { Search, Filter } from "lucide-react";

interface AgentFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: AgentStatus | "ALL";
  setStatusFilter: (val: AgentStatus | "ALL") => void;
}

export function AgentFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: AgentFiltersProps) {
  const statuses: (AgentStatus | "ALL")[] = ["ALL", "active", "idle", "paused", "training"];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-[12px] bg-[#161B22] border border-white/[0.06]">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-[#5A6472] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search agent title, model, role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-xs font-sans text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] transition-colors"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-xs font-sans text-[#8B95A5]">
          <Filter className="w-3.5 h-3.5 text-[#5A6472]" />
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AgentStatus | "ALL")}
            className="bg-transparent text-white capitalize focus:outline-none cursor-pointer font-mono-tech"
          >
            {statuses.map((st) => (
              <option key={st} value={st} className="bg-[#161B22] text-white capitalize">
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
