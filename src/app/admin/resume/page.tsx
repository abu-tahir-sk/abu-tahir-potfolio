import { prisma } from "@/lib/db";
import { ResumeManager } from "@/components/admin/ResumeManager";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default-settings" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F5FA] tracking-tight">
            Resume &amp; CV Management
          </h1>
          <p className="text-xs text-[#A0A3B8]">
            Upload or update your downloadable resume PDF.
          </p>
        </div>
      </div>

      <ResumeManager currentResumeUrl={settings?.resumeUrl} />
    </div>
  );
}
