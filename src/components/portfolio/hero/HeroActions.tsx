"use client";

import React from "react";
import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";
import { HeroStats } from "./HeroStats";

interface HeroActionsProps {
  resumeUrl?: string | null;
  projectCount?: number;
  yearsExperience?: number;
}

export function HeroActions({
  resumeUrl,
  projectCount,
  yearsExperience,
}: HeroActionsProps) {
  // Configured resume target or graceful fallback
  const hasResume = Boolean(resumeUrl);
  const activeResumeUrl = resumeUrl || "/resume/Abu-Tahir-Sk-Resume.pdf";

  return (
    <div className="space-y-7 pt-2">
      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Primary CTA: Download Resume */}
        {hasResume ? (
          <a
            href={activeResumeUrl}
            download="Abu-Tahir-Sk-Resume.pdf"
            className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#4F46E5] hover:from-[#8B5CF6] hover:to-[#6366F1] shadow-lg shadow-[#7C3AED]/25 hover:shadow-xl hover:shadow-[#7C3AED]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2 focus:ring-offset-[#070913]"
            aria-label="Download Resume PDF"
          >
            <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Download Resume</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-sm text-white/50 bg-white/5 border border-white/10 cursor-not-allowed"
            title="Resume file not currently configured"
          >
            <Download className="w-4 h-4 opacity-50" />
            <span>Resume Coming Soon</span>
          </button>
        )}

        {/* Secondary CTA: Explore My Projects */}
        <Link
          href="#projects"
          className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-sm text-[#F1F5F9] bg-[#0E1326]/80 hover:bg-[#151D3B] border border-[#8B5CF6]/35 hover:border-[#8B5CF6]/70 shadow-md shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2 focus:ring-offset-[#070913]"
          aria-label="Scroll to projects section"
        >
          <span>Explore My Projects</span>
          <ArrowRight className="w-4 h-4 text-[#A78BFA] transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Dynamic Live Metrics / Stats Cards */}
      <HeroStats
        projectCount={projectCount}
        yearsExperience={yearsExperience}
      />
    </div>
  );
}
