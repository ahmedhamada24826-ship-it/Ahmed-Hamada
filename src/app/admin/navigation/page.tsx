"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
} from "lucide-react";

export default function AdminNavigationPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [form, setForm] = useState({
    labelEn: "",
    labelAr: "",
    href: "#",
    order: 0,
    isVisible: true,
    isExternal: false,
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/navigation");
      const data = await res.json();
      if (data.items) setItems(data.items);
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
        labelEn: item.labelEn,
        labelAr: item.labelAr,
        href: item.href,
        order: item.order || 0,
        isVisible: item.isVisible ?? true,
        isExternal: item.isExternal ?? false,
      });
    } else {
      setEditingItem(null);
      setForm({
        labelEn: "",
        labelAr: "",
        href: "#",
        order: items.length + 1,
        isVisible: true,
        isExternal: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem ? { id: editingItem.id, ...form } : form;

      const res = await fetch("/api/admin/navigation", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadItems();
      }
    } catch (err) {
      alert("Failed to save navigation item.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete nav item "${name}"?`)) return;
    try {
      await fetch(`/api/admin/navigation?id=${id}`, { method: "DELETE" });
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const toggleVisibility = async (item: any) => {
    try {
      const res = await fetch("/api/admin/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, isVisible: !item.isVisible }),
      });
      if (res.ok) {
        setItems(
          items.map((i) =>
            i.id === item.id ? { ...i, isVisible: !i.isVisible } : i
          )
        );
      }
    } catch (err) {
      alert("Failed to toggle visibility.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Menu className="w-6 h-6 text-brand-light" />
            <span>Navigation Menu Manager</span>
          </h1>
          <p className="text-xs text-slate-400">
            Customize header links, bilingual labels, target sections, and order.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Navigation Link</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
          <span className="text-xs">Loading navigation links...</span>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Label (EN)</th>
                <th className="p-4">Label (AR)</th>
                <th className="p-4">Target (Href)</th>
                <th className="p-4">Order</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white text-sm">{item.labelEn}</td>
                  <td className="p-4 font-arabic text-slate-300">{item.labelAr}</td>
                  <td className="p-4 font-mono text-brand-light">{item.href}</td>
                  <td className="p-4 font-mono text-slate-400">#{item.order}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleVisibility(item)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        item.isVisible
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {item.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{item.isVisible ? "Visible" : "Hidden"}</span>
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-light hover:bg-slate-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.labelEn)}
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
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleSave}
            className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingItem ? "Edit Link" : "Add Link"}
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
                  Label (English)
                </label>
                <input
                  type="text"
                  required
                  value={form.labelEn}
                  onChange={(e) => setForm({ ...form, labelEn: e.target.value })}
                  placeholder="e.g. Projects"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 font-arabic">
                  اسم الرابط (بالعربية)
                </label>
                <input
                  type="text"
                  required
                  value={form.labelAr}
                  onChange={(e) => setForm({ ...form, labelAr: e.target.value })}
                  placeholder="المشاريع"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-arabic text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Target Link (Href)
                </label>
                <input
                  type="text"
                  required
                  value={form.href}
                  onChange={(e) => setForm({ ...form, href: e.target.value })}
                  placeholder="#projects or /link"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
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
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
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
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
