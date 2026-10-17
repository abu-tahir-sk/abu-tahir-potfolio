"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ExternalLink, ShieldCheck, User } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

interface AdminHeaderProps {
  user?: {
    email: string;
    name?: string | null;
  };
  unreadCount?: number;
}

export function AdminHeader({ user, unreadCount = 0 }: AdminHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-[#101322] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            type="button"
            className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-[#F5F5FA] hover:bg-white/10"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#A0A3B8]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>PostgreSQL Active</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#A0A3B8] hover:text-[#38BDF8] transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#15182A] border border-white/10">
            <div className="w-6 h-6 rounded-lg bg-[#6C63FF]/20 text-[#6C63FF] flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-semibold text-[#F5F5FA] block leading-tight">
                {user?.name || "Abu Tahir Sk"}
              </span>
              <span className="text-[10px] text-[#A0A3B8] block leading-none">
                {user?.email || "Admin"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 z-50">
            <AdminSidebar onClose={() => setMobileOpen(false)} unreadCount={unreadCount} />
          </div>
        </div>
      )}
    </>
  );
}
