"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { EvaluationService } from "@/lib/services/evaluation-service";
import { Evaluation } from "@/types/evaluation";
import {
  ArrowLeft,
  Activity,
  Award,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

export default function EvaluationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  useEffect(() => {
    if (id) {
      const found = EvaluationService.getEvaluationById(id);
      if (found) {
        setEvaluation(found);
      }
    }
  }, [id]);

  if (!evaluation) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="text-base font-sans font-semibold text-white">Evaluation Not Found</div>
        <p className="text-xs font-sans text-[#8B95A5]">
          The evaluation suite record with ID <code className="font-mono-tech">{id}</code> does not exist or has been removed.
        </p>
        <Link
          href="/evaluations"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#1E2430] text-xs font-sans text-white hover:bg-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Evaluations</span>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete evaluation suite "${evaluation.name}"?`)) {
      EvaluationService.deleteEvaluation(evaluation.id);
      router.push("/evaluations");
    }
  };

  const latestRun = evaluation.runs[0];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/evaluations"
          className="inline-flex items-center gap-2 text-xs font-sans text-[#8B95A5] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Evaluations</span>
        </Link>

        <button
          onClick={handleDelete}
          className="px-3 py-1.5 rounded-[8px] bg-red-500/10 border border-red-500/20 text-xs font-sans text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Suite</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="p-6 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] relative overflow-hidden glow-ambient-violet">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] font-semibold">
                Pass Rate: {evaluation.passRate}
              </span>
              <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 capitalize">
                {evaluation.status}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight">
              {evaluation.name}
            </h1>
            <p className="text-sm font-sans text-[#8B95A5] max-w-3xl leading-relaxed">
              {evaluation.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans text-[#8B95A5]">
            <div>
              <span className="text-[10px] text-[#5A6472] block uppercase">Target Model</span>
              <span className="font-mono-tech text-white">{evaluation.modelName}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#5A6472] block uppercase">Dataset</span>
              <span className="font-mono-tech text-[#22D3EE]">{evaluation.datasetName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scorecard Metrics Breakdown */}
      {latestRun && (
        <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-sans font-semibold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#10B981]" /> Suite Scorecard & Assertions ({latestRun.runDate})
            </h2>
            <span className="text-xs font-mono-tech text-[#10B981]">Overall: {evaluation.overallScore}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestRun.metrics.map((m, idx) => (
              <div key={idx} className="p-4 rounded-[10px] bg-[#1E2430]/60 border border-white/[0.04] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans text-[#8B95A5]">{m.name}</span>
                  {m.status === "pass" ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  ) : m.status === "warn" ? (
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="text-xl font-mono-tech font-bold text-white">{m.score}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historical Runs */}
      <div className="p-5 rounded-[14px] bg-[#161B22] border border-white/[0.06] space-y-4">
        <h2 className="text-sm font-sans font-semibold text-white">Historical Evaluation Run History</h2>
        <div className="divide-y divide-white/[0.04]">
          {evaluation.runs.map((run) => (
            <div key={run.id} className="py-3 flex items-center justify-between text-xs font-sans">
              <div className="flex items-center gap-3">
                <Clock className="w-3.5 h-3.5 text-[#5A6472]" />
                <span className="font-mono-tech text-white">{run.runDate}</span>
                <span className="font-mono-tech text-[#10B981]">Pass Rate: {run.passRate}</span>
              </div>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 capitalize">
                {run.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
