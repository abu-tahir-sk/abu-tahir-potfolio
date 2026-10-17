import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  FolderGit2,
  CheckCircle2,
  FileEdit,
  Sparkles,
  MessageSquare,
  Mail,
  Plus,
  ArrowUpRight,
  User,
  Settings,
  Code2,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Query real database metrics in parallel
  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    featuredProjects,
    totalMessages,
    unreadMessages,
    recentProjects,
    recentMessages,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.project.count({ where: { status: "DRAFT" } }),
    prisma.project.count({ where: { featured: true } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const metrics = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: FolderGit2,
      color: "text-[#38BDF8]",
      bg: "bg-[#38BDF8]/10",
      border: "border-[#38BDF8]/20",
    },
    {
      label: "Published Projects",
      value: publishedProjects,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
    },
    {
      label: "Draft Projects",
      value: draftProjects,
      icon: FileEdit,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
    },
    {
      label: "Featured Projects",
      value: featuredProjects,
      icon: Sparkles,
      color: "text-[#6C63FF]",
      bg: "bg-[#6C63FF]/10",
      border: "border-[#6C63FF]/20",
    },
    {
      label: "Total Inquiries",
      value: totalMessages,
      icon: MessageSquare,
      color: "text-[#F5F5FA]",
      bg: "bg-white/5",
      border: "border-white/10",
    },
    {
      label: "Unread Messages",
      value: unreadMessages,
      icon: Mail,
      color: unreadMessages > 0 ? "text-rose-400" : "text-[#A0A3B8]",
      bg: unreadMessages > 0 ? "bg-rose-400/10" : "bg-white/5",
      border: unreadMessages > 0 ? "border-rose-400/30" : "border-white/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#15182A] via-[#101322] to-[#15182A] border border-white/10 shadow-lg">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5FA] tracking-tight">
            Developer CMS Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A3B8] mt-1">
            Real-time control center for Abu Tahir Sk&apos;s developer portfolio and database.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/projects/new"
            className="button-primary text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 font-medium shadow-md shadow-[#6C63FF]/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
          <Link
            href="/admin/settings"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#A0A3B8] hover:text-white hover:bg-white/10 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Database Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl card-surface border ${metric.border} flex flex-col justify-between space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A0A3B8] font-medium leading-tight">
                  {metric.label}
                </span>
                <div className={`p-1.5 rounded-lg ${metric.bg} ${metric.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-[#F5F5FA] tracking-tight">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid: Recent Projects & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Projects Table */}
        <div className="lg:col-span-7 card-surface rounded-2xl border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#38BDF8]" />
              <h2 className="text-base font-bold text-[#F5F5FA]">Recent Projects</h2>
            </div>
            <Link
              href="/admin/projects"
              className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1 font-medium"
            >
              <span>Manage all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <p className="text-xs text-[#A0A3B8] py-8 text-center">
              No projects created yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#A0A3B8] font-mono uppercase text-[10px]">
                    <th className="pb-3 font-semibold">Title</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-medium text-[#F5F5FA]">
                        <span className="block truncate max-w-[180px]">{p.title}</span>
                      </td>
                      <td className="py-3 text-[#A0A3B8] font-mono text-[11px]">
                        {p.category}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.status === "PUBLISHED"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/projects/${p.id}/edit`}
                          className="text-[#6C63FF] hover:text-[#38BDF8] font-semibold transition-colors"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Contact Messages */}
        <div className="lg:col-span-5 card-surface rounded-2xl border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#6C63FF]" />
              <h2 className="text-base font-bold text-[#F5F5FA]">Recent Inquiries</h2>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View all ({unreadMessages} unread)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-xs text-[#A0A3B8] py-8 text-center">
              No inquiries received yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <Link
                  key={msg.id}
                  href="/admin/messages"
                  className={`block p-3.5 rounded-xl border transition-all ${
                    !msg.isRead
                      ? "bg-[#15182A] border-[#6C63FF]/30 shadow-sm shadow-[#6C63FF]/10"
                      : "bg-[#101322] border-white/5 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#F5F5FA]">
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-[#A0A3B8] font-mono">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#38BDF8] truncate">{msg.subject}</p>
                  <p className="text-xs text-[#A0A3B8] line-clamp-1 mt-0.5">{msg.message}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/admin/skills"
          className="card-surface p-5 rounded-xl border border-white/10 group hover:border-[#6C63FF]/40 transition-colors flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F5F5FA]">Manage Skills</h3>
            <p className="text-xs text-[#A0A3B8]">Tech stack &amp; tools</p>
          </div>
        </Link>

        <Link
          href="/admin/experience"
          className="card-surface p-5 rounded-xl border border-white/10 group hover:border-[#38BDF8]/40 transition-colors flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F5F5FA]">Work Experience</h3>
            <p className="text-xs text-[#A0A3B8]">Roles &amp; milestones</p>
          </div>
        </Link>

        <Link
          href="/admin/profile"
          className="card-surface p-5 rounded-xl border border-white/10 group hover:border-emerald-400/40 transition-colors flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F5F5FA]">Profile Details</h3>
            <p className="text-xs text-[#A0A3B8]">Bio, photo &amp; links</p>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="card-surface p-5 rounded-xl border border-white/10 group hover:border-amber-400/40 transition-colors flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F5F5FA]">Site Settings</h3>
            <p className="text-xs text-[#A0A3B8]">SEO, URLs &amp; footer</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
