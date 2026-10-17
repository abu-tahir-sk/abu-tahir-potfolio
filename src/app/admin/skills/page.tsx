import { prisma } from "@/lib/db";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { Code2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { displayOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center">
          <Code2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F5FA] tracking-tight">
            Skills Management
          </h1>
          <p className="text-xs text-[#A0A3B8]">
            Manage technologies, categories, display order, and visibility on the public portfolio.
          </p>
        </div>
      </div>

      <SkillsManager initialSkills={skills} />
    </div>
  );
}
