"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  FlaskConical,
  Database,
  Terminal,
  Bot,
  Activity,
  Rocket,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderGit2 },
  { name: "Models", href: "/models", icon: Cpu },
  { name: "Experiments", href: "/experiments", icon: FlaskConical },
  { name: "Datasets", href: "/datasets", icon: Database },
  { name: "Prompt Lab", href: "/prompt-lab", icon: Terminal },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "Evaluations", href: "/evaluations", icon: Activity },
  { name: "Deployments", href: "/deployments", icon: Rocket },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-white/[0.06] bg-[#0A0E14] transition-all duration-200 ease-in-out select-none z-20 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Navigation Header Label */}
      {!collapsed && (
        <div className="pt-5 px-4 pb-2 text-[11px] font-sans font-medium text-[#5A6472] tracking-[0.05em] uppercase">
          ENGINEERING CONSOLE
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 py-2 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-sans font-medium transition-all rounded-[8px]",
                isActive
                  ? "bg-[#7C3AED]/12 text-white font-semibold"
                  : "text-[#8B95A5] hover:text-white hover:bg-white/[0.04]"
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-[#7C3AED]" : "text-[#8B95A5]"
                )}
              />
              {!collapsed && (
                <span className="truncate tracking-normal">{item.name}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-white/[0.06] flex items-center justify-between bg-[#0A0E14]">
        {!collapsed && (
          <span className="px-1 text-[11px] font-mono-tech text-[#5A6472] tracking-wider uppercase">
            SYS // v0.1.0
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-[#8B95A5] hover:text-white hover:bg-white/[0.04] transition-colors ml-auto active:scale-95"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
