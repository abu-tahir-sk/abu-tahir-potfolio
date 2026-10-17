import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TimelineSection } from "@/components/portfolio/TimelineSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, CheckCircle2, Sparkles, Terminal, Code, Database, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "About Me & Journey — Abu Tahir Sk",
  description:
    "Learn more about Abu Tahir Sk, a Full-Stack Web Developer building modern web applications with React, Next.js, TypeScript, and PostgreSQL.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const [settings, experiences, educations] = await Promise.all([
    prisma.siteSettings.findUnique({
      where: { id: "default-settings" },
    }),
    prisma.experience.findMany({
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
    }),
    prisma.education.findMany({
      where: { visible: true },
      orderBy: [{ displayOrder: "asc" }, { passingYear: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  const name = settings?.fullName || "Abu Tahir Sk";
  const title = settings?.professionalTitle || "Full-Stack Web Developer";
  const bio =
    settings?.biography ||
    "I build modern web applications, responsive interfaces, and practical digital products using React, Next.js, TypeScript, and Node.js.";
  const profileImage = settings?.profileImageUrl || "/images/profile/avatar-default.svg";
  const resumeUrl = settings?.resumeUrl || "/resume/Abu-Tahir-Sk-Resume.pdf";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15182A] border border-[#7C3AED]/30 text-xs font-mono text-[#38BDF8]">
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>DEVELOPMENT JOURNEY</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#F5F5FA] tracking-tight">
              About &amp; Background
            </h1>
            <p className="text-sm sm:text-base text-[#A0A3B8] leading-relaxed">
              Full-Stack Developer focused on building practical, high-quality digital solutions with modern web engineering.
            </p>
          </div>

          {/* Profile Overview Card */}
          <div className="card-surface p-8 sm:p-12 rounded-3xl border border-white/10 mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-48 sm:w-56 aspect-square rounded-2xl overflow-hidden p-[2px] bg-gradient-to-tr from-[#7C3AED] to-[#38BDF8]">
                <div className="w-full h-full rounded-[14px] bg-[#101322] overflow-hidden flex items-center justify-center">
                  <Image
                    src={profileImage}
                    alt={name}
                    width={224}
                    height={224}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider">
                  Developer Profile
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5FA]">{name}</h2>
                <p className="text-sm font-semibold text-[#7C3AED]">{title}</p>
              </div>

              <div className="text-sm text-[#A0A3B8] leading-relaxed space-y-3">
                <p>{bio}</p>
                <p>
                  I specialize in turning product concepts into robust codebases. With hands-on experience developing SaaS solutions like <strong>DocuFlow</strong>, responsive workout trackers like <strong>FitLog</strong>, and ecosystem tools like <strong>DevStack</strong>, I prioritize clean architecture and long-term maintainability.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="button-primary text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium"
                >
                  <span>Get In Touch</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                {resumeUrl && (
                  <Link
                    href="/resume"
                    className="button-secondary text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium"
                  >
                    <FileText className="w-4 h-4 text-[#A0A3B8]" />
                    <span>View Resume</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Core Focus Areas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-3">
              <Code className="w-6 h-6 text-[#38BDF8]" />
              <h3 className="text-base font-bold text-[#F5F5FA]">Frontend Mastery</h3>
              <p className="text-xs text-[#A0A3B8] leading-relaxed">
                Building accessible, responsive user interfaces with React, Next.js, TypeScript, and modern Tailwind CSS.
              </p>
            </div>

            <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-3">
              <Database className="w-6 h-6 text-[#7C3AED]" />
              <h3 className="text-base font-bold text-[#F5F5FA]">Backend &amp; Databases</h3>
              <p className="text-xs text-[#A0A3B8] leading-relaxed">
                Designing relational schemas and server-side logic using PostgreSQL, Prisma, Server Actions, and Node.js.
              </p>
            </div>

            <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-3">
              <Globe className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-[#F5F5FA]">Production Deployment</h3>
              <p className="text-xs text-[#A0A3B8] leading-relaxed">
                Deploying serverless and edge architectures with Vercel, Neon PostgreSQL, CI/CD automation, and strict error handling.
              </p>
            </div>
          </div>

          {/* Timeline Section */}
          <TimelineSection experiences={experiences} educations={educations} />
        </div>
      </main>

      <Footer settings={settings || undefined} />
    </div>
  );
}
