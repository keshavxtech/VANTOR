import { Evaluation, CreateEvaluationInput, EvaluationTelemetry } from "@/types/evaluation";

const STORAGE_KEY = "vantor_evaluations_store_v1";

const initialSampleEvaluations: Evaluation[] = [
  {
    id: "eval_code_refactor_accuracy",
    name: "AST Refactor Accuracy & Safety Suite",
    description: "Automated evaluation suite validating refactored TypeScript output for syntax validity, test pass rates, and safety guardrails.",
    projectId: "proj_agent_refactor",
    projectName: "Autonomous Code Refactoring Agent",
    modelId: "mod_claude35_sonnet",
    modelName: "Claude Sonnet 5",
    datasetId: "ds_ast_refactor_bench",
    datasetName: "AST-Refactor-Eval-Suite",
    agentId: "agent_ast_refactor_swarm",
    agentName: "AST Refactoring & Test Generator Agent",
    passRate: "98.4%",
    overallScore: "96.8 / 100",
    status: "passed",
    createdAt: "2026-08-22T09:00:00Z",
    updatedAt: "2026-09-04T13:00:00Z",
    runs: [
      {
        id: "evalrun_1",
        runDate: "2026-09-04 13:00",
        passRate: "98.4%",
        status: "passed",
        metrics: [
          { name: "Pass Rate", score: "98.4%", status: "pass" },
          { name: "Syntax Accuracy", score: "100.0%", status: "pass" },
          { name: "Safety & Guardrails", score: "99.2%", status: "pass" },
          { name: "Avg Latency", score: "112ms", status: "pass" },
          { name: "Relevance Score", score: "95.5%", status: "pass" },
        ],
      },
      {
        id: "evalrun_2",
        runDate: "2026-09-01 10:00",
        passRate: "96.1%",
        status: "passed",
        metrics: [
          { name: "Pass Rate", score: "96.1%", status: "pass" },
          { name: "Syntax Accuracy", score: "98.5%", status: "pass" },
          { name: "Safety & Guardrails", score: "97.0%", status: "pass" },
          { name: "Avg Latency", score: "125ms", status: "warn" },
          { name: "Relevance Score", score: "94.0%", status: "pass" },
        ],
      },
    ],
  },
  {
    id: "eval_rag_grounding_harness",
    name: "RAG Context Hallucination Benchmark",
    description: "Evaluates model responses against ground truth context chunks to ensure zero hallucination and strict context adherence.",
    projectId: "proj_multimodal_rag",
    projectName: "Multimodal Vector Retrieval Index",
    modelId: "mod_gemini_15_pro",
    modelName: "Gemini 3.6 Flash",
    datasetId: "ds_vector_tech_docs",
    datasetName: "Tech-Manuals-Vector-Store",
    promptId: "prompt_rag_grounding",
    promptName: "Strict Context Grounding QA Template",
    passRate: "95.2%",
    overallScore: "94.5 / 100",
    status: "passed",
    createdAt: "2026-08-26T14:00:00Z",
    updatedAt: "2026-09-03T17:30:00Z",
    runs: [
      {
        id: "evalrun_3",
        runDate: "2026-09-03 17:30",
        passRate: "95.2%",
        status: "passed",
        metrics: [
          { name: "Pass Rate", score: "95.2%", status: "pass" },
          { name: "Zero Hallucination", score: "97.8%", status: "pass" },
          { name: "Context Recall", score: "92.6%", status: "pass" },
          { name: "Avg Latency", score: "88ms", status: "pass" },
        ],
      },
    ],
  },
];

export class EvaluationService {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  public static getEvaluations(): Evaluation[] {
    if (!this.isClient()) return initialSampleEvaluations;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSampleEvaluations));
        return initialSampleEvaluations;
      }
      return JSON.parse(stored);
    } catch {
      return initialSampleEvaluations;
    }
  }

  public static getEvaluationById(id: string): Evaluation | undefined {
    return this.getEvaluations().find((e) => e.id === id);
  }

  public static createEvaluation(input: CreateEvaluationInput): Evaluation {
    const evals = this.getEvaluations();
    const now = new Date().toISOString();
    const newEval: Evaluation = {
      id: `eval_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: input.name,
      description: input.description,
      projectId: input.projectId,
      projectName: input.projectName,
      modelId: input.modelId,
      modelName: input.modelName,
      datasetId: input.datasetId,
      datasetName: input.datasetName,
      promptId: input.promptId,
      promptName: input.promptName,
      agentId: input.agentId,
      agentName: input.agentName,
      passRate: "97.5%",
      overallScore: "95.0 / 100",
      status: input.status,
      createdAt: now,
      updatedAt: now,
      runs: [
        {
          id: `evalrun_${Date.now()}`,
          runDate: "Just now",
          passRate: "97.5%",
          status: "passed",
          metrics: [
            { name: "Pass Rate", score: "97.5%", status: "pass" },
            { name: "Accuracy", score: "98.0%", status: "pass" },
            { name: "Relevance", score: "96.5%", status: "pass" },
            { name: "Latency", score: "92ms", status: "pass" },
          ],
        },
      ],
    };

    const updated = [newEval, ...evals];
    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to store evaluation", e);
      }
    }
    return newEval;
  }

  public static deleteEvaluation(id: string): boolean {
    const evals = this.getEvaluations();
    const filtered = evals.filter((e) => e.id !== id);
    if (filtered.length === evals.length) return false;

    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (e) {
        console.error("Failed to delete evaluation", e);
      }
    }
    return true;
  }

  public static getTelemetry(): EvaluationTelemetry {
    const evals = this.getEvaluations();
    return {
      totalEvaluations: evals.length,
      avgPassRate: "96.8%",
      passedEvals: evals.filter((e) => e.status === "passed").length,
      failedEvals: evals.filter((e) => e.status === "failed").length,
    };
  }
}
