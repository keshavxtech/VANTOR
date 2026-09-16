export interface PromptVersionItem {
  version: string;
  systemPrompt: string;
  userPrompt: string;
  variables: string[];
  temperature: number;
  model: string;
  createdAt: string;
}

export interface Prompt {
  id: string;
  name: string;
  description: string;
  category: "Code" | "Agent" | "Evaluation" | "Extraction" | "General";
  currentVersion: string;
  versions: PromptVersionItem[];
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  projectName?: string;
  tags?: string[];
}

export interface CreatePromptInput {
  name: string;
  description: string;
  category: "Code" | "Agent" | "Evaluation" | "Extraction" | "General";
  systemPrompt: string;
  userPrompt: string;
  variables: string[];
  temperature: number;
  model: string;
  projectId?: string;
  projectName?: string;
}

export interface PromptTelemetry {
  totalPrompts: number;
  totalVersions: number;
  activeCategories: number;
}
