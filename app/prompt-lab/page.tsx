"use client";

import React, { useState, useEffect } from "react";
import { PromptTelemetryComponent } from "@/components/prompt-lab/prompt-telemetry";
import { PromptFilters } from "@/components/prompt-lab/prompt-filters";
import { PromptCard } from "@/components/prompt-lab/prompt-card";
import { CreatePromptModal } from "@/components/prompt-lab/create-prompt-modal";
import { PromptService } from "@/lib/services/prompt-service";
import { Prompt, CreatePromptInput } from "@/types/prompt";
import { Plus, Terminal } from "lucide-react";

export default function PromptLabPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [telemetry, setTelemetry] = useState(PromptService.getTelemetry());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Prompt["category"] | "ALL">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setPrompts(PromptService.getPrompts());
    setTelemetry(PromptService.getTelemetry());
  }, []);

  const handleCreatePrompt = (input: CreatePromptInput) => {
    PromptService.createPrompt(input);
    setPrompts(PromptService.getPrompts());
    setTelemetry(PromptService.getTelemetry());
  };

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#7C3AED]" />
            <h1 className="text-xl font-sans font-bold text-white tracking-tight">Prompt Lab</h1>
          </div>
          <p className="text-xs font-sans text-[#8B95A5] mt-1">
            System prompt guardrails, variable interpolation templates, and sandbox model execution.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-sans font-medium transition-all shadow-[0_2px_10px_rgba(124,58,237,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>New Template</span>
        </button>
      </div>

      <PromptTelemetryComponent telemetry={telemetry} />

      <PromptFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      {filteredPrompts.length === 0 ? (
        <div className="p-12 rounded-[14px] bg-[#161B22] border border-white/[0.06] text-center space-y-3">
          <Terminal className="w-10 h-10 text-[#5A6472] mx-auto" />
          <h3 className="text-sm font-sans font-medium text-white">No prompt templates found</h3>
          <p className="text-xs font-sans text-[#8B95A5] max-w-sm mx-auto">
            Try adjusting search or category filters to discover registered prompt templates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
        </div>
      )}

      <CreatePromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleCreatePrompt}
      />
    </div>
  );
}
