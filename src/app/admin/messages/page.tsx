import { prisma } from "@/lib/db";
import { MessagesManager } from "@/components/admin/MessagesManager";
import { MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F5FA] tracking-tight">
            Contact Messages &amp; Inquiries
          </h1>
          <p className="text-xs text-[#A0A3B8]">
            Review, reply to, and manage incoming messages submitted via your portfolio.
          </p>
        </div>
      </div>

      <MessagesManager initialMessages={messages} />
    </div>
  );
}
