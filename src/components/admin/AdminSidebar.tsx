"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Code2,
  Briefcase,
  GraduationCap,
  MessageSquare,
  User,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  onClose?: () => void;
  unreadCount?: number;
}

export function AdminSidebar({ onClose, unreadCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { name: "Skills", href: "/admin/skills", icon: Code2 },
    { name: "Experience", href: "/admin/experience", icon: Briefcase },
    { name: "Education", href: "/admin/education", icon: GraduationCap },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Resume", href: "/admin/resume", icon: FileText },
    { name: "Site Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-[#101322] border-r border-white/10 flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-between px-2 pt-2">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#38BDF8] p-[1.5px]">
              <div className="w-full h-full bg-[#15182A] rounded-[10px] flex items-center justify-center font-mono font-bold text-xs text-[#F5F5FA]">
                &#123;AT&#125;
              </div>
            </div>
            <div>
              <span className="font-bold text-sm text-[#F5F5FA] block">Portfolio CMS</span>
              <span className="text-[10px] text-[#38BDF8] font-mono">ADMIN CONSOLE</span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[#A0A3B8] hover:text-white hover:bg-white/10"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/30"
                    : "text-[#A0A3B8] hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#38BDF8] text-[#0B0B14]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-[#A0A3B8] hover:text-[#38BDF8] hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Public Website</span>
        </Link>

        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
