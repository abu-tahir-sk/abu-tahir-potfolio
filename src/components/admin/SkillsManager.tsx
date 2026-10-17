"use client";

import { useState } from "react";
import { createSkill, updateSkill, deleteSkill } from "@/actions/skills";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Code2,
  AlertCircle,
  Upload,
  X,
} from "lucide-react";

interface SkillItem {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  displayOrder: number;
  visible: boolean;
}

interface SkillsManagerProps {
  initialSkills: SkillItem[];
}

export function SkillsManager({ initialSkills }: SkillsManagerProps) {
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<"Frontend" | "Backend" | "Database" | "Tools">("Frontend");
  const [icon, setIcon] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [visible, setVisible] = useState(true);

  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [iconError, setIconError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNewModal = () => {
    setEditingSkill(null);
    setName("");
    setCategory("Frontend");
    setIcon("");
    setDisplayOrder(skills.length + 1);
    setVisible(true);
    setError(null);
    setIconError(null);
    setModalOpen(true);
  };

  const openEditModal = (s: SkillItem) => {
    setEditingSkill(s);
    setName(s.name);
    setCategory(s.category as any);
    setIcon(s.icon || "");
    setDisplayOrder(s.displayOrder);
    setVisible(s.visible);
    setError(null);
    setIconError(null);
    setModalOpen(true);
  };

  const handleIconUpload = async (file: File) => {
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      setIconError("Invalid file type. Allowed formats: SVG, PNG, WebP, JPG, GIF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setIconError("File size cannot exceed 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "portfolio/skills");

    try {
      setUploadingIcon(true);
      setIconError(null);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Icon upload failed");

      setIcon(data.url);
    } catch (err: any) {
      setIconError(err.message || "Failed to upload skill icon.");
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: name.trim(),
      category,
      icon: icon.trim() || null,
      displayOrder,
      visible,
    };

    try {
      if (editingSkill) {
        const res = await updateSkill(editingSkill.id, payload);
        if (res.error) throw new Error(res.error);
        if (res.skill) {
          setSkills((prev) =>
            prev.map((s) => (s.id === editingSkill.id ? (res.skill as SkillItem) : s))
          );
        }
      } else {
        const res = await createSkill(payload);
        if (res.error) throw new Error(res.error);
        if (res.skill) {
          setSkills((prev) => [...prev, res.skill as SkillItem]);
        }
      }
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to save skill");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      const res = await deleteSkill(id);
      if (res.success) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Delete skill error:", err);
    }
  };

  const handleToggleVisibility = async (skill: SkillItem) => {
    try {
      const res = await updateSkill(skill.id, {
        name: skill.name,
        category: skill.category,
        icon: skill.icon || null,
        displayOrder: skill.displayOrder,
        visible: !skill.visible,
      });
      if (res.success) {
        setSkills((prev) =>
          prev.map((s) => (s.id === skill.id ? { ...s, visible: !s.visible } : s))
        );
      }
    } catch (err) {
      console.error("Toggle visibility error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#15182A] border border-white/10">
        <div>
          <span className="text-xs text-[#A0A3B8]">
            Total configured skills: <strong className="text-white">{skills.length}</strong>
          </span>
        </div>
        <button
          onClick={openNewModal}
          type="button"
          className="button-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Skills Table */}
      <div className="card-surface rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#101322] border-b border-white/10 text-[#A0A3B8] font-mono uppercase text-[10px]">
                <th className="py-3 px-4 font-semibold">Skill &amp; Icon</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Order</th>
                <th className="py-3 px-4 font-semibold">Visibility</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {skills.map((skill) => {
                const hasCustomIcon =
                  Boolean(skill.icon) &&
                  (skill.icon!.startsWith("/") ||
                    skill.icon!.startsWith("http") ||
                    skill.icon!.startsWith("data:"));

                return (
                  <tr key={skill.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-bold text-sm text-[#F5F5FA]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#101322] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {hasCustomIcon ? (
                            <img
                              src={skill.icon!}
                              alt={skill.name}
                              className="w-4 h-4 object-contain"
                            />
                          ) : (
                            <Code2 className="w-4 h-4 text-[#7C3AED]" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold">{skill.name}</span>
                          {hasCustomIcon && (
                            <span className="text-[10px] font-mono text-emerald-400 font-normal">
                              Custom Icon
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#38BDF8] font-mono">
                      {skill.category}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#A0A3B8]">
                      {skill.displayOrder}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleVisibility(skill)}
                        type="button"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                          skill.visible
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-white/5 text-[#A0A3B8] border border-white/10"
                        }`}
                      >
                        {skill.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{skill.visible ? "Visible" : "Hidden"}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="p-1.5 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20 transition-colors"
                          title="Edit skill"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1.5 rounded-lg bg-white/5 text-[#A0A3B8] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="card-surface p-6 rounded-2xl border border-white/10 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[#F5F5FA]">
              {editingSkill ? "Edit Skill" : "Add New Skill"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Skill Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">Skill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, daisyUI, Docker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              {/* Icon Upload & Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Skill Icon / Logo</label>
                  {icon && (
                    <button
                      type="button"
                      onClick={() => {
                        setIcon("");
                        setIconError(null);
                      }}
                      className="text-[11px] text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#101322] border border-white/10">
                  {/* Icon Preview Thumbnail */}
                  <div className="w-12 h-12 rounded-lg bg-[#15182A] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                    {uploadingIcon ? (
                      <Loader2 className="w-5 h-5 text-[#7C3AED] animate-spin" />
                    ) : icon && (icon.startsWith("/") || icon.startsWith("http") || icon.startsWith("data:")) ? (
                      <img
                        src={icon}
                        alt="Skill icon preview"
                        className="w-7 h-7 object-contain"
                        onError={() => setIconError("Icon URL failed to load")}
                      />
                    ) : (
                      <Code2 className="w-5 h-5 text-[#A0A3B8]" />
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="button-secondary text-xs px-3 py-1.5 rounded-lg cursor-pointer font-medium inline-flex items-center gap-1.5 hover:border-[#7C3AED]/70 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span>{uploadingIcon ? "Uploading..." : "Upload Icon"}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleIconUpload(file);
                          }}
                          disabled={uploadingIcon}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-[#A0A3B8]">SVG, PNG, WebP</span>
                    </div>

                    <input
                      type="text"
                      placeholder="Or paste icon / SVG URL"
                      value={icon}
                      onChange={(e) => {
                        setIcon(e.target.value);
                        setIconError(null);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#15182A] border border-white/10 text-xs text-[#F5F5FA] placeholder-[#A0A3B8]/50 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                    />
                  </div>
                </div>

                {iconError && (
                  <p className="text-[11px] text-red-400 pl-1">{iconError}</p>
                )}
              </div>

              {/* Category & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              {/* Visibility Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="skill-visible"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  className="w-4 h-4 accent-[#7C3AED] rounded cursor-pointer"
                />
                <label htmlFor="skill-visible" className="text-xs text-[#F5F5FA] cursor-pointer">
                  Visible on public website
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#A0A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingIcon}
                  className="button-primary text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 font-semibold disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingSkill ? "Update Skill" : "Save Skill"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
