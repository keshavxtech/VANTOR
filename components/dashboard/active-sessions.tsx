"use client";

import React from "react";
import { Terminal, Clock, ArrowUpRight } from "lucide-react";

const staticSessions = [
  {
    id: "sess_904",
    title: "Llama-3-70B Fine-Tuning Pipeline",
    type: "Training Experiment",
    status: "Running",
    runtime: "01h 42m",
    compute: "4x H100",
  },
  {
    id: "sess_891",
    title: "Autonomous Code Refactoring Agent",
    type: "Agent Execution",
    status: "Completed",
    runtime: "18m 04s",
    compute: "CPU Local",
  },
  {
    id: "sess_885",
    title: "Embedding Retrieval Accuracy Benchmark",
    type: "Evaluation Suite",
    status: "Idle",
    runtime: "45m 12s",
    compute: "2x A100",
  },
  {
    id: "sess_872",
    title: "Quantization & ONNX Export Checkpoint",
    type: "Model Optimization",
    status: "Completed",
    runtime: "06m 50s",
    compute: "CPU Local",
  },
];

export function ActiveSessions() {
  return (
    <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-[#8B95A5]" />
          <h2 className="text-base font-sans font-semibold text-white tracking-normal">
            Active Engineering Sessions
          </h2>
        </div>
        <span className="text-[11px] font-sans font-medium text-[#5A6472] tracking-[0.05em] uppercase">
          4 REGISTERED SESSIONS
        </span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {staticSessions.map((session) => (
          <div
            key={session.id}
            className="py-3 flex items-center justify-between hover:bg-[#1E2430]/60 px-3 rounded-[10px] transition-all duration-150 group cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-sans font-medium text-white group-hover:text-[#7C3AED] transition-colors">
                  {session.title}
                </span>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-md bg-[#1E2430] border border-white/[0.06] text-[#8B95A5]">
                  {session.id}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-sans text-[#8B95A5]">
                <span>{session.type}</span>
                <span className="text-[#5A6472]">•</span>
                <span className="flex items-center gap-1 font-mono-tech text-[11px]">
                  <Clock className="w-3 h-3 text-[#5A6472]" />
                  {session.runtime}
                </span>
                <span className="text-[#5A6472]">•</span>
                <span className="font-mono-tech text-[11px] text-[#5A6472]">{session.compute}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] font-sans font-medium px-2.5 py-1 rounded-full border ${
                  session.status === "Running"
                    ? "bg-[#22D3EE]/10 border-[#22D3EE]/30 text-[#22D3EE]"
                    : session.status === "Completed"
                    ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]"
                    : "bg-[#1E2430] border-white/[0.06] text-[#5A6472]"
                }`}
              >
                {session.status}
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#5A6472] group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
