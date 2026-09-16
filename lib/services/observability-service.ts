import { AgentService } from "@/lib/services/agent-service";
import { DeploymentService } from "@/lib/services/deployment-service";
import { EvaluationService } from "@/lib/services/evaluation-service";
import { ExperimentService } from "@/lib/services/experiment-service";
import type { ObservabilityEvent, ObservabilitySummary, ProviderMetric, ModelMetric } from "@/types/observability";

const STORAGE_KEY = "vantor_observability_events_v1";

export class ObservabilityService {
  private static isClient() {
    return typeof window !== "undefined";
  }

  private static readEvents(): ObservabilityEvent[] {
    if (!this.isClient()) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ObservabilityEvent[]) : [];
    } catch {
      return [];
    }
  }

  private static writeEvents(events: ObservabilityEvent[]) {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(0, 500)));
    } catch (error) {
      console.error("Failed to persist observability events", error);
    }
  }

  public static record(event: Omit<ObservabilityEvent, "id">) {
    const events = this.readEvents();
    this.writeEvents([
      { ...event, id: `obs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}` },
      ...events,
    ]);
  }

  public static getEvents(): ObservabilityEvent[] {
    return this.readEvents();
  }

  public static clearEvents() {
    if (this.isClient()) localStorage.removeItem(STORAGE_KEY);
  }

  public static getSummary(): ObservabilitySummary {
    const events = this.readEvents();
    const aiRequests = events.filter((e) => e.type === "ai_request");
    const measurable = events.filter((e) => typeof e.latencyMs === "number");
    const successfulRuns = events.filter((e) => e.status === "success").length;
    const failedRuns = events.filter((e) => e.status === "failed").length;
    const totalRuns = successfulRuns + failedRuns;
    return {
      totalEvents: events.length,
      aiRequests: aiRequests.length,
      successfulRuns,
      failedRuns,
      avgLatencyMs: measurable.length ? Math.round(measurable.reduce((s, e) => s + (e.latencyMs ?? 0), 0) / measurable.length) : 0,
      totalInputTokens: events.reduce((s, e) => s + (e.inputTokens ?? 0), 0),
      totalOutputTokens: events.reduce((s, e) => s + (e.outputTokens ?? 0), 0),
      errorRate: totalRuns ? Number(((failedRuns / totalRuns) * 100).toFixed(1)) : 0,
    };
  }

  public static getProviderMetrics(): ProviderMetric[] {
    const map = new Map<string, ProviderMetric>();
    for (const event of this.readEvents().filter((e) => e.type === "ai_request" && e.provider)) {
      const provider = event.provider as string;
      const current = map.get(provider) ?? { provider, requests: 0, avgLatencyMs: 0, inputTokens: 0, outputTokens: 0, errors: 0 };
      const nextRequests = current.requests + 1;
      current.avgLatencyMs = Math.round(((current.avgLatencyMs * current.requests) + (event.latencyMs ?? 0)) / nextRequests);
      current.requests = nextRequests;
      current.inputTokens += event.inputTokens ?? 0;
      current.outputTokens += event.outputTokens ?? 0;
      if (event.status === "failed") current.errors += 1;
      map.set(provider, current);
    }
    return [...map.values()].sort((a, b) => b.requests - a.requests);
  }

  public static getModelMetrics(): ModelMetric[] {
    const map = new Map<string, ModelMetric>();
    for (const event of this.readEvents().filter((e) => e.type === "ai_request" && e.model)) {
      const key = `${event.provider ?? "unknown"}:${event.model}`;
      const current = map.get(key) ?? { model: event.model as string, provider: event.provider ?? "unknown", requests: 0, avgLatencyMs: 0, inputTokens: 0, outputTokens: 0, errors: 0 };
      const nextRequests = current.requests + 1;
      current.avgLatencyMs = Math.round(((current.avgLatencyMs * current.requests) + (event.latencyMs ?? 0)) / nextRequests);
      current.requests = nextRequests;
      current.inputTokens += event.inputTokens ?? 0;
      current.outputTokens += event.outputTokens ?? 0;
      if (event.status === "failed") current.errors += 1;
      map.set(key, current);
    }
    return [...map.values()].sort((a, b) => b.requests - a.requests);
  }

  public static syncDomainEvents() {
    if (!this.isClient()) return;
    const existing = this.readEvents();
    const known = new Set(existing.map((e) => e.id));
    const generated: ObservabilityEvent[] = [];

    ExperimentService.getExperiments().forEach((experiment) => experiment.runs.forEach((run) => {
      const id = `experiment:${run.id}`;
      if (!known.has(id)) generated.push({ id, type: "experiment_run", status: run.status === "failed" ? "failed" : run.status === "running" ? "running" : "success", title: experiment.name, resource: `Run #${run.runNumber}`, timestamp: run.timestamp });
    }));

    AgentService.getAgents().forEach((agent) => agent.runHistory.forEach((run) => {
      const id = `agent:${run.id}`;
      if (!known.has(id)) generated.push({ id, type: "agent_run", status: run.status === "failed" ? "failed" : run.status === "running" ? "running" : "success", title: agent.name, resource: run.task, timestamp: run.timestamp });
    }));

    EvaluationService.getEvaluations().forEach((evaluation) => evaluation.runs.forEach((run) => {
      const id = `evaluation:${run.id}`;
      if (!known.has(id)) generated.push({
        id,
        type: "evaluation_run",
        status: run.status === "failed" ? "failed" : run.status === "running" ? "running" : "success",
        title: evaluation.name,
        resource: `${run.passRate} pass rate`,
        latencyMs: run.latencyMs,
        inputTokens: run.inputTokens,
        outputTokens: run.outputTokens,
        timestamp: run.runDate,
      });
    }));

    DeploymentService.getDeployments().forEach((deployment) => {
      const id = `deployment:${deployment.id}:${deployment.updatedAt}`;
      if (!known.has(id)) generated.push({ id, type: "deployment", status: deployment.status === "Failed" ? "failed" : "info", title: deployment.name, resource: deployment.environment, timestamp: deployment.updatedAt });
    });

    if (generated.length) this.writeEvents([...generated, ...existing]);
  }
}
