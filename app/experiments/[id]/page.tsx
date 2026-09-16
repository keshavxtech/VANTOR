"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ExperimentService } from "@/lib/services/experiment-service";
import { Experiment } from "@/types/experiment";
import {
  ArrowLeft,
  FlaskConical,
  Cpu,
  Database,
  Trash2,
  Terminal,
  Activity,
  Award,
  Clock,
  PlayCircle,
  Sliders,
} from "lucide-react";

export default function ExperimentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [activeTab, setActiveTab] = useState<"runs" | "logs" | "parameters">("runs");

  useEffect(() => {
    if (id) {
      const found = ExperimentService.getExperimentById(id);
      if (found) {
        setExperiment(found);
      }
    }
  }, [id]);

  if (!experiment) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="text-base font-sans font-semibold text-white">Experiment Not Found</div>
        <p className="text-xs font-sans text-[#8B95A5]">
          The experiment sweep record with ID <code className="font-mono-tech">{id}</code> does not exist or has been removed.
        </p>
        <Link
          href="/experiments"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#1E2430] text-xs font-sans text-white hover:bg-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Experiments</span>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete experiment "${experiment.name}"?`)) {
      ExperimentService.deleteExperiment(experiment.id);
      router.push("/experiments");
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/experiments"
          className="inline-flex items-center gap-2 text-xs font-sans text-[#8B95A5] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Experiments</span>
        </Link>

        <button
          onClick={handleDelete}
          className="px-3 py-1.5 rounded-[8px] bg-red-500/10 border border-red-500/20 text-xs font-sans text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Sweep</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="p-6 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] relative overflow-hidden glow-ambient-violet">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded bg-[#1E2430] border border-white/[0.06] text-[#7C3AED] font-semibold">
                {experiment.promptVersion}
              </span>
              <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 capitalize">
                {experiment.status}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight">
              {experiment.name}
            </h1>
            <p className="text-sm font-sans text-[#8B95A5] max-w-3xl leading-relaxed">
              {experiment.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans text-[#8B95A5]">
            <div>
              <span className="text-[10px] text-[#5A6472] block uppercase">Model</span>
              <span className="font-mono-tech text-white">{experiment.modelName}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#5A6472] block uppercase">Dataset</span>
              <span className="font-mono-tech text-[#22D3EE]">{experiment.datasetName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.06] flex items-center gap-6 text-sm font-sans">
        {(["runs", "logs", "parameters"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-medium capitalize transition-colors relative ${
              activeTab === tab
                ? "text-white border-b-2 border-[#7C3AED]"
                : "text-[#8B95A5] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Runs Tab */}
      {activeTab === "runs" && (
        <div className="space-y-4">
          <h2 className="text-sm font-sans font-semibold text-white">Recorded Run Trials ({experiment.runs.length})</h2>
          <div className="space-y-3">
            {experiment.runs.map((run) => (
              <div key={run.id} className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono-tech font-bold px-2.5 py-1 rounded bg-[#7C3AED]/12 border border-[#7C3AED]/20 text-[#7C3AED]">
                      Run #{run.runNumber} ({run.id})
                    </span>
                    <span className="text-xs font-mono-tech text-[#8B95A5]">{run.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono-tech text-[#8B95A5]">
                    <Clock className="w-3.5 h-3.5 text-[#5A6472]" />
                    <span>{run.duration}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {run.metrics.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#1E2430]/60 border border-white/[0.04]">
                      <span className="text-[10px] font-sans text-[#5A6472] uppercase block">{m.name}</span>
                      <span className="text-base font-mono-tech font-bold text-[#10B981]">{m.value}</span>
                      {m.baseline && <span className="text-[10px] font-mono-tech text-[#5A6472] block">baseline: {m.baseline}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-sans font-semibold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#7C3AED]" /> Training & Loss Convergence Logs
            </h2>
            <span className="text-xs font-mono-tech text-[#10B981]">Stream Closed (Exit: 0)</span>
          </div>

          <pre className="p-4 rounded-[10px] bg-[#0A0E14] border border-white/[0.06] font-mono-tech text-[11px] text-[#8B95A5] leading-relaxed overflow-x-auto space-y-1">
            <div className="text-white">[INFO] Starting hyperparameter trial run_r64 on CUDA device 0...</div>
            <div>[INFO] Loading base weights for Llama 3.1 70B Instruct...</div>
            <div>[INFO] Applying LoRA target_modules=[q_proj, v_proj, k_proj, o_proj], r=64, alpha=128</div>
            <div className="text-[#22D3EE]">Epoch 1/3 | Step 500/1500 | Loss: 0.842 | LR: 2.00e-04</div>
            <div className="text-[#22D3EE]">Epoch 2/3 | Step 1000/1500 | Loss: 0.512 | LR: 1.34e-04</div>
            <div className="text-[#10B981]">Epoch 3/3 | Step 1500/1500 | Loss: 0.410 | LR: 1.00e-05</div>
            <div className="text-white">[INFO] Final checkpoint saved: ./checkpoints/exp_lora_rank_sweep_01/run_r64.pt</div>
            <div className="text-[#10B981] font-bold">[SUCCESS] Evaluation benchmark completed. Accuracy: 94.2% (Pass)</div>
          </pre>
        </div>
      )}

      {/* Parameters Tab */}
      {activeTab === "parameters" && (
        <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
          <h2 className="text-sm font-sans font-semibold text-white">Hyperparameter Configuration Tree</h2>
          <div className="grid grid-cols-2 gap-4 font-mono-tech text-xs">
            <div className="p-3 rounded-lg bg-[#1E2430]/60 border border-white/[0.04]">
              <span className="text-[#8B95A5] block">Optimizer</span>
              <span className="text-white font-bold">AdamW 8-bit (Unsloth)</span>
            </div>
            <div className="p-3 rounded-lg bg-[#1E2430]/60 border border-white/[0.04]">
              <span className="text-[#8B95A5] block">Learning Rate</span>
              <span className="text-white font-bold">2e-4 (Cosine Decay)</span>
            </div>
            <div className="p-3 rounded-lg bg-[#1E2430]/60 border border-white/[0.04]">
              <span className="text-[#8B95A5] block">Gradient Accumulation</span>
              <span className="text-white font-bold">4 steps</span>
            </div>
            <div className="p-3 rounded-lg bg-[#1E2430]/60 border border-white/[0.04]">
              <span className="text-[#8B95A5] block">Precision</span>
              <span className="text-white font-bold">bf16 (bfloat16 mixed)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
