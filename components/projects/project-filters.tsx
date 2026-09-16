"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedFramework: string;
  onFrameworkChange: (framework: string) => void;
  onReset: () => void;
}

const statuses: { label: string; value: string }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

const frameworks: { label: string; value: string }[] = [
  { label: "All Frameworks", value: "all" },
  { label: "PyTorch", value: "PyTorch" },
  { label: "Transformers", value: "Transformers" },
  { label: "LangChain", value: "LangChain" },
  { label: "Unsloth", value: "Unsloth" },
  { label: "LlamaIndex", value: "LlamaIndex" },
  { label: "vLLM", value: "vLLM" },
  { label: "Custom Python", value: "Custom Python" },
];

export function ProjectFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedFramework,
  onFrameworkChange,
  onReset,
}: ProjectFiltersProps) {
  const isFiltered = searchQuery !== "" || selectedStatus !== "all" || selectedFramework !== "all";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-[#5A6472] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects by name, description, tags..."
          className="w-full bg-[#161B22] border border-white/[0.06] rounded-[10px] pl-9 pr-3 py-2 text-xs font-sans text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED]/60 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A6472] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Filters */}
      <div className="flex items-center gap-2.5">
        {/* Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-[#161B22] border border-white/[0.06] rounded-[10px] px-3 py-2 text-xs font-sans text-[#8B95A5] focus:outline-none focus:border-[#7C3AED]/60 focus:text-white transition-colors cursor-pointer"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value} className="bg-[#161B22] text-white">
              {s.label}
            </option>
          ))}
        </select>

        {/* Framework Dropdown */}
        <select
          value={selectedFramework}
          onChange={(e) => onFrameworkChange(e.target.value)}
          className="bg-[#161B22] border border-white/[0.06] rounded-[10px] px-3 py-2 text-xs font-sans text-[#8B95A5] focus:outline-none focus:border-[#7C3AED]/60 focus:text-white transition-colors cursor-pointer"
        >
          {frameworks.map((f) => (
            <option key={f.value} value={f.value} className="bg-[#161B22] text-white">
              {f.label}
            </option>
          ))}
        </select>

        {/* Reset Filter Button */}
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
