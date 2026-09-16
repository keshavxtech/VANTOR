import { Deployment, CreateDeploymentInput, DeploymentTelemetry } from "@/types/deployment";

const STORAGE_KEY = "vantor_deployments_store_v1";

const initialSampleDeployments: Deployment[] = [
  {
    id: "dep_llama3_lora_prod",
    name: "Llama-3 70B Code Fine-Tune Endpoint",
    description: "Production vLLM inference endpoint serving quantized Llama-3 70B weights for internal IDE completion.",
    projectId: "proj_llama3_70b",
    projectName: "Llama-3 70B Quantized Fine-Tuner",
    targetType: "Model",
    targetId: "mod_llama31_70b",
    targetName: "Llama 3.1 70B Instruct",
    environment: "Production",
    version: "v2.1.0-prod",
    status: "Active",
    endpointUrl: "https://api.vantor.internal/v1/models/llama3-70b-code",
    latencyMs: "42 ms",
    throughput: "1,250 req/min",
    createdAt: "2026-08-25T10:00:00Z",
    updatedAt: "2026-09-04T14:30:00Z",
    history: [
      { id: "dh_1", version: "v2.1.0-prod", deployedAt: "2 hours ago", deployedBy: "Lead DevOps", status: "Active" },
      { id: "dh_2", version: "v2.0.0-rc1", deployedAt: "3 days ago", deployedBy: "CI/CD Pipeline", status: "Paused" },
    ],
  },
  {
    id: "dep_agent_refactor_edge",
    name: "AST Refactor Agent Worker Swarm",
    description: "Distributed background agent worker cluster executing automated AST code refactoring jobs.",
    projectId: "proj_agent_refactor",
    projectName: "Autonomous Code Refactoring Agent",
    targetType: "Agent",
    targetId: "agent_ast_refactor_swarm",
    targetName: "AST Refactoring & Test Generator Agent",
    environment: "Edge Cluster",
    version: "v1.4.2",
    status: "Active",
    endpointUrl: "https://agents.vantor.internal/v1/swarm/ast-refactor",
    latencyMs: "115 ms",
    throughput: "450 tasks/min",
    createdAt: "2026-08-28T14:00:00Z",
    updatedAt: "2026-09-04T12:00:00Z",
    history: [
      { id: "dh_3", version: "v1.4.2", deployedAt: "4 hours ago", deployedBy: "Swarm Orchestrator", status: "Active" },
    ],
  },
  {
    id: "dep_rag_vector_staging",
    name: "Multimodal Vector Search API",
    description: "Staging embedding vector search endpoint for hybrid technical manual queries.",
    projectId: "proj_multimodal_rag",
    projectName: "Multimodal Vector Retrieval Index",
    targetType: "Model",
    targetId: "mod_gemini_15_pro",
    targetName: "Gemini 3.6 Flash",
    environment: "Staging",
    version: "v1.0.0-beta",
    status: "Active",
    endpointUrl: "https://staging-api.vantor.internal/v1/search/manuals",
    latencyMs: "38 ms",
    throughput: "820 req/min",
    createdAt: "2026-09-01T11:00:00Z",
    updatedAt: "2026-09-03T18:00:00Z",
    history: [
      { id: "dh_4", version: "v1.0.0-beta", deployedAt: "Yesterday", deployedBy: "Search Dev", status: "Active" },
    ],
  },
];

export class DeploymentService {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  public static getDeployments(): Deployment[] {
    if (!this.isClient()) return initialSampleDeployments;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSampleDeployments));
        return initialSampleDeployments;
      }
      return JSON.parse(stored);
    } catch {
      return initialSampleDeployments;
    }
  }

  public static getDeploymentById(id: string): Deployment | undefined {
    return this.getDeployments().find((d) => d.id === id);
  }

  public static createDeployment(input: CreateDeploymentInput): Deployment {
    const deployments = this.getDeployments();
    const now = new Date().toISOString();
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newDep: Deployment = {
      id: `dep_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: input.name,
      description: input.description,
      projectId: input.projectId,
      projectName: input.projectName,
      targetType: input.targetType,
      targetId: input.targetId,
      targetName: input.targetName,
      environment: input.environment,
      version: input.version,
      status: input.status,
      endpointUrl: `https://api.vantor.internal/v1/deployments/${slug}`,
      latencyMs: "35 ms",
      throughput: "500 req/min",
      createdAt: now,
      updatedAt: now,
      history: [
        {
          id: `dh_${Date.now()}`,
          version: input.version,
          deployedAt: "Just now",
          deployedBy: "VANTOR Deployer",
          status: input.status,
        },
      ],
    };

    const updated = [newDep, ...deployments];
    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to store deployment", e);
      }
    }
    return newDep;
  }

  public static deleteDeployment(id: string): boolean {
    const deps = this.getDeployments();
    const filtered = deps.filter((d) => d.id !== id);
    if (filtered.length === deps.length) return false;

    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (e) {
        console.error("Failed to delete deployment", e);
      }
    }
    return true;
  }

  public static getTelemetry(): DeploymentTelemetry {
    const deps = this.getDeployments();
    return {
      totalDeployments: deps.length,
      activeDeployments: deps.filter((d) => d.status === "Active").length,
      avgLatency: "65 ms",
      totalRequestsSec: "2.5k req/sec",
    };
  }
}
