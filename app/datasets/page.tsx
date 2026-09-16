"use client";

import React, { useState, useEffect } from "react";
import { DatasetTelemetryComponent } from "@/components/datasets/dataset-telemetry";
import { DatasetFilters } from "@/components/datasets/dataset-filters";
import { DatasetCard } from "@/components/datasets/dataset-card";
import { AddDatasetModal } from "@/components/datasets/add-dataset-modal";
import { DatasetService } from "@/lib/services/dataset-service";
import { Dataset, DatasetFormat, DatasetStatus, CreateDatasetInput } from "@/types/dataset";
import { Plus, Database } from "lucide-react";

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [telemetry, setTelemetry] = useState(DatasetService.getTelemetry());
  const [searchQuery, setSearchQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState<DatasetFormat | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<DatasetStatus | "ALL">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setDatasets(DatasetService.getDatasets());
    setTelemetry(DatasetService.getTelemetry());
  }, []);

  const handleCreateDataset = (input: CreateDatasetInput) => {
    DatasetService.createDataset(input);
    setDatasets(DatasetService.getDatasets());
    setTelemetry(DatasetService.getTelemetry());
  };

  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch =
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.version.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = formatFilter === "ALL" || dataset.format === formatFilter;
    const matchesStatus = statusFilter === "ALL" || dataset.status === statusFilter;
    return matchesSearch && matchesFormat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#22D3EE]" />
            <h1 className="text-xl font-sans font-bold text-white tracking-tight">Datasets</h1>
          </div>
          <p className="text-xs font-sans text-[#8B95A5] mt-1">
            Data partitions, instruction tuning corpuses, vector embeddings, and evaluation benchmarks.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-sans font-medium transition-all shadow-[0_2px_10px_rgba(124,58,237,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>Attach Dataset</span>
        </button>
      </div>

      <DatasetTelemetryComponent telemetry={telemetry} />

      <DatasetFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        formatFilter={formatFilter}
        setFormatFilter={setFormatFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {filteredDatasets.length === 0 ? (
        <div className="p-12 rounded-[14px] bg-[#161B22] border border-white/[0.06] text-center space-y-3">
          <Database className="w-10 h-10 text-[#5A6472] mx-auto" />
          <h3 className="text-sm font-sans font-medium text-white">No datasets found</h3>
          <p className="text-xs font-sans text-[#8B95A5] max-w-sm mx-auto">
            Try adjusting your search query or format filters to discover connected data partitions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDatasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      )}

      <AddDatasetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleCreateDataset}
      />
    </div>
  );
}
