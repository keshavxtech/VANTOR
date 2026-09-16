"use client";

import React, { useState, useEffect } from "react";
import { DeploymentTelemetryComponent } from "@/components/deployments/deployment-telemetry";
import { DeploymentFilters } from "@/components/deployments/deployment-filters";
import { DeploymentCard } from "@/components/deployments/deployment-card";
import { CreateDeploymentModal } from "@/components/deployments/create-deployment-modal";
import { DeploymentService } from "@/lib/services/deployment-service";
import { Deployment, DeploymentEnvironment, DeploymentStatus, CreateDeploymentInput } from "@/types/deployment";
import { Plus, Zap } from "lucide-react";

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [telemetry, setTelemetry] = useState(DeploymentService.getTelemetry());
  const [searchQuery, setSearchQuery] = useState("");
  const [envFilter, setEnvFilter] = useState<DeploymentEnvironment | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<DeploymentStatus | "ALL">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setDeployments(DeploymentService.getDeployments());
    setTelemetry(DeploymentService.getTelemetry());
  }, []);

  const handleCreateDeployment = (input: CreateDeploymentInput) => {
    DeploymentService.createDeployment(input);
    setDeployments(DeploymentService.getDeployments());
    setTelemetry(DeploymentService.getTelemetry());
  };

  const filteredDeployments = deployments.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.endpointUrl.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnv = envFilter === "ALL" || d.environment === envFilter;
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchesSearch && matchesEnv && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#22D3EE]" />
            <h1 className="text-xl font-sans font-bold text-white tracking-tight">Deployments</h1>
          </div>
          <p className="text-xs font-sans text-[#8B95A5] mt-1">
            vLLM & Ollama serving endpoints, edge agent swarms, autoscale groups, and API traffic metrics.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-sans font-medium transition-all shadow-[0_2px_10px_rgba(124,58,237,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Endpoint</span>
        </button>
      </div>

      <DeploymentTelemetryComponent telemetry={telemetry} />

      <DeploymentFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        envFilter={envFilter}
        setEnvFilter={setEnvFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {filteredDeployments.length === 0 ? (
        <div className="p-12 rounded-[14px] bg-[#161B22] border border-white/[0.06] text-center space-y-3">
          <Zap className="w-10 h-10 text-[#5A6472] mx-auto" />
          <h3 className="text-sm font-sans font-medium text-white">No active deployments found</h3>
          <p className="text-xs font-sans text-[#8B95A5] max-w-sm mx-auto">
            Try adjusting search or environment filters to discover provisioned inference endpoints.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeployments.map((d) => (
            <DeploymentCard key={d.id} deployment={d} />
          ))}
        </div>
      )}

      <CreateDeploymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleCreateDeployment}
      />
    </div>
  );
}
