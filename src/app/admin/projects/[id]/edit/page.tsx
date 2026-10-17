import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { Edit } from "lucide-react";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  const initialData = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    shortDescription: project.shortDescription,
    description: project.description,
    coverImageUrl: project.coverImageUrl,
    coverImagePublicId: project.coverImagePublicId,
    screenshots: project.screenshots,
    technologies: project.technologies,
    features: project.features,
    category: project.category,
    githubUrl: project.githubUrl,
    liveDemoUrl: project.liveDemoUrl,
    featured: project.featured,
    status: project.status,
    completedAt: project.completedAt ? project.completedAt.toISOString() : null,
    displayOrder: project.displayOrder,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center">
          <Edit className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F5FA] tracking-tight">
            Edit Project: {project.title}
          </h1>
          <p className="text-xs text-[#A0A3B8]">
            Update project fields, screenshots, links, and publication status.
          </p>
        </div>
      </div>

      <ProjectForm initialData={initialData} isEdit={true} />
    </div>
  );
}
