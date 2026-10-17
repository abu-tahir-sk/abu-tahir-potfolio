import { prisma } from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { FeaturedProjects } from "@/components/portfolio/FeaturedProjects";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { TimelineSection } from "@/components/portfolio/TimelineSection";
import { ContactSection } from "@/components/portfolio/ContactSection";

export const revalidate = 60; // Incremental Static Regeneration every 60s or on-demand revalidation

export default async function HomePage() {
  // Parallel database fetch from PostgreSQL
  const [settings, projects, skills, experiences, educations] = await Promise.all([
    prisma.siteSettings.findUnique({
      where: { id: "default-settings" },
    }),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.skill.findMany({
      where: { visible: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.experience.findMany({
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
    }),
    prisma.education.findMany({
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
    }),
  ]);

  const siteSettings = settings || {
    fullName: "Abu Tahir Sk",
    professionalTitle: "Full-Stack Web Developer",
    biography:
      "I build modern web applications, responsive interfaces, and practical digital products using React, Next.js, TypeScript, and Node.js.",
    profileImageUrl: "/images/profile/avatar-default.svg",
    email: "abutahir2626@gmail.com",
    githubUrl: "https://github.com/abu-tahir-sk",
    linkedinUrl: "https://linkedin.com/in/abu-tahir-sk",
    availabilityStatus: "Available for full-time roles & projects",
    resumeUrl: "/resume/Abu-Tahir-Sk-Resume.pdf",
    footerText: "Designed and built by Abu Tahir Sk.",
  };

  // Calculate dynamic live metrics from PostgreSQL database
  const currentYear = new Date().getFullYear();
  let startYear = 2024;
  if (experiences.length > 0) {
    const years = experiences
      .map((e) => parseInt(e.startDate, 10))
      .filter((y) => !isNaN(y) && y > 2000 && y <= currentYear);
    if (years.length > 0) {
      startYear = Math.min(...years);
    }
  }
  const yearsExperience = Math.max(2, currentYear - startYear);
  const projectCount = projects.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B14] text-[#F5F5FA] selection:bg-[#6C63FF]/30 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <HeroSection
          settings={siteSettings}
          projectCount={projectCount}
          yearsExperience={yearsExperience}
        />
        <SkillsSection skills={skills} />
        <FeaturedProjects projects={projects} />
        <AboutSection settings={siteSettings} />
        <TimelineSection experiences={experiences} educations={educations} />
        <ContactSection settings={siteSettings} />
      </main>

      <Footer settings={siteSettings} />
    </div>
  );
}
