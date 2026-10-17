import { prisma } from "@/lib/db";
import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default-settings" },
  });

  const defaultData = {
    id: "default-settings",
    fullName: "Abu Tahir Sk",
    professionalTitle: "Full-Stack Web Developer",
    biography: "Full-Stack Web Developer",
    profileImageUrl: null,
    profileImagePublicId: null,
    avatarUrl: null,
    email: "abutahir2626@gmail.com",
    githubUrl: "https://github.com/abu-tahir-sk",
    linkedinUrl: "https://linkedin.com/in/abu-tahir-sk",
    availabilityStatus: "Available for full-time roles & projects",
    resumeUrl: "/resume/Abu-Tahir-Sk-Resume.pdf",
    siteUrl: "https://abutahir.dev",
    seoTitle: "Abu Tahir Sk — Full-Stack Web Developer Portfolio",
    seoDescription:
      "Full-Stack Web Developer specializing in React, Next.js, TypeScript, Node.js, and PostgreSQL.",
    socialImageUrl: null,
    footerText: "Designed and built by Abu Tahir Sk.",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F5FA] tracking-tight">
            Site Settings &amp; SEO
          </h1>
          <p className="text-xs text-[#A0A3B8]">
            Configure site-wide metadata, production domain, and footer branding.
          </p>
        </div>
      </div>

      <SettingsEditor initialSettings={settings || defaultData} />
    </div>
  );
}
