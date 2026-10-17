import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Download, FileText, ArrowUpRight, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume & Curriculum Vitae — Abu Tahir Sk",
  description:
    "View and download the professional resume of Abu Tahir Sk, Full-Stack Web Developer specializing in React, Next.js, and TypeScript.",
};

export const revalidate = 60;

export default async function ResumePage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default-settings" },
  });

  const resumeUrl = settings?.resumeUrl;
  const name = settings?.fullName || "Abu Tahir Sk";
  const title = settings?.professionalTitle || "Full-Stack Web Developer";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15182A] border border-[#7C3AED]/30 text-xs font-mono text-[#38BDF8]">
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>CURRICULUM VITAE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#F5F5FA] tracking-tight">
              Resume &amp; Credentials
            </h1>
            <p className="text-sm sm:text-base text-[#A0A3B8]">
              Detailed summary of technical expertise, development projects, and software engineering capabilities.
            </p>

            {resumeUrl && (
              <div className="pt-2 flex justify-center">
                <a
                  href={resumeUrl}
                  download="Abu-Tahir-Sk-Resume.pdf"
                  className="button-primary text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2 font-medium shadow-lg shadow-[#7C3AED]/25"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume (PDF)</span>
                </a>
              </div>
            )}
          </div>

          {/* PDF Viewer or Empty State */}
          {resumeUrl ? (
            <div className="card-surface rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="p-4 bg-[#101322] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#A0A3B8]">
                  <FileText className="w-4 h-4 text-[#7C3AED]" />
                  <span>{name} - Resume.pdf</span>
                </div>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#38BDF8] hover:underline inline-flex items-center gap-1"
                >
                  <span>Open in new tab</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="w-full h-[750px] bg-[#101322] flex items-center justify-center">
                <iframe
                  src={`${resumeUrl}#toolbar=0`}
                  title={`${name} Resume Preview`}
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          ) : (
            <div className="card-surface p-12 rounded-2xl border border-white/10 text-center space-y-4 max-w-lg mx-auto">
              <AlertCircle className="w-10 h-10 text-[#7C3AED] mx-auto opacity-70" />
              <h3 className="text-xl font-bold text-[#F5F5FA]">Resume Update in Progress</h3>
              <p className="text-xs text-[#A0A3B8] leading-relaxed">
                The latest version of the resume is currently being updated. In the meantime, feel free to explore projects or connect directly.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="button-primary text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 font-medium"
                >
                  <span>Contact Abu Tahir Sk</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer settings={settings || undefined} />
    </div>
  );
}
