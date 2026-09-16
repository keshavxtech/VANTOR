"use client";

import React from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import { Cpu, Database, FlaskConical, Clock } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
      case "draft":
        return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
      case "archived":
        return "bg-[#1E2430] text-[#5A6472] border-white/[0.06]";
      default:
        return "bg-[#1E2430] text-[#8B95A5] border-white/[0.06]";
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1A2029] hover:-translate-y-0.5 transition-all duration-150 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full space-y-4">
        {/* Top Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-sans font-semibold text-white group-hover:text-[#7C3AED] transition-colors leading-snug">
              {project.name}
            </h3>
            <span
              className={`text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full border capitalize shrink-0 ${getStatusBadge(
                project.status
              )}`}
            >
              {project.status}
            </span>
          </div>

          <p className="text-xs font-sans text-[#8B95A5] line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tags & Framework */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded-md bg-[#1E2430] border border-white/[0.06] text-white">
              {project.framework}
            </span>
            <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded-md bg-[#1E2430]/60 border border-white/[0.04] text-[#8B95A5]">
              {project.type}
            </span>
          </div>

          {/* Counters & Metadata */}
          <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-sans text-[#8B95A5]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5" title="Models">
                <Cpu className="w-3.5 h-3.5 text-[#5A6472]" />
                <span className="font-mono-tech text-[11px]">{project.modelsCount}</span>
              </span>
              <span className="flex items-center gap-1.5" title="Datasets">
                <Database className="w-3.5 h-3.5 text-[#5A6472]" />
                <span className="font-mono-tech text-[11px]">{project.datasetsCount}</span>
              </span>
              <span className="flex items-center gap-1.5" title="Experiments">
                <FlaskConical className="w-3.5 h-3.5 text-[#5A6472]" />
                <span className="font-mono-tech text-[11px]">{project.experimentsCount}</span>
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono-tech text-[#5A6472]">
              <Clock className="w-3 h-3" />
              <span>{formatDate(project.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
