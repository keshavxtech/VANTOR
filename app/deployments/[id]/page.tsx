"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DeploymentService } from "@/lib/services/deployment-service";
import { Deployment } from "@/types/deployment";
import {
  ArrowLeft,
  Zap,
  Globe,
  Trash2,
  CheckCircle2,
  Clock,
  Terminal,
  Copy,
  Check,
  Activity,
  ShieldCheck,
} from "lucide-react";

export default function DeploymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "code" | "logs">("overview");

  useEffect(() => {
    if (id) {
      const found = DeploymentService.getDeploymentById(id);
      if (found) {
        setDeployment(found);
      }
    }
  }, [id]);

  if (!deployment) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="text-base font-sans font-semibold text-white">Endpoint Not Found</div>
        <p className="text-xs font-sans text-[#8B95A5]">
          The deployment endpoint record with ID <code className="font-mono-tech">{id}</code> does not exist or has been removed.
        </p>
        <Link
          href="/deployments"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#1E2430] text-xs font-sans text-white hover:bg-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Deployments</span>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to deprovision endpoint "${deployment.name}"?`)) {
      DeploymentService.deleteDeployment(deployment.id);
      router.push("/deployments");
    }
  };

  const copyEndpoint = () => {
    navigator.clipboard.writeText(deployment.endpointUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pythonSnippet = `import openai

client = openai.OpenAI(
    base_url="${deployment.endpointUrl}",
    api_key="vantor-local-key"
)

response = client.chat.completions.create(
    model="${deployment.targetName}",
    messages=[
        {"role": "user", "content": "Refactor input data"}
    ]
)
print(response.choices[0].message.content)`;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/deployments"
          className="inline-flex items-center gap-2 text-xs font-sans text-[#8B95A5] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Deployments</span>
        </Link>

        <button
          onClick={handleDelete}
          className="px-3 py-1.5 rounded-[8px] bg-red-500/10 border border-red-500/20 text-xs font-sans text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Deprovision Endpoint</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="p-6 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] relative overflow-hidden glow-ambient-violet">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded bg-[#7C3AED]/12 border border-[#7C3AED]/20 text-[#7C3AED] font-semibold">
                {deployment.environment}
              </span>
              <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 capitalize">
                {deployment.status}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight">
              {deployment.name}
            </h1>
            <p className="text-sm font-sans text-[#8B95A5] max-w-3xl leading-relaxed">
              {deployment.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans text-[#8B95A5]">
            <div>
              <span className="text-[10px] text-[#5A6472] block uppercase">Target {deployment.targetType}</span>
              <span className="font-mono-tech text-white">{deployment.targetName}</span>
            </div>
          </div>
        </div>

        {/* Endpoint URL Copy Strip */}
        <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono-tech text-xs text-white bg-[#0A0E14] px-3 py-1.5 rounded-lg border border-white/[0.06] flex-1 truncate">
            <Globe className="w-3.5 h-3.5 text-[#22D3EE] shrink-0" />
            <span className="truncate">{deployment.endpointUrl}</span>
          </div>
          <button
            onClick={copyEndpoint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E2430] border border-white/[0.06] text-xs font-sans text-white hover:bg-white/[0.08] transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#8B95A5]" />}
            <span>{copied ? "Copied" : "Copy URL"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.06] flex items-center gap-6 text-sm font-sans">
        {(["overview", "code", "logs"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-medium capitalize transition-colors relative ${
              activeTab === tab
                ? "text-white border-b-2 border-[#7C3AED]"
                : "text-[#8B95A5] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
              <h2 className="text-sm font-sans font-semibold text-white">Serving Health & Telemetry Metrics</h2>
              <div className="grid grid-cols-3 gap-4 p-4 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.04]">
                <div>
                  <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
                    P95 LATENCY
                  </span>
                  <span className="text-xl font-mono-tech font-semibold text-[#22D3EE]">{deployment.latencyMs}</span>
                </div>
                <div>
                  <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
                    THROUGHPUT
                  </span>
                  <span className="text-xl font-mono-tech font-semibold text-[#10B981]">{deployment.throughput}</span>
                </div>
                <div>
                  <span className="text-[10px] font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em] block">
                    UPTIME SLA
                  </span>
                  <span className="text-xl font-mono-tech font-semibold text-white">99.98%</span>
                </div>
              </div>
            </div>

            {/* Deployment History */}
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-3">
              <h2 className="text-sm font-sans font-semibold text-white">Deployment Revision History</h2>
              <div className="divide-y divide-white/[0.04]">
                {deployment.history.map((h) => (
                  <div key={h.id} className="py-2.5 flex items-center justify-between text-xs font-sans">
                    <div className="space-y-0.5">
                      <span className="text-white font-mono-tech font-semibold block">{h.version}</span>
                      <span className="text-[11px] text-[#5A6472]">by {h.deployedBy}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono-tech text-[#8B95A5]">{h.deployedAt}</span>
                      <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 capitalize">
                        {h.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
              <h3 className="text-xs font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em]">
                HARDWARE & AUTOSCALE SPEC
              </h3>
              <div className="space-y-3 text-xs font-sans">
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-[#8B95A5]">Accelerator</span>
                  <span className="font-mono-tech text-white">4x NVIDIA A100-80GB</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-[#8B95A5]">Inference Engine</span>
                  <span className="font-mono-tech text-[#7C3AED]">vLLM v0.6.1</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-[#8B95A5]">Auto-scale Replicas</span>
                  <span className="font-mono-tech text-white">2 min / 8 max</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#8B95A5]">Region</span>
                  <span className="font-mono-tech text-white">us-east-local</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Snippet Tab */}
      {activeTab === "code" && (
        <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
          <h2 className="text-sm font-sans font-semibold text-white">Python OpenAI SDK Integration Snippet</h2>
          <pre className="p-4 rounded-[10px] bg-[#0A0E14] border border-white/[0.06] text-[#22D3EE] font-mono-tech text-xs overflow-x-auto leading-relaxed">
            {pythonSnippet}
          </pre>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-3">
          <h2 className="text-sm font-sans font-semibold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#7C3AED]" /> Live Ingestion Server Logs
          </h2>
          <pre className="p-4 rounded-[10px] bg-[#0A0E14] border border-white/[0.06] font-mono-tech text-[11px] text-[#8B95A5] leading-relaxed overflow-x-auto space-y-1">
            <div className="text-white">[INFO] vLLM server initialized on port 8000. CUDA memory 94.2% allocated.</div>
            <div>[HTTP] POST /v1/chat/completions HTTP/1.1 200 OK (latency: 38ms)</div>
            <div>[HTTP] POST /v1/chat/completions HTTP/1.1 200 OK (latency: 44ms)</div>
            <div className="text-[#10B981]">[HEALTH] Readiness probe ok: 200 OK</div>
          </pre>
        </div>
      )}
    </div>
  );
}
