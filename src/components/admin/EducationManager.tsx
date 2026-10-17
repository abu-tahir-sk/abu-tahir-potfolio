"use client";

import { useState } from "react";
import { createEducation, updateEducation, deleteEducation } from "@/actions/education";
import { Plus, Edit, Trash2, GraduationCap, Loader2, AlertCircle } from "lucide-react";

interface EducationItem {
  id: string;
  qualification: string;
  institution: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  displayOrder: number;
}

interface EducationManagerProps {
  initialEducations: EducationItem[];
}

export function EducationManager({ initialEducations }: EducationManagerProps) {
  const [educations, setEducations] = useState<EducationItem[]>(initialEducations);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);

  const [qualification, setQualification] = useState("");
  const [institution, setInstitution] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNewModal = () => {
    setEditingEdu(null);
    setQualification("");
    setInstitution("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setDisplayOrder(educations.length + 1);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (edu: EducationItem) => {
    setEditingEdu(edu);
    setQualification(edu.qualification);
    setInstitution(edu.institution);
    setDescription(edu.description);
    setStartDate(edu.startDate);
    setEndDate(edu.endDate || "");
    setDisplayOrder(edu.displayOrder);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      qualification,
      institution,
      description,
      startDate,
      endDate: endDate || null,
      displayOrder,
    };

    try {
      if (editingEdu) {
        const res = await updateEducation(editingEdu.id, payload);
        if (res.error) throw new Error(res.error);
        if (res.education) {
          setEducations((prev) =>
            prev.map((e) => (e.id === editingEdu.id ? (res.education as EducationItem) : e))
          );
        }
      } else {
        const res = await createEducation(payload);
        if (res.error) throw new Error(res.error);
        if (res.education) {
          setEducations((prev) => [...prev, res.education as EducationItem]);
        }
      }
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to save education entry");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education record?")) return;
    try {
      const res = await deleteEducation(id);
      if (res.success) {
        setEducations((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Delete education error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#15182A] border border-white/10">
        <span className="text-xs text-[#A0A3B8]">
          Total entries: <strong className="text-white">{educations.length}</strong>
        </span>
        <button
          onClick={openNewModal}
          type="button"
          className="button-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-4">
        {educations.length === 0 ? (
          <div className="card-surface p-12 rounded-2xl text-center text-xs text-[#A0A3B8]">
            No education entries added yet.
          </div>
        ) : (
          educations.map((edu) => (
            <div
              key={edu.id}
              className="card-surface p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#F5F5FA]">{edu.qualification}</h3>
                  <span className="text-xs text-[#38BDF8] font-medium">@ {edu.institution}</span>
                </div>
                <div className="text-xs font-mono text-[#A0A3B8]">
                  {edu.startDate} — {edu.endDate || "Present"}
                </div>
                <p className="text-xs text-[#A0A3B8] leading-relaxed whitespace-pre-wrap">
                  {edu.description}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start shrink-0">
                <button
                  onClick={() => openEditModal(edu)}
                  className="p-2 rounded-lg bg-[#6C63FF]/10 text-[#6C63FF] hover:bg-[#6C63FF]/20"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
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
              {editingEdu ? "Edit Education Entry" : "Add Education Entry"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Degree / Qualification *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech in Computer Science"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Institution / University *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Technical University"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Start Year *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2022"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">End Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026 or Present"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">Description / Focus *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Summary of coursework, academic focus, or certifications..."
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
                  <span>{editingEdu ? "Update Record" : "Save Record"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
