"use client";

import React, { useState } from "react";
import { CreateExperimentInput, ExperimentStatus } from "@/types/experiment";
import { X, FlaskConical, Cpu, Database } from "lucide-react";

interface CreateExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: CreateExperimentInput) => void;
}

export function CreateExperimentModal({ isOpen, onClose, onAdd }: CreateExperimentModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modelName, setModelName] = useState("Llama 3.1 70B Instruct");
  const [datasetName, setDatasetName] = useState("Code-Instruct-Python-v3");
  const [promptVersion, setPromptVersion] = useState("v2.1");
  const [tagsInput, setTagsInput] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onAdd({
      name: name.trim(),
      description: description.trim(),
      projectId: "proj_llama3_70b",
      projectName: "Llama-3 70B Quantized Fine-Tuner",
      modelId: "mod_llama31_70b",
      modelName,
      datasetId: "ds_code_instruct_v3",
      datasetName,
      promptVersion: promptVersion.trim() || "v1.0",
      status: "running",
      tags,
    });

    setName("");
    setDescription("");
    setTagsInput("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-[14px] bg-[#161B22] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#7C3AED]" />
            <h2 className="text-base font-sans font-semibold text-white">Launch Experiment Sweep</h2>
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
            <label className="text-[#8B95A5] font-medium">Experiment Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Llama-3 70B LoRA Rank Sweep"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#8B95A5] font-medium">Base Model Target</label>
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
              >
                <option value="Llama 3.1 70B Instruct" className="bg-[#161B22]">Llama 3.1 70B Instruct</option>
                <option value="Gemini 3.6 Flash" className="bg-[#161B22]">Gemini 3.6 Flash</option>
                <option value="Claude Sonnet 5" className="bg-[#161B22]">Claude Sonnet 5</option>
                <option value="GPT-5.6 Luna" className="bg-[#161B22]">GPT-5.6 Luna</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#8B95A5] font-medium">Dataset Partition</label>
              <select
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
              >
                <option value="Code-Instruct-Python-v3" className="bg-[#161B22]">Code-Instruct-Python-v3</option>
                <option value="Tech-Manuals-Vector-Store" className="bg-[#161B22]">Tech-Manuals-Vector-Store</option>
                <option value="AST-Refactor-Eval-Suite" className="bg-[#161B22]">AST-Refactor-Eval-Suite</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[#8B95A5] font-medium">Prompt Version Tag</label>
            <input
              type="text"
              value={promptVersion}
              onChange={(e) => setPromptVersion(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#8B95A5] font-medium">Description & Objectives</label>
            <textarea
              rows={3}
              placeholder="Hypothesis, hyperparameter ranges (learning rate, rank, batch size)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] transition-colors resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#8B95A5] font-medium">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="LoRA, Unsloth, FineTuning, Sweep"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
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
              Launch Run
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
