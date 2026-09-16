export type ProjectStatus = "active" | "draft" | "archived";

export type ProjectType =
  | "Fine-Tuning"
  | "Autonomous Agent"
  | "RAG / Retrieval"
  | "Model Evaluation"
  | "Quantization"
  | "Prompt Engineering"
  | "General Engineering";

export type ProjectFramework =
  | "PyTorch"
  | "Transformers"
  | "LangChain"
  | "Unsloth"
  | "LlamaIndex"
  | "vLLM"
  | "Custom Python"
  | "Other";

export interface ProjectActivity {
  id: string;
  action: string;
  timestamp: string;
  user: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  framework: ProjectFramework;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  modelsCount: number;
  datasetsCount: number;
  experimentsCount: number;
  tags?: string[];
  recentActivities?: ProjectActivity[];
}

export interface CreateProjectInput {
  name: string;
  description: string;
  type: ProjectType;
  framework: ProjectFramework;
  status: ProjectStatus;
  tags?: string[];
}

export interface ProjectTelemetry {
  totalProjects: number;
  activeProjects: number;
  totalModels: number;
  totalDatasets: number;
  totalExperiments: number;
}
