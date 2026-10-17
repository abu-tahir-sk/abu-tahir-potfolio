"use client";

import { useState } from "react";
import {
  Code2,
  Server,
  Database,
  Wrench,
  Cpu,
  Layers,
  Wind,
  Atom,
  FileCode,
  FileCode2,
  HardDrive,
  GitBranch,
  Send,
  Terminal,
  Cloud,
  ShieldCheck,
  Network,
  Palette,
  Boxes,
  Sparkles,
} from "lucide-react";
import { Github } from "@/components/ui/Icons";

interface SkillItem {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  displayOrder: number;
  visible: boolean;
}

interface SkillsSectionProps {
  skills: SkillItem[];
}

// Icon mapper helper
function getSkillIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("daisy")) return <Sparkles className="w-5 h-5 text-amber-400" />;
  if (lower.includes("netlify")) return <Cloud className="w-5 h-5 text-[#38BDF8]" />;
  if (lower.includes("react")) return <Atom className="w-5 h-5 text-[#38BDF8]" />;
  if (lower.includes("next")) return <Layers className="w-5 h-5 text-white" />;
  if (lower.includes("type")) return <FileCode2 className="w-5 h-5 text-[#38BDF8]" />;
  if (lower.includes("java") || lower.includes("js")) return <FileCode className="w-5 h-5 text-amber-400" />;
  if (lower.includes("tail")) return <Wind className="w-5 h-5 text-[#38BDF8]" />;
  if (lower.includes("css")) return <Palette className="w-5 h-5 text-blue-400" />;
  if (lower.includes("html")) return <Code2 className="w-5 h-5 text-orange-400" />;
  if (lower.includes("node")) return <Server className="w-5 h-5 text-emerald-400" />;
  if (lower.includes("express")) return <Cpu className="w-5 h-5 text-white" />;
  if (lower.includes("api")) return <Network className="w-5 h-5 text-[#7C3AED]" />;
  if (lower.includes("jwt") || lower.includes("auth")) return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
  if (lower.includes("postgre")) return <Database className="w-5 h-5 text-[#38BDF8]" />;
  if (lower.includes("prisma")) return <Boxes className="w-5 h-5 text-[#A78BFA]" />;
  if (lower.includes("mongo")) return <HardDrive className="w-5 h-5 text-emerald-500" />;
  if (lower.includes("github")) return <Github className="w-5 h-5 text-white" />;
  if (lower.includes("git")) return <GitBranch className="w-5 h-5 text-orange-400" />;
  if (lower.includes("postman")) return <Send className="w-5 h-5 text-orange-500" />;
  if (lower.includes("vs") || lower.includes("code")) return <Terminal className="w-5 h-5 text-[#38BDF8]" />;
  if (lower.includes("vercel")) return <Cloud className="w-5 h-5 text-white" />;
  return <Wrench className="w-5 h-5 text-[#7C3AED]" />;
}

function SkillIconDisplay({ name, icon }: { name: string; icon?: string | null }) {
  const [hasError, setHasError] = useState(false);

  const isImageUrl =
    Boolean(icon) &&
    (icon!.startsWith("/") ||
      icon!.startsWith("http://") ||
      icon!.startsWith("https://") ||
      icon!.startsWith("data:image/"));

  if (isImageUrl && !hasError) {
    return (
      <img
        src={icon!}
        alt={name}
        className="w-5 h-5 object-contain filter drop-shadow-sm transition-transform duration-200 group-hover:scale-110"
        onError={() => setHasError(true)}
      />
    );
  }

  return getSkillIcon(name);
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const visibleSkills = skills.filter((s) => s.visible);
  const categories = ["All", "Frontend", "Backend", "Database", "Tools"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSkills =
    activeCategory === "All"
      ? visibleSkills
      : visibleSkills.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="skills" className="py-24 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15182A] border border-[#7C3AED]/30 text-xs font-mono text-[#38BDF8]">
            <span>CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5FA] tracking-tight">
            Technical Skills &amp; Stack
          </h2>
          <p className="text-sm sm:text-base text-[#A0A3B8]">
            Technologies and tools I utilize actively to engineer performant, accessible web applications.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#4F46E5] text-white shadow-md shadow-[#7C3AED]/30 border border-[#8B5CF6]/50"
                  : "bg-[#15182A] text-[#A0A3B8] border border-white/10 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="card-surface p-4 rounded-xl flex items-center gap-3.5 group hover:border-[#7C3AED]/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-[#101322] border border-white/10 flex items-center justify-center group-hover:border-[#7C3AED]/50 transition-colors shrink-0 overflow-hidden">
                <SkillIconDisplay name={skill.name} icon={skill.icon} />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-[#F5F5FA] group-hover:text-white truncate">
                  {skill.name}
                </h4>
                <p className="text-[11px] font-mono text-[#A0A3B8] truncate">
                  {skill.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
