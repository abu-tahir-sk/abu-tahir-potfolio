"use client";

import { useState } from "react";
import {
  markMessageRead,
  markAllMessagesRead,
  deleteMessage,
  sendTestNotification,
  sendDirectReplyMessage,
} from "@/actions/messages";
import {
  Mail,
  MailOpen,
  Trash2,
  Search,
  Calendar,
  User,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Send,
  Loader2,
  CheckCheck,
  ExternalLink,
  CornerUpLeft,
  X,
  Sparkles,
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

  // Diagnostic Test Email State
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    provider?: string;
  } | null>(null);

  // In-Dashboard Reply Composer State
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [replyStatus, setReplyStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const unreadCount = messages.filter((m) => !m.isRead).length;

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

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllMessagesRead();
      if (res.success) {
        setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
        if (selectedMessage) {
          setSelectedMessage((prev) => (prev ? { ...prev, isRead: true } : null));
        }
      }
    } catch (err) {
      console.error("Mark all read error:", err);
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
          setIsReplying(false);
        }
      }
    } catch (err) {
      console.error("Delete message error:", err);
    }
  };

  const handleSendTestNotification = async () => {
    setTestSending(true);
    setTestResult(null);
    try {
      const res = await sendTestNotification();
      if (res.success) {
        if (res.notificationSent) {
          setTestResult({
            success: true,
            message: `Test email successfully dispatched to abutahir2626@gmail.com via ${res.provider?.toUpperCase()}!`,
            provider: res.provider,
          });
        } else {
          setTestResult({
            success: false,
            message:
              "No active email provider detected. Set RESEND_API_KEY or SMTP credentials in .env to receive live inbox alerts.",
          });
        }
      } else {
        setTestResult({
          success: false,
          message: res.error || "Failed to trigger test notification.",
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || "Error running test notification.",
      });
    } finally {
      setTestSending(false);
    }
  };

  // Direct Server Reply Dispatch
  const handleSendDirectReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    setReplySending(true);
    setReplyStatus(null);

    try {
      const res = await sendDirectReplyMessage({
        toEmail: selectedMessage.email,
        toName: selectedMessage.name,
        subject: selectedMessage.subject,
        replyMessage: replyText.trim(),
        originalMessage: selectedMessage.message,
      });

      if (res.success) {
        setReplyStatus({
          success: true,
          message: `Reply email successfully sent to ${selectedMessage.email} via ${res.provider?.toUpperCase()}!`,
        });
        setReplyText("");
        setTimeout(() => setIsReplying(false), 2500);
      } else {
        setReplyStatus({
          success: false,
          message: res.error || "Failed to dispatch email reply.",
        });
      }
    } catch (err: any) {
      setReplyStatus({
        success: false,
        message: err?.message || "Error sending email reply.",
      });
    } finally {
      setReplySending(false);
    }
  };

  // Build Gmail Web Compose Link
  const buildGmailUrl = () => {
    if (!selectedMessage) return "#";
    const to = encodeURIComponent(selectedMessage.email);
    const subject = encodeURIComponent(`Re: ${selectedMessage.subject}`);
    const bodyContent = replyText.trim()
      ? `${replyText}\n\n---\nOn ${new Date(selectedMessage.createdAt).toLocaleString()} ${selectedMessage.name} wrote:\n> ${selectedMessage.message.replace(/\n/g, "\n> ")}`
      : `Hi ${selectedMessage.name},\n\nThank you for reaching out!\n\n---\nOn ${new Date(selectedMessage.createdAt).toLocaleString()} ${selectedMessage.name} wrote:\n> ${selectedMessage.message.replace(/\n/g, "\n> ")}`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${encodeURIComponent(bodyContent)}`;
  };

  const quickTemplates = [
    "Thank you for reaching out! I'd love to learn more about your project and requirements.",
    "Hi, I reviewed your message and I'm very interested. Are you available for a quick call this week?",
    "Thank you! Could you please share more details regarding the project scope, timeline, and tech stack?",
  ];

  return (
    <div className="space-y-6">
      {/* Test Diagnostic Result Banner */}
      {testResult && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs gap-3 ${
            testResult.success
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            )}
            <span>{testResult.message}</span>
          </div>
          <button
            onClick={() => setTestResult(null)}
            className="text-white/60 hover:text-white px-2 py-1 rounded bg-white/5 text-[10px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search, Filter, and Action Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#15182A] border border-white/10">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#A0A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] placeholder-[#A0A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#101322] border border-white/10">
            {(["ALL", "UNREAD", "READ"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  filter === f
                    ? "bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#4F46E5] text-white shadow-sm shadow-[#7C3AED]/25"
                    : "text-[#A0A3B8] hover:text-white"
                }`}
              >
                <span>{f === "ALL" ? "All" : f === "UNREAD" ? "Unread" : "Read"}</span>
                {f === "UNREAD" && unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-500/80 text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mark All Read Button */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              type="button"
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-[#CBD5E1] hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
              title="Mark all inquiries as read"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Mark All Read</span>
            </button>
          )}

          {/* Send Test Email Button */}
          <button
            onClick={handleSendTestNotification}
            disabled={testSending}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-xs font-medium text-[#C4B5FD] hover:bg-[#7C3AED]/25 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Test Resend or SMTP notification delivery"
          >
            {testSending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5 text-[#A78BFA]" />
            )}
            <span>Test Email</span>
          </button>
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
                  setIsReplying(false);
                  setReplyStatus(null);
                  if (!msg.isRead) handleToggleRead(msg.id, false);
                }}
                type="button"
                className={`w-full text-left p-4 transition-colors block ${
                  selectedMessage?.id === msg.id
                    ? "bg-[#7C3AED]/15 border-l-4 border-l-[#7C3AED]"
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

                  {/* Primary Reply Toggle Button */}
                  <button
                    onClick={() => {
                      setIsReplying(!isReplying);
                      setReplyStatus(null);
                    }}
                    type="button"
                    className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-medium transition-all ${
                      isReplying
                        ? "bg-white/10 text-white border border-white/20"
                        : "button-primary shadow-sm shadow-[#7C3AED]/30"
                    }`}
                  >
                    <CornerUpLeft className="w-3.5 h-3.5" />
                    <span>{isReplying ? "Close Reply" : "Reply"}</span>
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="text-sm text-[#F5F5FA] leading-relaxed whitespace-pre-wrap font-sans bg-[#101322] p-5 rounded-xl border border-white/5">
                {selectedMessage.message}
              </div>

              {/* Direct Reply Composer Box */}
              {isReplying && (
                <div className="mt-6 p-5 rounded-2xl bg-[#121629] border border-[#7C3AED]/30 shadow-xl space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#7C3AED]/20 text-[#A78BFA] flex items-center justify-center">
                        <CornerUpLeft className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#F8FAFC] block">
                          Reply to {selectedMessage.name}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] block">
                          &lt;{selectedMessage.email}&gt;
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsReplying(false)}
                      className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Template Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-[#A78BFA] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Quick Responses
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickTemplates.map((template, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setReplyText(template)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-[#171b33] border border-white/10 text-[#CBD5E1] hover:text-white hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/10 transition-colors text-left truncate max-w-full"
                        >
                          &ldquo;{template.slice(0, 48)}...&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reply Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#F8FAFC] block">
                      Your Reply Message
                    </label>
                    <textarea
                      rows={5}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Write your response to ${selectedMessage.name}...`}
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0e1c] border border-white/10 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all resize-y"
                    />
                  </div>

                  {/* Reply Feedback Status */}
                  {replyStatus && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs flex items-start gap-2 ${
                        replyStatus.success
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-red-500/10 border-red-500/30 text-red-300"
                      }`}
                    >
                      {replyStatus.success ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      )}
                      <span>{replyStatus.message}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Direct Send from Dashboard */}
                      <button
                        onClick={handleSendDirectReply}
                        disabled={replySending || !replyText.trim()}
                        type="button"
                        className="button-primary text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold disabled:opacity-50"
                      >
                        {replySending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Sending Email...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send via Dashboard</span>
                          </>
                        )}
                      </button>

                      {/* Open Directly in Gmail Web (Works immediately in browser) */}
                      <a
                        href={buildGmailUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3.5 py-2.5 rounded-xl bg-[#1e2442] border border-[#38BDF8]/30 text-[#38BDF8] hover:bg-[#38BDF8]/10 hover:border-[#38BDF8]/60 transition-colors flex items-center gap-2 font-medium"
                        title="Open composed reply directly in Gmail in a new browser tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Reply with Gmail</span>
                      </a>

                      {/* Desktop Mail App */}
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                          selectedMessage.subject
                        )}&body=${encodeURIComponent(replyText)}`}
                        className="text-xs px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                        title="Open default system mail client"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Desktop Mail</span>
                      </a>
                    </div>

                    <button
                      onClick={() => setIsReplying(false)}
                      type="button"
                      className="text-xs text-[#94A3B8] hover:text-white px-2 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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
