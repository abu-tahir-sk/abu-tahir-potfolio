"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ExternalLink, User, Bell, Mail } from "lucide-react";
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
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

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

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <Link
              href="/admin/messages"
              onMouseEnter={() => setShowNotificationMenu(true)}
              onMouseLeave={() => setShowNotificationMenu(false)}
              className="relative p-2 rounded-xl bg-[#15182A] border border-white/10 text-[#A0A3B8] hover:text-white hover:border-[#7C3AED]/40 transition-all flex items-center justify-center focus:outline-none"
              title={unreadCount > 0 ? `${unreadCount} unread message(s)` : "Notifications"}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-400 animate-ping pointer-events-none" />
                </>
              )}
            </Link>

            {/* Quick Hover / Notification Dropdown preview */}
            {showNotificationMenu && (
              <div
                onMouseEnter={() => setShowNotificationMenu(true)}
                onMouseLeave={() => setShowNotificationMenu(false)}
                className="absolute right-0 mt-2 w-64 p-3 rounded-2xl bg-[#121629] border border-white/10 shadow-2xl shadow-black/80 z-50 text-xs text-[#CBD5E1] space-y-2"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#7C3AED]" />
                    Inquiry Notifications
                  </span>
                  <span className="text-[10px] font-mono text-[#A0A3B8]">
                    {unreadCount} unread
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  {unreadCount > 0
                    ? `You have ${unreadCount} new inquiry waiting in your inbox.`
                    : "No unread messages. All inquiries have been reviewed."}
                </p>
                <Link
                  href="/admin/messages"
                  className="block text-center py-1.5 px-3 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#C4B5FD] hover:bg-[#7C3AED]/30 transition-colors font-medium text-[11px]"
                >
                  View All Messages →
                </Link>
              </div>
            )}
          </div>

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
