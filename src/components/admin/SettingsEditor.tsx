"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/actions/settings";
import { Loader2, AlertCircle, CheckCircle2, Globe, Shield, FileText } from "lucide-react";

interface SiteSettingsData {
  id: string;
  fullName: string;
  professionalTitle: string;
  biography: string;
  profileImageUrl?: string | null;
  profileImagePublicId?: string | null;
  avatarUrl?: string | null;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  availabilityStatus: string;
  resumeUrl?: string | null;
  siteUrl: string;
  seoTitle: string;
  seoDescription: string;
  socialImageUrl?: string | null;
  footerText: string;
}

interface SettingsEditorProps {
  initialSettings: SiteSettingsData;
}

export function SettingsEditor({ initialSettings }: SettingsEditorProps) {
  const [formData, setFormData] = useState<SiteSettingsData>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await updateSiteSettings(formData);
      if (res.error) throw new Error(res.error);
      setSuccess("Site settings updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update site settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* SEO & Meta */}
      <div className="card-surface p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#38BDF8]" />
          <h2 className="text-base font-bold text-[#F5F5FA]">Search Engine Optimization (SEO)</h2>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#F5F5FA]">Production Site URL *</label>
          <input
            type="url"
            required
            placeholder="https://abutahir.dev"
            value={formData.siteUrl}
            onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          />
          <p className="text-[10px] text-[#A0A3B8]">
            Used for canonical URLs, Open Graph tags, and sitemap generation.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#F5F5FA]">Default SEO Title *</label>
          <input
            type="text"
            required
            value={formData.seoTitle}
            onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#F5F5FA]">Meta Description *</label>
          <textarea
            required
            rows={3}
            value={formData.seoDescription}
            onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#F5F5FA]">Social Share Image URL</label>
          <input
            type="text"
            placeholder="https://.../og-image.jpg"
            value={formData.socialImageUrl || ""}
            onChange={(e) => setFormData({ ...formData, socialImageUrl: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm font-mono text-[#38BDF8] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          />
        </div>
      </div>

      {/* Footer Text */}
      <div className="card-surface p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-[#F5F5FA]">Website Footer</h2>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#F5F5FA]">Custom Footer Notice</label>
          <input
            type="text"
            required
            value={formData.footerText}
            onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          />
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="button-primary px-8 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold disabled:opacity-50"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        <span>Save Global Settings</span>
      </button>
    </form>
  );
}
