import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B14] text-[#F5F5FA]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#15182A] border border-[#6C63FF]/40 mx-auto flex items-center justify-center text-[#6C63FF] shadow-lg shadow-[#6C63FF]/20">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider">
              Error 404
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5FA] tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-[#A0A3B8] leading-relaxed">
              The page you are looking for does not exist, has been removed, or was unpublished.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto button-primary text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/projects"
              className="w-full sm:w-auto button-secondary text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Projects</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
