"use client";

import React from "react";
import { FolderGit2, Cpu, Database, FlaskConical } from "lucide-react";
import { ProjectTelemetry } from "@/types/project";

interface ProjectTelemetryBarProps {
  telemetry: ProjectTelemetry;
}

export function ProjectTelemetryBar({ telemetry }: ProjectTelemetryBarProps) {
  const stats = [
    {
      title: "TOTAL PROJECTS",
      value: telemetry.totalProjects,
      subtitle: `${telemetry.activeProjects} Active`,
      icon: FolderGit2,
    },
    {
      title: "REGISTERED MODELS",
      value: telemetry.totalModels,
      subtitle: "Across Workspaces",
      icon: Cpu,
    },
    {
      title: "CONNECTED DATASETS",
      value: telemetry.totalDatasets,
      subtitle: "Ingested Sources",
      icon: Database,
    },
    {
      title: "RECORDED EXPERIMENTS",
      value: telemetry.totalExperiments,
      subtitle: "Eval Runs & Sweeps",
      icon: FlaskConical,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="p-4 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-sans font-medium text-[#5A6472] tracking-[0.05em] uppercase">
                {stat.title}
              </span>
              <div className="text-2xl font-sans font-semibold text-white tracking-tight leading-none">
                {stat.value}
              </div>
              <span className="text-xs font-sans text-[#8B95A5] block pt-0.5">
                {stat.subtitle}
              </span>
            </div>
            <div className="w-10 h-10 rounded-[10px] bg-[#1E2430] border border-white/[0.06] flex items-center justify-center text-[#8B95A5]">
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
