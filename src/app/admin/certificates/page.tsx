"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Award,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  ExternalLink,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { MediaPickerModal } from "@/components/MediaPickerModal";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [form, setForm] = useState({
    titleEn: "",
    titleAr: "",
    issuerEn: "",
    issuerAr: "",
    issueDate: "2024",
    credentialId: "",
    verificationUrl: "",
    imageUrl: "",
    descriptionEn: "",
    descriptionAr: "",
    skills: "Power BI, SQL, Python",
    isFeatured: true,
    isVisible: true,
    order: 0,
  });

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/certificates");
      const data = await res.json();
      if (data.certificates) setCertificates(data.certificates);
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
        titleEn: item.titleEn,
        titleAr: item.titleAr,
        issuerEn: item.issuerEn,
        issuerAr: item.issuerAr,
        issueDate: item.issueDate,
        credentialId: item.credentialId || "",
        verificationUrl: item.verificationUrl || "",
        imageUrl: item.imageUrl || "",
        descriptionEn: item.descriptionEn || "",
        descriptionAr: item.descriptionAr || "",
        skills: item.skills || "",
        isFeatured: item.isFeatured ?? true,
        isVisible: item.isVisible ?? true,
        order: item.order || 0,
      });
    } else {
      setEditingItem(null);
      setForm({
        titleEn: "",
        titleAr: "",
        issuerEn: "",
        issuerAr: "",
        issueDate: "2024",
        credentialId: "",
        verificationUrl: "",
        imageUrl: "",
        descriptionEn: "",
        descriptionAr: "",
        skills: "Power BI, SQL",
        isFeatured: true,
        isVisible: true,
        order: certificates.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem ? { id: editingItem.id, ...form } : form;

      const res = await fetch("/api/admin/certificates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadCertificates();
      }
    } catch (err) {
      alert("Failed to save certificate.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete certificate "${name}"?`)) return;
    try {
      await fetch(`/api/admin/certificates?id=${id}`, { method: "DELETE" });
      setCertificates(certificates.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-brand-light" />
            <span>Certificates &amp; Credentials Management</span>
          </h1>
          <p className="text-xs text-slate-400">
            Add verified credentials, certificates, verification links, and certificate previews.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Certificate</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
          <span className="text-xs">Loading certificates...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-royal/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-brand-light flex items-center justify-center border border-slate-700">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {cert.issueDate}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">{cert.titleEn}</h3>
                  <h4 className="font-arabic text-xs text-slate-400 font-semibold mt-0.5">
                    {cert.titleAr}
                  </h4>
                  <div className="text-xs text-brand-light font-medium mt-1">
                    {cert.issuerEn}
                  </div>
                </div>

                {cert.imageUrl && (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                    <Image src={cert.imageUrl} alt={cert.titleEn} fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                {cert.verificationUrl ? (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-brand-light hover:underline flex items-center gap-1"
                  >
                    <span>Verify Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-emerald-400">Verified</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(cert)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-light hover:bg-slate-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id, cert.titleEn)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleSave}
            className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingItem ? "Edit Certificate" : "Add New Certificate"}
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
                  Certificate Title (EN)
                </label>
                <input
                  type="text"
                  required
                  value={form.titleEn}
                  onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                  placeholder="e.g. Microsoft Certified: Power BI Data Analyst Associate"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 font-arabic">
                  اسم الشهادة (بالعربية)
                </label>
                <input
                  type="text"
                  required
                  value={form.titleAr}
                  onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                  placeholder="مثال: شهادة محلل بيانات Power BI معتمد"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-arabic text-right"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Issuer (EN)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.issuerEn}
                    onChange={(e) => setForm({ ...form, issuerEn: e.target.value })}
                    placeholder="Microsoft"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-arabic">
                    الجهة المصدرة (بالعربية)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.issuerAr}
                    onChange={(e) => setForm({ ...form, issuerAr: e.target.value })}
                    placeholder="مايكروسوفت"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-arabic text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Issue Year / Date
                  </label>
                  <input
                    type="text"
                    value={form.issueDate}
                    onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                    placeholder="2024"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    value={form.credentialId}
                    onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
                    placeholder="PL-300-XXXX"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Online Verification URL
                </label>
                <input
                  type="url"
                  value={form.verificationUrl}
                  onChange={(e) => setForm({ ...form, verificationUrl: e.target.value })}
                  placeholder="https://learn.microsoft.com/..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Certificate Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://... or choose file"
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-brand-light rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Related Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="Power BI, DAX, SQL"
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
                Save Certificate
              </button>
            </div>
          </form>
        </div>
      )}

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setForm({ ...form, imageUrl: url })}
        title="Select Certificate Image"
        folder="certificates"
      />
    </div>
  );
}
