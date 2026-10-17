"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  toggleProjectFeatured,
  toggleProjectStatus,
  deleteProject,
} from "@/actions/projects";
import {
  Search,
  Plus,
  Sparkles,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  coverImageUrl: string;
  technologies: string[];
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: Date | string;
}

interface ProjectsTableProps {
  initialProjects: ProjectItem[];
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleToggleFeatured = async (id: string, current: boolean) => {
    setActionLoading(id);
    const res = await toggleProjectFeatured(id, !current);
    if (res.success) {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
      );
    }
    setActionLoading(null);
  };

  const handleToggleStatus = async (id: string, current: "DRAFT" | "PUBLISHED") => {
    setActionLoading(id);
    const nextStatus = current === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const res = await toggleProjectStatus(id, nextStatus);
    if (res.success) {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
      );
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    const res = await deleteProject(id);
    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
    }
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#15182A] border border-white/10">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#A0A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] placeholder-[#A0A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>

          <Link
            href="/admin/projects/new"
            className="button-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 font-medium shadow-sm shadow-[#6C63FF]/30 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Projects Table */}
      <div className="card-surface rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#101322] border-b border-white/10 text-[#A0A3B8] font-mono uppercase text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Project</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Tech Stack</th>
                <th className="py-3.5 px-4 font-semibold">Featured</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#A0A3B8]">
                    No projects found matching current criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Title + Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#101322] border border-white/10 shrink-0">
                          <Image
                            src={project.coverImageUrl || "/images/projects/docuflow/template-1.jpg"}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-[#F5F5FA] block">
                            {project.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#38BDF8]">
                            /{project.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#A0A3B8] font-mono">
                      {project.category}
                    </td>

                    {/* Technologies */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 border border-white/10 text-[#A0A3B8]"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-[9px] font-mono text-[#A0A3B8]">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleFeatured(project.id, project.featured)}
                        disabled={actionLoading === project.id}
                        type="button"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                          project.featured
                            ? "bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/40"
                            : "bg-white/5 text-[#A0A3B8] border border-white/10 hover:text-white"
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{project.featured ? "Featured" : "Standard"}</span>
                      </button>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(project.id, project.status)}
                        disabled={actionLoading === project.id}
                        type="button"
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                          project.status === "PUBLISHED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {project.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {project.status === "PUBLISHED" && (
                          <Link
                            href={`/projects/${project.slug}`}
                            target="_blank"
                            title="Preview Public Page"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A0A3B8] hover:text-[#38BDF8]"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          title="Edit Project"
                          className="p-1.5 rounded-lg bg-[#6C63FF]/10 hover:bg-[#6C63FF]/20 text-[#6C63FF]"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        {deleteConfirmId === project.id ? (
                          <div className="flex items-center gap-1 bg-red-500/10 p-1 rounded-lg border border-red-500/20">
                            <button
                              onClick={() => handleDelete(project.id)}
                              disabled={actionLoading === project.id}
                              className="text-red-400 hover:text-red-300 font-bold px-1"
                            >
                              {actionLoading === project.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                "Yes"
                              )}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-[#A0A3B8] hover:text-white px-1"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(project.id)}
                            title="Delete Project"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-[#A0A3B8] hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
