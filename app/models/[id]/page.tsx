"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ModelService } from "@/lib/services/model-service";
import { Model } from "@/types/model";
import {
  ArrowLeft,
  Cpu,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Terminal,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function ModelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [model, setModel] = useState<Model | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "benchmarks" | "activity">("overview");

  useEffect(() => {
    if (id) {
      const found = ModelService.getModelById(id);
      if (found) {
        setModel(found);
      }
    }
  }, [id]);

  if (!model) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="text-base font-sans font-semibold text-white">Model Not Found</div>
        <p className="text-xs font-sans text-[#8B95A5]">
          The model registry record with ID <code className="font-mono-tech">{id}</code> does not exist or has been removed.
        </p>
        <Link
          href="/models"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#1E2430] text-xs font-sans text-white hover:bg-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Models</span>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove model "${model.name}"?`)) {
      ModelService.deleteModel(model.id);
      router.push("/models");
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/models"
          className="inline-flex items-center gap-2 text-xs font-sans text-[#8B95A5] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Models</span>
        </Link>

        <button
          onClick={handleDelete}
          className="px-3 py-1.5 rounded-[8px] bg-red-500/10 border border-red-500/20 text-xs font-sans text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Unregister Model</span>
        </button>
      </div>

      {/* Hero Header Banner */}
      <div className="p-6 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] relative overflow-hidden glow-ambient-violet">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded bg-[#1E2430] border border-white/[0.06] text-[#7C3AED] font-semibold">
                {model.provider}
              </span>
              <span className="text-xs font-mono-tech text-[#5A6472]">{model.version}</span>
              <span
                className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border capitalize ${
                  model.status === "ready"
                    ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                    : model.status === "preview"
                    ? "bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/20"
                    : "bg-[#1E2430] text-[#5A6472] border-white/[0.06]"
                }`}
              >
                {model.status}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight">
              {model.name}
            </h1>
            <p className="text-sm font-sans text-[#8B95A5] max-w-3xl leading-relaxed">
              {model.description}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 self-start shrink-0">
            <Link
              href={`/prompt-lab?modelId=${model.id}`}
              className="px-3 py-2 rounded-[10px] bg-[#7C3AED] text-xs font-sans font-medium text-white hover:bg-[#6D28D9] transition-all flex items-center gap-1.5 shadow-md shadow-[#7C3AED]/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test in Prompt Lab</span>
            </Link>
            <Link
              href={`/deployments?modelId=${model.id}`}
              className="px-3 py-2 rounded-[10px] bg-[#1E2430] border border-white/[0.06] text-xs font-sans text-white hover:border-white/[0.12] transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Deploy Endpoint</span>
            </Link>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="mt-6 pt-4 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-3">
            <span className="text-[#5A6472] font-medium">Type:</span>
            <span className="font-mono-tech px-2 py-0.5 rounded bg-[#1E2430] border border-white/[0.06] text-white">
              {model.type}
            </span>
            <span className="text-[#5A6472] font-medium">Context Window:</span>
            <span className="font-mono-tech px-2 py-0.5 rounded bg-[#1E2430]/60 border border-white/[0.04] text-[#8B95A5]">
              {model.contextWindow}
            </span>
          </div>

          {model.evalScore && (
            <div className="flex items-center gap-1 text-xs font-mono-tech text-[#10B981]">
              <Activity className="w-3.5 h-3.5" />
              <span>Eval Benchmark: {model.evalScore}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.06] flex items-center gap-6 text-sm font-sans">
        {(["overview", "benchmarks", "activity"] as const).map((tab) => (
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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
              <h2 className="text-sm font-sans font-semibold text-white">Model Architecture & Specifications</h2>
              <div className="grid grid-cols-3 gap-4 p-4 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.04]">
                <div>
                  <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
                    CONTEXT WINDOW
                  </span>
                  <span className="text-base font-mono-tech font-semibold text-white">{model.contextWindow}</span>
                </div>
                <div>
                  <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
                    PROVIDER
                  </span>
                  <span className="text-base font-mono-tech font-semibold text-[#7C3AED]">{model.provider}</span>
                </div>
                <div>
                  <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
                    ASSOCIATED PROJECTS
                  </span>
                  <span className="text-base font-mono-tech font-semibold text-white">{model.associatedProjectsCount}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-sans font-medium text-white">Supported Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#1E2430] text-[11px] font-mono-tech text-white flex items-center gap-1.5 border border-white/[0.06]">
                    <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> Structured JSON Generation
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#1E2430] text-[11px] font-mono-tech text-white flex items-center gap-1.5 border border-white/[0.06]">
                    <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> Function Calling / Tool Use
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#1E2430] text-[11px] font-mono-tech text-white flex items-center gap-1.5 border border-white/[0.06]">
                    <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> Long-Context RAG
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#1E2430] text-[11px] font-mono-tech text-white flex items-center gap-1.5 border border-white/[0.06]">
                    <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> Code Execution & Analysis
                  </span>
                </div>
              </div>
            </div>

            {/* Registered Tags */}
            {model.tags && model.tags.length > 0 && (
              <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-3">
                <h2 className="text-sm font-sans font-semibold text-white">Registry Metadata Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-full bg-[#1E2430] text-xs font-mono-tech text-[#8B95A5] border border-white/[0.06]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
              <h3 className="text-xs font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em]">
                MODEL REGISTRY ENTRY
              </h3>
              <div className="space-y-3 text-xs font-sans">
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-[#8B95A5]">Model ID</span>
                  <span className="font-mono-tech text-white">{model.id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-[#8B95A5]">Version Tag</span>
                  <span className="font-mono-tech text-white">{model.version}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-[#8B95A5]">Status</span>
                  <span className="capitalize text-white">{model.status}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#8B95A5]">Last Synced</span>
                  <span className="text-white">{new Date(model.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Benchmarks Tab */}
      {activeTab === "benchmarks" && (
        <div className="p-6 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
          <h2 className="text-sm font-sans font-semibold text-white">Evaluation Benchmark Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.04]">
              <span className="text-[10px] font-sans text-[#8B95A5] uppercase">HumanEval Pass@1</span>
              <div className="text-2xl font-mono-tech font-bold text-[#10B981] mt-1">91.4%</div>
            </div>
            <div className="p-4 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.04]">
              <span className="text-[10px] font-sans text-[#8B95A5] uppercase">SWE-bench Lite</span>
              <div className="text-2xl font-mono-tech font-bold text-[#22D3EE] mt-1">48.2%</div>
            </div>
            <div className="p-4 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.04]">
              <span className="text-[10px] font-sans text-[#8B95A5] uppercase">MMLU Pro</span>
              <div className="text-2xl font-mono-tech font-bold text-[#7C3AED] mt-1">86.7%</div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
          <h2 className="text-sm font-sans font-semibold text-white">Model Audit Trail</h2>
          <div className="divide-y divide-white/[0.04]">
            {model.recentActivities && model.recentActivities.length > 0 ? (
              model.recentActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between text-xs font-sans">
                  <div className="space-y-0.5">
                    <p className="text-white font-medium">{act.action}</p>
                    <p className="text-[11px] text-[#5A6472]">by {act.user}</p>
                  </div>
                  <span className="text-[11px] font-mono-tech text-[#8B95A5]">{act.timestamp}</span>
                </div>
              ))
            ) : (
              <p className="text-xs font-sans text-[#8B95A5] py-2">No recent model activity recorded.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
