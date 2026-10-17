"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createProject, updateProject } from "@/actions/projects";
import { slugify } from "@/lib/utils";
import {
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { TechBadge } from "@/components/ui/TechBadge";

interface ProjectData {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImageUrl: string;
  coverImagePublicId?: string | null;
  screenshots: string[];
  technologies: string[];
  features: string[];
  category: string;
  githubUrl?: string | null;
  liveDemoUrl?: string | null;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  completedAt?: string | null;
  displayOrder: number;
}

interface ProjectFormProps {
  initialData?: ProjectData;
  isEdit?: boolean;
}

export function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ProjectData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    coverImageUrl: initialData?.coverImageUrl || "",
    coverImagePublicId: initialData?.coverImagePublicId || null,
    screenshots: initialData?.screenshots || [],
    technologies: initialData?.technologies || ["React", "Next.js", "TypeScript"],
    features: initialData?.features || [],
    category: initialData?.category || "Full-Stack",
    githubUrl: initialData?.githubUrl || "",
    liveDemoUrl: initialData?.liveDemoUrl || "",
    featured: initialData?.featured || false,
    status: initialData?.status || "PUBLISHED",
    completedAt: initialData?.completedAt
      ? new Date(initialData.completedAt).toISOString().split("T")[0]
      : "",
    displayOrder: initialData?.displayOrder || 0,
  });

  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingShot, setUploadingShot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-slug on title change when not manually edited or new
  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !isEdit && !prev.slug.startsWith(val.slice(0, 3).toLowerCase()) ? slugify(val) : prev.slug,
    }));
  };

  // Image Upload helper
  const handleFileUpload = async (file: File, isScreenshot: boolean = false) => {
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("folder", "portfolio/projects");

    try {
      if (isScreenshot) setUploadingShot(true);
      else setUploadingCover(true);
      setError(null);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: uploadForm,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (isScreenshot) {
        setFormData((prev) => ({
          ...prev,
          screenshots: [...prev.screenshots, data.url],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          coverImageUrl: data.url,
          coverImagePublicId: data.publicId,
        }));
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      if (isScreenshot) setUploadingShot(false);
      else setUploadingCover(false);
    }
  };

  // Technology handlers
  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const removeTech = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== item),
    }));
  };

  // Feature handlers
  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  const removeScreenshot = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEdit && initialData?.id) {
        const res = await updateProject(initialData.id, formData);
        if (res.error) throw new Error(res.error);
        setSuccess("Project updated successfully!");
      } else {
        const res = await createProject(formData);
        if (res.error) throw new Error(res.error);
        setSuccess("Project created successfully!");
      }

      setTimeout(() => {
        router.push("/admin/projects");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to save project.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs text-[#A0A3B8] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects list</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Fields */}
          <div className="lg:col-span-8 space-y-6">
            <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-base font-bold text-[#F5F5FA]">Basic Information</h2>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DocuFlow"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] placeholder-[#A0A3B8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              {/* Slug & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Slug (URL) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. docuflow"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: slugify(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm font-mono text-[#38BDF8] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                  <p className="text-[10px] text-[#A0A3B8]">
                    Accessible at: /projects/{formData.slug || "slug"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Web App">Web App</option>
                    <option value="Mobile / Cross-platform">Mobile / Cross-platform</option>
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">
                  Short Description (Card preview) *
                </label>
                <textarea
                  required
                  rows={2}
                  maxLength={250}
                  placeholder="One or two sentences summarizing the project..."
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] placeholder-[#A0A3B8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">
                  Full Description &amp; Technical Architecture *
                </label>
                <textarea
                  required
                  rows={7}
                  placeholder="Detailed breakdown of the project, problem solved, architecture..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] placeholder-[#A0A3B8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
            </div>

            {/* Implemented Features List */}
            <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-base font-bold text-[#F5F5FA]">Implemented Features</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Live A4 invoice preview"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="button-secondary text-xs px-4 py-2 rounded-xl flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#101322] border border-white/10 flex items-center justify-between text-xs text-[#F5F5FA]"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Screenshots Gallery Upload */}
            <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#F5F5FA]">Additional Screenshots</h2>
                <label className="button-secondary text-xs px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 font-medium">
                  {uploadingShot ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Upload Screenshot</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], true);
                    }}
                  />
                </label>
              </div>

              {formData.screenshots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.screenshots.map((shot, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#101322] group"
                    >
                      <Image src={shot} alt={`Screenshot ${idx + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeScreenshot(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#A0A3B8]">No additional screenshots uploaded yet.</p>
              )}
            </div>
          </div>

          {/* Right Sidebar Controls */}
          <div className="lg:col-span-4 space-y-6">
            {/* Publication & Status Card */}
            <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-sm font-bold text-[#F5F5FA]">Status &amp; Visibility</h2>

              {/* Status Switch */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">Publication Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "DRAFT" | "PUBLISHED",
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                >
                  <option value="PUBLISHED">Published (Visible on site)</option>
                  <option value="DRAFT">Draft (Admin only)</option>
                </select>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#101322] border border-white/10">
                <div>
                  <span className="text-xs font-semibold text-[#F5F5FA] block">Featured Project</span>
                  <span className="text-[10px] text-[#A0A3B8] block">Showcase on homepage</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 accent-[#7C3AED] rounded cursor-pointer"
                />
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
            </div>

            {/* Cover Image Upload Card */}
            <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-sm font-bold text-[#F5F5FA]">Cover Image *</h2>

              {formData.coverImageUrl ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#101322]">
                  <Image
                    src={formData.coverImageUrl}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-xl border border-dashed border-white/20 bg-[#101322] flex items-center justify-center text-xs text-[#A0A3B8]">
                  No cover image selected
                </div>
              )}

              {/* Upload Button */}
              <label className="w-full button-secondary py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer">
                {uploadingCover ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>Upload New Cover</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0], false);
                  }}
                />
              </label>

              {/* Or manual URL */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#A0A3B8]">Or paste image URL:</span>
                <input
                  type="text"
                  placeholder="https://... or /images/..."
                  value={formData.coverImageUrl}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] font-mono focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                />
              </div>
            </div>

            {/* Technologies */}
            <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-sm font-bold text-[#F5F5FA]">Technologies *</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Prisma"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="button-secondary text-xs px-3 py-2 rounded-xl"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {formData.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 pr-1.5 text-[#F5F5FA]"
                  >
                    <TechBadge name={tech} size="xs" className="border-0 bg-transparent hover:bg-transparent shadow-none" />
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="text-[#A0A3B8] hover:text-red-400 text-sm leading-none px-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="card-surface p-6 rounded-2xl border border-white/10 space-y-3">
              <h2 className="text-sm font-bold text-[#F5F5FA]">Project Links</h2>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#A0A3B8]">GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl || ""}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#A0A3B8]">Live Demo URL</label>
                <input
                  type="url"
                  placeholder="https://...vercel.app"
                  value={formData.liveDemoUrl || ""}
                  onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full button-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Project...</span>
                </>
              ) : (
                <span>{isEdit ? "Update Project" : "Publish Project"}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
