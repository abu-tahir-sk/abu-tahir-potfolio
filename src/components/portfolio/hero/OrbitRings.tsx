"use client";

import React from "react";

export function OrbitRings() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -z-10"
    >
      <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] lg:w-[540px] lg:h-[540px] transition-transform duration-700">
        {/* Outer Ring: Rotating Clockwise */}
        <div className="absolute inset-0 rounded-full border border-[#8B5CF6]/20 animate-spin-slow">
          {/* Dashed outer accent arc */}
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <circle
              cx="50"
              cy="50"
              r="49"
              stroke="#A855F7"
              strokeWidth="0.75"
              strokeDasharray="4 8"
              strokeOpacity="0.4"
            />
          </svg>
          {/* Orbiting Satellite Node 1 */}
          <div className="absolute top-[8%] left-[22%] w-2.5 h-2.5 rounded-full bg-[#C084FC] shadow-[0_0_12px_#A855F7]" />
        </div>

        {/* Middle Ring: Rotating Counter-Clockwise */}
        <div className="absolute inset-[12%] rounded-full border border-[#38BDF8]/20 animate-spin-reverse-slow">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <circle
              cx="50"
              cy="50"
              r="48"
              stroke="#38BDF8"
              strokeWidth="0.6"
              strokeDasharray="8 12"
              strokeOpacity="0.3"
            />
          </svg>
          {/* Orbiting Satellite Node 2 */}
          <div className="absolute bottom-[10%] right-[20%] w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_10px_#38BDF8]" />
        </div>

        {/* Inner Ring: Subtle Accent Ring */}
        <div className="absolute inset-[24%] rounded-full border border-purple-400/15">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6C63FF]/5 via-transparent to-[#38BDF8]/5" />
        </div>

        {/* Center ambient glow beacon */}
        <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-[#8B5CF6]/20 via-[#4F46E5]/15 to-[#38BDF8]/15 blur-2xl" />
      </div>
    </div>
  );
}
