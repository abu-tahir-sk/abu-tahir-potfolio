"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  School,
  BookOpen,
  Calendar,
  Building2,
  Award,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export interface EducationItem {
  id: string;
  qualification: string;
  institution: string;
  subject?: string | null;
  boardOrUniversity?: string | null;
  passingYear?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  displayOrder: number;
  visible?: boolean;
}

interface EducationSectionProps {
  educations: EducationItem[];
}

function getEducationMeta(qualification: string) {
  const lower = qualification.toLowerCase();
  if (
    lower.includes("bachelor") ||
    lower.includes("b.a") ||
    lower.includes("degree") ||
    lower.includes("honours")
  ) {
    return {
      icon: <GraduationCap className="w-5 h-5 text-white" />,
      gradient: "from-[#7C3AED] via-[#6D28D9] to-[#4F46E5]",
      glowColor: "rgba(124, 58, 237, 0.35)",
      badgeBg: "bg-[#7C3AED]/15 text-[#A78BFA] border-[#7C3AED]/30",
      statusText: "Completed",
    };
  }
  if (lower.includes("higher secondary") || lower.includes("class xii") || lower.includes("12")) {
    return {
      icon: <BookOpen className="w-5 h-5 text-white" />,
      gradient: "from-[#0284C7] via-[#2563EB] to-[#4F46E5]",
      glowColor: "rgba(2, 132, 199, 0.35)",
      badgeBg: "bg-[#0284C7]/15 text-[#38BDF8] border-[#0284C7]/30",
      statusText: "Passed",
    };
  }
  return {
    icon: <School className="w-5 h-5 text-white" />,
    gradient: "from-[#0D9488] via-[#0284C7] to-[#6366F1]",
    glowColor: "rgba(13, 148, 136, 0.35)",
    badgeBg: "bg-[#0D9488]/15 text-[#2DD4BF] border-[#0D9488]/30",
    statusText: "Passed",
  };
}

export function EducationSection({ educations }: EducationSectionProps) {
  // Sort in reverse chronological order (latest passing year first: 2025 -> 2022 -> 2020)
  const visibleEducations = educations
    .filter((e) => e.visible !== false)
    .sort((a, b) => {
      const yearA = parseInt(a.passingYear || a.endDate || "0", 10);
      const yearB = parseInt(b.passingYear || b.endDate || "0", 10);
      if (yearA !== yearB) {
        return yearB - yearA; // Latest year first
      }
      return a.displayOrder - b.displayOrder;
    });

  if (visibleEducations.length === 0) {
    return null;
  }

  return (
    <section id="education" className="py-24 border-t border-white/10 relative overflow-hidden bg-[var(--bg-main)]">
      {/* Ambient background lighting matching hero style */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#7C3AED]/10 via-[#4F46E5]/10 to-[#38BDF8]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15182A] border border-[#7C3AED]/30 text-xs font-mono text-[#38BDF8]">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>ACADEMIC FOUNDATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5FA] tracking-tight">
            Education &amp; Qualifications
          </h2>
          <p className="text-sm sm:text-base text-[#A0A3B8]">
            Formal academic background, graduation credentials, and schooling milestones.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative">
          {/* Vertical Timeline Guide Line */}
          <div className="absolute left-6 md:left-1/2 top-3 bottom-8 w-[2px] bg-gradient-to-b from-[#7C3AED] via-[#6366F1] to-[#38BDF8]/20 -translate-x-1/2 pointer-events-none opacity-40 hidden sm:block" />

          {/* Education Entries */}
          <div className="space-y-8 md:space-y-12">
            {visibleEducations.map((edu, index) => {
              const meta = getEducationMeta(edu.qualification);
              const year = edu.passingYear || edu.endDate || "";
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.12 }}
                  className={`relative flex flex-col md:flex-row items-center gap-6 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Node Icon (Center on desktop, left on mobile) */}
                  <div className="hidden sm:flex absolute left-6 md:left-1/2 -translate-x-1/2 z-20 items-center justify-center w-12 h-12 rounded-2xl p-[2px] bg-gradient-to-br from-[#7C3AED] to-[#38BDF8] shadow-lg shadow-[#7C3AED]/25">
                    <div className={`w-full h-full rounded-[14px] bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}>
                      {meta.icon}
                    </div>
                  </div>

                  {/* Empty Spacer Column for Desktop Alternate Layout */}
                  <div className="hidden md:block w-1/2" />

                  {/* Content Card */}
                  <div className="w-full sm:pl-16 md:pl-0 md:w-1/2">
                    <div
                      className={`card-surface p-6 sm:p-7 rounded-2xl border border-white/10 group hover:border-[#7C3AED]/40 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/40 ${
                        isEven ? "md:mr-8" : "md:ml-8"
                      }`}
                    >
                      {/* Mobile Top Icon + Badge Row */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex sm:hidden items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] text-white p-2">
                          {meta.icon}
                        </div>

                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border font-semibold ml-auto sm:ml-0 ${meta.badgeBg}`}>
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {meta.statusText}: {year}
                          </span>
                        </div>
                      </div>

                      {/* Qualification Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-[#F5F5FA] group-hover:text-white transition-colors tracking-tight">
                        {edu.qualification}
                      </h3>

                      {/* Institution / College / School */}
                      <div className="mt-2 flex items-center gap-2 text-sm text-[#F5F5FA] font-medium">
                        <Building2 className="w-4 h-4 text-[#7C3AED] shrink-0" />
                        <span>{edu.institution}</span>
                      </div>

                      {/* Board or University Affiliation */}
                      {edu.boardOrUniversity && (
                        <div className="mt-1.5 flex items-center gap-2 text-xs font-mono text-[#38BDF8]">
                          <Award className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                          <span>{edu.boardOrUniversity}</span>
                        </div>
                      )}

                      {/* Subject / Honours Details if specified */}
                      {edu.subject && edu.subject !== edu.qualification && (
                        <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-[#A0A3B8]">
                          <CheckCircle2 className="w-3 h-3 text-[#7C3AED]" />
                          <span>Specialization: {edu.subject}</span>
                        </div>
                      )}

                      {/* Optional Description if provided */}
                      {edu.description && (
                        <p className="mt-3 text-xs text-[#A0A3B8] leading-relaxed border-t border-white/5 pt-3">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
