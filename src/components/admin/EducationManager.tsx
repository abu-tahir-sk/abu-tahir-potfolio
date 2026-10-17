"use client";

import { useState } from "react";
import { createEducation, updateEducation, deleteEducation } from "@/actions/education";
import {
  Plus,
  Edit,
  Trash2,
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Award,
} from "lucide-react";

export interface EducationItem {
  id: string;
  qualification: string;
  institution: string;
  subject?: string | null;
  boardOrUniversity?: string | null;
  passingYear?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  displayOrder: number;
  visible?: boolean;
}

interface EducationManagerProps {
  initialEducations: EducationItem[];
}

export function EducationManager({ initialEducations }: EducationManagerProps) {
  const [educations, setEducations] = useState<EducationItem[]>(initialEducations);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);

  // Form State
  const [qualification, setQualification] = useState("");
  const [institution, setInstitution] = useState("");
  const [subject, setSubject] = useState("");
  const [boardOrUniversity, setBoardOrUniversity] = useState("");
  const [passingYear, setPassingYear] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [visible, setVisible] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNewModal = () => {
    setEditingEdu(null);
    setQualification("");
    setInstitution("");
    setSubject("");
    setBoardOrUniversity("");
    setPassingYear("");
    setDescription("");
    setDisplayOrder(educations.length + 1);
    setVisible(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (edu: EducationItem) => {
    setEditingEdu(edu);
    setQualification(edu.qualification);
    setInstitution(edu.institution);
    setSubject(edu.subject || "");
    setBoardOrUniversity(edu.boardOrUniversity || "");
    setPassingYear(edu.passingYear || edu.endDate || "");
    setDescription(edu.description || "");
    setDisplayOrder(edu.displayOrder);
    setVisible(edu.visible !== false);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      qualification: qualification.trim(),
      institution: institution.trim(),
      subject: subject.trim() || null,
      boardOrUniversity: boardOrUniversity.trim() || null,
      passingYear: passingYear.trim() || null,
      description: description.trim() || null,
      startDate: null,
      endDate: passingYear.trim() || null,
      displayOrder,
      visible,
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

  const handleToggleVisibility = async (edu: EducationItem) => {
    try {
      const newVisible = edu.visible === false;
      const res = await updateEducation(edu.id, {
        qualification: edu.qualification,
        institution: edu.institution,
        subject: edu.subject || null,
        boardOrUniversity: edu.boardOrUniversity || null,
        passingYear: edu.passingYear || null,
        description: edu.description || null,
        displayOrder: edu.displayOrder,
        visible: newVisible,
      });
      if (res.success) {
        setEducations((prev) =>
          prev.map((e) => (e.id === edu.id ? { ...e, visible: newVisible } : e))
        );
      }
    } catch (err) {
      console.error("Toggle visibility error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#15182A] border border-white/10">
        <div>
          <span className="text-xs text-[#A0A3B8]">
            Total configured education records: <strong className="text-white">{educations.length}</strong>
          </span>
        </div>
        <button
          onClick={openNewModal}
          type="button"
          className="button-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education Record</span>
        </button>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {educations.length === 0 ? (
          <div className="card-surface p-12 rounded-2xl text-center text-xs text-[#A0A3B8]">
            No education entries added yet. Click &quot;Add Education Record&quot; above to create one.
          </div>
        ) : (
          educations.map((edu) => (
            <div
              key={edu.id}
              className="card-surface p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all duration-200 hover:border-[#7C3AED]/40"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-[#7C3AED]/15 text-[#A78BFA]">
                    <GraduationCap className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-[#F5F5FA]">{edu.qualification}</h3>
                  {edu.subject && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#101322] border border-white/10 text-[#38BDF8] font-mono">
                      {edu.subject}
                    </span>
                  )}
                  {edu.visible === false && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono">
                      Hidden
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#A0A3B8] pt-1">
                  <div className="flex items-center gap-1.5 text-white/90 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>{edu.institution}</span>
                  </div>

                  {edu.boardOrUniversity && (
                    <div className="flex items-center gap-1.5 font-mono text-[#38BDF8]">
                      <Award className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>{edu.boardOrUniversity}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 font-mono text-emerald-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Year: {edu.passingYear || edu.endDate || "N/A"}</span>
                  </div>

                  <span className="text-[11px] text-[#A0A3B8]/60 font-mono">
                    Order: {edu.displayOrder}
                  </span>
                </div>

                {edu.description && (
                  <p className="text-xs text-[#A0A3B8] leading-relaxed pt-1 whitespace-pre-wrap">
                    {edu.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-start md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5 w-full md:w-auto justify-end">
                <button
                  onClick={() => handleToggleVisibility(edu)}
                  type="button"
                  className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
                    edu.visible !== false
                      ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                      : "bg-white/5 text-[#A0A3B8] hover:bg-white/10 border border-white/10"
                  }`}
                  title={edu.visible !== false ? "Visible on portfolio" : "Hidden from portfolio"}
                >
                  {edu.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="text-[11px] hidden sm:inline">
                    {edu.visible !== false ? "Visible" : "Hidden"}
                  </span>
                </button>

                <button
                  onClick={() => openEditModal(edu)}
                  className="p-2 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20 border border-[#7C3AED]/20 transition-colors"
                  title="Edit record"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(edu.id)}
                  className="p-2 rounded-xl bg-white/5 text-[#A0A3B8] hover:text-red-400 hover:bg-red-500/10 border border-white/10 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="card-surface p-6 sm:p-7 rounded-2xl border border-white/10 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 text-[#A78BFA] flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#F5F5FA]">
                {editingEdu ? "Edit Education Record" : "Add Education Record"}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Qualification / Degree */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">
                  Qualification / Degree *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.A. in Political Science (Honours) or Higher Secondary"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              {/* Institution / College / School */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">
                  School / College / Institution *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Murshidabad Adarsha Mahavidyalaya or Amirabad High Madrasha"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              {/* Board / University & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">
                    University / Board (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. University of Kalyani, WBCHSE"
                    value={boardOrUniversity}
                    onChange={(e) => setBoardOrUniversity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">
                    Subject / Honours (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Political Science (Honours)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              {/* Passing Year & Display Order */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Passing / Completion Year *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2025, 2022, 2020"
                    value={passingYear}
                    onChange={(e) => setPassingYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              {/* Description (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">
                  Description / Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional brief notes or summary..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-y"
                />
              </div>

              {/* Visibility Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edu-visible"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  className="w-4 h-4 accent-[#7C3AED] rounded cursor-pointer"
                />
                <label htmlFor="edu-visible" className="text-xs text-[#F5F5FA] cursor-pointer">
                  Visible on public portfolio website
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#A0A3B8] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="button-primary text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 font-semibold disabled:opacity-50"
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
