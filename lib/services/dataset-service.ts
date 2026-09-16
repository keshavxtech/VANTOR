import { Dataset, CreateDatasetInput, DatasetTelemetry, DatasetVersion } from "@/types/dataset";

const STORAGE_KEY = "vantor_datasets_store_v2";

const initialSampleDatasets: Dataset[] = [
  {
    id: "ds_code_instruct_v3",
    name: "Code-Instruct-Python-v3",
    description: "Curated dataset of 150,000 high-quality Python function implementations with docstrings and type annotations.",
    format: "JSONL",
    size: "1.4 GB",
    rowCount: "150,000 samples",
    version: "v3.2",
    status: "ready",
    createdAt: "2026-08-10T12:00:00Z",
    updatedAt: "2026-09-04T10:30:00Z",
    projectId: "proj_llama3_70b",
    projectName: "Llama-3 70B Quantized Fine-Tuner",
    experimentsCount: 4,
    tags: ["Python", "Instruct", "JSONL"],
    recentActivities: [
      { id: "dact_1", action: "Partition split 80/10/10 verified", timestamp: "2 hours ago", user: "Data Curator" },
    ],
  },
  {
    id: "ds_vector_tech_docs",
    name: "Tech-Manuals-Vector-Store",
    description: "Ingested chunks and 1536-dim vector embeddings of enterprise architecture manuals and API specs.",
    format: "Vector Index",
    size: "4.8 GB",
    rowCount: "50,000 vectors",
    version: "v1.0",
    status: "ready",
    createdAt: "2026-08-15T09:00:00Z",
    updatedAt: "2026-09-03T18:00:00Z",
    projectId: "proj_multimodal_rag",
    projectName: "Multimodal Vector Retrieval Index",
    experimentsCount: 3,
    tags: ["RAG", "Embeddings", "VectorIndex"],
    recentActivities: [
      { id: "dact_2", action: "Re-indexed with ADA-002 embeddings", timestamp: "Yesterday", user: "RAG Engine" },
    ],
  },
  {
    id: "ds_ast_refactor_bench",
    name: "AST-Refactor-Eval-Suite",
    description: "Benchmarking test pairs for multi-file JavaScript/TypeScript AST structural transformations.",
    format: "Parquet",
    size: "620 MB",
    rowCount: "12,500 pairs",
    version: "v2.1",
    status: "ready",
    createdAt: "2026-08-18T15:30:00Z",
    updatedAt: "2026-09-02T14:15:00Z",
    projectId: "proj_agent_refactor",
    projectName: "Autonomous Code Refactoring Agent",
    experimentsCount: 5,
    tags: ["AST", "TypeScript", "Parquet"],
    recentActivities: [
      { id: "dact_3", action: "Added 500 edge-case test vectors", timestamp: "2 days ago", user: "Eval Lead" },
    ],
  },
  {
    id: "ds_audio_command_v1",
    name: "Whisper-Speech-Commands",
    description: "Short voice command audio recordings in 16kHz WAV format with synchronized text transcripts.",
    format: "Audio Archive",
    size: "8.2 GB",
    rowCount: "45,000 files",
    version: "v1.0-draft",
    status: "processing",
    createdAt: "2026-08-28T10:00:00Z",
    updatedAt: "2026-09-01T11:00:00Z",
    projectId: "proj_whisper_transcriber",
    projectName: "Edge Whisper Voice Command Engine",
    experimentsCount: 1,
    tags: ["Audio", "WAV", "Whisper"],
    recentActivities: [
      { id: "dact_4", action: "Audio normalization filter applied", timestamp: "3 days ago", user: "Audio Pipeline" },
    ],
  },
];

export class DatasetService {
  private static isClient() { return typeof window !== "undefined"; }
  public static getDatasets(): Dataset[] {
    if (!this.isClient()) return initialSampleDatasets;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) { localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSampleDatasets)); return initialSampleDatasets; }
      return JSON.parse(stored) as Dataset[];
    } catch { return initialSampleDatasets; }
  }
  public static getDatasetById(id: string) { return this.getDatasets().find(d => d.id === id); }
  private static persist(datasets: Dataset[]) { if (this.isClient()) localStorage.setItem(STORAGE_KEY, JSON.stringify(datasets)); }
  public static createDataset(input: CreateDatasetInput): Dataset {
    const now = new Date().toISOString();
    const version: DatasetVersion = { id: `dsv_${Date.now().toString(36)}`, version: input.version || "v1.0", createdAt: now, rows: input.rowCount, size: input.size, note: "Initial dataset registration" };
    const dataset: Dataset = { id: `ds_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`, ...input, version: version.version, experimentsCount: 0, createdAt: now, updatedAt: now, versions: [version], recentActivities: [{ id: `dact_${Date.now()}`, action: "Dataset registered in catalog", timestamp: "Just now", user: "VANTOR Core" }] };
    const updated = [dataset, ...this.getDatasets()]; this.persist(updated); return dataset;
  }
  public static updateDataset(id: string, patch: Partial<Dataset>, activity = "Dataset metadata updated"): Dataset | undefined {
    const now = new Date().toISOString(); const datasets = this.getDatasets(); const current = datasets.find(d => d.id === id); if (!current) return;
    const updatedDataset = { ...current, ...patch, updatedAt: now, recentActivities: [{ id: `dact_${Date.now()}`, action: activity, timestamp: "Just now", user: "VANTOR Core" }, ...(current.recentActivities || [])] };
    this.persist(datasets.map(d => d.id === id ? updatedDataset : d)); return updatedDataset;
  }
  public static createVersion(id: string, note?: string): Dataset | undefined {
    const current = this.getDatasetById(id); if (!current) return;
    const match = current.version.match(/v(\d+)\.(\d+)/); const major = match ? Number(match[1]) : 1; const minor = match ? Number(match[2]) + 1 : 1;
    const version = `v${major}.${minor}`; const now = new Date().toISOString(); const item: DatasetVersion = { id: `dsv_${Date.now().toString(36)}`, version, createdAt: now, rows: current.rowCount, size: current.size, note: note || "New dataset revision" };
    return this.updateDataset(id, { version, versions: [item, ...(current.versions || [])] }, `Created dataset version ${version}`);
  }
  public static deleteDataset(id: string) { const filtered = this.getDatasets().filter(d => d.id !== id); if (filtered.length === this.getDatasets().length) return false; this.persist(filtered); return true; }
  public static getTelemetry(): DatasetTelemetry {
    const datasets = this.getDatasets();
    const parse = (v: string) => { const m=v.match(/([\d.]+)\s*(GB|MB|KB)/i); return m ? Number(m[1]) * ({GB:1024,MB:1,KB:1/1024}[m[2].toUpperCase()] || 0) : 0; };
    const mb = datasets.reduce((sum,d)=>sum+parse(d.size),0);
    const samples = datasets.reduce((sum,d)=>{ const n=d.rowCount.replace(/,/g,"").match(/\d+/); return sum+(n?Number(n[0]):0); },0);
    return { totalDatasets: datasets.length, readyDatasets: datasets.filter(d=>d.status === "ready").length, totalSize: mb>=1024 ? `${(mb/1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`, totalSamples: `${samples.toLocaleString()} samples` };
  }
}
