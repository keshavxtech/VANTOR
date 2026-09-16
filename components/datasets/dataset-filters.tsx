"use client";

import React from "react";
import { DatasetFormat, DatasetStatus } from "@/types/dataset";
import { Search, Filter } from "lucide-react";

interface DatasetFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  formatFilter: DatasetFormat | "ALL";
  setFormatFilter: (val: DatasetFormat | "ALL") => void;
  statusFilter: DatasetStatus | "ALL";
  setStatusFilter: (val: DatasetStatus | "ALL") => void;
}

export function DatasetFilters({
  searchQuery,
  setSearchQuery,
  formatFilter,
  setFormatFilter,
  statusFilter,
  setStatusFilter,
}: DatasetFiltersProps) {
  const formats: (DatasetFormat | "ALL")[] = ["ALL", "JSONL", "Parquet", "CSV", "Vector Index", "Audio Archive"];
  const statuses: (DatasetStatus | "ALL")[] = ["ALL", "ready", "processing", "archived"];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-[12px] bg-[#161B22] border border-white/[0.06]">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-[#5A6472] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search dataset name, description, tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-xs font-sans text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] transition-colors"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-xs font-sans text-[#8B95A5]">
          <Filter className="w-3.5 h-3.5 text-[#5A6472]" />
          <span>Format:</span>
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value as DatasetFormat | "ALL")}
            className="bg-transparent text-white focus:outline-none cursor-pointer font-mono-tech"
          >
            {formats.map((fmt) => (
              <option key={fmt} value={fmt} className="bg-[#161B22] text-white">
                {fmt}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-xs font-sans text-[#8B95A5]">
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DatasetStatus | "ALL")}
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
