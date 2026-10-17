import { prisma } from "@/lib/db";
import { EducationManager } from "@/components/admin/EducationManager";
import { GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const educations = await prisma.education.findMany({
    orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F5FA] tracking-tight">
            Education &amp; Qualifications
          </h1>
          <p className="text-xs text-[#A0A3B8]">
            Manage academic degrees, certifications, and technical qualifications.
          </p>
        </div>
      </div>

      <EducationManager initialEducations={educations} />
    </div>
  );
}
