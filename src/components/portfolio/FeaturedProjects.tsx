import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Sparkles, FolderGit2 } from "lucide-react";
import { Github } from "@/components/ui/Icons";

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImageUrl: string;
  category: string;
  technologies: string[];
  features?: string[];
  githubUrl?: string | null;
  liveDemoUrl?: string | null;
  featured: boolean;
}

interface FeaturedProjectsProps {
  projects: ProjectItem[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  // If no projects published, show polished empty state
  if (!projects || projects.length === 0) {
    return (
      <section id="projects" className="py-20 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <FolderGit2 className="w-12 h-12 text-[#6C63FF] mx-auto opacity-60" />
          <h2 className="text-2xl font-bold text-[#F5F5FA]">Projects Coming Soon</h2>
          <p className="text-sm text-[#A0A3B8] max-w-md mx-auto">
            New software applications and case studies are being published. Check back shortly.
          </p>
        </div>
      </section>
    );
  }

  const featuredProject = projects.find((p) => p.featured) || projects[0];
  const otherProjects = projects.filter((p) => p.id !== featuredProject.id);

  return (
    <section id="projects" className="py-24 border-t border-white/10 relative overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#6C63FF]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15182A] border border-[#6C63FF]/30 text-xs font-mono text-[#38BDF8] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#6C63FF]" />
              <span>SHOWCASE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5FA] tracking-tight">
              Featured Work
            </h2>
            <p className="text-sm sm:text-base text-[#A0A3B8] max-w-xl mt-2">
              Full-stack applications built with modern engineering practices, scalable databases, and responsive design.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#38BDF8] hover:text-[#F5F5FA] transition-colors group"
          >
            <span>View All Projects ({projects.length})</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Primary Hero Feature Card (DocuFlow or highest priority featured project) */}
        {featuredProject && (
          <div className="card-surface rounded-2xl overflow-hidden border border-white/10 mb-12 group hover:border-[#6C63FF]/40 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Image Preview Container */}
              <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] bg-[#101322] overflow-hidden">
                <Image
                  src={featuredProject.coverImageUrl || "/images/projects/docuflow/template-1.jpg"}
                  alt={featuredProject.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#15182A] via-transparent to-transparent opacity-80 lg:hidden" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#6C63FF] text-white text-xs font-semibold shadow-md shadow-[#6C63FF]/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured Project</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#0B0B14]/80 backdrop-blur-md border border-white/10 text-xs font-mono text-[#A0A3B8]">
                    {featuredProject.category}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-[#38BDF8] tracking-wider uppercase">
                      Selected Case Study
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F5FA] group-hover:text-white transition-colors">
                      {featuredProject.title}
                    </h3>
                  </div>

                  <p className="text-sm text-[#A0A3B8] leading-relaxed">
                    {featuredProject.shortDescription}
                  </p>

                  {/* Highlights / Features pills if available */}
                  {featuredProject.features && featuredProject.features.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-[#F5F5FA] uppercase tracking-wider mb-2">
                        Key Capabilities:
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#A0A3B8]">
                        {featuredProject.features.slice(0, 6).map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF]" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technology Tags */}
                  <div className="pt-3">
                    <div className="flex flex-wrap gap-2">
                      {featuredProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-[#F5F5FA]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/projects/${featuredProject.slug}`}
                    className="button-primary text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium"
                  >
                    <span>View Project Details</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  {featuredProject.liveDemoUrl && (
                    <a
                      href={featuredProject.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-secondary text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#38BDF8]" />
                    </a>
                  )}

                  {featuredProject.githubUrl && (
                    <a
                      href={featuredProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Repository"
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#A0A3B8] hover:text-[#F5F5FA] hover:bg-white/10 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Published Projects Grid */}
        {otherProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <div
                key={project.id}
                className="card-surface rounded-xl overflow-hidden border border-white/10 flex flex-col group hover:border-[#6C63FF]/40 transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="relative h-48 bg-[#101322] overflow-hidden">
                  <Image
                    src={project.coverImageUrl || "/images/projects/docuflow/template-1.jpg"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0B0B14]/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-[#38BDF8]">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-[#F5F5FA] group-hover:text-[#38BDF8] transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-xs text-[#A0A3B8] line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-[#A0A3B8]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] font-mono text-[#A0A3B8] self-center">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Footer links */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-xs font-semibold text-[#6C63FF] hover:text-[#38BDF8] flex items-center gap-1 transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub Repo"
                          className="text-[#A0A3B8] hover:text-white transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Live Demo"
                          className="text-[#A0A3B8] hover:text-[#38BDF8] transition-colors"
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
    </section>
  );
}
