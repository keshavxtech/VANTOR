import { WorkspaceSettings } from "@/types/settings";

const STORAGE_KEY = "vantor_settings_store_v1";

const defaultSettings: WorkspaceSettings = {
  workspaceName: "VANTOR Core Engine",
  theme: "dark",
  compactMode: false,
  defaultModel: "Claude Sonnet 5",
  defaultFramework: "PyTorch",
  autoSavePromptVersions: true,
  telemetryEnabled: true,
  maxParallelEvalRuns: 4,
};

export class SettingsService {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  public static getSettings(): WorkspaceSettings {
    if (!this.isClient()) return defaultSettings;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
        return defaultSettings;
      }
      return JSON.parse(stored);
    } catch {
      return defaultSettings;
    }
  }

  public static updateSettings(newSettings: Partial<WorkspaceSettings>): WorkspaceSettings {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update workspace settings", e);
      }
    }
    return updated;
  }
}
