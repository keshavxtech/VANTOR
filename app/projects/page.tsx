"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ProjectService } from "@/lib/services/project-service";
import { Project, CreateProjectInput, ProjectTelemetry } from "@/types/project";
import { ProjectTelemetryBar } from "@/components/projects/project-telemetry";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectCard } from "@/components/projects/project-card";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { Plus, Sparkles, FolderGit2 } from "lucide-react";
import { GithubRepositoryPicker, GithubRepo } from "@/components/github/github-repository-picker";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [telemetry, setTelemetry] = useState<ProjectTelemetry>({
    totalProjects: 0,
    activeProjects: 0,
    totalModels: 0,
    totalDatasets: 0,
    totalExperiments: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedFramework, setSelectedFramework] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load project data
  const loadData = () => {
    const data = ProjectService.getProjects();
    const stats = ProjectService.getTelemetry();
    setProjects(data);
    setTelemetry(stats);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.framework.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));

      // Status filter
      const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;

      // Framework filter
      const matchesFramework =
        selectedFramework === "all" || p.framework === selectedFramework;

      return matchesSearch && matchesStatus && matchesFramework;
    });
  }, [projects, searchQuery, selectedStatus, selectedFramework]);

  // Create Project handler
  const handleCreateProject = (input: CreateProjectInput) => {
    const newProj = ProjectService.createProject(input);
    loadData();
    setNotification(`Project "${newProj.name}" created successfully.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleGithubImport = (repo: GithubRepo) => {
    const existing = projects.find((project) => project.name.toLowerCase() === repo.name.toLowerCase());
    if (existing) {
      setNotification(`Project "${existing.name}" already exists in VANTOR.`);
      setTimeout(() => setNotification(null), 4000);
      return;
    }
    const project = ProjectService.createProject({
      name: repo.name,
      description: repo.description || `GitHub repository ${repo.full_name}`,
      type: "General Engineering",
      framework: repo.language === "Python" ? "Custom Python" : "Other",
      status: "active",
      tags: ["github", repo.private ? "private" : "public"],
    });
    loadData();
    setNotification(`Imported ${repo.full_name} as project "${project.name}".`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedFramework("all");
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 rounded-[10px] bg-[#10B981]/10 border border-[#10B981]/30 text-white text-xs font-sans flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-[#8B95A5] hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="p-6 rounded-[14px] bg-[#161B22] border border-white/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.4)] relative overflow-hidden glow-ambient-violet">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#7C3AED]/12 border border-[#7C3AED]/30 text-[10px] font-sans font-medium text-[#7C3AED] uppercase tracking-[0.05em]">
                WORKSPACE REPOSITORY
              </span>
              <span className="text-xs font-mono-tech text-[#5A6472]">
                {filteredProjects.length} LISTED
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight">
              Projects
            </h1>
            <p className="text-sm font-sans text-[#8B95A5] max-w-2xl leading-relaxed">
              Manage AI engineering codebases, model training pipelines, agent swarms, and retrieval workspaces.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-[10px] bg-[#7C3AED] text-xs font-sans font-semibold text-white hover:bg-[#6D28D9] transition-all shadow-md shadow-[#7C3AED]/20 active:scale-[0.98] flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Telemetry Overview */}
      <GithubRepositoryPicker onImport={handleGithubImport} />
      <ProjectTelemetryBar telemetry={telemetry} />

      {/* Filter Bar */}
      <ProjectFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedFramework={selectedFramework}
        onFrameworkChange={setSelectedFramework}
        onReset={handleResetFilters}
      />

      {/* Projects Grid View */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-[14px] bg-[#161B22] border border-white/[0.06] text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-[#1E2430] border border-white/[0.06] flex items-center justify-center text-[#5A6472] mx-auto">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-sans font-semibold text-white">No Projects Found</h3>
            <p className="text-xs font-sans text-[#8B95A5]">
              {searchQuery || selectedStatus !== "all" || selectedFramework !== "all"
                ? "No engineering projects match your current search or filter criteria."
                : "Initialize your first AI engineering workspace project to get started."}
            </p>
          </div>

          <div className="pt-2">
            {searchQuery || selectedStatus !== "all" || selectedFramework !== "all" ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-[10px] bg-[#1E2430] border border-white/[0.06] text-xs font-sans text-white hover:bg-white/[0.08] transition-colors"
              >
                Clear Search & Filters
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-[10px] bg-[#7C3AED] text-xs font-sans font-medium text-white hover:bg-[#6D28D9] transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Project</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
