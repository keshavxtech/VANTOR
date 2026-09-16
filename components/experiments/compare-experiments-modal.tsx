"use client";

import React from "react";
import { Experiment } from "@/types/experiment";
import { X, SlidersHorizontal, Award, CheckCircle2, ArrowRight } from "lucide-react";

interface CompareExperimentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiments: Experiment[];
}

export function CompareExperimentsModal({ isOpen, onClose, experiments }: CompareExperimentsModalProps) {
  if (!isOpen || experiments.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-[14px] bg-[#161B22] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#7C3AED]" />
            <h2 className="text-base font-sans font-semibold text-white">Side-by-Side Experiment Comparison ({experiments.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8B95A5] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans">
          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto border border-white/[0.06] rounded-[10px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1E2430]/80 border-b border-white/[0.06] text-[#8B95A5]">
                  <th className="p-3.5 font-medium">Attribute / Metric</th>
                  {experiments.map((exp) => (
                    <th key={exp.id} className="p-3.5 font-semibold text-white min-w-[200px]">
                      {exp.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-mono-tech text-[11px]">
                <tr>
                  <td className="p-3 text-[#8B95A5] font-sans">Base Model</td>
                  {experiments.map((exp) => (
                    <td key={exp.id} className="p-3 text-white">{exp.modelName}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-[#8B95A5] font-sans">Dataset Partition</td>
                  {experiments.map((exp) => (
                    <td key={exp.id} className="p-3 text-[#22D3EE]">{exp.datasetName}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-[#8B95A5] font-sans">Prompt Version</td>
                  {experiments.map((exp) => (
                    <td key={exp.id} className="p-3 text-[#7C3AED]">{exp.promptVersion}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-[#8B95A5] font-sans">Total Runs Recorded</td>
                  {experiments.map((exp) => (
                    <td key={exp.id} className="p-3 text-white">{exp.runs.length} runs</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-[#8B95A5] font-sans">Top Run Accuracy</td>
                  {experiments.map((exp) => {
                    const acc = exp.runs[0]?.metrics?.find((m) => m.name === "Accuracy")?.value || "N/A";
                    return (
                      <td key={exp.id} className="p-3 text-[#10B981] font-bold">{acc}</td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-3 text-[#8B95A5] font-sans">Top Run Loss</td>
                  {experiments.map((exp) => {
                    const loss = exp.runs[0]?.metrics?.find((m) => m.name === "Loss")?.value || "N/A";
                    return (
                      <td key={exp.id} className="p-3 text-white">{loss}</td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-3 text-[#8B95A5] font-sans">Run Status</td>
                  {experiments.map((exp) => (
                    <td key={exp.id} className="p-3 capitalize text-white">{exp.status}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.06] flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors font-medium text-xs shadow-md shadow-[#7C3AED]/20"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
