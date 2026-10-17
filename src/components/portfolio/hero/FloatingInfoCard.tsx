"use client";

import React from "react";
import { Code2 } from "lucide-react";

export function FloatingCards() {
  return (
    <>
      {/* Card A: Availability Badge (Bottom Left) */}
      <div
        className="absolute -bottom-2 -left-3 sm:bottom-4 sm:-left-4 lg:bottom-6 lg:-left-8 z-20 animate-float-slow pointer-events-auto scale-90 sm:scale-100 origin-bottom-left"
        style={{ willChange: "transform" }}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-[#090D1C]/92 border border-[#8B5CF6]/35 backdrop-blur-xl shadow-2xl shadow-black/80 hover:border-[#8B5CF6]/60 hover:bg-[#11172E] transition-all group">
          <div className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500 shadow-[0_0_8px_#10B981]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] sm:text-xs font-semibold text-[#F8FAFC] tracking-tight group-hover:text-white transition-colors whitespace-nowrap">
              Available for Opportunities
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-medium whitespace-nowrap">
              Open to Developer Roles
            </span>
          </div>
        </div>
      </div>

      {/* Card B: Core Tech Stack Badge (Top Right) */}
      <div
        className="absolute -top-2 -right-3 sm:top-4 sm:-right-4 lg:top-8 lg:-right-8 z-20 animate-float-delayed pointer-events-auto scale-90 sm:scale-100 origin-top-right"
        style={{ willChange: "transform" }}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-[#090D1C]/92 border border-[#38BDF8]/30 backdrop-blur-xl shadow-2xl shadow-black/80 hover:border-[#38BDF8]/60 hover:bg-[#11172E] transition-all group">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#8B5CF6]/25 to-[#38BDF8]/20 border border-[#8B5CF6]/30 flex items-center justify-center shrink-0 shadow-inner">
            <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A78BFA] group-hover:text-[#38BDF8] transition-colors" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-[#94A3B8] whitespace-nowrap">
              Building with
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-[#F8FAFC] tracking-tight group-hover:text-white transition-colors whitespace-nowrap">
              Full Web Applications
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
