"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ProjectService } from "@/lib/services/project-service";
import { Project } from "@/types/project";
import {
  ArrowLeft,
  Cpu,
  Database,
  FlaskConical,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";

type DetailTab = "overview" | "models" | "datasets" | "experiments" | "activity";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  useEffect(() => {
    if (id) {
      const found = ProjectService.getProjectById(id);
      if (found) {
        setProject(found);
      }
    }
  }, [id]);

  if (!project) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="text-base font-sans font-semibold text-white">Project Not Found</div>
        <p className="text-xs font-sans text-[#8B95A5]">
          The project workspace with ID <code className="font-mono-tech">{id}</code> does not exist or has been removed.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#1E2430] text-xs font-sans text-white hover:bg-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Projects</span>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove project "${project.name}"?`)) {
      ProjectService.deleteProject(project.id);
      router.push("/projects");
    }
  };

  const tabs: { id: DetailTab; label: string; count: number | null }[] = [
    { id: "overview", label: "Overview", count: null },
    { id: "models", label: "Models", count: project.modelsCount },
    { id: "datasets", label: "Datasets", count: project.datasetsCount },
    { id: "experiments", label: "Experiments", count: project.experimentsCount },
    { id: "activity", label: "Activity Logs", count: project.recentActivities?.length || 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Back Link & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-sans text-[#8B95A5] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>

        <button
          onClick={handleDelete}
          className="px-3 py-1.5 rounded-[8px] bg-red-500/10 border border-red-500/20 text-xs font-sans text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Archive Project</span>
        </button>
      </div>

      {/* Hero Header Banner */}
      <div className="p-6 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] relative overflow-hidden glow-ambient-violet">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full border capitalize ${
                  project.status === "active"
                    ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                    : project.status === "draft"
                    ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                    : "bg-[#1E2430] text-[#5A6472] border-white/[0.06]"
                }`}
              >
                {project.status}
              </span>
              <span className="text-xs font-mono-tech text-[#5A6472]">
                {project.id}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight">
              {project.name}
            </h1>
            <p className="text-sm font-sans text-[#8B95A5] max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 self-start shrink-0">
            <button
              onClick={() => router.push("/models")}
              className="px-3 py-2 rounded-[10px] bg-[#7C3AED] text-xs font-sans font-medium text-white hover:bg-[#6D28D9] transition-all flex items-center gap-1.5 shadow-md shadow-[#7C3AED]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Model</span>
            </button>
            <button
              onClick={() => router.push("/datasets")}
              className="px-3 py-2 rounded-[10px] bg-[#1E2430] border border-white/[0.06] text-xs font-sans text-white hover:border-white/[0.12] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#8B95A5]" />
              <span>Connect Dataset</span>
            </button>
          </div>
        </div>

        {/* Tags & Architecture Bar */}
        <div className="mt-6 pt-4 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-3">
            <span className="text-[#5A6472] font-medium">Framework:</span>
            <span className="font-mono-tech px-2 py-0.5 rounded bg-[#1E2430] border border-white/[0.06] text-white">
              {project.framework}
            </span>
            <span className="text-[#5A6472] font-medium">Type:</span>
            <span className="font-mono-tech px-2 py-0.5 rounded bg-[#1E2430]/60 border border-white/[0.04] text-[#8B95A5]">
              {project.type}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#8B95A5]">
            <span className="flex items-center gap-1 font-mono-tech text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#5A6472]" />
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-white/[0.06] flex items-center gap-6 text-sm font-sans">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === tab.id
                ? "text-white border-b-2 border-[#7C3AED]"
                : "text-[#8B95A5] hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className="text-[10px] font-mono-tech px-1.5 py-0.2 rounded-full bg-[#1E2430] border border-white/[0.06] text-[#8B95A5]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Contents */}

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Workspace Metrics & Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
              <h2 className="text-sm font-sans font-semibold text-white">Engineering Workspace Summary</h2>
              <div className="grid grid-cols-3 gap-4 p-4 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.04]">
                <div>
                  <span className="text-[11px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
                    REGISTERED MODELS
                  </span>
                  <span className="text-xl font-mono-tech font-semibold text-white">{project.modelsCount}</span>
                </div>
                <div>
                  <span className="text-[11px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
                    DATASETS CONNECTED
                  </span>
                  <span className="text-xl font-mono-tech font-semibold text-white">{project.datasetsCount}</span>
                </div>
                <div>
                  <span className="text-[11px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
                    EXPERIMENT RUNS
                  </span>
                  <span className="text-xl font-mono-tech font-semibold text-white">{project.experimentsCount}</span>
                </div>
              </div>
              <p className="text-xs font-sans text-[#8B95A5] leading-relaxed">
                This project provides an isolated environment for model weights, dataset partitions, and hyperparameter experiment tracking under the <code className="font-mono-tech text-white">{project.framework}</code> runtime engine.
              </p>
            </div>

            {/* Recent Activity */}
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
              <h2 className="text-sm font-sans font-semibold text-white">Recent Project Activity</h2>
              <div className="divide-y divide-white/[0.04]">
                {project.recentActivities && project.recentActivities.length > 0 ? (
                  project.recentActivities.map((act) => (
                    <div key={act.id} className="py-3 flex items-center justify-between text-xs font-sans">
                      <div className="space-y-0.5">
                        <p className="text-white font-medium">{act.action}</p>
                        <p className="text-[11px] text-[#5A6472]">by {act.user}</p>
                      </div>
                      <span className="text-[11px] font-mono-tech text-[#8B95A5]">{act.timestamp}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-sans text-[#8B95A5] py-2">No recent activity recorded.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info Panel */}
          <div className="space-y-6">
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
              <h3 className="text-xs font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em]">
                WORKSPACE METADATA
              </h3>
              <div className="space-y-3 text-xs font-sans">
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-[#8B95A5]">Project ID</span>
                  <span className="font-mono-tech text-white">{project.id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-[#8B95A5]">Framework</span>
                  <span className="font-mono-tech text-white">{project.framework}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-[#8B95A5]">Type</span>
                  <span className="font-mono-tech text-white">{project.type}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#8B95A5]">Status</span>
                  <span className="capitalize text-white">{project.status}</span>
                </div>
              </div>
            </div>

            {/* Quick Module Triggers */}
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-3">
              <h3 className="text-xs font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em]">
                MODULE QUICK ACTIONS
              </h3>
              <button
                onClick={() => setActiveTab("models")}
                className="w-full text-left p-3 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.06] hover:bg-[#1E2430] transition-colors flex items-center justify-between text-xs font-sans text-white group"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#8B95A5] group-hover:text-[#7C3AED] transition-colors" />
                  <span>Register Model Weights</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-[#5A6472]" />
              </button>

              <button
                onClick={() => setActiveTab("datasets")}
                className="w-full text-left p-3 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.06] hover:bg-[#1E2430] transition-colors flex items-center justify-between text-xs font-sans text-white group"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#8B95A5] group-hover:text-[#7C3AED] transition-colors" />
                  <span>Attach Dataset</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-[#5A6472]" />
              </button>

              <button
                onClick={() => setActiveTab("experiments")}
                className="w-full text-left p-3 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.06] hover:bg-[#1E2430] transition-colors flex items-center justify-between text-xs font-sans text-white group"
              >
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-[#8B95A5] group-hover:text-[#7C3AED] transition-colors" />
                  <span>New Experiment Sweep</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-[#5A6472]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODELS TAB */}
      {activeTab === "models" && (
        <div className="p-12 rounded-[14px] bg-[#161B22] border border-white/[0.06] text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#1E2430] border border-white/[0.06] flex items-center justify-center text-[#5A6472] mx-auto">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-sans font-semibold text-white">No models registered yet.</h3>
            <p className="text-xs font-sans text-[#8B95A5]">
              Register local checkpoint weights, GGUF/ONNX quantizations, or open Hugging Face models for this project workspace.
            </p>
          </div>
          <button
            onClick={() => router.push("/models")}
            className="px-4 py-2 rounded-[10px] bg-[#7C3AED] text-xs font-sans font-medium text-white hover:bg-[#6D28D9] transition-colors inline-flex items-center gap-2 shadow-md shadow-[#7C3AED]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Register Model</span>
          </button>
        </div>
      )}

      {/* DATASETS TAB */}
      {activeTab === "datasets" && (
        <div className="p-12 rounded-[14px] bg-[#161B22] border border-white/[0.06] text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#1E2430] border border-white/[0.06] flex items-center justify-center text-[#5A6472] mx-auto">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-sans font-semibold text-white">No datasets connected yet.</h3>
            <p className="text-xs font-sans text-[#8B95A5]">
              Attach CSV, JSONL, Parquet instruction tuning files or vector embedding data sources to this project.
            </p>
          </div>
          <button
            onClick={() => router.push("/datasets")}
            className="px-4 py-2 rounded-[10px] bg-[#7C3AED] text-xs font-sans font-medium text-white hover:bg-[#6D28D9] transition-colors inline-flex items-center gap-2 shadow-md shadow-[#7C3AED]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Dataset</span>
          </button>
        </div>
      )}

      {/* EXPERIMENTS TAB */}
      {activeTab === "experiments" && (
        <div className="p-12 rounded-[14px] bg-[#161B22] border border-white/[0.06] text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#1E2430] border border-white/[0.06] flex items-center justify-center text-[#5A6472] mx-auto">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-sans font-semibold text-white">No experiments recorded yet.</h3>
            <p className="text-xs font-sans text-[#8B95A5]">
              Record training loss curves, evaluation scorecards, and hyperparameter sweeps for this project.
            </p>
          </div>
          <button
            onClick={() => router.push("/experiments")}
            className="px-4 py-2 rounded-[10px] bg-[#7C3AED] text-xs font-sans font-medium text-white hover:bg-[#6D28D9] transition-colors inline-flex items-center gap-2 shadow-md shadow-[#7C3AED]/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Experiment</span>
          </button>
        </div>
      )}

      {/* ACTIVITY LOGS TAB */}
      {activeTab === "activity" && (
        <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
          <h2 className="text-sm font-sans font-semibold text-white">Workspace Audit Trail</h2>
          <div className="divide-y divide-white/[0.04]">
            {project.recentActivities && project.recentActivities.length > 0 ? (
              project.recentActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between text-xs font-sans">
                  <div className="space-y-0.5">
                    <p className="text-white font-medium">{act.action}</p>
                    <p className="text-[11px] text-[#5A6472]">by {act.user}</p>
                  </div>
                  <span className="text-[11px] font-mono-tech text-[#8B95A5]">{act.timestamp}</span>
                </div>
              ))
            ) : (
              <p className="text-xs font-sans text-[#8B95A5] py-2">No activity records found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
