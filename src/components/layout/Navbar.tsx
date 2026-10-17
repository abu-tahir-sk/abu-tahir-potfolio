"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, ArrowUpRight, ShieldCheck } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Projects", href: "/projects" },
    { name: "Skills", href: "/#skills" },
    { name: "Experience", href: "/#experience" },
    { name: "About", href: "/about" },
    { name: "Resume", href: "/resume" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[#0B0B14]/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20 py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Monogram */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#38BDF8] p-[1.5px] shadow-md shadow-[#6C63FF]/20 group-hover:shadow-[#6C63FF]/40 transition-shadow">
              <div className="w-full h-full bg-[#101322] rounded-[10px] flex items-center justify-center">
                <span className="font-mono font-bold text- text-[#F5F5FA] group-hover:text-[#38BDF8] transition-colors">
                  A
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-[#F5F5FA] group-hover:text-white transition-colors">
                Abu Tahir Sk
              </span>
              {/* <span className="text-[10px] text-[#A0A3B8] tracking-wider uppercase font-medium">
                Full-Stack Dev
              </span> */}
            </div>
          </Link>

          {/* Desktop Center Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#15182A]/70 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${isActive
                    ? "text-[#F5F5FA] bg-[#6C63FF]/20 border border-[#6C63FF]/40 shadow-sm shadow-[#6C63FF]/10"
                    : "text-[#A0A3B8] hover:text-[#F5F5FA] hover:bg-white/5"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/admin/login"
              title="Admin Portal"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#A0A3B8] hover:text-[#F5F5FA] hover:bg-white/10 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#A0A3B8] hover:text-[#6C63FF]" />
            </Link>

            <Link
              href="/contact"
              className="button-primary text-xs px-4 py-2 rounded-lg flex items-center gap-1.5"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isOpen}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#F5F5FA] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden mt-3 px-4 pt-2 pb-6 bg-[#101322]/95 border-b border-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? "text-[#F5F5FA] bg-[#6C63FF]/20 border border-[#6C63FF]/30"
                    : "text-[#A0A3B8] hover:text-white hover:bg-white/5"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/contact"
                className="button-primary text-sm px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-center"
              >
                <span>Let&apos;s Talk</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/login"
                className="px-4 py-2 text-xs text-[#A0A3B8] hover:text-white text-center flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin CMS</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
