import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects & Portfolio — Abu Tahir Sk",
  description:
    "Explore full-stack web applications, SaaS platforms, and digital tools engineered by Abu Tahir Sk using Next.js, React, TypeScript, and PostgreSQL.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default-settings" },
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15182A] border border-[#7C3AED]/30 text-xs font-mono text-[#38BDF8]">
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>PRODUCTION PORTFOLIO</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#F5F5FA] tracking-tight">
              All Engineered Projects
            </h1>
            <p className="text-sm sm:text-base text-[#A0A3B8] leading-relaxed">
              Browse production-ready web platforms, document SaaS applications, and interactive developer tools built with React, Next.js, and PostgreSQL.
            </p>
          </div>

          {/* Interactive Explorer */}
          <ProjectsExplorer initialProjects={projects} />
        </div>
      </main>

      <Footer settings={settings || undefined} />
    </div>
  );
}
