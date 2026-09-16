import { Experiment, CreateExperimentInput, ExperimentTelemetry } from "@/types/experiment";

const STORAGE_KEY = "vantor_experiments_store_v1";

const initialSampleExperiments: Experiment[] = [
  {
    id: "exp_lora_rank_sweep_01",
    name: "Llama-3 70B LoRA Rank Sweep",
    description: "Evaluating training loss and evaluation benchmark pass rates across LoRA rank r=8, r=16, and r=64.",
    projectId: "proj_llama3_70b",
    projectName: "Llama-3 70B Quantized Fine-Tuner",
    modelId: "mod_llama31_70b",
    modelName: "Llama 3.1 70B Instruct",
    datasetId: "ds_code_instruct_v3",
    datasetName: "Code-Instruct-Python-v3",
    promptVersion: "v2.1",
    status: "completed",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-09-04T11:30:00Z",
    tags: ["LoRA", "Sweep", "Unsloth"],
    runs: [
      {
        id: "run_r64",
        runNumber: 1,
        parameters: { rank: 64, lora_alpha: 128, lr: 0.0002, batch_size: 16 },
        metrics: [
          { name: "Accuracy", value: "94.2%", baseline: "88.0%" },
          { name: "Loss", value: "0.41", baseline: "0.85" },
          { name: "Latency", value: "120ms", baseline: "115ms" },
          { name: "Token Usage", value: "4.2M tokens", baseline: "4.0M" },
        ],
        status: "completed",
        timestamp: "2026-09-04 11:30",
        duration: "01h 45m",
      },
      {
        id: "run_r16",
        runNumber: 2,
        parameters: { rank: 16, lora_alpha: 32, lr: 0.0002, batch_size: 16 },
        metrics: [
          { name: "Accuracy", value: "91.8%", baseline: "88.0%" },
          { name: "Loss", value: "0.52", baseline: "0.85" },
          { name: "Latency", value: "110ms", baseline: "115ms" },
          { name: "Token Usage", value: "3.8M tokens", baseline: "4.0M" },
        ],
        status: "completed",
        timestamp: "2026-09-04 09:15",
        duration: "01h 10m",
      },
    ],
  },
  {
    id: "exp_rag_embedding_topk",
    name: "RAG Chunk Size & Top-K Accuracy",
    description: "Testing dense vector retrieval accuracy comparing chunk sizes 256, 512, 1024 with Top-K=5 vs Top-K=10.",
    projectId: "proj_multimodal_rag",
    projectName: "Multimodal Vector Retrieval Index",
    modelId: "mod_gemini_15_pro",
    modelName: "Gemini 3.6 Flash",
    datasetId: "ds_vector_tech_docs",
    datasetName: "Tech-Manuals-Vector-Store",
    promptVersion: "v1.4",
    status: "running",
    createdAt: "2026-08-25T14:00:00Z",
    updatedAt: "2026-09-04T15:00:00Z",
    tags: ["RAG", "Embeddings", "TopK"],
    runs: [
      {
        id: "run_chunk512_top5",
        runNumber: 1,
        parameters: { chunk_size: 512, top_k: 5, similarity_threshold: 0.75 },
        metrics: [
          { name: "Recall@5", value: "89.4%", baseline: "82.0%" },
          { name: "MRR", value: "0.86", baseline: "0.74" },
          { name: "Latency", value: "45ms", baseline: "60ms" },
        ],
        status: "running",
        timestamp: "2026-09-04 15:00",
        duration: "35m",
      },
    ],
  },
];

export class ExperimentService {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  public static getExperiments(): Experiment[] {
    if (!this.isClient()) return initialSampleExperiments;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSampleExperiments));
        return initialSampleExperiments;
      }
      return JSON.parse(stored);
    } catch {
      return initialSampleExperiments;
    }
  }

  public static getExperimentById(id: string): Experiment | undefined {
    return this.getExperiments().find((e) => e.id === id);
  }

  public static createExperiment(input: CreateExperimentInput): Experiment {
    const experiments = this.getExperiments();
    const now = new Date().toISOString();
    const newExperiment: Experiment = {
      id: `exp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: input.name,
      description: input.description,
      projectId: input.projectId,
      projectName: input.projectName,
      modelId: input.modelId,
      modelName: input.modelName,
      datasetId: input.datasetId,
      datasetName: input.datasetName,
      promptVersion: input.promptVersion,
      status: input.status,
      createdAt: now,
      updatedAt: now,
      tags: input.tags || ["Experiment"],
      runs: [
        {
          id: `run_${Date.now()}`,
          runNumber: 1,
          parameters: { lr: 0.0001, batch_size: 8 },
          metrics: [
            { name: "Accuracy", value: "92.0%", baseline: "85.0%" },
            { name: "Latency", value: "95ms", baseline: "100ms" },
          ],
          status: "completed",
          timestamp: "Just now",
          duration: "15m",
        },
      ],
    };

    const updated = [newExperiment, ...experiments];
    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to store experiment", e);
      }
    }
    return newExperiment;
  }

  public static deleteExperiment(id: string): boolean {
    const exps = this.getExperiments();
    const filtered = exps.filter((e) => e.id !== id);
    if (filtered.length === exps.length) return false;

    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (e) {
        console.error("Failed to delete experiment", e);
      }
    }
    return true;
  }

  public static getTelemetry(): ExperimentTelemetry {
    const exps = this.getExperiments();
    const totalRuns = exps.reduce((acc, e) => acc + e.runs.length, 0);
    return {
      totalExperiments: exps.length,
      activeRuns: exps.filter((e) => e.status === "running").length,
      completedRuns: totalRuns,
      avgPassRate: "93.4%",
    };
  }
}
