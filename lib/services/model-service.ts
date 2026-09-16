import { Model, CreateModelInput, ModelTelemetry } from "@/types/model";

const STORAGE_KEY = "vantor_models_store_v1";

const initialSampleModels: Model[] = [
  {
    id: "mod_gemini_36_flash",
    name: "Gemini 3.6 Flash",
    provider: "Google",
    type: "LLM",
    version: "gemini-3.6-flash",
    description: "Fast general-purpose Gemini model for low-latency generation, agent execution, and evaluation runs.",
    contextWindow: "1,000,000 tokens",
    status: "ready",
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-09-13T10:00:00Z",
    associatedProjectsCount: 0,
    evalScore: "N/A",
    tags: ["Google", "Gemini", "LLM", "1M Context"],
    recentActivities: [],
  },

  {
    id: "mod_gemini_35_flash",
    name: "Gemini 3.5 Flash",
    provider: "Google",
    type: "LLM",
    version: "gemini-3.5-flash",
    description: "Fast Flash model for general-purpose generation, multimodal reasoning, and high-throughput engineering tasks.",
    contextWindow: "1,000,000 tokens",
    status: "ready",
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-09-04T12:00:00Z",
    associatedProjectsCount: 3,
    evalScore: "96.4%",
    tags: ["Google", "Gemini", "LLM", "1M Context"],
    recentActivities: [
      { id: "mact_1", action: "Benchmarked against SWE-bench (Score: 92.1%)", timestamp: "1 hour ago", user: "Eval Runner" },
      { id: "mact_2", action: "Connected to Llama-3 Fine-Tuning project", timestamp: "Yesterday", user: "Lead Engineer" },
    ],
  },
  {
    id: "mod_gpt4o",
    name: "GPT-5.6 Luna",
    provider: "OpenAI",
    type: "LLM",
    version: "gpt-5.6-luna",
    description: "High-speed omni model capabilities for natural language and structured code generation.",
    contextWindow: "128,000 tokens",
    status: "ready",
    createdAt: "2026-08-05T14:00:00Z",
    updatedAt: "2026-09-03T16:30:00Z",
    associatedProjectsCount: 4,
    evalScore: "95.8%",
    tags: ["OpenAI", "Omni", "LLM", "128k"],
    recentActivities: [
      { id: "mact_3", action: "Assigned as default generator for Code Refactor Agent", timestamp: "2 days ago", user: "Agent Admin" },
    ],
  },
  {
    id: "mod_claude35_sonnet",
    name: "Claude Sonnet 5",
    provider: "Anthropic",
    type: "LLM",
    version: "claude-sonnet-5",
    description: "State-of-the-art coding and reasoning model for multi-step agentic workflows.",
    contextWindow: "200,000 tokens",
    status: "ready",
    createdAt: "2026-08-10T09:00:00Z",
    updatedAt: "2026-09-04T08:15:00Z",
    associatedProjectsCount: 2,
    evalScore: "97.1%",
    tags: ["Anthropic", "Sonnet", "Reasoning", "200k"],
    recentActivities: [
      { id: "mact_4", action: "Refactoring agent run completed (Pass Rate: 98.4%)", timestamp: "4 hours ago", user: "Swarm Core" },
    ],
  },
  {
    id: "mod_llama31_70b",
    name: "Llama 3.1 70B Instruct",
    provider: "Meta",
    type: "LLM",
    version: "llama-3.1-70b-instruct-v1",
    description: "Open-weight foundational model optimized for custom fine-tuning and local inference.",
    contextWindow: "128,000 tokens",
    status: "ready",
    createdAt: "2026-08-12T11:00:00Z",
    updatedAt: "2026-09-02T10:00:00Z",
    associatedProjectsCount: 2,
    evalScore: "91.5%",
    tags: ["Meta", "OpenSource", "70B", "LoRA"],
    recentActivities: [
      { id: "mact_5", action: "LoRA checkpoint v3 weight merge finished", timestamp: "3 days ago", user: "Trainer Bot" },
    ],
  },
  {
    id: "mod_mistral_large",
    name: "Mistral Large 2",
    provider: "Mistral",
    type: "LLM",
    version: "mistral-large-2407",
    description: "Top-tier multilingual model for code synthesis and instruction adherence.",
    contextWindow: "128,000 tokens",
    status: "ready",
    createdAt: "2026-08-18T13:20:00Z",
    updatedAt: "2026-09-01T15:40:00Z",
    associatedProjectsCount: 1,
    evalScore: "93.0%",
    tags: ["Mistral", "Multilingual", "128k"],
    recentActivities: [
      { id: "mact_6", action: "Registered in model matrix", timestamp: "4 days ago", user: "Admin" },
    ],
  },
  {
    id: "mod_codestral_22b",
    name: "Codestral 22B",
    provider: "Mistral",
    type: "Code Engine",
    version: "codestral-22b-v0.1",
    description: "Specialized open code generation engine optimized for low-latency inline code completion.",
    contextWindow: "32,000 tokens",
    status: "preview",
    createdAt: "2026-08-22T16:00:00Z",
    updatedAt: "2026-08-30T11:10:00Z",
    associatedProjectsCount: 1,
    evalScore: "89.4%",
    tags: ["Mistral", "Code", "Inline"],
    recentActivities: [
      { id: "mact_7", action: "Preview deployment endpoint created", timestamp: "5 days ago", user: "DevOps Engine" },
    ],
  },
];

