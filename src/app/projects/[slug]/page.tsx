import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";
import { TechBadge } from "@/components/ui/TechBadge";
import { Github } from "@/components/ui/Icons";

interface ProjectDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project || project.status !== "PUBLISHED") {
    return {
      title: "Project Not Found — Abu Tahir Sk",
    };
  }

  return {
    title: `${project.title} — Abu Tahir Sk Project Case Study`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} | Abu Tahir Sk`,
      description: project.shortDescription,
      images: project.coverImageUrl ? [{ url: project.coverImageUrl }] : [],
    },
  };
}

export const revalidate = 60;

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { slug } = await params;

  const [project, settings] = await Promise.all([
    prisma.project.findUnique({
      where: { slug },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default-settings" },
    }),
  ]);

  if (!project || project.status !== "PUBLISHED") {
    notFound();
  }

  // Related published projects
  const relatedProjects = await prisma.project.findMany({
    where: {
      status: "PUBLISHED",
      NOT: { id: project.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back button */}
          <div className="mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A0A3B8] hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to all projects</span>
            </Link>
          </div>

          {/* Project Header */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#15182A] border border-[#7C3AED]/30 text-xs font-mono text-[#38BDF8]">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#4F46E5] text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-[#7C3AED]/25">
                  <Sparkles className="w-3 h-3" />
                  <span>Featured Case Study</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F5F5FA] tracking-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[#A0A3B8] max-w-3xl leading-relaxed">
              {project.shortDescription}
            </p>

            {/* Quick Action Links */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-primary text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium"
                >
                  <span>Launch Live Application</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-secondary text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium"
                >
                  <Github className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          </div>

          {/* Cover Hero Banner */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#101322] mb-12">
            <Image
              src={project.coverImageUrl || "/images/projects/docuflow/template-1.jpg"}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover object-top"
            />
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
            {/* Left Main Content */}
            <div className="lg:col-span-8 space-y-10">
              {/* Detailed Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#F5F5FA] tracking-tight flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#7C3AED]" />
                  <span>Project Overview &amp; Architecture</span>
                </h2>
                <div className="text-sm sm:text-base text-[#A0A3B8] leading-relaxed whitespace-pre-wrap space-y-4">
                  {project.description}
                </div>
              </div>

              {/* Implemented Features Checklist */}
              {project.features && project.features.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <h3 className="text-xl font-bold text-[#F5F5FA] tracking-tight">
                    Implemented Features &amp; Capabilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#15182A] border border-white/10 flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-[#F5F5FA]">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Screenshots Gallery if available */}
              {project.screenshots && project.screenshots.length > 1 && (
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <h3 className="text-xl font-bold text-[#F5F5FA] tracking-tight">
                    Application Screenshots
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.screenshots.map((shot, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#101322] group"
                      >
                        <Image
                          src={shot}
                          alt={`${project.title} screenshot ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Meta Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A0A3B8] mb-3">
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <TechBadge key={tech} name={tech} size="sm" />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-[#A0A3B8]">
                    <span>Category</span>
                    <span className="font-semibold text-white">{project.category}</span>
                  </div>
                  {project.completedAt && (
                    <div className="flex items-center justify-between text-[#A0A3B8]">
                      <span>Completion</span>
                      <span className="font-semibold text-white">
                        {new Date(project.completedAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[#A0A3B8]">
                    <span>Status</span>
                    <span className="font-semibold text-emerald-400">Live &amp; Deployed</span>
                  </div>
                </div>

                {/* External links */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full button-primary py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold"
                    >
                      <span>Visit Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full button-secondary py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-medium"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="pt-12 border-t border-white/10 space-y-6">
              <h3 className="text-2xl font-bold text-[#F5F5FA]">More Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="card-surface p-5 rounded-xl border border-white/10 group hover:border-[#7C3AED]/40 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-[#38BDF8] uppercase">
                        {p.category}
                      </span>
                      <h4 className="text-base font-bold text-[#F5F5FA] group-hover:text-white transition-colors mt-1">
                        {p.title}
                      </h4>
                      <p className="text-xs text-[#A0A3B8] line-clamp-2 mt-1">
                        {p.shortDescription}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#7C3AED] flex items-center gap-1">
                      <span>View case study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer settings={settings || undefined} />
    </div>
  );
}
