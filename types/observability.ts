export type ObservabilityEventType = "ai_request" | "experiment_run" | "agent_run" | "evaluation_run" | "deployment" | "system";
export type ObservabilityStatus = "success" | "failed" | "running" | "info";

export interface ObservabilityEvent {
  id: string;
  type: ObservabilityEventType;
  status: ObservabilityStatus;
  title: string;
  resource: string;
  provider?: string;
  model?: string;
  latencyMs?: number;
  inputTokens?: number;
  outputTokens?: number;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface ObservabilitySummary {
  totalEvents: number;
  aiRequests: number;
  successfulRuns: number;
  failedRuns: number;
  avgLatencyMs: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  errorRate: number;
}

export interface ProviderMetric {
  provider: string;
  requests: number;
  avgLatencyMs: number;
  inputTokens: number;
  outputTokens: number;
  errors: number;
}

export interface ModelMetric {
  model: string;
  provider: string;
  requests: number;
  avgLatencyMs: number;
  inputTokens: number;
  outputTokens: number;
  errors: number;
}
