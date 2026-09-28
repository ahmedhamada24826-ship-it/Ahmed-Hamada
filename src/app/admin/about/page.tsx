"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User, Save, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { MediaPickerModal } from "@/components/MediaPickerModal";

export default function AdminAboutEditorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setFormData(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Failed to save About settings.");
      }
    } catch (err) {
      alert("Error saving About settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-400">
        <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
        <span className="text-xs">Loading about content...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between sticky top-16 z-20 bg-slate-950/90 backdrop-blur-md py-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-brand-light" />
            <span>About Me Section Editor</span>
          </h1>
          <p className="text-xs text-slate-400">
            Edit professional biography, key career highlights, and background credentials.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-royal/20 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving Changes..." : "Save About Section"}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>About Me section saved and updated live!</span>
        </div>
      )}

      {/* Biography */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          Professional Biography
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Biography (English)
            </label>
            <textarea
              rows={6}
              value={formData.aboutBioEn || ""}
              onChange={(e) => setFormData({ ...formData, aboutBioEn: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              السيرة المهنية (بالعربية)
            </label>
            <textarea
              rows={6}
              value={formData.aboutBioAr || ""}
              onChange={(e) => setFormData({ ...formData, aboutBioAr: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right leading-relaxed"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          Career Highlights &amp; Bullet Points
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Highlights (English - Each line is a bullet item)
            </label>
            <textarea
              rows={5}
              value={formData.aboutHighlightsEn || ""}
              onChange={(e) =>
                setFormData({ ...formData, aboutHighlightsEn: e.target.value })
              }
              placeholder="• Faculty of Commerce, Kafr El Sheikh University&#10;• Expert in Power BI & DAX"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              الركائز والمحطات البارزة (بالعربية - كل سطر عنصر نقطي)
            </label>
            <textarea
              rows={5}
              value={formData.aboutHighlightsAr || ""}
              onChange={(e) =>
                setFormData({ ...formData, aboutHighlightsAr: e.target.value })
              }
              placeholder="• خريج كلية التجارة - جامعة كفر الشيخ&#10;• خبير في Power BI و DAX و SQL"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Secondary Image for About Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          About Section Custom Image
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center">
            {formData.aboutPhotoUrl ? (
              <Image
                src={formData.aboutPhotoUrl}
                alt="About Photo"
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-center p-2 text-slate-500 text-[10px]">
                Default Hero/Wordmark Used
              </div>
            )}
          </div>

          <div className="space-y-3 flex-1">
            <button
              type="button"
              onClick={() => setMediaPickerOpen(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-brand-light rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Choose / Upload Custom About Image</span>
            </button>
            {formData.aboutPhotoUrl && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, aboutPhotoUrl: null })}
                className="ml-2 px-3 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setFormData({ ...formData, aboutPhotoUrl: url })}
        title="Select About Section Image"
        folder="about"
      />
    </form>
  );
}
