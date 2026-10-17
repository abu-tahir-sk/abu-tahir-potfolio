"use client";

import React, { useState } from "react";
import Image from "next/image";
import { OrbitRings } from "./OrbitRings";
import { FloatingCards } from "./FloatingInfoCard";

interface ProfilePortraitProps {
  name: string;
  profileImageUrl?: string | null;
}

export function ProfilePortrait({
  name,
  profileImageUrl,
}: ProfilePortraitProps) {
  // Use user's cutout portrait webp by default, or database image if specified
  const initialImage =
    profileImageUrl && profileImageUrl !== "/images/profile/avatar-default.svg"
      ? profileImageUrl
      : "/images/profile/abu-tahir-portrait.webp";

  const [imgSrc, setImgSrc] = useState(initialImage);

  return (
    <div className="relative flex items-center justify-center w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[500px] mx-auto select-none">
      {/* 1. Concentric Rotating Geometric Orbit Rings */}
      <OrbitRings />

      {/* 2. Ambient Purple & Blue Rim-Lighting / Soft Halo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 max-w-[340px] max-h-[340px] m-auto rounded-full bg-gradient-to-tr from-[#8B5CF6]/30 via-[#38BDF8]/20 to-transparent blur-[75px] -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/4 right-0 w-[200px] h-[200px] rounded-full bg-[#38BDF8]/20 blur-[65px] -z-10"
      />

      {/* 3. Main Portrait Wrapper with smooth bottom blend */}
      <div className="relative z-10 w-[240px] sm:w-[320px] lg:w-[420px] h-[320px] sm:h-[400px] lg:h-[490px] flex items-end justify-center">
        <div
          className="relative w-full h-full flex items-end justify-center"
          style={{
            maskImage: "linear-gradient(to bottom, black 84%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 84%, transparent 100%)",
          }}
        >
          <Image
            src={imgSrc}
            alt={name || "Abu Tahir Sk - Full-Stack Web Developer"}
            width={862}
            height={1024}
            priority
            sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 420px"
            className="w-full h-full object-contain object-bottom filter drop-shadow-[0_15px_30px_rgba(108,99,255,0.3)] transition-transform duration-700 hover:scale-[1.02]"
            onError={() => {
              // Graceful fallback to avatar-default.svg if portrait fails
              if (imgSrc !== "/images/profile/avatar-default.svg") {
                setImgSrc("/images/profile/avatar-default.svg");
              }
            }}
          />
        </div>

        {/* 4. Floating Information Cards (Card A & Card B) */}
        <FloatingCards />
      </div>
    </div>
  );
}
