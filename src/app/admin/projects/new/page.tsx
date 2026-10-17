import { ProjectForm } from "@/components/admin/ProjectForm";
import { Plus } from "lucide-react";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F5FA] tracking-tight">
            Create New Project
          </h1>
          <p className="text-xs text-[#A0A3B8]">
            Add a new development case study, upload screenshots, and publish to PostgreSQL.
          </p>
        </div>
      </div>

      <ProjectForm isEdit={false} />
    </div>
  );
}
