"use client";

import React from "react";
import Link from "next/link";
import { Deployment } from "@/types/deployment";
import { Zap, Cpu, Activity, Clock, Globe, ShieldCheck } from "lucide-react";

interface DeploymentCardProps {
  deployment: Deployment;
}

export function DeploymentCard({ deployment }: DeploymentCardProps) {
  const getStatusBadge = (status: Deployment["status"]) => {
    switch (status) {
      case "Active":
        return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
      case "Building":
        return "bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/20 animate-pulse";
      case "Paused":
        return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
      case "Failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Draft":
        return "bg-[#1E2430] text-[#5A6472] border-white/[0.06]";
    }
  };

  return (
    <Link href={`/deployments/${deployment.id}`} className="block group">
      <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1A2029] hover:-translate-y-0.5 transition-all duration-150 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full space-y-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#7C3AED]/12 border border-[#7C3AED]/20 text-[#7C3AED] font-semibold">
                  {deployment.environment}
                </span>
                <span className="text-[10px] font-mono-tech text-[#5A6472]">{deployment.version}</span>
              </div>
              <h3 className="text-base font-sans font-semibold text-white group-hover:text-[#7C3AED] transition-colors leading-snug pt-1">
                {deployment.name}
              </h3>
            </div>
            <span className={`text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full border capitalize shrink-0 ${getStatusBadge(deployment.status)}`}>
              {deployment.status}
            </span>
          </div>

          <p className="text-xs font-sans text-[#8B95A5] line-clamp-2 leading-relaxed">
            {deployment.description}
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5 p-2.5 rounded-lg bg-[#1E2430]/60 border border-white/[0.04]">
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="text-[#8B95A5]">Target {deployment.targetType}:</span>
              <span className="font-mono-tech text-white text-[11px] truncate max-w-[160px]">{deployment.targetName}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-sans pt-1 border-t border-white/[0.04]">
              <span className="text-[#8B95A5]">Latency: <strong className="text-[#22D3EE] font-mono-tech">{deployment.latencyMs}</strong></span>
              <span className="text-[#8B95A5]">Rate: <strong className="text-[#10B981] font-mono-tech">{deployment.throughput}</strong></span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-sans text-[#8B95A5]">
            <span className="text-[11px] font-mono-tech text-[#5A6472] truncate max-w-[180px]">
              {deployment.endpointUrl}
            </span>
            <Globe className="w-3.5 h-3.5 text-[#7C3AED]" />
          </div>
        </div>
      </div>
    </Link>
  );
}
