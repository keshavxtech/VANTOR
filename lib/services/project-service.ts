import {
  Project,
  CreateProjectInput,
  ProjectTelemetry,
} from "@/types/project";

const STORAGE_KEY = "vantor_projects_store_v1";

const initialSampleProjects: Project[] = [
  {
    id: "proj_llama3_70b",
    name: "Llama-3 70B Quantized Fine-Tuner",
    description: "Low-rank adaptation (LoRA) fine-tuning pipeline for Llama-3-70B on domain-specific software engineering datasets.",
    type: "Fine-Tuning",
    framework: "Unsloth",
    status: "active",
    createdAt: "2026-08-15T10:30:00Z",
    updatedAt: "2026-09-04T14:20:00Z",
    modelsCount: 3,
    datasetsCount: 4,
    experimentsCount: 12,
    tags: ["LLM", "LoRA", "Unsloth", "H100"],
    recentActivities: [
      { id: "act_1", action: "Checkpoint v2 saved (Eval Loss: 0.42)", timestamp: "2 hours ago", user: "Lead Engineer" },
      { id: "act_2", action: "Dataset 'code-instruct-v3' attached", timestamp: "Yesterday", user: "Data Curator" },
      { id: "act_3", action: "Hyperparameter sweep batch #4 complete", timestamp: "2 days ago", user: "AutoRunner" },
    ],
  },
  {
    id: "proj_agent_refactor",
    name: "Autonomous Code Refactoring Agent",
    description: "Self-correcting multi-agent swarm for static analysis, AST refactoring, and automatic unit test generation.",
    type: "Autonomous Agent",
    framework: "LangChain",
    status: "active",
    createdAt: "2026-08-20T14:00:00Z",
    updatedAt: "2026-09-04T11:45:00Z",
    modelsCount: 2,
    datasetsCount: 2,
    experimentsCount: 8,
    tags: ["Agents", "AST", "Refactor", "Swarm"],
    recentActivities: [
      { id: "act_4", action: "Agent evaluation suite score: 94.8%", timestamp: "3 hours ago", user: "Agent Runner" },
      { id: "act_5", action: "System prompt updated with guardrails", timestamp: "1 day ago", user: "Prompt Engineer" },
    ],
  },
  {
    id: "proj_multimodal_rag",
    name: "Multimodal Vector Retrieval Index",
    description: "Hybrid dense & sparse embedding retrieval engine for technical manuals, PDF schematics, and source code.",
    type: "RAG / Retrieval",
    framework: "LlamaIndex",
    status: "active",
    createdAt: "2026-08-25T09:15:00Z",
    updatedAt: "2026-09-03T18:10:00Z",
    modelsCount: 2,
    datasetsCount: 6,
    experimentsCount: 5,
    tags: ["RAG", "Embeddings", "VectorDB", "Hybrid"],
    recentActivities: [
      { id: "act_6", action: "Index re-ingested with 50,000 vectors", timestamp: "Yesterday", user: "Search Specialist" },
    ],
  },
  {
    id: "proj_whisper_transcriber",
    name: "Edge Whisper Voice Command Engine",
    description: "ONNX quantized Whisper-large-v3 model optimized for low-latency edge audio command transcription.",
    type: "Quantization",
    framework: "Transformers",
    status: "draft",
    createdAt: "2026-08-28T16:20:00Z",
    updatedAt: "2026-09-01T12:00:00Z",
    modelsCount: 1,
    datasetsCount: 1,
    experimentsCount: 2,
    tags: ["Audio", "ONNX", "Edge", "Whisper"],
    recentActivities: [
      { id: "act_7", action: "Draft project created", timestamp: "3 days ago", user: "Edge Engineer" },
    ],
  },
  {
    id: "proj_eval_suite_v1",
    name: "Standard Safety & Red-Teaming Benchmark",
    description: "Comprehensive automated evaluation harness testing model outputs against safety, hallucination, and bias rubrics.",
    type: "Model Evaluation",
    framework: "Custom Python",
    status: "archived",
    createdAt: "2026-07-10T11:00:00Z",
    updatedAt: "2026-08-10T09:30:00Z",
    modelsCount: 5,
    datasetsCount: 3,
    experimentsCount: 15,
    tags: ["Safety", "Eval", "RedTeaming"],
    recentActivities: [
      { id: "act_8", action: "Project archived after v2 migration", timestamp: "3 weeks ago", user: "System Admin" },
    ],
  },
];

export class ProjectService {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  public static getProjects(): Project[] {
    if (!this.isClient()) {
      return initialSampleProjects;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSampleProjects));
        return initialSampleProjects;
      }
      return JSON.parse(stored);
    } catch {
      return initialSampleProjects;
    }
  }

  public static getProjectById(id: string): Project | undefined {
    const projects = this.getProjects();
    return projects.find((p) => p.id === id);
  }

  public static createProject(input: CreateProjectInput): Project {
    const projects = this.getProjects();
    const now = new Date().toISOString();
    const newProject: Project = {
      id: `proj_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: input.name,
      description: input.description,
      type: input.type,
      framework: input.framework,
      status: input.status,
      createdAt: now,
      updatedAt: now,
      modelsCount: 0,
      datasetsCount: 0,
      experimentsCount: 0,
      tags: input.tags || [input.type, input.framework],
      recentActivities: [
        {
          id: `act_${Date.now()}`,
          action: "Project initialized in workspace",
          timestamp: "Just now",
          user: "VANTOR Core",
        },
      ],
    };

    const updatedProjects = [newProject, ...projects];
    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
      } catch (err) {
        console.error("Failed to persist project", err);
      }
    }
    return newProject;
  }

  public static deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    if (filtered.length === projects.length) return false;

    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (err) {
        console.error("Failed to update projects store", err);
      }
    }
    return true;
  }

  public static getTelemetry(): ProjectTelemetry {
    const projects = this.getProjects();
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === "active").length,
      totalModels: projects.reduce((acc, p) => acc + p.modelsCount, 0),
      totalDatasets: projects.reduce((acc, p) => acc + p.datasetsCount, 0),
      totalExperiments: projects.reduce((acc, p) => acc + p.experimentsCount, 0),
    };
  }
}
