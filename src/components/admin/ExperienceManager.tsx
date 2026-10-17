"use client";

import { useState } from "react";
import { createExperience, updateExperience, deleteExperience } from "@/actions/experience";
import { Plus, Edit, Trash2, Briefcase, Loader2, AlertCircle } from "lucide-react";

interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  technologies: string[];
  displayOrder: number;
}

interface ExperienceManagerProps {
  initialExperiences: ExperienceItem[];
}

export function ExperienceManager({ initialExperiences }: ExperienceManagerProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);

  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);
  const [techString, setTechString] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNewModal = () => {
    setEditingExp(null);
    setRole("");
    setOrganization("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setCurrent(false);
    setTechString("");
    setDisplayOrder(experiences.length + 1);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setRole(exp.role);
    setOrganization(exp.organization);
    setDescription(exp.description);
    setStartDate(exp.startDate);
    setEndDate(exp.endDate || "");
    setCurrent(exp.current);
    setTechString(exp.technologies.join(", "));
    setDisplayOrder(exp.displayOrder);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const techs = techString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      role,
      organization,
      description,
      startDate,
      endDate: current ? null : endDate || null,
      current,
      technologies: techs,
      displayOrder,
    };

    try {
      if (editingExp) {
        const res = await updateExperience(editingExp.id, payload);
        if (res.error) throw new Error(res.error);
        if (res.experience) {
          setExperiences((prev) =>
            prev.map((e) => (e.id === editingExp.id ? (res.experience as ExperienceItem) : e))
          );
        }
      } else {
        const res = await createExperience(payload);
        if (res.error) throw new Error(res.error);
        if (res.experience) {
          setExperiences((prev) => [...prev, res.experience as ExperienceItem]);
        }
      }
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to save experience entry");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience record?")) return;
    try {
      const res = await deleteExperience(id);
      if (res.success) {
        setExperiences((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Delete experience error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#15182A] border border-white/10">
        <span className="text-xs text-[#A0A3B8]">
          Total entries: <strong className="text-white">{experiences.length}</strong>
        </span>
        <button
          onClick={openNewModal}
          type="button"
          className="button-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      <div className="space-y-4">
        {experiences.length === 0 ? (
          <div className="card-surface p-12 rounded-2xl text-center text-xs text-[#A0A3B8]">
            No experience entries added yet.
          </div>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="card-surface p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#F5F5FA]">{exp.role}</h3>
                  <span className="text-xs text-[#38BDF8] font-medium">@ {exp.organization}</span>
                </div>
                <div className="text-xs font-mono text-[#A0A3B8]">
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate || "Ongoing"}
                </div>
                <p className="text-xs text-[#A0A3B8] leading-relaxed whitespace-pre-wrap">
                  {exp.description}
                </p>
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {exp.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-[#F5F5FA]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-start shrink-0">
                <button
                  onClick={() => openEditModal(exp)}
                  className="p-2 rounded-lg bg-[#6C63FF]/10 text-[#6C63FF] hover:bg-[#6C63FF]/20"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-2 rounded-lg bg-white/5 text-[#A0A3B8] hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="card-surface p-6 rounded-2xl border border-white/10 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[#F5F5FA]">
              {editingExp ? "Edit Experience Entry" : "Add Experience Entry"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack Developer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Freelance / Client Project"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Start Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024 or Jan 2024"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">End Date</label>
                  <input
                    type="text"
                    disabled={current}
                    placeholder={current ? "Present" : "e.g. Dec 2024"}
                    value={current ? "" : endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF] disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="exp-current"
                  checked={current}
                  onChange={(e) => setCurrent(e.target.checked)}
                  className="w-4 h-4 accent-[#6C63FF] rounded cursor-pointer"
                />
                <label htmlFor="exp-current" className="text-xs text-[#F5F5FA] cursor-pointer">
                  Currently active in this role
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">Technologies (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Next.js, TypeScript, PostgreSQL"
                  value={techString}
                  onChange={(e) => setTechString(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Summary of responsibilities, achievements, and technologies..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

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
                  disabled={loading}
                  className="button-primary text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 font-semibold disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingExp ? "Update Record" : "Save Record"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
