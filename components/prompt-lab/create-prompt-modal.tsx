"use client";

import React, { useState } from "react";
import { CreatePromptInput, Prompt } from "@/types/prompt";
import { X, Terminal } from "lucide-react";

interface CreatePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: CreatePromptInput) => void;
}

export function CreatePromptModal({ isOpen, onClose, onAdd }: CreatePromptModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Prompt["category"]>("Code");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.2);
  const [model, setModel] = useState("Claude Sonnet 5");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // extract variables matching {{var_name}}
    const varMatches = userPrompt.match(/\{\{([^}]+)\}\}/g) || [];
    const variables = Array.from(new Set(varMatches.map((m) => m.replace(/[\{\}]/g, "").trim())));

    onAdd({
      name: name.trim(),
      description: description.trim(),
      category,
      systemPrompt: systemPrompt.trim(),
      userPrompt: userPrompt.trim(),
      variables,
      temperature,
      model,
      projectId: "proj_agent_refactor",
      projectName: "Autonomous Code Refactoring Agent",
    });

    setName("");
    setDescription("");
    setSystemPrompt("");
    setUserPrompt("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-[14px] bg-[#161B22] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#7C3AED]" />
            <h2 className="text-base font-sans font-semibold text-white">Create Prompt Template</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8B95A5] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-sans">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-[#8B95A5] font-medium">Prompt Identifier Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. AST Structural Code Refactoring Guardrail"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8B95A5] font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Prompt["category"])}
                className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
              >
                <option value="Code" className="bg-[#161B22]">Code</option>
                <option value="Agent" className="bg-[#161B22]">Agent</option>
                <option value="Evaluation" className="bg-[#161B22]">Evaluation</option>
                <option value="Extraction" className="bg-[#161B22]">Extraction</option>
                <option value="General" className="bg-[#161B22]">General</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#8B95A5] font-medium">Default Model Target</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
              >
                <option value="Claude Sonnet 5" className="bg-[#161B22]">Claude Sonnet 5</option>
                <option value="Gemini 3.6 Flash" className="bg-[#161B22]">Gemini 3.6 Flash</option>
                <option value="GPT-5.6 Luna" className="bg-[#161B22]">GPT-5.6 Luna</option>
                <option value="Llama 3.1 70B Instruct" className="bg-[#161B22]">Llama 3.1 70B Instruct</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#8B95A5] font-medium">Temperature ({temperature})</label>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full mt-2 cursor-pointer accent-[#7C3AED]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[#8B95A5] font-medium">System Instructions</label>
            <textarea
              rows={2}
              placeholder="You are an expert compiler agent..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] transition-colors resize-none font-mono-tech"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#8B95A5] font-medium">User Prompt Template (use {"{{variable_name}}"} brackets)</label>
            <textarea
              rows={3}
              placeholder="Refactor the following function:\n\n{{code_snippet}}"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] transition-colors resize-none font-mono-tech"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#1E2430] text-white hover:bg-white/[0.08] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors font-medium shadow-md shadow-[#7C3AED]/20"
            >
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
