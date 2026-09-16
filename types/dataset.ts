export type DatasetFormat = "JSONL" | "Parquet" | "CSV" | "Vector Index" | "Audio Archive";
export type DatasetStatus = "ready" | "processing" | "archived";

export interface DatasetActivity { id: string; action: string; timestamp: string; user: string; }
export interface DatasetVersion { id: string; version: string; createdAt: string; rows: string; size: string; note?: string; }

export interface Dataset {
  id: string; name: string; description: string; format: DatasetFormat; size: string; rowCount: string;
  version: string; status: DatasetStatus; createdAt: string; updatedAt: string; projectId?: string; projectName?: string;
  experimentsCount: number; tags?: string[]; recentActivities?: DatasetActivity[];
  sourceFileName?: string; columns?: string[]; sampleRows?: Record<string, unknown>[]; versions?: DatasetVersion[];
}
export interface CreateDatasetInput {
  name: string; description: string; format: DatasetFormat; size: string; rowCount: string; version: string; status: DatasetStatus;
  projectId?: string; projectName?: string; tags?: string[]; sourceFileName?: string; columns?: string[]; sampleRows?: Record<string, unknown>[];
}
export interface DatasetTelemetry { totalDatasets: number; readyDatasets: number; totalSize: string; totalSamples: string; }
