"use client";

import React, { useState } from "react";
import { CreateDeploymentInput, DeploymentEnvironment, DeploymentStatus } from "@/types/deployment";
import { X, Zap, Cpu } from "lucide-react";

interface CreateDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: CreateDeploymentInput) => void;
}

export function CreateDeploymentModal({ isOpen, onClose, onAdd }: CreateDeploymentModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetType, setTargetType] = useState<"Model" | "Agent">("Model");
  const [targetName, setTargetName] = useState("Llama 3.1 70B Instruct");
  const [environment, setEnvironment] = useState<DeploymentEnvironment>("Production");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      description: description.trim(),
      projectId: "proj_llama3_70b",
      projectName: "Llama-3 70B Quantized Fine-Tuner",
      targetType,
      targetId: "mod_llama31_70b",
      targetName,
      environment,
      version: "v1.0.0",
      status: "Active",
    });

    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-[14px] bg-[#161B22] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#22D3EE]" />
            <h2 className="text-base font-sans font-semibold text-white">Deploy Model / Agent Endpoint</h2>
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
            <label className="text-[#8B95A5] font-medium">Endpoint Identifier Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Llama-3 70B Code Fine-Tune Endpoint"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#8B95A5] font-medium">Target Type</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as "Model" | "Agent")}
                className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
              >
                <option value="Model" className="bg-[#161B22]">Model Weights</option>
                <option value="Agent" className="bg-[#161B22]">Agent Worker</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#8B95A5] font-medium">Target Artifact Name</label>
              <input
                type="text"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[#8B95A5] font-medium">Environment Tier</label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as DeploymentEnvironment)}
              className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
            >
              <option value="Production" className="bg-[#161B22]">Production</option>
              <option value="Staging" className="bg-[#161B22]">Staging</option>
              <option value="Development" className="bg-[#161B22]">Development</option>
              <option value="Edge Cluster" className="bg-[#161B22]">Edge Cluster</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[#8B95A5] font-medium">Description</label>
            <textarea
              rows={3}
              placeholder="Infrastructure hardware, auto-scaling policy, rate limits..."
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
              Provision Endpoint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
