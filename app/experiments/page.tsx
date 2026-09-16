"use client";

import React, { useState, useEffect } from "react";
import { ExperimentTelemetryComponent } from "@/components/experiments/experiment-telemetry";
import { ExperimentFilters } from "@/components/experiments/experiment-filters";
import { ExperimentCard } from "@/components/experiments/experiment-card";
import { CreateExperimentModal } from "@/components/experiments/create-experiment-modal";
import { CompareExperimentsModal } from "@/components/experiments/compare-experiments-modal";
import { ExperimentService } from "@/lib/services/experiment-service";
import { Experiment, ExperimentStatus, CreateExperimentInput } from "@/types/experiment";
import { Plus, FlaskConical, SlidersHorizontal } from "lucide-react";

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [telemetry, setTelemetry] = useState(ExperimentService.getTelemetry());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ExperimentStatus | "ALL">("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setExperiments(ExperimentService.getExperiments());
    setTelemetry(ExperimentService.getTelemetry());
  }, []);

  const handleCreateExperiment = (input: CreateExperimentInput) => {
    ExperimentService.createExperiment(input);
    setExperiments(ExperimentService.getExperiments());
    setTelemetry(ExperimentService.getTelemetry());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredExperiments = experiments.filter((exp) => {
    const matchesSearch =
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.datasetName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || exp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedExperiments = experiments.filter((exp) => selectedIds.includes(exp.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#7C3AED]" />
            <h1 className="text-xl font-sans font-bold text-white tracking-tight">Experiments</h1>
          </div>
          <p className="text-xs font-sans text-[#8B95A5] mt-1">
            Track hyperparameter sweeps, LoRA rank variations, loss convergence, and benchmark metrics.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {selectedIds.length >= 2 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1E2430] hover:bg-white/[0.08] border border-white/[0.08] text-white text-xs font-sans font-medium transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#7C3AED]" />
              <span>Compare Selected ({selectedIds.length})</span>
            </button>
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-sans font-medium transition-all shadow-[0_2px_10px_rgba(124,58,237,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Experiment</span>
          </button>
        </div>
      </div>

      <ExperimentTelemetryComponent telemetry={telemetry} />

      <ExperimentFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {filteredExperiments.length === 0 ? (
        <div className="p-12 rounded-[14px] bg-[#161B22] border border-white/[0.06] text-center space-y-3">
          <FlaskConical className="w-10 h-10 text-[#5A6472] mx-auto" />
          <h3 className="text-sm font-sans font-medium text-white">No experiments found</h3>
          <p className="text-xs font-sans text-[#8B95A5] max-w-sm mx-auto">
            Try adjusting search or status filters to discover hyperparameter sweeps.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExperiments.map((exp) => (
            <ExperimentCard
              key={exp.id}
              experiment={exp}
              isSelected={selectedIds.includes(exp.id)}
              onToggleSelect={() => toggleSelect(exp.id)}
            />
          ))}
        </div>
      )}

      <CreateExperimentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAdd={handleCreateExperiment}
      />

      <CompareExperimentsModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        experiments={selectedExperiments}
      />
    </div>
  );
}
