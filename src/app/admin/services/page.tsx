"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { IconRenderer } from "@/components/IconRenderer";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  const [form, setForm] = useState({
    titleEn: "",
    titleAr: "",
    descriptionEn: "",
    descriptionAr: "",
    iconName: "BarChart3",
    ctaTextEn: "Request Service",
    ctaTextAr: "طلب الخدمة",
    ctaLink: "#contact",
    order: 0,
    isVisible: true,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.services) setServices(data.services);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: any) => {
    if (service) {
      setEditingService(service);
      setForm({
        titleEn: service.titleEn,
        titleAr: service.titleAr,
        descriptionEn: service.descriptionEn,
        descriptionAr: service.descriptionAr,
        iconName: service.iconName || "TrendingUp",
        ctaTextEn: service.ctaTextEn || "Request Service",
        ctaTextAr: service.ctaTextAr || "طلب الخدمة",
        ctaLink: service.ctaLink || "#contact",
        order: service.order || 0,
        isVisible: service.isVisible ?? true,
      });
    } else {
      setEditingService(null);
      setForm({
        titleEn: "",
        titleAr: "",
        descriptionEn: "",
        descriptionAr: "",
        iconName: "BarChart3",
        ctaTextEn: "Request Service",
        ctaTextAr: "طلب الخدمة",
        ctaLink: "#contact",
        order: services.length + 1,
        isVisible: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingService ? "PUT" : "POST";
      const body = editingService ? { id: editingService.id, ...form } : form;

      const res = await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadServices();
      }
    } catch (err) {
      alert("Failed to save service.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete service "${title}"?`)) return;
    try {
      await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-light" />
            <span>Professional Services Management</span>
          </h1>
          <p className="text-xs text-slate-400">
            Define your analytical services, Power BI consulting offerings, and training programs.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
          <span className="text-xs">Loading services...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-royal/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-brand-light flex items-center justify-center border border-slate-700">
                    <IconRenderer name={srv.iconName} className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">#{srv.order}</span>
                </div>

                <h3 className="font-bold text-white text-base">{srv.titleEn}</h3>
                <h4 className="font-arabic text-xs text-slate-400 font-semibold">{srv.titleAr}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {srv.descriptionEn}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-brand-light">{srv.ctaTextEn}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(srv)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-light hover:bg-slate-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id, srv.titleEn)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleSave}
            className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingService ? "Edit Service" : "Add New Service"}
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
                  Service Title (English)
                </label>
                <input
                  type="text"
                  required
                  value={form.titleEn}
                  onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                  placeholder="e.g. Business Intelligence & Dashboards"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 font-arabic">
                  عنوان الخدمة (بالعربية)
                </label>
                <input
                  type="text"
                  required
                  value={form.titleAr}
                  onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                  placeholder="مثال: تطوير لوحات تحكم ذكاء الأعمال"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-arabic text-right focus:outline-none"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Description (English)
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.descriptionEn}
                  onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 font-arabic">
                  الوصف (بالعربية)
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.descriptionAr}
                  onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-arabic text-right focus:outline-none"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Lucide Icon Name
                  </label>
                  <input
                    type="text"
                    value={form.iconName}
                    onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                    placeholder="BarChart3, LineChart, Filter"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
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
                className="px-4 py-2 bg-brand-royal text-white rounded-xl text-xs font-bold"
              >
                Save Service
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
