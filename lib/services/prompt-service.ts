import { Prompt, CreatePromptInput, PromptTelemetry, PromptVersionItem } from "@/types/prompt";

const STORAGE_KEY = "vantor_prompts_store_v1";

const initialSamplePrompts: Prompt[] = [
  {
    id: "prompt_ast_refactor_system",
    name: "AST Structural Code Refactoring Guardrail",
    description: "System instructions forcing deterministic TypeScript AST mutations and prohibiting hallucinated imports.",
    category: "Code",
    currentVersion: "v2.1",
    createdAt: "2026-08-15T10:00:00Z",
    updatedAt: "2026-09-04T14:00:00Z",
    projectId: "proj_agent_refactor",
    projectName: "Autonomous Code Refactoring Agent",
    tags: ["AST", "TypeScript", "Refactor"],
    versions: [
      {
        version: "v2.1",
        systemPrompt: "You are an expert TypeScript AST compiler agent. Analyze input source code, execute precise AST transformations without changing runtime semantics, and produce clean code output.",
        userPrompt: "Refactor the following function to use async/await and remove explicit promise constructors:\n\n{{code_snippet}}",
        variables: ["code_snippet"],
        temperature: 0.1,
        model: "Claude Sonnet 5",
        createdAt: "2026-09-04 14:00",
      },
      {
        version: "v1.0",
        systemPrompt: "You are a code refactoring assistant. Improve the given code snippet.",
        userPrompt: "Refactor code: {{code_snippet}}",
        variables: ["code_snippet"],
        temperature: 0.2,
        model: "GPT-5.6 Luna",
        createdAt: "2026-08-15 10:00",
      },
    ],
  },
  {
    id: "prompt_rag_grounding",
    name: "Strict Context Grounding QA Template",
    description: "RAG prompt enforcing zero external knowledge fallback when retrieved facts are insufficient.",
    category: "Extraction",
    currentVersion: "v1.4",
    createdAt: "2026-08-20T11:00:00Z",
    updatedAt: "2026-09-03T16:20:00Z",
    projectId: "proj_multimodal_rag",
    projectName: "Multimodal Vector Retrieval Index",
    tags: ["RAG", "Grounding", "Extraction"],
    versions: [
      {
        version: "v1.4",
        systemPrompt: "Answer the user question strictly based on the provided context passages below. If the answer cannot be directly derived from the context, reply 'INSUFFICIENT_CONTEXT'.",
        userPrompt: "Context:\n{{retrieved_chunks}}\n\nQuestion: {{user_query}}",
        variables: ["retrieved_chunks", "user_query"],
        temperature: 0.0,
        model: "Gemini 3.6 Flash",
        createdAt: "2026-09-03 16:20",
      },
    ],
  },
];

export class PromptService {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  public static getPrompts(): Prompt[] {
    if (!this.isClient()) return initialSamplePrompts;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSamplePrompts));
        return initialSamplePrompts;
      }
      return JSON.parse(stored);
    } catch {
      return initialSamplePrompts;
    }
  }

  public static getPromptById(id: string): Prompt | undefined {
    return this.getPrompts().find((p) => p.id === id);
  }

  public static createPrompt(input: CreatePromptInput): Prompt {
    const prompts = this.getPrompts();
    const now = new Date().toISOString();
    const initialVersion: PromptVersionItem = {
      version: "v1.0",
      systemPrompt: input.systemPrompt,
      userPrompt: input.userPrompt,
      variables: input.variables,
      temperature: input.temperature,
      model: input.model,
      createdAt: now,
    };

    const newPrompt: Prompt = {
      id: `prompt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: input.name,
      description: input.description,
      category: input.category,
      currentVersion: "v1.0",
      createdAt: now,
      updatedAt: now,
      projectId: input.projectId,
      projectName: input.projectName,
      tags: [input.category],
      versions: [initialVersion],
    };

    const updated = [newPrompt, ...prompts];
    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to store prompt", e);
      }
    }
    return newPrompt;
  }

  public static addVersion(promptId: string, versionData: Omit<PromptVersionItem, "createdAt">): Prompt | null {
    const prompts = this.getPrompts();
    const idx = prompts.findIndex((p) => p.id === promptId);
    if (idx === -1) return null;

    const target = prompts[idx];
    const now = new Date().toISOString();
    const newVer: PromptVersionItem = {
      ...versionData,
      createdAt: now,
    };

    target.versions = [newVer, ...target.versions];
    target.currentVersion = newVer.version;
    target.updatedAt = now;
    prompts[idx] = target;

    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
      } catch (e) {
        console.error("Failed to add prompt version", e);
      }
    }
    return target;
  }

  public static deletePrompt(id: string): boolean {
    const prompts = this.getPrompts();
    const filtered = prompts.filter((p) => p.id !== id);
    if (filtered.length === prompts.length) return false;

    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (e) {
        console.error("Failed to delete prompt", e);
      }
    }
    return true;
  }

  public static getTelemetry(): PromptTelemetry {
    const prompts = this.getPrompts();
    const totalVersions = prompts.reduce((acc, p) => acc + p.versions.length, 0);
    const categories = new Set(prompts.map((p) => p.category));
    return {
      totalPrompts: prompts.length,
      totalVersions,
      activeCategories: categories.size,
    };
  }
}
