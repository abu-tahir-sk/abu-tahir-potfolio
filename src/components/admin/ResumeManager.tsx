"use client";

import { useState } from "react";
import { updateResumeUrl } from "@/actions/settings";
import { Upload, Loader2, FileText, CheckCircle2, AlertCircle, ExternalLink, Trash2 } from "lucide-react";

interface ResumeManagerProps {
  currentResumeUrl?: string | null;
}

export function ResumeManager({ currentResumeUrl }: ResumeManagerProps) {
  const [resumeUrl, setResumeUrl] = useState(currentResumeUrl || "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("folder", "portfolio/resume");

    try {
      setUploading(true);
      setError(null);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: uploadForm,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setResumeUrl(data.url);
      await updateResumeUrl(data.url);
      setSuccess("Resume uploaded and updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to upload resume file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await updateResumeUrl(resumeUrl.trim());
      if (res.error) throw new Error(res.error);
      setSuccess("Resume link updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update resume link.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove the current resume link?")) return;
    setLoading(true);
    try {
      await updateResumeUrl("");
      setResumeUrl("");
      setSuccess("Resume removed.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card-surface p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        <div>
          <h2 className="text-base font-bold text-[#F5F5FA]">Upload Resume Document</h2>
          <p className="text-xs text-[#A0A3B8] mt-1">
            Upload your latest PDF resume. Visitors will be able to download and view it directly on the /resume route.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="p-8 rounded-2xl border-2 border-dashed border-white/10 hover:border-[#7C3AED]/50 bg-[#101322] text-center space-y-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] mx-auto flex items-center justify-center">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <FileText className="w-6 h-6" />
            )}
          </div>

          <div>
            <span className="text-sm font-semibold text-[#F5F5FA] block">
              {uploading ? "Uploading file..." : "Select Resume File (PDF, DOCX)"}
            </span>
            <span className="text-xs text-[#A0A3B8] block mt-0.5">
              Maximum file size: 10MB
            </span>
          </div>

          <label className="inline-flex button-primary text-xs px-5 py-2.5 rounded-xl cursor-pointer font-medium">
            <Upload className="w-4 h-4 mr-2" />
            <span>Choose PDF File</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />
          </label>
        </div>

        {/* Manual URL Form */}
        <form onSubmit={handleSaveUrl} className="space-y-3 pt-4 border-t border-white/10">
          <label className="text-xs font-semibold text-[#F5F5FA] block">
            Or configure verified local / remote resume URL:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="/resume/Abu-Tahir-Sk-Resume.pdf or https://..."
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-xs font-mono text-[#38BDF8] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            <button
              type="submit"
              disabled={loading}
              className="button-primary text-xs px-5 py-2.5 rounded-xl font-semibold disabled:opacity-50"
            >
              Save URL
            </button>
            {resumeUrl && (
              <button
                type="button"
                onClick={handleRemove}
                className="p-2.5 rounded-xl bg-white/5 text-[#A0A3B8] hover:text-red-400 hover:bg-red-500/10"
                title="Remove resume"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

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
      </div>

      {/* Preview Section */}
      {resumeUrl && (
        <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F5F5FA]">Live Preview of Current Resume</h3>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#38BDF8] hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>Open in new tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="w-full h-96 rounded-xl overflow-hidden border border-white/10 bg-[#101322]">
            <iframe src={resumeUrl} title="Resume Preview" className="w-full h-full border-0" />
          </div>
        </div>
      )}
    </div>
  );
}
