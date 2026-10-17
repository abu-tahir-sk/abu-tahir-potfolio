import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowUp, ShieldCheck } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/Icons";

interface FooterProps {
  settings?: {
    fullName?: string;
    professionalTitle?: string;
    email?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    footerText?: string;
  };
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const name = settings?.fullName || "Abu Tahir Sk";
  const title = settings?.professionalTitle || "Full-Stack Web Developer";
  const email = settings?.email || "abutahir2626@gmail.com";
  const github = settings?.githubUrl || "https://github.com/abu-tahir-sk";
  const linkedin = settings?.linkedinUrl || "https://www.linkedin.com/in/abu-tahir-sk-739036352";
  const footerText = settings?.footerText || "Designed & Built by Abu Tahir Sk.";

  return (
    <footer className="border-t border-white/10 bg-[var(--bg-main)] relative overflow-hidden transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-t from-[#7C3AED]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6]/40 via-[#7C3AED]/30 to-[#38BDF8]/40 p-[1.5px] shadow-md shadow-[#8B5CF6]/20 group-hover:shadow-[#8B5CF6]/40 group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-[#101322]/95 rounded-[10px] flex items-center justify-center p-1.5 overflow-hidden">
                  <Image
                    src="/images/logo.png"
                    alt="Abu Tahir Sk Logo"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(139,92,246,0.5)] group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div>
                <span className="font-bold text-base text-[#F5F5FA] group-hover:text-white transition-colors">{name}</span>
                <p className="text-xs text-[#A0A3B8]">{title}</p>
              </div>
            </Link>
            <p className="text-sm text-[#A0A3B8] max-w-md leading-relaxed">
              Crafting robust web applications, responsive user interfaces, and practical digital products with React, Next.js, TypeScript, and PostgreSQL.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#A0A3B8] hover:text-[#F5F5FA] hover:bg-white/10 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#A0A3B8] hover:text-[#38BDF8] hover:bg-white/10 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${email}`}
                aria-label="Send Email"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#A0A3B8] hover:text-[#7C3AED] hover:bg-white/10 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F5F5FA]">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-[#A0A3B8]">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  All Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-white transition-colors">
                  Resume
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured & Admin */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F5F5FA]">
              Platform
            </h3>
            <ul className="space-y-2 text-sm text-[#A0A3B8]">
              <li>
                <Link href="/projects/docuflow" className="hover:text-white transition-colors">
                  DocuFlow SaaS
                </Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-white transition-colors">
                  Download CV
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-[#7C3AED] transition-colors inline-flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Admin Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A0A3B8]">
          <p>
            &copy; {currentYear} {name}. {footerText}
          </p>
          <div className="flex items-center gap-4">
            <span>Powered by Next.js &amp; PostgreSQL</span>
            <a
              href="#top"
              aria-label="Back to top"
              className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-[#A0A3B8] hover:text-white transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
