"use client";

import React from "react";
import Link from "next/link";
import { Dataset } from "@/types/dataset";
import { Database, HardDrive, Layers, FlaskConical } from "lucide-react";

interface DatasetCardProps {
  dataset: Dataset;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  const getStatusBadge = (status: Dataset["status"]) => {
    switch (status) {
      case "ready":
        return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
      case "processing":
        return "bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/20";
      case "archived":
        return "bg-[#1E2430] text-[#5A6472] border-white/[0.06]";
    }
  };

  return (
    <Link href={`/datasets/${dataset.id}`} className="block group">
      <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1A2029] hover:-translate-y-0.5 transition-all duration-150 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#1E2430] border border-white/[0.06] text-[#22D3EE] font-semibold">
                  {dataset.format}
                </span>
                <span className="text-[10px] font-mono-tech text-[#5A6472]">{dataset.version}</span>
              </div>
              <h3 className="text-base font-sans font-semibold text-white group-hover:text-[#7C3AED] transition-colors leading-snug pt-1">
                {dataset.name}
              </h3>
            </div>
            <span className={`text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full border capitalize shrink-0 ${getStatusBadge(dataset.status)}`}>
              {dataset.status}
            </span>
          </div>

          <p className="text-xs font-sans text-[#8B95A5] line-clamp-2 leading-relaxed">
            {dataset.description}
          </p>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#1E2430]/60 border border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-xs font-sans">
              <HardDrive className="w-3.5 h-3.5 text-[#5A6472]" />
              <span className="font-mono-tech text-white text-[11px]">{dataset.size}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-sans">
              <Layers className="w-3.5 h-3.5 text-[#5A6472]" />
              <span className="font-mono-tech text-white text-[11px]">{dataset.rowCount}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-sans text-[#8B95A5]">
            <span className="flex items-center gap-1.5" title="Experiments">
              <FlaskConical className="w-3.5 h-3.5 text-[#5A6472]" />
              <span className="font-mono-tech text-[11px]">{dataset.experimentsCount} experiments</span>
            </span>

            {dataset.projectName && (
              <span className="text-[11px] font-sans text-[#5A6472] truncate max-w-[140px]">
                {dataset.projectName}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
