import React from "react";
import { TelemetryCards } from "@/components/dashboard/telemetry-cards";
import { ActiveSessions } from "@/components/dashboard/active-sessions";
import { QuickLauncher } from "@/components/dashboard/quick-launcher";
import Link from "next/link";
import { ShieldCheck, Activity, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero Control Banner */}
      <div className="p-6 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] relative overflow-hidden glow-ambient-violet">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#7C3AED]/12 border border-[#7C3AED]/30 text-[10px] font-sans font-medium text-[#7C3AED] uppercase tracking-[0.05em]">
                AI Engineering Platform
              </span>
              <span className="text-xs font-mono-tech text-[#5A6472]">
                LOCAL NODE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight">
              VANTOR WORKSPACE
            </h1>
            <p className="text-sm font-sans text-[#8B95A5] max-w-2xl leading-relaxed">
              Premium infrastructure control surface for autonomous agents, model evaluation, dataset curation, and prompt engineering.
            </p>
          </div>

          <div className="flex items-center gap-3.5 self-start md:self-auto shrink-0">
            <div className="px-4 py-2.5 rounded-[10px] bg-[#1E2430] border border-white/[0.06] flex items-center gap-3">
              <Activity className="w-4 h-4 text-[#10B981]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em]">NODE STATUS</span>
                <span className="text-xs font-mono-tech font-semibold text-white">OPERATIONAL</span>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-[10px] bg-[#1E2430] border border-white/[0.06] flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em]">VANTOR CORE</span>
                <span className="text-xs font-mono-tech font-semibold text-white">AI ENGINEERING</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Telemetry Overview */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.08em] text-[#5A6472]">Workspace Telemetry</div>
          <p className="text-xs text-[#8B95A5] mt-1">Live engineering signals from the VANTOR control plane.</p>
        </div>
        <Link href="/observability" className="inline-flex items-center gap-2 px-3 py-2 rounded-[9px] bg-[#1E2430] border border-white/[0.06] text-xs text-[#D7DCE3] hover:border-[#7C3AED]/40 hover:text-white transition-colors">
          <BarChart3 className="w-3.5 h-3.5" /> Open Observability
        </Link>
      </div>
      <TelemetryCards />

      {/* Quick Launch Command Center */}
      <QuickLauncher />
      
      {/* Active Engineering Sessions */}
      <ActiveSessions />
    </div>
  );
}
