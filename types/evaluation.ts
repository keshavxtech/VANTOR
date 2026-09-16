export type EvaluationStatus = "passed" | "running" | "failed" | "pending";

export interface EvaluationMetricResult {
  name: string;
  score: string;
  status: "pass" | "warn" | "fail";
}

export interface EvaluationRun {
  id: string;
  runDate: string;
  metrics: EvaluationMetricResult[];
  passRate: string;
  status: EvaluationStatus;
  samplesEvaluated?: number;
  latencyMs?: number;
  inputTokens?: number;
  outputTokens?: number;
  overallScore?: string;
  output?: string;
  error?: string;
}

export interface Evaluation {
  id: string;
  name: string;
  description: string;
  projectId: string;
  projectName: string;
  modelId: string;
  modelName: string;
  datasetId: string;
  datasetName: string;
  promptId?: string;
  promptName?: string;
  agentId?: string;
  agentName?: string;
  passRate: string;
  overallScore: string;
  status: EvaluationStatus;
  createdAt: string;
  updatedAt: string;
  runs: EvaluationRun[];
}

export interface CreateEvaluationInput {
  name: string;
  description: string;
  projectId: string;
  projectName: string;
  modelId: string;
  modelName: string;
  datasetId: string;
  datasetName: string;
  promptId?: string;
  promptName?: string;
  agentId?: string;
  agentName?: string;
  status: EvaluationStatus;
}

export interface EvaluationTelemetry {
  totalEvaluations: number;
  avgPassRate: string;
  passedEvals: number;
  failedEvals: number;
}
