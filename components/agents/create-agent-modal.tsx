"use client";

import React, { useState } from "react";
import { CreateAgentInput, AgentStatus, AgentTool } from "@/types/agent";
import { X, Bot, Cpu } from "lucide-react";

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: CreateAgentInput) => void;
}

export function CreateAgentModal({ isOpen, onClose, onAdd }: CreateAgentModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("Claude Sonnet 5");
  const [systemInstructions, setSystemInstructions] = useState("");
  const [status, setStatus] = useState<AgentStatus>("active");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const defaultTools: AgentTool[] = [
      { id: "tool_ast", name: "AST Parser & Mutator", type: "AST Mutation", enabled: true },
      { id: "tool_static", name: "ESLint / Static Analyzer", type: "Static Analysis", enabled: true },
      { id: "tool_test", name: "Jest / Vitest Runner", type: "Test Runner", enabled: true },
      { id: "tool_vector", name: "Codebase Embedding Index", type: "Vector Retrieval", enabled: false },
    ];

    onAdd({
      name: name.trim(),
      description: description.trim(),
      model,
      systemInstructions: systemInstructions.trim() || "You are an autonomous AI engineering agent.",
      status,
      tools: defaultTools,
      projectId: "proj_agent_refactor",
      projectName: "Autonomous Code Refactoring Agent",
    });

    setName("");
    setDescription("");
    setSystemInstructions("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-[14px] bg-[#161B22] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#7C3AED]" />
            <h2 className="text-base font-sans font-semibold text-white">Deploy Agent Instance</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8B95A5] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-sans">
          <div className="space-y-1">
            <label className="text-[#8B95A5] font-medium">Agent Identifier Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. AST Refactoring & Test Generator Agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#8B95A5] font-medium">Base Reasoning Model</label>
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
              <label className="text-[#8B95A5] font-medium">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AgentStatus)}
                className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
              >
                <option value="active" className="bg-[#161B22]">Active</option>
                <option value="idle" className="bg-[#161B22]">Idle</option>
                <option value="paused" className="bg-[#161B22]">Paused</option>
                <option value="training" className="bg-[#161B22]">Training</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[#8B95A5] font-medium">System Instructions</label>
            <textarea
              rows={3}
              placeholder="System prompt guiding agent decision loops..."
              value={systemInstructions}
              onChange={(e) => setSystemInstructions(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] transition-colors resize-none font-mono-tech"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#8B95A5] font-medium">Agent Role Description</label>
            <textarea
              rows={2}
              placeholder="High level description of agent capabilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] transition-colors resize-none"
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
              Deploy Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
