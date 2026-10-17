"use client";

import { useState } from "react";
import Image from "next/image";
import { updateSiteSettings } from "@/actions/settings";
import { Upload, Loader2, AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/Icons";

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

interface ProfileEditorProps {
  initialSettings: SiteSettingsData;
}

export function ProfileEditor({ initialSettings }: ProfileEditorProps) {
  const [formData, setFormData] = useState<SiteSettingsData>(initialSettings);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("folder", "portfolio/profile");

    try {
      setUploading(true);
      setError(null);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: uploadForm,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setFormData((prev) => ({
        ...prev,
        profileImageUrl: data.url,
        profileImagePublicId: data.publicId,
      }));
    } catch (err: any) {
      setError(err.message || "Failed to upload profile image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await updateSiteSettings(formData);
      if (res.error) throw new Error(res.error);
      setSuccess("Profile settings updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Avatar & Photo Management */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-4 text-center">
            <h2 className="text-sm font-bold text-[#F5F5FA]">Profile Photograph</h2>

            <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden border border-white/10 bg-[#101322] shadow-xl group">
              <Image
                src={formData.profileImageUrl || "/images/profile/avatar-default.svg"}
                alt={formData.fullName}
                fill
                className="object-cover"
              />
            </div>

            <label className="w-full button-secondary py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>Upload New Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                }}
              />
            </label>

            <div className="space-y-1 text-left">
              <span className="text-[10px] text-[#A0A3B8]">Direct Image URL:</span>
              <input
                type="text"
                value={formData.profileImageUrl || ""}
                onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#101322] border border-white/10 text-xs font-mono text-[#F5F5FA] focus:outline-none focus:ring-1 focus:ring-[#6C63FF]"
              />
            </div>
          </div>

          <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A0A3B8]">
              Current Availability
            </h3>
            <div className="space-y-1.5">
              <label className="text-xs text-[#F5F5FA]">Hero Availability Badge Text</label>
              <input
                type="text"
                value={formData.availabilityStatus}
                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Identity & Bio Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-[#F5F5FA]">Developer Identity</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">Professional Title *</label>
                <input
                  type="text"
                  required
                  value={formData.professionalTitle}
                  onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F5FA]">
                Biography &amp; Introduction *
              </label>
              <textarea
                required
                rows={5}
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              />
            </div>
          </div>

          <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-[#F5F5FA]">Contact &amp; Social Links</h2>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#6C63FF]" />
                  <span>Public Contact Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA] flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-white" />
                  <span>GitHub Profile URL *</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA] flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>LinkedIn Profile URL *</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </div>
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
            className="w-full sm:w-auto button-primary px-8 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Profile Changes</span>
          </button>
        </div>
      </div>
    </form>
  );
}
