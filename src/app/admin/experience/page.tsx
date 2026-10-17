import { prisma } from "@/lib/db";
import { ExperienceManager } from "@/components/admin/ExperienceManager";
import { Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F5FA] tracking-tight">
            Work Experience Management
          </h1>
          <p className="text-xs text-[#A0A3B8]">
            Manage work experience, freelance accomplishments, and development roles.
          </p>
        </div>
      </div>

      <ExperienceManager initialExperiences={experiences} />
    </div>
  );
}
