"use client";

import React from "react";
import Link from "next/link";
import { Evaluation } from "@/types/evaluation";
import { Activity, Cpu, Database, Award, CheckCircle2, XCircle, Clock } from "lucide-react";

interface EvaluationCardProps {
  evaluation: Evaluation;
}

export function EvaluationCard({ evaluation }: EvaluationCardProps) {
  const getStatusBadge = (status: Evaluation["status"]) => {
    switch (status) {
      case "passed":
        return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
      case "running":
        return "bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/20 animate-pulse";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "pending":
        return "bg-[#1E2430] text-[#5A6472] border-white/[0.06]";
    }
  };

  return (
    <Link href={`/evaluations/${evaluation.id}`} className="block group">
      <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1A2029] hover:-translate-y-0.5 transition-all duration-150 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full space-y-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] font-semibold">
                  Pass: {evaluation.passRate}
                </span>
                <span className="text-[10px] font-mono-tech text-[#5A6472]">{evaluation.runs.length} runs</span>
              </div>
              <h3 className="text-base font-sans font-semibold text-white group-hover:text-[#7C3AED] transition-colors leading-snug pt-1">
                {evaluation.name}
              </h3>
            </div>
            <span className={`text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full border capitalize shrink-0 ${getStatusBadge(evaluation.status)}`}>
              {evaluation.status}
            </span>
          </div>

          <p className="text-xs font-sans text-[#8B95A5] line-clamp-2 leading-relaxed">
            {evaluation.description}
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5 p-2.5 rounded-lg bg-[#1E2430]/60 border border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-xs font-sans text-[#8B95A5]">
              <Cpu className="w-3.5 h-3.5 text-[#5A6472]" />
              <span className="font-mono-tech text-white text-[11px] truncate">{evaluation.modelName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-sans text-[#8B95A5]">
              <Database className="w-3.5 h-3.5 text-[#5A6472]" />
              <span className="font-mono-tech text-[#22D3EE] text-[11px] truncate">{evaluation.datasetName}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-sans text-[#8B95A5]">
            <span className="text-[11px] font-sans text-[#5A6472]">{evaluation.projectName}</span>
            <span className="flex items-center gap-1 text-[11px] font-mono-tech text-[#10B981]">
              <Award className="w-3.5 h-3.5" />
              <span>Score: {evaluation.overallScore}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
