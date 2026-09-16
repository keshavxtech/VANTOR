"use client";

import { ObservabilityService } from "@/lib/services/observability-service";
import React, { useMemo, useState } from "react";
import { PromptVersionItem } from "@/types/prompt";
import { AI_MODEL_CATALOG, findAIModel } from "@/lib/ai/model-catalog";
import { Play, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

interface PromptTesterProps {
  versionItem: PromptVersionItem;
}

function interpolate(template: string, values: Record<string, string>) {
  return template.replace(/{{\s*([^}]+)\s*}}/g, (_, key: string) => values[key.trim()] ?? `{{${key}}}`);
}

export function PromptTester({ versionItem }: PromptTesterProps) {
  const initialModel = findAIModel(versionItem.model || "")?.id || "gemini-3.6-flash";
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [model, setModel] = useState(initialModel);
  const [temperature, setTemperature] = useState(versionItem.temperature ?? 0.2);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const selectedModel = useMemo(() => findAIModel(model) || AI_MODEL_CATALOG[0], [model]);

  const handleVarChange = (key: string, val: string) => {
    setVariableValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);
    setError(null);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedModel.provider,
          model: selectedModel.id,
          systemPrompt: interpolate(versionItem.systemPrompt, variableValues),
          userPrompt: interpolate(versionItem.userPrompt, variableValues),
          temperature,
          maxOutputTokens: 2048,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "AI generation failed.");
      setOutput(data.text);
      setTokensUsed(data.usage?.totalTokens ?? null);
      setLatencyMs(data.latencyMs ?? null);
      ObservabilityService.record({
        type: "ai_request",
        status: "success",
        title: "Prompt Lab generation",
        resource: versionItem.model || "Live AI Playground",
        provider: data.provider,
        model: data.model,
        latencyMs: data.latencyMs,
        inputTokens: data.usage?.inputTokens,
        outputTokens: data.usage?.outputTokens,
        timestamp: new Date().toISOString(),
      });
    } catch (runError) {
      ObservabilityService.record({
        type: "ai_request",
        status: "failed",
        title: "Prompt Lab generation",
        resource: versionItem.model || "Live AI Playground",
        provider: selectedModel.provider,
        model: selectedModel.id,
        timestamp: new Date().toISOString(),
      });
      setError(runError instanceof Error ? runError.message : "AI generation failed.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#7C3AED]" />
          <div>
            <h2 className="text-sm font-sans font-semibold text-white">Live AI Playground</h2>
            <p className="text-[10px] text-[#5A6472] mt-0.5">Provider-agnostic VANTOR AI Core</p>
          </div>
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-xs font-sans font-medium transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer"
        >
          <Play className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
          <span>{isRunning ? "Running..." : "Run with AI"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.04] text-xs font-sans">
        <div className="space-y-1">
          <label className="text-[#8B95A5] font-medium">Target Model Engine</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-1.5 rounded bg-[#161B22] border border-white/[0.06] text-white focus:outline-none focus:border-[#7C3AED] cursor-pointer"
          >
            {AI_MODEL_CATALOG.map((option) => (
              <option key={option.id} value={option.id}>{option.name} · {option.provider}</option>
            ))}
          </select>
          <p className="text-[10px] text-[#5A6472] pt-1">Provider: {selectedModel.provider}</p>
        </div>

        <div className="space-y-1">
          <label className="text-[#8B95A5] font-medium">Temperature ({temperature})</label>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full mt-2 cursor-pointer accent-[#7C3AED]"
          />
        </div>
      </div>

      {versionItem.variables && versionItem.variables.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-sans font-medium text-white">Interpolation Variables</h3>
          <div className="space-y-2">
            {versionItem.variables.map((v) => (
              <div key={v} className="space-y-1 text-xs font-sans">
                <label className="text-[#7C3AED] font-mono-tech">{`{{${v}}}`}</label>
                <textarea
                  rows={2}
                  placeholder={`Provide test value for {{${v}}}...`}
                  value={variableValues[v] || ""}
                  onChange={(e) => handleVarChange(v, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1E2430]/60 border border-white/[0.06] text-white placeholder-[#5A6472] focus:outline-none focus:border-[#7C3AED] resize-none font-mono-tech text-[11px]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-sans text-[#8B95A5]">
            <span className="flex items-center gap-1.5 text-[#10B981] font-mono-tech">
              <CheckCircle2 className="w-3.5 h-3.5" /> Live Run Complete
            </span>
            <div className="flex items-center gap-3 font-mono-tech text-[11px]">
              <span>Tokens: <strong className="text-white">{tokensUsed ?? "—"}</strong></span>
              <span>Latency: <strong className="text-[#22D3EE]">{latencyMs ?? "—"}ms</strong></span>
            </div>
          </div>

          <pre className="p-4 rounded-[10px] bg-[#0A0E14] border border-white/[0.06] text-white font-mono-tech text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
