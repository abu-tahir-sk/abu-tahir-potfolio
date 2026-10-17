"use client";

import React from "react";

export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* 1. Deep Cosmic Dark Navy Base */}
      <div className="absolute inset-0 bg-[#060814] hero-bg-base" />

      {/* 2. Left Celestial Atmosphere & 3D Purple Planet */}
      <div className="absolute top-[10%] sm:top-[12%] lg:top-[14%] left-[1.5%] sm:left-[2.5%] lg:left-[3.5%] flex items-center justify-center">
        {/* Diffuse Purple Aura */}
        <div className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-tr from-[#A855F7]/35 via-[#7C3AED]/20 to-transparent blur-[85px] animate-pulse-glow" />
        {/* 3D Purple Planet Sphere with radial rim lighting */}
        <div
          className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full animate-orb-left"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #C084FC 0%, #9333EA 35%, #581C87 70%, #1E0E38 95%)",
            boxShadow:
              "0 0 40px rgba(168, 85, 247, 0.55), inset -3px -3px 8px rgba(0, 0, 0, 0.8)",
          }}
        />
      </div>

      {/* 3. Right Celestial Atmosphere & 3D Electric Blue Planet */}
      <div className="absolute top-[8%] sm:top-[10%] lg:top-[12%] right-[1.5%] sm:right-[2.5%] lg:right-[3.5%] flex items-center justify-center">
        {/* Diffuse Cyan Flare / Glow */}
        <div className="absolute w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] rounded-full bg-gradient-to-bl from-[#38BDF8]/40 via-[#2563EB]/25 to-transparent blur-[95px] animate-pulse-glow-reverse" />
        {/* 3D Cyan Planet Sphere with radial rim lighting */}
        <div
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full animate-orb-right"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #7DD3FC 0%, #38BDF8 30%, #1D4ED8 65%, #0B1E4A 90%, #030816 100%)",
            boxShadow:
              "0 0 55px rgba(56, 189, 248, 0.65), inset -4px -4px 10px rgba(0, 0, 0, 0.85)",
          }}
        />
      </div>

      {/* 4. Cosmic Sweeping Symmetrical Orbital Arcs */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60 animate-arc-shimmer"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Grand Left-to-Right Arc passing through left purple sphere */}
        <path
          d="M -80,820 C 180,480 380,240 980,180"
          stroke="url(#hero-left-arc-gradient)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
        />
        {/* Grand Right-to-Left Arc passing through right cyan sphere */}
        <path
          d="M 1520,820 C 1260,440 1060,220 460,190"
          stroke="url(#hero-right-arc-gradient)"
          strokeWidth="1.5"
          strokeDasharray="6 10"
        />
        {/* Outer subtle orbital boundary ring */}
        <ellipse
          cx="720"
          cy="460"
          rx="660"
          ry="340"
          stroke="url(#hero-orbit-ellipse-gradient)"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />

        <defs>
          <linearGradient id="hero-left-arc-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#8B5CF6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-right-arc-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#6366F1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-orbit-ellipse-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>

      {/* 5. 3D Perspective Grid Floor (Bottom 50% of hero section) */}
      <div className="absolute bottom-0 left-0 right-0 h-[52%] overflow-hidden pointer-events-none">
        <div className="absolute inset-x-[-30%] bottom-[-15%] h-[130%] login-perspective-grid animate-grid-drift" />
      </div>

      {/* 6. Floating Stardust Particles */}
      <div className="absolute inset-0">
        {[
          { top: "18%", left: "18%", delay: "0s", duration: "8s", size: "w-1 h-1", color: "bg-[#C084FC]" },
          { top: "28%", left: "30%", delay: "2s", duration: "10s", size: "w-1.5 h-1.5", color: "bg-[#38BDF8]" },
          { top: "42%", left: "12%", delay: "4s", duration: "9s", size: "w-1 h-1", color: "bg-[#818CF8]" },
          { top: "62%", left: "20%", delay: "1.5s", duration: "11s", size: "w-1 h-1", color: "bg-[#E879F9]" },
          { top: "22%", left: "76%", delay: "3s", duration: "9.5s", size: "w-1.5 h-1.5", color: "bg-[#38BDF8]" },
          { top: "35%", left: "84%", delay: "5s", duration: "8.5s", size: "w-1 h-1", color: "bg-[#A78BFA]" },
          { top: "54%", left: "72%", delay: "2.5s", duration: "10.5s", size: "w-1 h-1", color: "bg-[#60A5FA]" },
          { top: "72%", left: "80%", delay: "4.5s", duration: "8s", size: "w-1 h-1", color: "bg-[#C084FC]" },
          { top: "14%", left: "48%", delay: "6s", duration: "12s", size: "w-1 h-1", color: "bg-[#F472B6]" },
        ].map((p, idx) => (
          <span
            key={idx}
            className={`absolute rounded-full ${p.size} ${p.color} animate-particle-drift shadow-[0_0_8px_#FFFFFF]`}
            style={{
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* 7. Bottom seamless transition into subsequent sections */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent via-[#060814]/70 to-[#0B0B14] hero-bottom-fade pointer-events-none" />
    </div>
  );
}
