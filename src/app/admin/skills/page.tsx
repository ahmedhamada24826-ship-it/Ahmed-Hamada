"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";
import { IconRenderer } from "@/components/IconRenderer";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Skill modal / edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [skillForm, setSkillForm] = useState({
    nameEn: "",
    nameAr: "",
    categoryName: "Business Intelligence",
    iconName: "BarChart3",
    proficiency: 90,
    order: 0,
    isVisible: true,
  });

  // Category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    nameEn: "",
    nameAr: "",
    order: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [skillsRes, catsRes] = await Promise.all([
        fetch("/api/admin/skills"),
        fetch("/api/admin/categories"),
      ]);
      const skillsData = await skillsRes.json();
      const catsData = await catsRes.json();
      if (skillsData.skills) setSkills(skillsData.skills);
      if (catsData.categories) setCategories(catsData.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (skill?: any) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillForm({
        nameEn: skill.nameEn,
        nameAr: skill.nameAr,
        categoryName: skill.categoryName,
        iconName: skill.iconName,
        proficiency: skill.proficiency || 90,
        order: skill.order || 0,
        isVisible: skill.isVisible ?? true,
      });
    } else {
      setEditingSkill(null);
      setSkillForm({
        nameEn: "",
        nameAr: "",
        categoryName: categories[0]?.nameEn || "Business Intelligence",
        iconName: "BarChart3",
        proficiency: 90,
        order: skills.length + 1,
        isVisible: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        const res = await fetch("/api/admin/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingSkill.id, ...skillForm }),
        });
        if (res.ok) {
          setIsModalOpen(false);
          loadData();
        }
      } else {
        const res = await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(skillForm),
        });
        if (res.ok) {
          setIsModalOpen(false);
          loadData();
        }
      }
    } catch (err) {
      alert("Error saving skill.");
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return;
    try {
      await fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" });
      setSkills(skills.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });
      if (res.ok) {
        setIsCategoryModalOpen(false);
        setCategoryForm({ nameEn: "", nameAr: "", order: 0 });
        loadData();
      }
    } catch (err) {
      alert("Failed to add category.");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-brand-light" />
            <span>Skills &amp; Competencies Management</span>
          </h1>
          <p className="text-xs text-slate-400">
            Add, reorder, categorize, and control the visibility of technical competencies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Skill</span>
          </button>
        </div>
      </div>

      {/* Skills Table */}
      {loading ? (
        <div className="py-20 flex justify-center items-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
          <span className="text-xs">Loading skills...</span>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Icon &amp; Skill</th>
                  <th className="p-4">Arabic Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Proficiency</th>
                  <th className="p-4">Order</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 text-brand-light flex items-center justify-center shrink-0 border border-slate-700">
                          <IconRenderer name={skill.iconName} className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-white text-sm">{skill.nameEn}</span>
                      </div>
                    </td>

                    <td className="p-4 font-arabic text-slate-300">
                      {skill.nameAr}
                    </td>

                    <td className="p-4 text-slate-400">
                      {skill.categoryName}
                    </td>

                    <td className="p-4 font-mono font-bold text-brand-light">
                      {skill.proficiency}%
                    </td>

                    <td className="p-4 text-slate-500 font-mono">
                      #{skill.order}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(skill)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-light hover:bg-slate-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id, skill.nameEn)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleSaveSkill}
            className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Skill Name (English)
                </label>
                <input
                  type="text"
                  required
                  value={skillForm.nameEn}
                  onChange={(e) => setSkillForm({ ...skillForm, nameEn: e.target.value })}
                  placeholder="e.g. Power BI"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 font-arabic">
                  اسم المهارة (بالعربية)
                </label>
                <input
                  type="text"
                  required
                  value={skillForm.nameAr}
                  onChange={(e) => setSkillForm({ ...skillForm, nameAr: e.target.value })}
                  placeholder="مثال: باور بي آي"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={skillForm.categoryName}
                    onChange={(e) =>
                      setSkillForm({ ...skillForm, categoryName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="Business Intelligence">Business Intelligence</option>
                    <option value="Data Analysis">Data Analysis</option>
                    <option value="Data Modeling & ETL">Data Modeling & ETL</option>
                    <option value="Python Analytics">Python Analytics</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.nameEn}>
                        {c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Lucide Icon Name
                  </label>
                  <input
                    type="text"
                    value={skillForm.iconName}
                    onChange={(e) =>
                      setSkillForm({ ...skillForm, iconName: e.target.value })
                    }
                    placeholder="BarChart3, Database, Code2"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Proficiency % ({skillForm.proficiency}%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={skillForm.proficiency}
                    onChange={(e) =>
                      setSkillForm({ ...skillForm, proficiency: Number(e.target.value) })
                    }
                    className="w-full accent-brand-royal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={skillForm.order}
                    onChange={(e) =>
                      setSkillForm({ ...skillForm, order: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-royal text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-600"
              >
                Save Skill
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Manage Categories</h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of categories */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white">{cat.nameEn}</span>
                    <span className="text-slate-400 block font-arabic">{cat.nameAr}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.nameEn)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Create category form */}
            <form onSubmit={handleAddCategory} className="space-y-3 pt-3 border-t border-slate-800">
              <div className="font-bold text-xs text-brand-light">Add New Category</div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Category Name (EN)"
                  value={categoryForm.nameEn}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameEn: e.target.value })}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="اسم التصنيف (بالعربية)"
                  value={categoryForm.nameAr}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value })}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-arabic text-right"
                  dir="rtl"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-brand-royal text-white rounded-xl text-xs font-bold"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
