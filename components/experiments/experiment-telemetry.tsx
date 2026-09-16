"use client";

import React from "react";
import { ExperimentTelemetry } from "@/types/experiment";
import { FlaskConical, PlayCircle, CheckCircle2, Award } from "lucide-react";

interface ExperimentTelemetryProps {
  telemetry: ExperimentTelemetry;
}

export function ExperimentTelemetryComponent({ telemetry }: ExperimentTelemetryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
            TOTAL EXPERIMENTS
          </span>
          <span className="text-xl font-mono-tech font-semibold text-white mt-1 block">
            {telemetry.totalExperiments}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/12 border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED]">
          <FlaskConical className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
            ACTIVE RUNS
          </span>
          <span className="text-xl font-mono-tech font-semibold text-[#22D3EE] mt-1 block">
            {telemetry.activeRuns}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/12 border border-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE]">
          <PlayCircle className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
            COMPLETED RUNS
          </span>
          <span className="text-xl font-mono-tech font-semibold text-[#10B981] mt-1 block">
            {telemetry.completedRuns}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#10B981]/12 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
            AVG EVAL PASS RATE
          </span>
          <span className="text-xl font-mono-tech font-semibold text-[#10B981] mt-1 block">
            {telemetry.avgPassRate}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#1E2430] border border-white/[0.06] flex items-center justify-center text-[#8B95A5]">
          <Award className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
