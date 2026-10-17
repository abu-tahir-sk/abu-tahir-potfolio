"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowUpRight, ExternalLink, Sparkles, FolderGit2 } from "lucide-react";
import { Github } from "@/components/ui/Icons";

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImageUrl: string;
  category: string;
  technologies: string[];
  githubUrl?: string | null;
  liveDemoUrl?: string | null;
  featured: boolean;
  completedAt?: Date | string | null;
}

interface ProjectsExplorerProps {
  initialProjects: ProjectItem[];
}

export function ProjectsExplorer({ initialProjects }: ProjectsExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTech, setSelectedTech] = useState("All");

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    initialProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [initialProjects]);

  // Extract top technologies
  const allTechnologies = useMemo(() => {
    const counts = new Map<string, number>();
    initialProjects.forEach((p) => {
      p.technologies.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1));
    });
    const sorted = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tech]) => tech);
    return ["All", ...sorted.slice(0, 8)];
  }, [initialProjects]);

  // Filtered projects
  const filtered = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        selectedCategory === "All" ||
        project.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchTech =
        selectedTech === "All" ||
        project.technologies.some((t) => t.toLowerCase() === selectedTech.toLowerCase());

      return matchSearch && matchCategory && matchTech;
    });
  }, [initialProjects, searchTerm, selectedCategory, selectedTech]);

  return (
    <div className="space-y-8">
      {/* Controls Bar: Search & Category Pills */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#15182A] border border-white/10 shadow-lg">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A0A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, description, or technology..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] placeholder-[#A0A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              type="button"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-[#6C63FF] text-white shadow-sm shadow-[#6C63FF]/30"
                  : "bg-white/5 text-[#A0A3B8] hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Technology quick-filter tags */}
      {allTechnologies.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs text-[#A0A3B8]">
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider">Tech Filter:</span>
          {allTechnologies.map((tech) => (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              type="button"
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors shrink-0 ${
                selectedTech === tech
                  ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40"
                  : "bg-[#101322] border border-white/10 text-[#A0A3B8] hover:text-white"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#A0A3B8]">
        <p>
          Showing <span className="font-semibold text-white">{filtered.length}</span> of{" "}
          <span className="font-semibold text-white">{initialProjects.length}</span> published projects
        </p>
        {(searchTerm || selectedCategory !== "All" || selectedTech !== "All") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setSelectedTech("All");
            }}
            className="text-xs text-[#38BDF8] hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="card-surface p-12 rounded-2xl text-center space-y-3">
          <FolderGit2 className="w-10 h-10 text-[#6C63FF] mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-[#F5F5FA]">No matching projects found</h3>
          <p className="text-xs text-[#A0A3B8] max-w-sm mx-auto">
            Try adjusting your search query or clear the filters to view all published work.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="card-surface rounded-2xl overflow-hidden border border-white/10 flex flex-col group hover:border-[#6C63FF]/40 transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative h-52 bg-[#101322] overflow-hidden">
                  <Image
                    src={project.coverImageUrl || "/images/projects/docuflow/template-1.jpg"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0B0B14]/80 backdrop-blur-md border border-white/10 text-xs font-mono text-[#38BDF8]">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-[#6C63FF] text-white text-[11px] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#F5F5FA] group-hover:text-[#38BDF8] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A0A3B8] line-clamp-3 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-white/10 text-[#F5F5FA]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="text-[11px] font-mono text-[#A0A3B8] self-center">
                      +{project.technologies.length - 5}
                    </span>
                  )}
                </div>

                {/* Action Links */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="button-primary text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 font-medium"
                  >
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Repository"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#A0A3B8] hover:text-white transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Live Demo Link"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#A0A3B8] hover:text-[#38BDF8] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
