import Link from "next/link";
import { ArrowUpRight, Code, Database, Layout, ShieldCheck, Zap } from "lucide-react";

interface AboutSectionProps {
  settings: {
    fullName?: string;
    professionalTitle?: string;
    biography?: string;
  };
}

export function AboutSection({ settings }: AboutSectionProps) {
  const name = settings?.fullName || "Abu Tahir Sk";
  const title = settings?.professionalTitle || "Full-Stack Web Developer";
  const bio =
    settings?.biography ||
    "I build modern web applications, responsive interfaces, and practical digital products using React, Next.js, TypeScript, and Node.js. Passionate about clean code architecture, intuitive user interfaces, and robust backend database design.";

  const principles = [
    {
      icon: <Layout className="w-5 h-5 text-[#38BDF8]" />,
      title: "Responsive Interface Engineering",
      description:
        "Building pixel-perfect, accessible UI components with modern CSS, Tailwind, and React that scale flawlessly across mobile, tablet, and desktop viewports.",
    },
    {
      icon: <Database className="w-5 h-5 text-[#6C63FF]" />,
      title: "Database-Driven Applications",
      description:
        "Architecting clean relational schemas with PostgreSQL and Prisma ORM, ensuring data integrity, performance, and type-safe data access layers.",
    },
    {
      icon: <Code className="w-5 h-5 text-emerald-400" />,
      title: "Component & API Architecture",
      description:
        "Developing maintainable full-stack systems using Next.js Server Components, Server Actions, and RESTful route handlers with strict TypeScript types.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      title: "Security & Pragmatic Engineering",
      description:
        "Implementing defense-in-depth authentication, input sanitization with Zod, rate limiting, and zero-compromise server-side authorization.",
    },
  ];

  return (
    <section id="about" className="py-24 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Biography & Approach */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15182A] border border-[#6C63FF]/30 text-xs font-mono text-[#38BDF8]">
              <Zap className="w-3.5 h-3.5 text-[#6C63FF]" />
              <span>ABOUT ME</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5FA] tracking-tight">
              Engineering with Purpose &amp; Precision
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#A0A3B8] leading-relaxed">
              <p>{bio}</p>
              <p>
                My development workflow emphasizes clean separation of concerns, strict type-safety, and intuitive interfaces. Whether engineering a document SaaS like DocuFlow or building dynamic developer tools, my priority is delivering dependable, user-first software.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="button-primary text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 font-medium"
              >
                <span>Read Full Development Story</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Core Pillars Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {principles.map((p, idx) => (
              <div
                key={idx}
                className="card-surface p-6 rounded-2xl border border-white/10 space-y-3 group hover:border-[#6C63FF]/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#101322] border border-white/10 flex items-center justify-center group-hover:border-[#6C63FF]/50 transition-colors">
                  {p.icon}
                </div>
                <h3 className="text-base font-bold text-[#F5F5FA] group-hover:text-white transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-[#A0A3B8] leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
