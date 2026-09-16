export interface WorkspaceSettings {
  workspaceName: string;
  theme: "dark" | "system";
  compactMode: boolean;
  defaultModel: string;
  defaultFramework: string;
  autoSavePromptVersions: boolean;
  telemetryEnabled: boolean;
  maxParallelEvalRuns: number;
}
