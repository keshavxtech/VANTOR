"use client";

import React from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface WorkspaceShellProps {
  children: React.ReactNode;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#0A0E14] overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#0A0E14] p-8 relative">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
