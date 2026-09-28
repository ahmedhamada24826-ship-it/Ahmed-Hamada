"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
} from "lucide-react";

export default function AdminEducationPage() {
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [form, setForm] = useState({
    institutionEn: "",
    institutionAr: "",
    degreeEn: "",
    degreeAr: "",
    fieldEn: "",
    fieldAr: "",
    startDate: "2019",
    endDate: "2023",
    gradeEn: "Good",
    gradeAr: "جيد",
    descriptionEn: "",
    descriptionAr: "",
    order: 0,
    isVisible: true,
  });

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/education");
      const data = await res.json();
      if (data.education) setEducation(data.education);
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
        institutionEn: item.institutionEn,
        institutionAr: item.institutionAr,
        degreeEn: item.degreeEn,
        degreeAr: item.degreeAr,
        fieldEn: item.fieldEn,
        fieldAr: item.fieldAr,
        startDate: item.startDate,
        endDate: item.endDate,
        gradeEn: item.gradeEn || "",
        gradeAr: item.gradeAr || "",
        descriptionEn: item.descriptionEn || "",
        descriptionAr: item.descriptionAr || "",
        order: item.order || 0,
        isVisible: item.isVisible ?? true,
      });
    } else {
      setEditingItem(null);
      setForm({
        institutionEn: "",
        institutionAr: "",
        degreeEn: "",
        degreeAr: "",
        fieldEn: "",
        fieldAr: "",
        startDate: "2019",
        endDate: "2023",
        gradeEn: "Good",
        gradeAr: "جيد",
        descriptionEn: "",
        descriptionAr: "",
        order: education.length + 1,
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

      const res = await fetch("/api/admin/education", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadEducation();
      }
    } catch (err) {
      alert("Failed to save education record.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await fetch(`/api/admin/education?id=${id}`, { method: "DELETE" });
      setEducation(education.filter((e) => e.id !== id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-brand-light" />
            <span>Academic Qualifications &amp; Education</span>
          </h1>
          <p className="text-xs text-slate-400">
            Manage degree details, universities, graduation years, and academic honors.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education Record</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
          <span className="text-xs">Loading education...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-royal/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-800 text-brand-light">
                    {item.startDate} - {item.endDate}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">#{item.order}</span>
                </div>

                <h3 className="font-bold text-white text-base">{item.degreeEn}</h3>
                <h4 className="text-xs text-brand-light font-semibold">{item.institutionEn}</h4>
                <div className="text-[11px] text-slate-400 font-arabic">{item.institutionAr}</div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {item.descriptionEn}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-light hover:bg-slate-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.degreeEn)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
                {editingItem ? "Edit Education Record" : "Add Education Record"}
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
                    Degree Title (EN)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.degreeEn}
                    onChange={(e) => setForm({ ...form, degreeEn: e.target.value })}
                    placeholder="Bachelor's in Commerce"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-arabic">
                    الدرجة العلمية (بالعربية)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.degreeAr}
                    onChange={(e) => setForm({ ...form, degreeAr: e.target.value })}
                    placeholder="بكالوريوس التجارة"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-arabic text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Institution / University (EN)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.institutionEn}
                    onChange={(e) => setForm({ ...form, institutionEn: e.target.value })}
                    placeholder="Faculty of Commerce, Kafr El Sheikh University"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-arabic">
                    الجامعة / الكلية (بالعربية)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.institutionAr}
                    onChange={(e) => setForm({ ...form, institutionAr: e.target.value })}
                    placeholder="كلية التجارة - جامعة كفر الشيخ"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-arabic text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Start Year
                  </label>
                  <input
                    type="text"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

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
