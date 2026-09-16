"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Clock3, Cpu, Database, Gauge, RefreshCw, Server, Trash2, Zap } from "lucide-react";
import { ObservabilityService } from "@/lib/services/observability-service";
import type { ObservabilityEvent, ProviderMetric, ModelMetric } from "@/types/observability";

function formatTokens(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
}

function eventColor(status: ObservabilityEvent["status"]) {
  if (status === "success") return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20";
  if (status === "failed") return "text-[#F87171] bg-[#F87171]/10 border-[#F87171]/20";
  if (status === "running") return "text-[#22D3EE] bg-[#22D3EE]/10 border-[#22D3EE]/20";
  return "text-[#8B95A5] bg-[#1E2430] border-white/[0.06]";
}

export function ObservabilityDashboard() {
  const [events, setEvents] = useState<ObservabilityEvent[]>([]);
  const [providers, setProviders] = useState<ProviderMetric[]>([]);
  const [models, setModels] = useState<ModelMetric[]>([]);
  const [tick, setTick] = useState(0);

  const refresh = () => {
    ObservabilityService.syncDomainEvents();
    setEvents(ObservabilityService.getEvents());
    setProviders(ObservabilityService.getProviderMetrics());
    setModels(ObservabilityService.getModelMetrics());
    setTick((v) => v + 1);
  };

  useEffect(() => { refresh(); }, []);
  const summary = useMemo(() => ObservabilityService.getSummary(), [events, tick]);
  const recent = events.slice(0, 10);

  const cards = [
    { label: "AI REQUESTS", value: summary.aiRequests, sub: `${summary.totalEvents} total events`, icon: Zap },
    { label: "AVG LATENCY", value: `${summary.avgLatencyMs}ms`, sub: "Recorded AI runs", icon: Clock3 },
    { label: "TOKEN INPUT", value: formatTokens(summary.totalInputTokens), sub: "Observed usage", icon: Database },
    { label: "TOKEN OUTPUT", value: formatTokens(summary.totalOutputTokens), sub: `${summary.errorRate}% run error rate`, icon: Gauge },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-[#7C3AED] font-medium"><Activity className="w-3.5 h-3.5" /> Telemetry Control Plane</div>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-white tracking-tight">Observability</h1>
          <p className="mt-2 text-sm text-[#8B95A5] max-w-2xl">A unified view of model calls, agent runs, experiments, evaluations, and deployment activity recorded by VANTOR.</p>
        </div>
        <button onClick={refresh} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[9px] bg-[#1E2430] border border-white/[0.06] text-xs text-[#D7DCE3] hover:border-white/[0.12] transition-colors"><RefreshCw className="w-3.5 h-3.5" /> Refresh telemetry</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-start"><span className="text-[10px] uppercase tracking-[0.08em] text-[#5A6472]">{label}</span><Icon className="w-4 h-4 text-[#8B95A5]" /></div>
            <div className="mt-3 text-3xl font-semibold text-white tracking-tight">{value}</div>
            <div className="mt-2 text-xs text-[#8B95A5]">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <section className="rounded-[14px] bg-[#161B22] border border-white/[0.06] overflow-hidden">
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between"><div><h2 className="text-sm font-semibold text-white">Provider Performance</h2><p className="text-xs text-[#5A6472] mt-1">Observed live AI requests from VANTOR AI Core.</p></div><Server className="w-4 h-4 text-[#8B95A5]" /></div>
          <div className="p-5 space-y-3">
            {providers.length === 0 ? <EmptyState text="No AI requests recorded yet. Run Prompt Lab to populate telemetry." /> : providers.map((p) => <ProviderRow key={p.provider} metric={p} />)}
          </div>
        </section>

        <section className="rounded-[14px] bg-[#161B22] border border-white/[0.06] overflow-hidden">
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between"><div><h2 className="text-sm font-semibold text-white">Model Performance</h2><p className="text-xs text-[#5A6472] mt-1">Requests, latency and token consumption by model.</p></div><Cpu className="w-4 h-4 text-[#8B95A5]" /></div>
          <div className="p-5 space-y-3">
            {models.length === 0 ? <EmptyState text="No model telemetry yet." /> : models.slice(0, 6).map((m) => <ModelRow key={`${m.provider}:${m.model}`} metric={m} />)}
          </div>
        </section>
      </div>

      <section className="rounded-[14px] bg-[#161B22] border border-white/[0.06] overflow-hidden">
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between"><div><h2 className="text-sm font-semibold text-white">Recent Activity Stream</h2><p className="text-xs text-[#5A6472] mt-1">Normalized events across the engineering workspace.</p></div><Activity className="w-4 h-4 text-[#8B95A5]" /></div>
        <div className="divide-y divide-white/[0.04]">
          {recent.length === 0 ? <div className="p-8"><EmptyState text="Telemetry will appear here as you run AI calls, agents, experiments, evaluations, or deployment actions." /></div> : recent.map((event) => (
            <div key={event.id} className="px-5 py-3.5 flex items-center gap-4">
              <span className={`text-[9px] uppercase tracking-[0.06em] px-2 py-1 rounded-full border ${eventColor(event.status)}`}>{event.status}</span>
              <div className="min-w-0 flex-1"><div className="text-sm text-white truncate">{event.title}</div><div className="text-xs text-[#5A6472] truncate mt-0.5">{event.type.replace("_", " ")} · {event.resource}</div></div>
              <div className="hidden md:flex items-center gap-4 text-[11px] font-mono-tech text-[#8B95A5]">{event.model && <span>{event.model}</span>}{typeof event.latencyMs === "number" && <span>{event.latencyMs}ms</span>}<span>{event.timestamp}</span></div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end"><button onClick={() => { ObservabilityService.clearEvents(); refresh(); }} className="inline-flex items-center gap-2 text-xs text-[#5A6472] hover:text-[#F87171] transition-colors"><Trash2 className="w-3.5 h-3.5" /> Clear local telemetry</button></div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) { return <div className="text-xs text-[#5A6472] py-2">{text}</div>; }
function ProviderRow({ metric }: { metric: ProviderMetric }) { return <div className="p-3.5 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.04]"><div className="flex justify-between"><span className="text-sm text-white capitalize">{metric.provider}</span><span className="text-[11px] font-mono-tech text-[#8B95A5]">{metric.requests} requests</span></div><div className="grid grid-cols-3 gap-3 mt-3 text-[11px] text-[#8B95A5]"><span>{metric.avgLatencyMs}ms avg</span><span>{formatTokens(metric.inputTokens)} in</span><span className={metric.errors ? "text-[#F87171]" : "text-[#10B981]"}>{metric.errors} errors</span></div></div>; }
function ModelRow({ metric }: { metric: ModelMetric }) { return <div className="p-3.5 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.04]"><div className="flex justify-between gap-3"><span className="text-sm text-white truncate">{metric.model}</span><span className="text-[10px] text-[#5A6472] uppercase">{metric.provider}</span></div><div className="grid grid-cols-3 gap-3 mt-3 text-[11px] text-[#8B95A5]"><span>{metric.requests} req</span><span>{metric.avgLatencyMs}ms</span><span>{formatTokens(metric.outputTokens)} out</span></div></div>; }
