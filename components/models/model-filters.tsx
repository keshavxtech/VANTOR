"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface ModelFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedProvider: string;
  onProviderChange: (p: string) => void;
  selectedType: string;
  onTypeChange: (t: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  onReset: () => void;
}

const providers = ["All Providers", "Google", "OpenAI", "Anthropic", "Meta", "Mistral", "Local / Custom"];
const types = ["All Types", "LLM", "Vision LLM", "Code Engine", "Embedding", "Audio Transcriber"];
const statuses = ["All Statuses", "ready", "preview", "deprecated", "offline"];

export function ModelFilters({
  searchQuery,
  onSearchChange,
  selectedProvider,
  onProviderChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  onReset,
}: ModelFiltersProps) {
  const isFiltered =
    searchQuery !== "" ||
    selectedProvider !== "All Providers" ||
    selectedType !== "All Types" ||
    selectedStatus !== "All Statuses";

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-[#5A6472] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search models by name, version, tags..."
          className="w-full bg-[#161B22] border border-white/[0.06] rounded-[10px] pl-9 pr-3 py-2 text-xs font-sans text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED]/60 transition-colors"
        />
        {searchQuery && (
          <button onClick={() => onSearchChange("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A6472] hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <select
          value={selectedProvider}
          onChange={(e) => onProviderChange(e.target.value)}
          className="bg-[#161B22] border border-white/[0.06] rounded-[10px] px-3 py-2 text-xs font-sans text-[#8B95A5] focus:outline-none focus:border-[#7C3AED]/60 cursor-pointer"
        >
          {providers.map((p) => (
            <option key={p} value={p} className="bg-[#161B22] text-white">
              {p}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="bg-[#161B22] border border-white/[0.06] rounded-[10px] px-3 py-2 text-xs font-sans text-[#8B95A5] focus:outline-none focus:border-[#7C3AED]/60 cursor-pointer"
        >
          {types.map((t) => (
            <option key={t} value={t} className="bg-[#161B22] text-white">
              {t}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-[#161B22] border border-white/[0.06] rounded-[10px] px-3 py-2 text-xs font-sans text-[#8B95A5] focus:outline-none focus:border-[#7C3AED]/60 cursor-pointer capitalize"
        >
          {statuses.map((s) => (
            <option key={s} value={s} className="bg-[#161B22] text-white capitalize">
              {s}
            </option>
          ))}
        </select>

        {isFiltered && (
          <button
            onClick={onReset}
            className="px-3 py-2 rounded-[10px] bg-[#1E2430] border border-white/[0.06] text-xs font-sans text-[#8B95A5] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
