"use client";
import { useState, useEffect } from "react";
import { updateSiteSettings } from "@/actions/settings";
import { Loader2, AlertCircle, CheckCircle2, Globe, Shield, FileText, Mail, Bell, Cloud, Image as ImageIcon } from "lucide-react";

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
  const [storageInfo, setStorageInfo] = useState<{
    provider: string;
    isCloudinaryConfigured: boolean;
    cloudName?: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/uploads")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStorageInfo(data);
      })
      .catch(() => {});
  }, []);

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
            className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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
            className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#F5F5FA]">Meta Description *</label>
          <textarea
            required
            rows={3}
            value={formData.seoDescription}
            onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#F5F5FA]">Social Share Image URL</label>
          <input
            type="text"
            placeholder="https://.../og-image.jpg"
            value={formData.socialImageUrl || ""}
            onChange={(e) => setFormData({ ...formData, socialImageUrl: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm font-mono text-[#38BDF8] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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
            className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>
      </div>

      {/* Media Storage & Cloudinary CDN */}
      <div className="card-surface p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-[#38BDF8]" />
          <h2 className="text-base font-bold text-[#F5F5FA]">Image &amp; Media Storage (Cloudinary CDN)</h2>
        </div>
        <p className="text-xs text-[#A0A3B8] leading-relaxed">
          Manage how project screenshots, cover images, and your profile photograph are stored and served.
        </p>

        <div className="p-4 rounded-xl bg-[#101322] border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-[#94A3B8]">Active Storage Provider:</span>
            <span className="font-semibold flex items-center gap-1.5">
              {storageInfo?.isCloudinaryConfigured ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-emerald-400 font-mono">Cloudinary CDN (Active)</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-[#38BDF8] font-mono">Local Storage (/public/uploads)</span>
                </>
              )}
            </span>
          </div>

          {storageInfo?.isCloudinaryConfigured && (
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-[#94A3B8]">Cloud Name:</span>
              <span className="font-mono text-[#38BDF8]">{storageInfo.cloudName}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-1">
            <span className="text-[#94A3B8]">Optimization &amp; Delivery:</span>
            <span className="text-[#E2E8F0]">
              {storageInfo?.isCloudinaryConfigured
                ? "Auto WebP compression + Global CDN delivery"
                : "Standard local resolution fallback"}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-[#A0A3B8] space-y-1.5 leading-relaxed">
          <p className="font-semibold text-white">How to connect Cloudinary for global CDN delivery:</p>
          <ol className="list-decimal list-inside space-y-1 text-[#94A3B8]">
            <li>Sign up for a free account at <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] underline">cloudinary.com</a></li>
            <li>In your Cloudinary Dashboard, copy your <strong>Cloud Name</strong>, <strong>API Key</strong>, and <strong>API Secret</strong></li>
            <li>Paste them into your <code className="text-white">.env</code> file under <code className="text-[#C084FC]">CLOUDINARY_CLOUD_NAME</code>, <code className="text-[#C084FC]">CLOUDINARY_API_KEY</code>, and <code className="text-[#C084FC]">CLOUDINARY_API_SECRET</code></li>
          </ol>
          <p className="text-[10px] text-[#64748B] pt-1">
            * Note: If left blank, all uploads will continue to work seamlessly by saving to your project&apos;s local <code className="text-white">/public/uploads</code> folder.
          </p>
        </div>
      </div>

      {/* Email & Notifications System */}
      <div className="card-surface p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#A78BFA]" />
          <h2 className="text-base font-bold text-[#F5F5FA]">Email &amp; Notification System</h2>
        </div>
        <p className="text-xs text-[#A0A3B8] leading-relaxed">
          When visitors submit messages via the contact form, notifications are logged into your PostgreSQL database with unread alerts and sent to your email.
        </p>
        
        <div className="p-4 rounded-xl bg-[#101322] border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-[#94A3B8]">Target Admin Inbox:</span>
            <span className="font-mono text-[#38BDF8] font-medium">abutahir2626@gmail.com</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-[#94A3B8]">Supported Delivery Channels:</span>
            <span className="text-[#E2E8F0]">Resend API or Gmail / SMTP</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[#94A3B8]">Sender Auto-Acknowledgement:</span>
            <span className="text-emerald-400 font-medium">Enabled (Includes LinkedIn &amp; GitHub)</span>
          </div>
        </div>

        <p className="text-[11px] text-[#64748B]">
          To activate direct email delivery to your inbox, add <code className="text-[#C084FC]">RESEND_API_KEY</code> or your Gmail app password (<code className="text-[#C084FC]">SMTP_USER</code> &amp; <code className="text-[#C084FC]">SMTP_PASS</code>) to your <code className="text-white">.env</code> file. Test email sending anytime from the <a href="/admin/messages" className="text-[#38BDF8] underline">Messages Console</a>.
        </p>
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
