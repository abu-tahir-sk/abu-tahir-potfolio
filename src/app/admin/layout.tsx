import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname");

  // Login page should always be rendered standalone without admin sidebar/header
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#070914]">{children}</div>;
  }

  const session = await getSession();

  let unreadCount = 0;
  if (session) {
    unreadCount = await prisma.contactMessage.count({
      where: { isRead: false },
    });
  }

  if (!session) {
    return <div className="min-h-screen bg-[#070914]">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-[#0B0B14] text-[#F5F5FA]">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <AdminSidebar unreadCount={unreadCount} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={session} unreadCount={unreadCount} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
