import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#0A0E14] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8"><Logo /></div>
        <div className="rounded-2xl border border-white/[0.07] bg-[#161B22] p-6 shadow-2xl shadow-black/30">
          {children}
        </div>
        <p className="text-center text-[11px] text-[#5A6472] mt-5">VANTOR · AI ENGINEERING WORKSPACE</p>
      </div>
    </main>
  );
}
