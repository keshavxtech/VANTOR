"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FolderGit2, Cpu, FlaskConical, Bot, Terminal, Plus } from "lucide-react";

const quickActions = [
  { label: "New Project", icon: FolderGit2, desc: "Initialize AI workspace", href: "/projects", primary: true },
  { label: "Register Model", icon: Cpu, desc: "Connect model weights", href: "/models", primary: false },
  { label: "Run Experiment", icon: FlaskConical, desc: "Launch eval sweep", href: "/experiments", primary: false },
  { label: "Deploy Agent", icon: Bot, desc: "Spin up worker agent", href: "/agents", primary: false },
  { label: "Prompt Lab", icon: Terminal, desc: "Test system prompts", href: "/prompt-lab", primary: false },
];

export function QuickLauncher() {
  const router = useRouter();

  return (
    <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h2 className="text-sm font-sans font-semibold text-white tracking-normal">Quick Launch Actions</h2>
        <span className="text-[11px] font-sans font-medium text-[#5A6472] tracking-[0.05em] uppercase">5 QUICK COMMANDS</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              type="button"
              key={action.label}
              onClick={() => router.push(action.href)}
              className={`flex flex-col items-start p-4 rounded-[10px] text-left transition-all duration-150 active:scale-[0.98] group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 ${
                action.primary
                  ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-md shadow-[#7C3AED]/20"
                  : "bg-[#1E2430]/60 border border-white/[0.06] text-white hover:border-white/[0.12] hover:bg-[#1E2430]"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <Icon className={`w-4 h-4 ${action.primary ? "text-white" : "text-[#8B95A5] group-hover:text-white"} transition-colors`} />
                <Plus className={`w-3.5 h-3.5 ${action.primary ? "text-white/80" : "text-[#5A6472] group-hover:text-white"} transition-colors`} />
              </div>
              <span className="text-sm font-sans font-medium text-white mb-0.5">{action.label}</span>
              <span className={`text-xs font-sans ${action.primary ? "text-white/70" : "text-[#8B95A5]"} line-clamp-1`}>{action.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
