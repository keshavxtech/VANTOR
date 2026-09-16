"use client";

import React, { useState, useEffect } from "react";
import { ModelTelemetryBar } from "@/components/models/model-telemetry";
import { ModelFilters } from "@/components/models/model-filters";
import { ModelCard } from "@/components/models/model-card";
import { AddModelModal } from "@/components/models/add-model-modal";
import { ModelService } from "@/lib/services/model-service";
import { Model, CreateModelInput } from "@/types/model";
import { Plus, Cpu } from "lucide-react";

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [telemetry, setTelemetry] = useState(ModelService.getTelemetry());
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState("All Providers");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setModels(ModelService.getModels());
    setTelemetry(ModelService.getTelemetry());
  }, []);

  const handleCreateModel = (input: CreateModelInput) => {
    ModelService.createModel(input);
    setModels(ModelService.getModels());
    setTelemetry(ModelService.getTelemetry());
  };

  const filteredModels = models.filter((model) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      model.name.toLowerCase().includes(query) ||
      model.description.toLowerCase().includes(query) ||
      model.version.toLowerCase().includes(query) ||
      (model.tags ?? []).some((tag) => tag.toLowerCase().includes(query));
    const matchesProvider = providerFilter === "All Providers" || model.provider === providerFilter;
    const matchesType = typeFilter === "All Types" || model.type === typeFilter;
    const matchesStatus = statusFilter === "All Statuses" || model.status === statusFilter;
    return matchesSearch && matchesProvider && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#7C3AED]" />
            <h1 className="text-xl font-sans font-bold text-white tracking-tight">Models</h1>
          </div>
          <p className="text-xs font-sans text-[#8B95A5] mt-1">
            Registry of foundation LLMs, custom fine-tunes, and local model artifacts.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-sans font-medium transition-all shadow-[0_2px_10px_rgba(124,58,237,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Model</span>
        </button>
      </div>

      <ModelTelemetryBar telemetry={telemetry} />

      <ModelFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedProvider={providerFilter}
        onProviderChange={setProviderFilter}
        selectedType={typeFilter}
        onTypeChange={setTypeFilter}
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={() => {
          setSearchQuery("");
          setProviderFilter("All Providers");
          setTypeFilter("All Types");
          setStatusFilter("All Statuses");
        }}
      />

      {filteredModels.length === 0 ? (
        <div className="p-12 rounded-[14px] bg-[#161B22] border border-white/[0.06] text-center space-y-3">
          <Cpu className="w-10 h-10 text-[#5A6472] mx-auto" />
          <h3 className="text-sm font-sans font-medium text-white">No models found</h3>
          <p className="text-xs font-sans text-[#8B95A5] max-w-sm mx-auto">
            Try adjusting your search query or filters to discover registered foundation models.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      )}

      <AddModelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateModel}
      />
    </div>
  );
}
