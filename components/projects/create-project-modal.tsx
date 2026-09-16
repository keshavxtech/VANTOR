"use client";

import React, { useState } from "react";
import { X, Loader2, FolderPlus, Sparkles } from "lucide-react";
import { CreateProjectInput, ProjectType, ProjectFramework, ProjectStatus } from "@/types/project";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateProjectInput) => void;
}

const projectTypes: ProjectType[] = [
  "Fine-Tuning",
  "Autonomous Agent",
  "RAG / Retrieval",
  "Model Evaluation",
  "Quantization",
  "Prompt Engineering",
];

const frameworks: ProjectFramework[] = [
  "PyTorch",
  "Transformers",
  "LangChain",
  "Unsloth",
  "LlamaIndex",
  "vLLM",
  "Custom Python",
];

export function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ProjectType>("Fine-Tuning");
  const [framework, setFramework] = useState<ProjectFramework>("PyTorch");
  const [status, setStatus] = useState<ProjectStatus>("active");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { name?: string; description?: string } = {};
    if (!name.trim()) {
      newErrors.name = "Project name is required.";
    }
    if (!description.trim()) {
      newErrors.description = "Project description is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        name: name.trim(),
        description: description.trim(),
        type,
        framework,
        status,
      });
      setIsSubmitting(false);
      setName("");
      setDescription("");
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 transition-opacity duration-200">
      <div className="w-full max-w-lg bg-[#161B22] border border-white/[0.10] rounded-[14px] shadow-[0_12px_32px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#7C3AED]/12 border border-[#7C3AED]/30 flex items-center justify-center text-[#7C3AED]">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-sans font-semibold text-white">Create New Project</h2>
              <p className="text-xs font-sans text-[#8B95A5]">Initialize an AI engineering workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8B95A5] hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-medium text-white">
              Project Name <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Llama-3 70B Fine-Tuner"
              className="w-full bg-[#1E2430] border border-white/[0.06] rounded-[10px] px-3.5 py-2 text-xs font-sans text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
            {errors.name && <p className="text-[11px] font-sans text-[#EF4444]">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-medium text-white">
              Description <span className="text-[#EF4444]">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the engineering objectives, architecture or datasets..."
              className="w-full bg-[#1E2430] border border-white/[0.06] rounded-[10px] px-3.5 py-2 text-xs font-sans text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] transition-colors resize-none"
            />
            {errors.description && (
              <p className="text-[11px] font-sans text-[#EF4444]">{errors.description}</p>
            )}
          </div>

          {/* Type & Framework Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Project Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-medium text-white">Project Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
                className="w-full bg-[#1E2430] border border-white/[0.06] rounded-[10px] px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-[#7C3AED] cursor-pointer"
              >
                {projectTypes.map((t) => (
                  <option key={t} value={t} className="bg-[#161B22] text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Framework */}
            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-medium text-white">Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value as ProjectFramework)}
                className="w-full bg-[#1E2430] border border-white/[0.06] rounded-[10px] px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-[#7C3AED] cursor-pointer"
              >
                {frameworks.map((f) => (
                  <option key={f} value={f} className="bg-[#161B22] text-white">
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Initial Status */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-medium text-white">Initial Status</label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(["active", "draft", "archived"] as ProjectStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`py-2 px-3 rounded-[8px] text-xs font-sans capitalize border transition-all ${
                    status === s
                      ? "bg-[#7C3AED]/12 border-[#7C3AED] text-white font-medium"
                      : "bg-[#1E2430]/60 border-white/[0.06] text-[#8B95A5] hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[10px] bg-transparent border border-white/[0.06] text-xs font-sans text-[#8B95A5] hover:text-white hover:bg-white/[0.04] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-[10px] bg-[#7C3AED] text-xs font-sans font-semibold text-white hover:bg-[#6D28D9] transition-all shadow-md shadow-[#7C3AED]/20 active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Initializing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
