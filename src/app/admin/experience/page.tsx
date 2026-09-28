"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  Briefcase,
  MapPin,
} from "lucide-react";

export default function AdminExperiencePage() {
  const [experience, setExperience] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [form, setForm] = useState({
    organizationEn: "",
    organizationAr: "",
    positionEn: "",
    positionAr: "",
    type: "work",
    descriptionEn: "",
    descriptionAr: "",
    startDate: "2023",
    endDate: "",
    isCurrent: false,
    locationEn: "Egypt",
    locationAr: "مصر",
    order: 0,
    isVisible: true,
  });

  useEffect(() => {
    loadExperience();
  }, []);

  const loadExperience = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/experience");
      const data = await res.json();
      if (data.experience) setExperience(data.experience);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setForm({
        organizationEn: item.organizationEn,
        organizationAr: item.organizationAr,
        positionEn: item.positionEn,
        positionAr: item.positionAr,
        type: item.type || "work",
        descriptionEn: item.descriptionEn || "",
        descriptionAr: item.descriptionAr || "",
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        isCurrent: Boolean(item.isCurrent),
        locationEn: item.locationEn || "Egypt",
        locationAr: item.locationAr || "مصر",
        order: item.order || 0,
        isVisible: item.isVisible ?? true,
      });
    } else {
      setEditingItem(null);
      setForm({
        organizationEn: "",
        organizationAr: "",
        positionEn: "",
        positionAr: "",
        type: "work",
        descriptionEn: "",
        descriptionAr: "",
        startDate: "2023",
        endDate: "",
        isCurrent: false,
        locationEn: "Egypt",
        locationAr: "مصر",
        order: experience.length + 1,
        isVisible: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem ? { id: editingItem.id, ...form } : form;

      const res = await fetch("/api/admin/experience", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadExperience();
      }
    } catch (err) {
      alert("Failed to save experience.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await fetch(`/api/admin/experience?id=${id}`, { method: "DELETE" });
      setExperience(experience.filter((e) => e.id !== id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-brand-light" />
            <span>Professional Career &amp; Experience Timeline</span>
          </h1>
          <p className="text-xs text-slate-400">
            Manage work experience, freelance consulting, instruction, and workshops.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Record</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
          <span className="text-xs">Loading experience...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-brand-royal/40 transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-base">{item.positionEn}</span>
                  {item.isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      Current
                    </span>
                  )}
                </div>

                <div className="text-xs text-brand-light font-semibold flex items-center gap-2">
                  <span>{item.organizationEn}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-400">
                    {item.startDate} - {item.isCurrent ? "Present" : item.endDate || ""}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 max-w-3xl">
                  {item.descriptionEn}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="p-2 rounded-xl text-slate-400 hover:text-brand-light bg-slate-800 hover:bg-slate-700"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.positionEn)}
                  className="p-2 rounded-xl text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleSave}
            className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingItem ? "Edit Experience Record" : "Add Experience Record"}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Position Title (EN)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.positionEn}
                    onChange={(e) => setForm({ ...form, positionEn: e.target.value })}
                    placeholder="Data Analyst"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-arabic">
                    المسمى الوظيفي (بالعربية)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.positionAr}
                    onChange={(e) => setForm({ ...form, positionAr: e.target.value })}
                    placeholder="محلل بيانات"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-arabic text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Organization (EN)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.organizationEn}
                    onChange={(e) => setForm({ ...form, organizationEn: e.target.value })}
                    placeholder="Company / Freelance"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-arabic">
                    المؤسسة / جهة العمل (بالعربية)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.organizationAr}
                    onChange={(e) => setForm({ ...form, organizationAr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-arabic text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Start Date / Year
                  </label>
                  <input
                    type="text"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    placeholder="2023"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    End Date / Year
                  </label>
                  <input
                    type="text"
                    disabled={form.isCurrent}
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    placeholder="2024"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono disabled:opacity-40"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isCurrent}
                  onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-royal bg-slate-800 border-slate-700"
                />
                <span>Current Role (Ongoing)</span>
              </label>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Description (EN)
                </label>
                <textarea
                  rows={3}
                  value={form.descriptionEn}
                  onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 font-arabic">
                  الوصف (بالعربية)
                </label>
                <textarea
                  rows={3}
                  value={form.descriptionAr}
                  onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-arabic text-right"
                  dir="rtl"
                />
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
                className="px-4 py-2 bg-brand-royal text-white rounded-xl text-xs font-bold"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
