export type ModelProvider =
  | "Google"
  | "OpenAI"
  | "Anthropic"
  | "Meta"
  | "Mistral"
  | "Local / Custom";

export type ModelType =
  | "LLM"
  | "Vision LLM"
  | "Code Engine"
  | "Embedding"
  | "Audio Transcriber";

export type ModelStatus = "ready" | "preview" | "deprecated" | "offline";

export interface ModelActivity {
  id: string;
  action: string;
  timestamp: string;
  user: string;
}

export interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
  type: ModelType;
  version: string;
  description: string;
  contextWindow: string; // e.g. "128k tokens", "1M tokens"
  status: ModelStatus;
  createdAt: string;
  updatedAt: string;
  associatedProjectsCount: number;
  evalScore?: string;
  tags?: string[];
  recentActivities?: ModelActivity[];
}

export interface CreateModelInput {
  name: string;
  provider: ModelProvider;
  type: ModelType;
  version: string;
  description: string;
  contextWindow: string;
  status: ModelStatus;
  tags?: string[];
}

export interface ModelTelemetry {
  totalModels: number;
  readyModels: number;
  providersCount: number;
  totalAssociatedProjects: number;
}
