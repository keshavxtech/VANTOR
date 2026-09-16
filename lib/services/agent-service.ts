import { Agent, CreateAgentInput, AgentTelemetry } from "@/types/agent";

const STORAGE_KEY = "vantor_agents_store_v1";

const initialSampleAgents: Agent[] = [
  {
    id: "agent_ast_refactor_swarm",
    name: "AST Refactoring & Test Generator Agent",
    description: "Autonomous code modification agent that parses AST node trees, applies clean code patterns, and executes automated verification unit tests.",
    model: "Claude Sonnet 5",
    systemInstructions: "You are an autonomous engineering agent. You receive source files, analyze AST structures, apply refactoring passes, and verify output using the test runner capability.",
    status: "active",
    projectId: "proj_agent_refactor",
    projectName: "Autonomous Code Refactoring Agent",
    promptId: "prompt_ast_refactor_system",
    promptName: "AST Structural Code Refactoring Guardrail",
    createdAt: "2026-08-20T14:00:00Z",
    updatedAt: "2026-09-04T12:00:00Z",
    tools: [
      { id: "tool_ast", name: "AST Parser & Mutator", type: "AST Mutation", enabled: true },
      { id: "tool_static", name: "ESLint / Static Analyzer", type: "Static Analysis", enabled: true },
      { id: "tool_test", name: "Jest / Vitest Runner", type: "Test Runner", enabled: true },
      { id: "tool_vector", name: "Codebase Embedding Index", type: "Vector Retrieval", enabled: false },
    ],
    runHistory: [
      { id: "arun_1", task: "Refactored legacy async callbacks in /lib/api", status: "success", timestamp: "2 hours ago", duration: "18s" },
      { id: "arun_2", task: "Generated unit test harness for auth module", status: "success", timestamp: "Yesterday", duration: "24s" },
    ],
  },
  {
    id: "agent_rag_doc_ingest",
    name: "Doc Ingestion & Vector Chunking Agent",
    description: "Background worker agent that monitors incoming PDF schematics, extracts text markdown, generates vector chunks, and pushes embeddings to index.",
    model: "Gemini 3.6 Flash",
    systemInstructions: "You are a document processing worker agent. Inspect incoming technical documentation, format clean Markdown chunks, and generate dense vectors.",
    status: "idle",
    projectId: "proj_multimodal_rag",
    projectName: "Multimodal Vector Retrieval Index",
    promptId: "prompt_rag_grounding",
    promptName: "Strict Context Grounding QA Template",
    createdAt: "2026-08-25T11:00:00Z",
    updatedAt: "2026-09-03T16:00:00Z",
    tools: [
      { id: "tool_vec_push", name: "Vector Index Ingester", type: "Vector Retrieval", enabled: true },
      { id: "tool_api", name: "Doc Pipeline Dispatcher", type: "API Dispatcher", enabled: true },
    ],
    runHistory: [
      { id: "arun_3", task: "Ingested 1,200 PDF pages from architecture manual", status: "success", timestamp: "Yesterday", duration: "02m 14s" },
    ],
  },
];

export class AgentService {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  public static getAgents(): Agent[] {
    if (!this.isClient()) return initialSampleAgents;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSampleAgents));
        return initialSampleAgents;
      }
      return JSON.parse(stored);
    } catch {
      return initialSampleAgents;
    }
  }

  public static getAgentById(id: string): Agent | undefined {
    return this.getAgents().find((a) => a.id === id);
  }

  public static createAgent(input: CreateAgentInput): Agent {
    const agents = this.getAgents();
    const now = new Date().toISOString();
    const newAgent: Agent = {
      id: `agent_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: input.name,
      description: input.description,
      model: input.model,
      systemInstructions: input.systemInstructions,
      status: input.status,
      tools: input.tools,
      projectId: input.projectId,
      projectName: input.projectName,
      promptId: input.promptId,
      promptName: input.promptName,
      createdAt: now,
      updatedAt: now,
      runHistory: [
        {
          id: `arun_${Date.now()}`,
          task: "Agent initialized in workspace swarm",
          status: "success",
          timestamp: "Just now",
          duration: "1s",
        },
      ],
    };

    const updated = [newAgent, ...agents];
    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to store agent", e);
      }
    }
    return newAgent;
  }

  public static updateTools(agentId: string, tools: Agent["tools"]): Agent | null {
    const agents = this.getAgents();
    const idx = agents.findIndex((a) => a.id === agentId);
    if (idx === -1) return null;

    agents[idx].tools = tools;
    agents[idx].updatedAt = new Date().toISOString();

    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
      } catch (e) {
        console.error("Failed to update agent tools", e);
      }
    }
    return agents[idx];
  }

  public static deleteAgent(id: string): boolean {
    const agents = this.getAgents();
    const filtered = agents.filter((a) => a.id !== id);
    if (filtered.length === agents.length) return false;

    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (e) {
        console.error("Failed to delete agent", e);
      }
    }
    return true;
  }

  public static getTelemetry(): AgentTelemetry {
    const agents = this.getAgents();
    const enabledToolsCount = agents.reduce((acc, a) => acc + a.tools.filter((t) => t.enabled).length, 0);
    const totalRuns = agents.reduce((acc, a) => acc + a.runHistory.length, 0);
    return {
      totalAgents: agents.length,
      activeAgents: agents.filter((a) => a.status === "active").length,
      totalToolsEnabled: enabledToolsCount,
      totalAgentRuns: totalRuns,
    };
  }
}