export class ModelService {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  public static getModels(): Model[] {
    if (!this.isClient()) return initialSampleModels;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSampleModels));
        return initialSampleModels;
      }

      const parsed = JSON.parse(stored) as Model[];
      const migrated = parsed.map((model) => {
        if (model.id === "mod_gemini_25_flash" || model.version === "gemini-2.5-flash") {
          return {
            ...model,
            id: model.id === "mod_gemini_25_flash" ? "mod_gemini_36_flash" : model.id,
            name: "Gemini 3.6 Flash",
            version: "gemini-3.6-flash",
            description: model.description.replace(/Gemini 2\.5 Flash/gi, "Gemini 3.6 Flash"),
            tags: model.tags?.map((tag) => tag.replace(/2\.5/gi, "3.6")),
          };
        }

        if (model.id === "mod_gemini_15_pro") {
          return {
            ...model,
            id: "mod_gemini_35_flash",
            name: "Gemini 3.5 Flash",
            version: "gemini-3.5-flash",
          };
        }

        return model;
      });

      if (JSON.stringify(migrated) !== JSON.stringify(parsed)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      }

      return migrated;
    } catch {
      return initialSampleModels;
    }
  }

  public static getModelById(id: string): Model | undefined {
    return this.getModels().find((m) => m.id === id);
  }

  public static createModel(input: CreateModelInput): Model {
    const models = this.getModels();
    const now = new Date().toISOString();
    const newModel: Model = {
      id: `mod_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: input.name,
      provider: input.provider,
      type: input.type,
      version: input.version,
      description: input.description,
      contextWindow: input.contextWindow,
      status: input.status,
      createdAt: now,
      updatedAt: now,
      associatedProjectsCount: 0,
      evalScore: "N/A",
      tags: input.tags || [input.provider, input.type],
      recentActivities: [
        {
          id: `mact_${Date.now()}`,
          action: "Model registered in VANTOR catalog",
          timestamp: "Just now",
          user: "VANTOR Core",
        },
      ],
    };

    const updated = [newModel, ...models];
    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to store model", e);
      }
    }
    return newModel;
  }

  public static deleteModel(id: string): boolean {
    const models = this.getModels();
    const filtered = models.filter((m) => m.id !== id);
    if (filtered.length === models.length) return false;

    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (e) {
        console.error("Failed to delete model", e);
      }
    }
    return true;
  }

  public static getTelemetry(): ModelTelemetry {
    const models = this.getModels();
    const providers = new Set(models.map((m) => m.provider));
    return {
      totalModels: models.length,
      readyModels: models.filter((m) => m.status === "ready").length,
      providersCount: providers.size,
      totalAssociatedProjects: models.reduce((acc, m) => acc + m.associatedProjectsCount, 0),
    };
  }
}
