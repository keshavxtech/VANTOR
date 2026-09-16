"use client";

import React, { useState, useEffect } from "react";
import { SettingsService } from "@/lib/services/settings-service";
import { WorkspaceSettings } from "@/types/settings";
import { GithubConnection } from "@/components/github/github-connection";
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Cpu,
  ShieldCheck,
  HardDrive,
  Download,
  Upload,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<WorkspaceSettings>(SettingsService.getSettings());
  const [activeTab, setActiveTab] = useState<"general" | "compute" | "credentials" | "backup">("general");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(SettingsService.getSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    SettingsService.updateSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportBackup = () => {
    const data: Record<string, unknown> = {};
    if (typeof window !== "undefined") {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("vantor_")) {
          try {
            data[key] = JSON.parse(localStorage.getItem(key) || "{}");
          } catch {
            data[key] = localStorage.getItem(key);
          }
        }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vantor_workspace_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all local workspace settings to factory defaults?")) {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      setSettings(SettingsService.getSettings());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#7C3AED]" />
            <h1 className="text-xl font-sans font-bold text-white tracking-tight">Settings</h1>
          </div>
          <p className="text-xs font-sans text-[#8B95A5] mt-1">
            Configure local AI node compute preferences, workspace defaults, hardware accelerators, and data backups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1E2430] hover:bg-white/[0.08] text-white text-xs font-sans font-medium transition-all border border-white/[0.06]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#5A6472]" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-sans font-medium transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer"
          >
            {savedSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? "Saved!" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.06] flex items-center gap-6 text-sm font-sans">
        {(["general", "compute", "credentials", "backup"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-medium capitalize transition-colors relative ${
              activeTab === tab
                ? "text-white border-b-2 border-[#7C3AED]"
                : "text-[#8B95A5] hover:text-white"
            }`}
          >
            {tab === "general"
              ? "General"
              : tab === "compute"
              ? "Compute & Acceleration"
              : tab === "credentials"
              ? "Model Registry & Keys"
              : "Export & Backup"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="space-y-6 max-w-2xl">
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4 text-xs font-sans">
              <h2 className="text-sm font-sans font-semibold text-white">Workspace Configuration</h2>

              <div className="space-y-1">
                <label className="text-[#8B95A5] font-medium">Workspace Node Name</label>
                <input
                  type="text"
                  value={settings.workspaceName}
                  onChange={(e) => setSettings({ ...settings, workspaceName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#8B95A5] font-medium">Default Model Engine</label>
                  <select
                    value={settings.defaultModel}
                    onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED] cursor-pointer"
                  >
                    <option value="Claude Sonnet 5">Claude Sonnet 5</option>
                    <option value="Gemini 3.6 Flash">Gemini 3.6 Flash</option>
                    <option value="GPT-5.6 Luna">GPT-5.6 Luna</option>
                    <option value="Llama 3.1 70B Instruct">Llama 3.1 70B Instruct</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#8B95A5] font-medium">Default Framework Target</label>
                  <select
                    value={settings.defaultFramework}
                    onChange={(e) => setSettings({ ...settings, defaultFramework: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED] cursor-pointer"
                  >
                    <option value="PyTorch">PyTorch (Unsloth)</option>
                    <option value="vLLM">vLLM Inference</option>
                    <option value="Ollama">Ollama Local</option>
                    <option value="ONNX / GGUF">ONNX / GGUF</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 space-y-3 border-t border-white/[0.04]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSavePromptVersions}
                    onChange={(e) => setSettings({ ...settings, autoSavePromptVersions: e.target.checked })}
                    className="rounded border-white/[0.2] bg-[#1E2430] text-[#7C3AED]"
                  />
                  <span className="text-white">Auto-save Prompt Lab revisions on test execution</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.telemetryEnabled}
                    onChange={(e) => setSettings({ ...settings, telemetryEnabled: e.target.checked })}
                    className="rounded border-white/[0.2] bg-[#1E2430] text-[#7C3AED]"
                  />
                  <span className="text-white">Enable local performance telemetry metrics logging</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* GitHub Integration */}
        {activeTab === "general" && (
          <div className="max-w-2xl">
            <GithubConnection />
          </div>
        )}

        {/* Compute Tab */}
        {activeTab === "compute" && (
          <div className="space-y-6 max-w-2xl">
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4 text-xs font-sans">
              <h2 className="text-sm font-sans font-semibold text-white">Local Acceleration & Parallel Runs</h2>

              <div className="space-y-1">
                <label className="text-[#8B95A5] font-medium">Max Concurrent Parallel Evaluation Suites ({settings.maxParallelEvalRuns})</label>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={settings.maxParallelEvalRuns}
                  onChange={(e) => setSettings({ ...settings, maxParallelEvalRuns: parseInt(e.target.value) })}
                  className="w-full mt-2 cursor-pointer accent-[#7C3AED]"
                />
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-[#8B95A5] font-medium">Local vLLM / Ollama Node Endpoint URL</label>
                <input
                  type="text"
                  defaultValue="http://localhost:11434/v1"
                  className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white font-mono-tech focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Credentials Tab */}
        {activeTab === "credentials" && (
          <div className="space-y-6 max-w-2xl">
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4 text-xs font-sans">
              <h2 className="text-sm font-sans font-semibold text-white">Local Model Provider API Mask Controls</h2>
              <p className="text-[#8B95A5]">
                VANTOR operates on a strict ₹0 local budget. Optional provider key masks below permit local endpoint overrides when configured by the engineer.
              </p>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[#8B95A5] font-medium">OpenAI Key Override Mask</label>
                  <input
                    type="password"
                    placeholder="sk-proj-********************************"
                    className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white font-mono-tech focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#8B95A5] font-medium">Anthropic Key Override Mask</label>
                  <input
                    type="password"
                    placeholder="sk-ant-********************************"
                    className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white font-mono-tech focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backup Tab */}
        {activeTab === "backup" && (
          <div className="space-y-6 max-w-2xl">
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4 text-xs font-sans">
              <h2 className="text-sm font-sans font-semibold text-white">Export & Restore Workspace State</h2>
              <p className="text-[#8B95A5]">
                Export all local models, datasets, hyperparameter experiments, prompts, agents, evaluations, and deployments state to a single JSON archive.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-sans font-medium transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Workspace Archive (.json)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
