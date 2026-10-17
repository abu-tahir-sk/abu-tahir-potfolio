"use client";

import { useState } from "react";
import { markMessageRead, deleteMessage } from "@/actions/messages";
import {
  Mail,
  MailOpen,
  Trash2,
  Search,
  Calendar,
  User,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
}

interface MessagesManagerProps {
  initialMessages: MessageItem[];
}

export function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(
    initialMessages[0] || null
  );

  const filtered = messages.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchFilter =
      filter === "ALL" ||
      (filter === "UNREAD" && !m.isRead) ||
      (filter === "READ" && m.isRead);

    return matchSearch && matchFilter;
  });

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await markMessageRead(id, !currentRead);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: !currentRead } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, isRead: !currentRead } : null));
        }
      }
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await deleteMessage(id);
      if (res.success) {
        const remaining = messages.filter((m) => m.id !== id);
        setMessages(remaining);
        if (selectedMessage?.id === id) {
          setSelectedMessage(remaining[0] || null);
        }
      }
    } catch (err) {
      console.error("Delete message error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#15182A] border border-white/10">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#A0A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] placeholder-[#A0A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#101322] border border-white/10">
          {(["ALL", "UNREAD", "READ"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? "bg-[#6C63FF] text-white shadow-sm shadow-[#6C63FF]/20"
                  : "text-[#A0A3B8] hover:text-white"
              }`}
            >
              {f === "ALL" ? "All Messages" : f === "UNREAD" ? "Unread" : "Read"}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Pane Layout: Message List on Left, Selected Message on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List */}
        <div className="lg:col-span-5 card-surface rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5 max-h-[700px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A0A3B8]">
              No messages found.
            </div>
          ) : (
            filtered.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.isRead) handleToggleRead(msg.id, false);
                }}
                type="button"
                className={`w-full text-left p-4 transition-colors block ${
                  selectedMessage?.id === msg.id
                    ? "bg-[#6C63FF]/15 border-l-4 border-l-[#6C63FF]"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        msg.isRead ? "bg-transparent" : "bg-[#38BDF8]"
                      }`}
                    />
                    <span className="font-semibold text-xs text-[#F5F5FA] truncate max-w-[150px]">
                      {msg.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A0A3B8] font-mono">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#38BDF8] truncate">{msg.subject}</p>
                <p className="text-xs text-[#A0A3B8] line-clamp-1 mt-0.5">{msg.message}</p>
              </button>
            ))
          )}
        </div>

        {/* Selected Message Viewer */}
        <div className="lg:col-span-7 card-surface rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
          {selectedMessage ? (
            <>
              {/* Message Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-[#F5F5FA]">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-[#A0A3B8]">
                    <span>From:</span>
                    <strong className="text-white">{selectedMessage.name}</strong>
                    <span>&lt;{selectedMessage.email}&gt;</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#A0A3B8] pt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>
                      {new Date(selectedMessage.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      handleToggleRead(selectedMessage.id, selectedMessage.isRead)
                    }
                    type="button"
                    title={selectedMessage.isRead ? "Mark unread" : "Mark read"}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#A0A3B8] hover:text-white hover:bg-white/10"
                  >
                    {selectedMessage.isRead ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <MailOpen className="w-4 h-4 text-[#38BDF8]" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    type="button"
                    title="Delete message"
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#A0A3B8] hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject
                    )}`}
                    className="button-primary text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 font-medium"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </a>
                </div>
              </div>

              {/* Message Body */}
              <div className="text-sm text-[#F5F5FA] leading-relaxed whitespace-pre-wrap font-sans bg-[#101322] p-5 rounded-xl border border-white/5">
                {selectedMessage.message}
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-xs text-[#A0A3B8] space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto opacity-50 text-[#6C63FF]" />
              <p>Select a message on the left to read its content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
