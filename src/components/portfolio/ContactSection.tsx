"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Loader2, MessageSquare } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/Icons";

interface ContactSectionProps {
  settings?: {
    fullName?: string;
    email?: string;
    githubUrl?: string;
    linkedinUrl?: string;
  };
}

export function ContactSection({ settings }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website_hp: "", // Honeypot field
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const email = settings?.email || "abutahir2626@gmail.com";
  const github = settings?.githubUrl || "https://github.com/abu-tahir-sk";
  const linkedin = settings?.linkedinUrl || "https://www.linkedin.com/in/abu-tahir-sk-739036352";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic client checks
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message.");
      }

      setSuccess(data.message || "Thank you! Your message has been sent successfully.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        website_hp: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 border-t border-white/10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#7C3AED]/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15182A] border border-[#7C3AED]/30 text-xs font-mono text-[#38BDF8]">
              <MessageSquare className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>LET&apos;S CONNECT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5FA] tracking-tight">
              Have a Project in Mind or Want to Collaborate?
            </h2>

            <p className="text-sm sm:text-base text-[#A0A3B8] leading-relaxed">
              I am open to discussions about software development roles, freelance web engineering, or questions about my open-source projects. Leave a message here and I will respond promptly.
            </p>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-sm text-[#F5F5FA]">
                <div className="w-10 h-10 rounded-xl bg-[#15182A] border border-white/10 flex items-center justify-center text-[#7C3AED]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#A0A3B8] block">Direct Email</span>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-[#38BDF8] transition-colors font-medium"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-[#F5F5FA]">
                <div className="w-10 h-10 rounded-xl bg-[#15182A] border border-white/10 flex items-center justify-center text-[#38BDF8]">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#A0A3B8] block">LinkedIn</span>
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#38BDF8] transition-colors font-medium"
                  >
                    abu-tahir-sk-739036352
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-[#F5F5FA]">
                <div className="w-10 h-10 rounded-xl bg-[#15182A] border border-white/10 flex items-center justify-center text-white">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#A0A3B8] block">GitHub</span>
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#38BDF8] transition-colors font-medium"
                  >
                    github.com/abu-tahir-sk
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="card-surface p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field (hidden from real users) */}
                <input
                  type="text"
                  name="website_hp"
                  value={formData.website_hp}
                  onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-semibold text-[#F5F5FA]">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] placeholder-[#A0A3B8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-semibold text-[#F5F5FA]">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] placeholder-[#A0A3B8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="text-xs font-semibold text-[#F5F5FA]">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    placeholder="Project Inquiry / Job Opportunity / Collaboration"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] placeholder-[#A0A3B8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-semibold text-[#F5F5FA]">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Provide details about your project, timeline, or position..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] placeholder-[#A0A3B8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all resize-y"
                  />
                </div>

                {/* Alert Banners */}
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full button-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
