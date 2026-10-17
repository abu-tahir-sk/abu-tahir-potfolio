import { prisma } from "@/lib/db";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { FolderGit2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center">
          <FolderGit2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F5FA] tracking-tight">
            Manage Projects
          </h1>
          <p className="text-xs text-[#A0A3B8]">
            Create, edit, publish, or feature projects on Abu Tahir Sk&apos;s portfolio.
          </p>
        </div>
      </div>

      <ProjectsTable initialProjects={projects} />
    </div>
  );
}
