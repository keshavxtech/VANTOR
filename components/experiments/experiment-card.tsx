"use client";

import React from "react";
import Link from "next/link";
import { Experiment } from "@/types/experiment";
import { FlaskConical, Cpu, Database, PlayCircle, CheckCircle2, XCircle, Clock } from "lucide-react";

interface ExperimentCardProps {
  experiment: Experiment;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export function ExperimentCard({ experiment, isSelected, onToggleSelect }: ExperimentCardProps) {
  const getStatusBadge = (status: Experiment["status"]) => {
    switch (status) {
      case "completed":
        return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
      case "running":
        return "bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/20 animate-pulse";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "idle":
        return "bg-[#1E2430] text-[#5A6472] border-white/[0.06]";
    }
  };

  const topMetric = experiment.runs[0]?.metrics?.find((m) => m.name === "Accuracy") || experiment.runs[0]?.metrics?.[0];

  return (
    <div className={`p-5 rounded-[14px] bg-[#161B22] border ${isSelected ? "border-[#7C3AED] ring-1 ring-[#7C3AED]" : "border-white/[0.06] hover:border-white/[0.12]"} hover:bg-[#1A2029] hover:-translate-y-0.5 transition-all duration-150 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full space-y-4`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelect}
                className="mt-1 rounded border-white/[0.2] bg-[#1E2430] text-[#7C3AED] focus:ring-0 cursor-pointer"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tech text-[#7C3AED]">Prompt {experiment.promptVersion}</span>
                <span className="text-[10px] font-mono-tech text-[#5A6472]">{experiment.runs.length} runs</span>
              </div>
              <Link href={`/experiments/${experiment.id}`} className="group">
                <h3 className="text-base font-sans font-semibold text-white group-hover:text-[#7C3AED] transition-colors leading-snug pt-1">
                  {experiment.name}
                </h3>
              </Link>
            </div>
          </div>

          <span className={`text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full border capitalize shrink-0 ${getStatusBadge(experiment.status)}`}>
            {experiment.status}
          </span>
        </div>

        <p className="text-xs font-sans text-[#8B95A5] line-clamp-2 leading-relaxed">
          {experiment.description}
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5 p-2.5 rounded-lg bg-[#1E2430]/60 border border-white/[0.04]">
          <div className="flex items-center gap-1.5 text-xs font-sans text-[#8B95A5]">
            <Cpu className="w-3.5 h-3.5 text-[#5A6472]" />
            <span className="font-mono-tech text-white text-[11px] truncate">{experiment.modelName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-sans text-[#8B95A5]">
            <Database className="w-3.5 h-3.5 text-[#5A6472]" />
            <span className="font-mono-tech text-white text-[11px] truncate">{experiment.datasetName}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-sans text-[#8B95A5]">
          <span className="text-[11px] font-sans text-[#5A6472]">{experiment.projectName}</span>

          {topMetric && (
            <span className="flex items-center gap-1 text-[11px] font-mono-tech text-[#10B981]">
              <span>{topMetric.name}:</span>
              <span className="font-bold">{topMetric.value}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
