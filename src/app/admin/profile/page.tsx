import { prisma } from "@/lib/db";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default-settings" },
  });

  const defaultData = {
    id: "default-settings",
    fullName: "Abu Tahir Sk",
    professionalTitle: "Full-Stack Web Developer",
    biography:
      "I build modern web applications, responsive interfaces, and practical digital products using React, Next.js, TypeScript, and Node.js.",
    profileImageUrl: "/images/profile/avatar-default.svg",
    profileImagePublicId: null,
    avatarUrl: null,
    email: "abutahir2626@gmail.com",
    githubUrl: "https://github.com/abu-tahir-sk",
    linkedinUrl: "https://www.linkedin.com/in/abu-tahir-sk-739036352",
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
        <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F5FA] tracking-tight">
            Profile Settings
          </h1>
          <p className="text-xs text-[#A0A3B8]">
            Update your public developer identity, bio, portrait photograph, and links.
          </p>
        </div>
      </div>

      <ProfileEditor initialSettings={settings || defaultData} />
    </div>
  );
}
