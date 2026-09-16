"use client";

import React, { useState, useEffect } from "react";
import { EvaluationTelemetryComponent } from "@/components/evaluations/evaluation-telemetry";
import { EvaluationFilters } from "@/components/evaluations/evaluation-filters";
import { EvaluationCard } from "@/components/evaluations/evaluation-card";
import { RunEvaluationModal } from "@/components/evaluations/run-evaluation-modal";
import { EvaluationService } from "@/lib/services/evaluation-service";
import { Evaluation, EvaluationStatus, CreateEvaluationInput } from "@/types/evaluation";
import { Plus, Activity } from "lucide-react";

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [telemetry, setTelemetry] = useState(EvaluationService.getTelemetry());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EvaluationStatus | "ALL">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setEvaluations(EvaluationService.getEvaluations());
    setTelemetry(EvaluationService.getTelemetry());
  }, []);

  const handleCreateEvaluation = (input: CreateEvaluationInput) => {
    EvaluationService.createEvaluation(input);
    setEvaluations(EvaluationService.getEvaluations());
    setTelemetry(EvaluationService.getTelemetry());
  };

  const filteredEvaluations = evaluations.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.datasetName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#10B981]" />
            <h1 className="text-xl font-sans font-bold text-white tracking-tight">Evaluations</h1>
          </div>
          <p className="text-xs font-sans text-[#8B95A5] mt-1">
            Automated test suites, LLM-as-a-judge scorecards, hallucination checks, and regression reports.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-sans font-medium transition-all shadow-[0_2px_10px_rgba(124,58,237,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>Run Evaluation</span>
        </button>
      </div>

      <EvaluationTelemetryComponent telemetry={telemetry} />

      <EvaluationFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {filteredEvaluations.length === 0 ? (
        <div className="p-12 rounded-[14px] bg-[#161B22] border border-white/[0.06] text-center space-y-3">
          <Activity className="w-10 h-10 text-[#5A6472] mx-auto" />
          <h3 className="text-sm font-sans font-medium text-white">No evaluation suites found</h3>
          <p className="text-xs font-sans text-[#8B95A5] max-w-sm mx-auto">
            Try adjusting search or status filters to discover evaluation suites.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvaluations.map((item) => (
            <EvaluationCard key={item.id} evaluation={item} />
          ))}
        </div>
      )}

      <RunEvaluationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleCreateEvaluation}
      />
    </div>
  );
}
