"use client";

import { useState } from "react";
import { Briefcase, GraduationCap, Calendar, Building, Sparkles } from "lucide-react";

interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  technologies: string[];
}

interface EducationItem {
  id: string;
  qualification: string;
  institution: string;
  description: string;
  startDate: string;
  endDate?: string | null;
}

interface TimelineSectionProps {
  experiences: ExperienceItem[];
  educations: EducationItem[];
}

export function TimelineSection({ experiences, educations }: TimelineSectionProps) {
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience");

  return (
    <section id="experience" className="py-24 border-t border-white/10 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15182A] border border-[#6C63FF]/30 text-xs font-mono text-[#38BDF8]">
            <Sparkles className="w-3.5 h-3.5 text-[#6C63FF]" />
            <span>JOURNEY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5FA] tracking-tight">
            Experience &amp; Education
          </h2>
          <p className="text-sm sm:text-base text-[#A0A3B8]">
            Practical hands-on development journey, engineering projects, and academic background.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-xl bg-[#15182A] border border-white/10">
            <button
              onClick={() => setActiveTab("experience")}
              type="button"
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "experience"
                  ? "bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/20"
                  : "text-[#A0A3B8] hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Experience ({experiences.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("education")}
              type="button"
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "education"
                  ? "bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/20"
                  : "text-[#A0A3B8] hover:text-white"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Education ({educations.length})</span>
            </button>
          </div>
        </div>

        {/* Experience List */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            {experiences.length === 0 ? (
              <p className="text-center text-sm text-[#A0A3B8] py-8">
                No experience entries added yet.
              </p>
            ) : (
              experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="card-surface p-6 sm:p-8 rounded-2xl border border-white/10 relative group hover:border-[#6C63FF]/40 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#F5F5FA] group-hover:text-[#38BDF8] transition-colors">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-[#A0A3B8] mt-1">
                        <Building className="w-4 h-4 text-[#6C63FF]" />
                        <span>{exp.organization}</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101322] border border-white/10 text-xs font-mono text-[#A0A3B8] self-start">
                      <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>
                        {exp.startDate} — {exp.current ? "Present" : exp.endDate || "Ongoing"}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[#A0A3B8] leading-relaxed whitespace-pre-wrap mb-5">
                    {exp.description}
                  </p>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-white/10 text-[#F5F5FA]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Education List */}
        {activeTab === "education" && (
          <div className="space-y-6">
            {educations.length === 0 ? (
              <p className="text-center text-sm text-[#A0A3B8] py-8">
                No education entries added yet.
              </p>
            ) : (
              educations.map((edu) => (
                <div
                  key={edu.id}
                  className="card-surface p-6 sm:p-8 rounded-2xl border border-white/10 relative group hover:border-[#6C63FF]/40 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#F5F5FA] group-hover:text-[#38BDF8] transition-colors">
                        {edu.qualification}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-[#A0A3B8] mt-1">
                        <GraduationCap className="w-4 h-4 text-[#6C63FF]" />
                        <span>{edu.institution}</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101322] border border-white/10 text-xs font-mono text-[#A0A3B8] self-start">
                      <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>
                        {edu.startDate} — {edu.endDate || "Present"}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[#A0A3B8] leading-relaxed whitespace-pre-wrap">
                    {edu.description}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
