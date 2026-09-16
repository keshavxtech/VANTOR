"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DatasetService } from "@/lib/services/dataset-service";
import { Dataset } from "@/types/dataset";
import {
  ArrowLeft,
  Database,
  HardDrive,
  Layers,
  FlaskConical,
  Trash2,
  FileCode,
  CheckCircle2,
  Share2,
} from "lucide-react";

export default function DatasetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "sample" | "lineage">("overview");

  useEffect(() => {
    if (id) {
      const found = DatasetService.getDatasetById(id);
      if (found) {
        setDataset(found);
      }
    }
  }, [id]);

  if (!dataset) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="text-base font-sans font-semibold text-white">Dataset Not Found</div>
        <p className="text-xs font-sans text-[#8B95A5]">
          The dataset record with ID <code className="font-mono-tech">{id}</code> does not exist or has been removed.
        </p>
        <Link
          href="/datasets"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#1E2430] text-xs font-sans text-white hover:bg-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Datasets</span>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete dataset "${dataset.name}"?`)) {
      DatasetService.deleteDataset(dataset.id);
      router.push("/datasets");
    }
  };

  const sampleJsonl = [
    {
      instruction: "Write a Python function to compute the Levenshtein distance between two strings using dynamic programming.",
      input: "str1 = 'kitten', str2 = 'sitting'",
      output: "def levenshtein(s1, s2):\n    if len(s1) < len(s2):\n        return levenshtein(s2, s1)\n    if len(s2) == 0:\n        return len(s1)\n    previous_row = range(len(s2) + 1)\n    for i, c1 in enumerate(s1):\n        current_row = [i + 1]\n        for j, c2 in enumerate(s2):\n            insertions = previous_row[j + 1] + 1\n            deletions = current_row[j] + 1\n            substitutions = previous_row[j] + (c1 != c2)\n            current_row.append(min(insertions, deletions, substitutions))\n        previous_row = current_row\n    return previous_row[-1]"
    },
    {
      instruction: "Generate a type-safe TypeScript interface for an asynchronous streaming HTTP response chunk.",
      input: "",
      output: "export interface StreamChunk<T = unknown> {\n  id: string;\n  object: 'chat.completion.chunk';\n  created: number;\n  model: string;\n  choices: Array<{\n    index: number;\n    delta: Partial<T>;\n    finish_reason: 'stop' | 'length' | null;\n  }>;\n}"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/datasets"
          className="inline-flex items-center gap-2 text-xs font-sans text-[#8B95A5] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Datasets</span>
        </Link>

        <button
          onClick={handleDelete}
          className="px-3 py-1.5 rounded-[8px] bg-red-500/10 border border-red-500/20 text-xs font-sans text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Dataset</span>
        </button>
      </div>

      {/* Hero Header Banner */}
      <div className="p-6 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] relative overflow-hidden glow-ambient-violet">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded bg-[#1E2430] border border-white/[0.06] text-[#22D3EE] font-semibold">
                {dataset.format}
              </span>
              <span className="text-xs font-mono-tech text-[#5A6472]">{dataset.version}</span>
              <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 capitalize">
                {dataset.status}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight">
              {dataset.name}
            </h1>
            <p className="text-sm font-sans text-[#8B95A5] max-w-3xl leading-relaxed">
              {dataset.description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start shrink-0">
            <Link
              href={`/experiments?datasetId=${dataset.id}`}
              className="px-3 py-2 rounded-[10px] bg-[#7C3AED] text-xs font-sans font-medium text-white hover:bg-[#6D28D9] transition-all flex items-center gap-1.5 shadow-md shadow-[#7C3AED]/20"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Launch Experiment</span>
            </Link>
            <button
              onClick={() => {
                const updated = DatasetService.createVersion(dataset.id, "Manual dataset revision");
                if (updated) setDataset(updated);
              }}
              className="px-3 py-2 rounded-[10px] bg-[#1E2430] border border-white/[0.06] text-xs font-sans font-medium text-white hover:bg-white/[0.08] transition-all"
            >
              Create Version
            </button>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="mt-6 pt-4 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-4 text-[#8B95A5]">
            <span className="flex items-center gap-1.5 font-mono-tech text-white">
              <HardDrive className="w-3.5 h-3.5 text-[#5A6472]" />
              Size: {dataset.size}
            </span>
            <span className="flex items-center gap-1.5 font-mono-tech text-white">
              <Layers className="w-3.5 h-3.5 text-[#5A6472]" />
              Row Count: {dataset.rowCount}
            </span>
          </div>

          {dataset.projectName && (
            <div className="text-xs font-sans text-[#5A6472]">
              Assigned Project: <span className="text-white">{dataset.projectName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.06] flex items-center gap-6 text-sm font-sans">
        {(["overview", "sample", "lineage"] as const).map((tab) => (
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
              <h2 className="text-sm font-sans font-semibold text-white">Partition Summary & Split Ratios</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-[#8B95A5]">Train / Validation / Test Split</span>
                  <span className="font-mono-tech text-white">80% / 10% / 10%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-[#1E2430] overflow-hidden flex">
                  <div className="h-full bg-[#7C3AED]" style={{ width: "80%" }} title="Train: 80%" />
                  <div className="h-full bg-[#22D3EE]" style={{ width: "10%" }} title="Val: 10%" />
                  <div className="h-full bg-[#10B981]" style={{ width: "10%" }} title="Test: 10%" />
                </div>
                <div className="flex items-center gap-4 text-[11px] font-sans text-[#8B95A5] pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#7C3AED]" /> Train (80%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#22D3EE]" /> Validation (10%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Test (10%)
                  </span>
                </div>
              </div>
            </div>

            {dataset.tags && dataset.tags.length > 0 && (
              <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-3">
                <h2 className="text-sm font-sans font-semibold text-white">Dataset Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {dataset.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-full bg-[#1E2430] text-xs font-mono-tech text-[#8B95A5] border border-white/[0.06]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
              <h3 className="text-xs font-sans font-medium text-[#5A6472] uppercase tracking-[0.05em]">
                DATASET METADATA
              </h3>
              <div className="space-y-3 text-xs font-sans">
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-[#8B95A5]">Dataset ID</span>
                  <span className="font-mono-tech text-white">{dataset.id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-[#8B95A5]">Format</span>
                  <span className="font-mono-tech text-[#22D3EE]">{dataset.format}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-[#8B95A5]">Version Tag</span>
                  <span className="font-mono-tech text-white">{dataset.version}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#8B95A5]">Experiments Linked</span>
                  <span className="font-mono-tech text-white">{dataset.experimentsCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Data Viewer Tab */}
      {activeTab === "sample" && (
        <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-sans font-semibold text-white">Interactive JSONL Inspector Preview</h2>
            <span className="text-xs font-mono-tech text-[#5A6472]">Showing 2 sample records</span>
          </div>

          {dataset.sourceFileName && (
            <p className="text-[11px] text-[#5A6472]">Source: <span className="font-mono-tech text-[#8B95A5]">{dataset.sourceFileName}</span></p>
          )}
          {dataset.sampleRows && dataset.sampleRows.length > 0 ? (
            <div className="overflow-x-auto rounded-[10px] border border-white/[0.06]">
              <table className="w-full text-left text-[11px] font-mono-tech">
                <thead className="bg-[#0A0E14] text-[#8B95A5]"><tr>{(dataset.columns || Object.keys((dataset.sampleRows ?? [])[0] ?? {})).map(c => <th key={c} className="px-3 py-2 border-b border-white/[0.06] whitespace-nowrap">{c}</th>)}</tr></thead>
                <tbody>{(dataset.sampleRows ?? []).slice(0, 20).map((row, idx) => <tr key={idx} className="border-b border-white/[0.04] last:border-0">{(dataset.columns || Object.keys((dataset.sampleRows ?? [])[0] ?? {})).map(c => <td key={c} className="px-3 py-2 text-[#D7DCE3] max-w-[320px] truncate">{String(row[c] ?? "")}</td>)}</tr>)}</tbody>
              </table>
            </div>
          ) : (
          <div className="space-y-4">
            {sampleJsonl.map((sample, idx) => (
              <div key={idx} className="p-4 rounded-[10px] bg-[#0A0E14] border border-white/[0.06] font-mono-tech text-xs space-y-2">
                <div className="text-[#7C3AED] font-semibold"># Record #{idx + 1}</div>
                <div className="text-white"><span className="text-[#8B95A5]">instruction:</span> &quot;{sample.instruction}&quot;</div>
                {sample.input && <div className="text-[#22D3EE]"><span className="text-[#8B95A5]">input:</span> &quot;{sample.input}&quot;</div>}
                <div className="text-[#8B95A5] pt-1">output:</div>
                <pre className="p-3 rounded bg-[#161B22] border border-white/[0.04] text-[#10B981] overflow-x-auto text-[11px] leading-relaxed">
                  {sample.output}
                </pre>
              </div>
            ))}
          </div>
          )}
          {dataset.versions && dataset.versions.length > 0 && (
            <div className="mt-5 p-4 rounded-[10px] bg-[#0A0E14] border border-white/[0.06]">
              <h3 className="text-xs font-semibold text-white mb-3">Version History</h3>
              <div className="space-y-2">
                {dataset.versions.map(v => <div key={v.id} className="flex items-center justify-between gap-3 text-[11px]"><span className="font-mono-tech text-[#22D3EE]">{v.version}</span><span className="text-[#8B95A5]">{v.rows}</span><span className="text-[#5A6472]">{v.note}</span></div>)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lineage Tab */}
      {activeTab === "lineage" && (
        <div className="p-6 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
          <h2 className="text-sm font-sans font-semibold text-white">Data Lineage & Provenance Flow</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.04]">
            <div className="p-4 rounded-lg bg-[#161B22] border border-white/[0.06] text-center space-y-1 w-full md:w-auto">
              <span className="text-[10px] font-sans text-[#5A6472] uppercase block">SOURCE FILE</span>
              <span className="text-xs font-mono-tech text-white block">raw_corpus_v3.jsonl</span>
            </div>
            <div className="text-xs font-mono-tech text-[#7C3AED]">→ AST Filter →</div>
            <div className="p-4 rounded-lg bg-[#161B22] border border-white/[0.06] text-center space-y-1 w-full md:w-auto">
              <span className="text-[10px] font-sans text-[#5A6472] uppercase block">CURATED PARTITION</span>
              <span className="text-xs font-mono-tech text-[#22D3EE] block">{dataset.name}</span>
            </div>
            <div className="text-xs font-mono-tech text-[#7C3AED]">→ Fine-Tune →</div>
            <div className="p-4 rounded-lg bg-[#161B22] border border-white/[0.06] text-center space-y-1 w-full md:w-auto">
              <span className="text-[10px] font-sans text-[#5A6472] uppercase block">TRAINED MODEL</span>
              <span className="text-xs font-mono-tech text-[#10B981] block">Llama-3-70B-Instruct</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
