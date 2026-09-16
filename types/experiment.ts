export type ExperimentStatus = "running" | "completed" | "failed" | "idle";

export interface ExperimentMetric {
  name: string; // Accuracy, F1, Latency, TokenUsage
  value: string;
  baseline?: string;
}

export interface ExperimentRun {
  id: string;
  runNumber: number;
  parameters: Record<string, string | number>;
  metrics: ExperimentMetric[];
  status: ExperimentStatus;
  timestamp: string;
  duration: string;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  projectId: string;
  projectName: string;
  modelId: string;
  modelName: string;
  datasetId: string;
  datasetName: string;
  promptVersion: string;
  status: ExperimentStatus;
  createdAt: string;
  updatedAt: string;
  runs: ExperimentRun[];
  tags?: string[];
}

export interface CreateExperimentInput {
  name: string;
  description: string;
  projectId: string;
  projectName: string;
  modelId: string;
  modelName: string;
  datasetId: string;
  datasetName: string;
  promptVersion: string;
  status: ExperimentStatus;
  tags?: string[];
}

export interface ExperimentTelemetry {
  totalExperiments: number;
  activeRuns: number;
  completedRuns: number;
  avgPassRate: string;
}
