export type AgentStatus = "active" | "idle" | "paused" | "training";

export interface AgentTool {
  id: string;
  name: string;
  type: "Static Analysis" | "AST Mutation" | "Vector Retrieval" | "Test Runner" | "API Dispatcher";
  enabled: boolean;
}

export interface AgentRunHistory {
  id: string;
  task: string;
  status: "success" | "failed" | "running";
  timestamp: string;
  duration: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  systemInstructions: string;
  status: AgentStatus;
  tools: AgentTool[];
  projectId: string;
  projectName: string;
  promptId?: string;
  promptName?: string;
  createdAt: string;
  updatedAt: string;
  runHistory: AgentRunHistory[];
}

export interface CreateAgentInput {
  name: string;
  description: string;
  model: string;
  systemInstructions: string;
  status: AgentStatus;
  tools: AgentTool[];
  projectId: string;
  projectName: string;
  promptId?: string;
  promptName?: string;
}

export interface AgentTelemetry {
  totalAgents: number;
  activeAgents: number;
  totalToolsEnabled: number;
  totalAgentRuns: number;
}
