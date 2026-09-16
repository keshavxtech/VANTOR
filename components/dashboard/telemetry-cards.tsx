"use client";

import React from "react";
import { Cpu, Bot, Zap, ShieldCheck } from "lucide-react";

const metrics = [
  {
    title: "CLUSTER COMPUTE",
    value: "94.2%",
    change: "8 Nodes Online",
    icon: Cpu,
    status: "OPTIMAL",
    statusColor: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20",
    sparkline: "M0 16 L10 14 L20 18 L30 10 L40 12 L50 6 L60 8 L70 2",
    sparklineColor: "#10B981",
  },
  {
    title: "ACTIVE AUTONOMOUS AGENTS",
    value: "14",
    change: "3 Tasks Executing",
    icon: Bot,
    status: "ACTIVE",
    statusColor: "text-[#7C3AED] bg-[#7C3AED]/10 border-[#7C3AED]/20",
    sparkline: "M0 18 L10 12 L20 14 L30 8 L40 10 L50 4 L60 6 L70 3",
    sparklineColor: "#7C3AED",
  },
  {
    title: "TOKEN GENERATION VELOCITY",
    value: "4.8k/s",
    change: "Peak 6.2k/s",
    icon: Zap,
    status: "STABLE",
    statusColor: "text-[#22D3EE] bg-[#22D3EE]/10 border-[#22D3EE]/20",
    sparkline: "M0 14 L10 16 L20 8 L30 14 L40 6 L50 10 L60 4 L70 5",
    sparklineColor: "#22D3EE",
  },
  {
    title: "EVAL PASS RATE",
    value: "98.4%",
    change: "+1.2% benchmark",
    icon: ShieldCheck,
    status: "VERIFIED",
    statusColor: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20",
    sparkline: "M0 15 L10 13 L20 11 L30 12 L40 8 L50 6 L60 4 L70 2",
    sparklineColor: "#10B981",
  },
];

export function TelemetryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.title}
            className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] hover:border-white/[0.10] hover:bg-[#1A2029] hover:-translate-y-0.5 transition-all duration-150 shadow-[0_4px_12px_rgba(0,0,0,0.4)] group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-sans font-medium text-[#5A6472] tracking-[0.05em] uppercase">
                  {metric.title}
                </span>
                <Icon className="w-4 h-4 text-[#8B95A5] group-hover:text-white transition-colors" />
              </div>

              <div className="text-[36px] font-sans font-semibold text-white tracking-tight leading-none my-3">
                {metric.value}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/[0.04]">
              <span className="text-xs font-sans text-[#8B95A5]">
                {metric.change}
              </span>

              {/* Sparkline & Badge */}
              <div className="flex items-center gap-2">
                <svg className="w-12 h-5 overflow-visible shrink-0" viewBox="0 0 70 20">
                  <path
                    d={metric.sparkline}
                    fill="none"
                    stroke={metric.sparklineColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </svg>
                <span
                  className={`text-[10px] font-mono-tech px-2 py-0.5 rounded-full border ${metric.statusColor}`}
                >
                  {metric.status}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
