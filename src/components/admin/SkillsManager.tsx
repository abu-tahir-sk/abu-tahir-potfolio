"use client";

import { useState } from "react";
import { createSkill, updateSkill, deleteSkill } from "@/actions/skills";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Code2, AlertCircle } from "lucide-react";

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
  const [displayOrder, setDisplayOrder] = useState(0);
  const [visible, setVisible] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNewModal = () => {
    setEditingSkill(null);
    setName("");
    setCategory("Frontend");
    setDisplayOrder(skills.length + 1);
    setVisible(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (s: SkillItem) => {
    setEditingSkill(s);
    setName(s.name);
    setCategory(s.category as any);
    setDisplayOrder(s.displayOrder);
    setVisible(s.visible);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name,
      category,
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
                <th className="py-3 px-4 font-semibold">Skill Name</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Order</th>
                <th className="py-3 px-4 font-semibold">Visibility</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-bold text-sm text-[#F5F5FA]">
                    {skill.name}
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
                        className="p-1.5 rounded-lg bg-[#6C63FF]/10 text-[#6C63FF] hover:bg-[#6C63FF]/20"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="p-1.5 rounded-lg bg-white/5 text-[#A0A3B8] hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F5FA]">Skill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-sm text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F5F5FA]">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
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
                    className="w-full px-3 py-2.5 rounded-xl bg-[#101322] border border-white/10 text-xs text-[#F5F5FA] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="skill-visible"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  className="w-4 h-4 accent-[#6C63FF] rounded cursor-pointer"
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
