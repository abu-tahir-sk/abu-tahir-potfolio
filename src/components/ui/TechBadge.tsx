"use client";

import React, { useState } from "react";
import { Code2 } from "lucide-react";

// Mapping dictionary from common technology names / aliases to icon paths in /icons/skills/
const TECH_ICON_MAP: Record<string, string> = {
  // Frontend
  react: "/icons/skills/react.svg",
  "react.js": "/icons/skills/react.svg",
  reactjs: "/icons/skills/react.svg",
  next: "/icons/skills/nextjs.svg",
  "next.js": "/icons/skills/nextjs.svg",
  nextjs: "/icons/skills/nextjs.svg",
  typescript: "/icons/skills/typescript.svg",
  ts: "/icons/skills/typescript.svg",
  javascript: "/icons/skills/javascript.svg",
  js: "/icons/skills/javascript.svg",
  html: "/icons/skills/html5.svg",
  html5: "/icons/skills/html5.svg",
  css: "/icons/skills/css3.svg",
  css3: "/icons/skills/css3.svg",
  tailwind: "/icons/skills/tailwindcss.svg",
  "tailwind css": "/icons/skills/tailwindcss.svg",
  tailwindcss: "/icons/skills/tailwindcss.svg",
  daisyui: "/icons/skills/daisyui.svg",
  "daisy ui": "/icons/skills/daisyui.svg",

  // Backend
  node: "/icons/skills/nodejs.svg",
  "node.js": "/icons/skills/nodejs.svg",
  nodejs: "/icons/skills/nodejs.svg",
  express: "/icons/skills/express.svg",
  "express.js": "/icons/skills/express.svg",
  expressjs: "/icons/skills/express.svg",
  jwt: "/icons/skills/jwt.svg",
  "jwt authentication": "/icons/skills/jwt.svg",
  auth: "/icons/skills/jwt.svg",
  "rest api": "/icons/skills/restapi.svg",
  "rest apis": "/icons/skills/restapi.svg",
  rest: "/icons/skills/restapi.svg",
  api: "/icons/skills/restapi.svg",

  // Database
  postgresql: "/icons/skills/postgresql.svg",
  postgres: "/icons/skills/postgresql.svg",
  prisma: "/icons/skills/prisma.svg",
  mongodb: "/icons/skills/mongodb.svg",
  mongo: "/icons/skills/mongodb.svg",
  mongoose: "/icons/skills/mongoose.svg",
  mongos: "/icons/skills/mongoose.svg",

  // Tools & Platforms
  git: "/icons/skills/git.svg",
  github: "/icons/skills/github.svg",
  postman: "/icons/skills/postman.svg",
  vscode: "/icons/skills/vscode.svg",
  "vs code": "/icons/skills/vscode.svg",
  vercel: "/icons/skills/vercel.svg",
  netlify: "/icons/skills/netlify.svg",
};

export function getTechIconPath(techName: string): string | null {
  if (!techName) return null;
  const normalized = techName.trim().toLowerCase();
  if (TECH_ICON_MAP[normalized]) {
    return TECH_ICON_MAP[normalized];
  }
  // Try stripped matching (e.g. without dots or spaces)
  const stripped = normalized.replace(/[^a-z0-9]/g, "");
  if (TECH_ICON_MAP[stripped]) {
    return TECH_ICON_MAP[stripped];
  }
  for (const [key, path] of Object.entries(TECH_ICON_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return path;
    }
  }
  return null;
}

export interface TechBadgeProps {
  name: string;
  size?: "xs" | "sm" | "md";
  className?: string;
  showIcon?: boolean;
}

export function TechBadge({
  name,
  size = "sm",
  className = "",
  showIcon = true,
}: TechBadgeProps) {
  const [hasError, setHasError] = useState(false);
  const iconPath = getTechIconPath(name);

  const sizeClasses = {
    xs: "px-2 py-0.5 text-[10px] gap-1",
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-xs sm:text-sm gap-2",
  }[size];

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-lg font-mono bg-white/5 border border-white/10 text-[#F5F5FA] hover:border-[#7C3AED]/40 hover:bg-white/10 transition-all duration-150 select-none ${sizeClasses} ${className}`}
    >
      {showIcon && (
        <span className="shrink-0 flex items-center justify-center">
          {iconPath && !hasError ? (
            <img
              src={iconPath}
              alt={name}
              className={`${iconSizes} object-contain`}
              onError={() => setHasError(true)}
              loading="lazy"
            />
          ) : (
            <Code2 className={`${iconSizes} text-[#A78BFA] opacity-80`} />
          )}
        </span>
      )}
      <span className="truncate">{name}</span>
    </span>
  );
}
