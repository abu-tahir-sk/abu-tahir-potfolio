"use client";

import React from "react";
import { ArrowDown } from "lucide-react";
import { HeroBackground } from "./hero/HeroBackground";
// import { AnimatedRole } from "./hero/AnimatedRole";
import { HeroActions } from "./hero/HeroActions";
import { ProfilePortrait } from "./hero/ProfilePortrait";

export interface HeroSectionProps {
  settings?: {
    fullName?: string;
    professionalTitle?: string;
    biography?: string;
    profileImageUrl?: string | null;
    avatarUrl?: string | null;
    email?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    availabilityStatus?: string;
    resumeUrl?: string | null;
  };
  projectCount?: number;
  yearsExperience?: number;
}

export function HeroSection({
  settings,
  projectCount,
  yearsExperience,
}: HeroSectionProps) {
  const name = settings?.fullName || "Abu Tahir Sk";
  const bio =
    "I build responsive web applications, scalable backend solutions, and modern digital experiences using React, Next.js, TypeScript, and Node.js.";
  const profileImage =
    settings?.profileImageUrl || "/images/profile/abu-tahir-portrait.webp";
  const resumeUrl =
    settings?.resumeUrl || "/resume/Abu-Tahir-Sk-Resume.pdf";

  return (
    <section
      id="hero"
      aria-label="Introduction & Overview"
      className="relative min-h-[640px] lg:h-screen flex flex-col justify-center pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-14 overflow-hidden"
    >
      {/* 1. Deep Atmosphere, Gradient Orbs & Subtle Grid */}
      <HeroBackground />

      {/* 2. Main Content Container (max-width ~1280px) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.08fr_0.92fr] gap-8 md:gap-8 lg:gap-12 items-center">
          {/* =========================================================
              Left Column (~52% width): Text, Heading, Role & CTAs
             ========================================================= */}
          <div className="space-y-4 sm:space-y-5 text-left flex flex-col justify-center">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#C084FC] shadow-sm shadow-[#8B5CF6]/15 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C084FC] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C084FC]" />
              </span>
              <span>HI, I&apos;M ABU TAHIR SK</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-6xl font-black tracking-tight text-[#F8FAFC] leading-[1.12]">
              Building Modern <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#38BDF8] bg-clip-text text-transparent">
                Web Experiences.
              </span>
            </h1>

            {/* Animated Role Subtitle */}
            {/* <AnimatedRole /> */}

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-[#94A3B8] max-w-xl leading-relaxed ">
              {bio}
            </p>

            {/* CTA Buttons & Live Stats Cards */}

            <HeroActions
              resumeUrl={resumeUrl}
              projectCount={projectCount}
              yearsExperience={yearsExperience}
            />

          </div>

          {/* =========================================================
              Right Column (~48% width): Real Portrait & Animated Rings
             ========================================================= */}
          <div className="flex justify-center items-center w-full pt-4 md:pt-0">
            <ProfilePortrait
              name={name}
              profileImageUrl={profileImage}
            />
          </div>
        </div>

        {/* Explore Projects Scroll Anchor */}
        <div className="mt-8 sm:mt-12 flex justify-center">
          <a
            href="#projects"
            aria-label="Scroll to explore projects"
            className="group flex flex-col items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#94A3B8] hover:text-[#C084FC] transition-colors focus:outline-none"
          >
            <span>Explore Projects</span>
            <ArrowDown className="w-4 h-4 text-[#A855F7] group-hover:translate-y-1 transition-transform animate-bounce" />
          </a>
        </div>
      </div>
    </section >
  );
}
