export type DeploymentEnvironment = "Production" | "Staging" | "Development" | "Edge Cluster";

export type DeploymentStatus = "Active" | "Building" | "Draft" | "Paused" | "Failed";

export interface DeploymentHistory {
  id: string;
  version: string;
  deployedAt: string;
  deployedBy: string;
  status: DeploymentStatus;
}

export interface Deployment {
  id: string;
  name: string;
  description: string;
  projectId: string;
  projectName: string;
  targetType: "Model" | "Agent";
  targetId: string;
  targetName: string;
  environment: DeploymentEnvironment;
  version: string;
  status: DeploymentStatus;
  endpointUrl: string;
  latencyMs: string;
  throughput: string;
  createdAt: string;
  updatedAt: string;
  history: DeploymentHistory[];
}

export interface CreateDeploymentInput {
  name: string;
  description: string;
  projectId: string;
  projectName: string;
  targetType: "Model" | "Agent";
  targetId: string;
  targetName: string;
  environment: DeploymentEnvironment;
  version: string;
  status: DeploymentStatus;
}

export interface DeploymentTelemetry {
  totalDeployments: number;
  activeDeployments: number;
  avgLatency: string;
  totalRequestsSec: string;
}
