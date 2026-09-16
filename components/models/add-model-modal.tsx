"use client";

import React, { useState } from "react";
import { X, Loader2, Cpu, Sparkles } from "lucide-react";
import { CreateModelInput, ModelProvider, ModelType, ModelStatus } from "@/types/model";

interface AddModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateModelInput) => void;
}

const providers: ModelProvider[] = ["Google", "OpenAI", "Anthropic", "Meta", "Mistral", "Local / Custom"];
const types: ModelType[] = ["LLM", "Vision LLM", "Code Engine", "Embedding", "Audio Transcriber"];

export function AddModelModal({ isOpen, onClose, onSubmit }: AddModelModalProps) {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState<ModelProvider>("Google");
  const [type, setType] = useState<ModelType>("LLM");
  const [version, setVersion] = useState("v1.0");
  const [description, setDescription] = useState("");
  const [contextWindow, setContextWindow] = useState("128,000 tokens");
  const [status, setStatus] = useState<ModelStatus>("ready");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: { name?: string; description?: string } = {};
    if (!name.trim()) errs.name = "Model name is required.";
    if (!description.trim()) errs.description = "Description is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        name: name.trim(),
        provider,
        type,
        version: version.trim() || "v1.0",
        description: description.trim(),
        contextWindow: contextWindow.trim() || "128k tokens",
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
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#7C3AED]/12 border border-[#7C3AED]/30 flex items-center justify-center text-[#7C3AED]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-sans font-semibold text-white">Add Model to Catalog</h2>
              <p className="text-xs font-sans text-[#8B95A5]">Register AI model weights or endpoint metadata</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#8B95A5] hover:text-white hover:bg-white/[0.04] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-medium text-white">Model Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gemini 3.6 Flash"
              className="w-full bg-[#1E2430] border border-white/[0.06] rounded-[10px] px-3.5 py-2 text-xs font-sans text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED]"
            />
            {errors.name && <p className="text-[11px] font-sans text-[#EF4444]">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-medium text-white">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as ModelProvider)}
                className="w-full bg-[#1E2430] border border-white/[0.06] rounded-[10px] px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-[#7C3AED]"
              >
                {providers.map((p) => (
                  <option key={p} value={p} className="bg-[#161B22] text-white">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-medium text-white">Model Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ModelType)}
                className="w-full bg-[#1E2430] border border-white/[0.06] rounded-[10px] px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-[#7C3AED]"
              >
                {types.map((t) => (
                  <option key={t} value={t} className="bg-[#161B22] text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-medium text-white">Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. v1.5-002"
                className="w-full bg-[#1E2430] border border-white/[0.06] rounded-[10px] px-3.5 py-2 text-xs font-sans text-white focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-medium text-white">Context Window</label>
              <input
                type="text"
                value={contextWindow}
                onChange={(e) => setContextWindow(e.target.value)}
                placeholder="e.g. 128,000 tokens"
                className="w-full bg-[#1E2430] border border-white/[0.06] rounded-[10px] px-3.5 py-2 text-xs font-sans text-white focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-medium text-white">Description *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical summary of parameters, training objectives or specialization..."
              className="w-full bg-[#1E2430] border border-white/[0.06] rounded-[10px] px-3.5 py-2 text-xs font-sans text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] resize-none"
            />
            {errors.description && <p className="text-[11px] font-sans text-[#EF4444]">{errors.description}</p>}
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[10px] bg-transparent border border-white/[0.06] text-xs font-sans text-[#8B95A5] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-[10px] bg-[#7C3AED] text-xs font-sans font-semibold text-white hover:bg-[#6D28D9] flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Add Model</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
