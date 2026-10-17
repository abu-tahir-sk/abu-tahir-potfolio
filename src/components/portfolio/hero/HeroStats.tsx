"use client";

import React from "react";
import { Smile, Briefcase, Star, Coffee } from "lucide-react";

interface HeroStatsProps {
  projectCount?: number;
  yearsExperience?: number;
}

export function HeroStats({
  projectCount = 3,
  yearsExperience = 2,
}: HeroStatsProps) {
  const stats = [
    {
      icon: <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-[#A855F7]" />,
      value: "10+",
      label: "Satisfied Clients",
    },
    {
      icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#A855F7]" />,
      value: `${projectCount}+`,
      label: "Completed Projects",
    },
    {
      icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#A855F7]" />,
      value: `${yearsExperience}+`,
      label: "Years Experience",
    },
    {
      icon: <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-[#A855F7]" />,
      value: "100%",
      label: "Dedication",
    },
  ];

  return (
    <div className="pt-3 sm:pt-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 xl:gap-3.5">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#8B5CF6]/30 hover:bg-white/[0.05] transition-all duration-200 group min-w-0"
          >
            <div className="shrink-0 p-1.5 sm:p-2 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 group-hover:scale-110 group-hover:bg-[#8B5CF6]/20 transition-all duration-200">
              {stat.icon}
            </div>
            <div className="flex flex-col text-left min-w-0 flex-1">
              <span className="text-lg sm:text-xl xl:text-2xl font-extrabold text-[#F8FAFC] tracking-tight leading-none group-hover:text-white transition-colors">
                {stat.value}
              </span>
              <span className="text-[11px] sm:text-xs text-[#94A3B8] font-medium mt-1 leading-snug break-words">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
