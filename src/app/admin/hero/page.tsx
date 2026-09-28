"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Save, Loader2, CheckCircle2, Image as ImageIcon, FileDown } from "lucide-react";
import { MediaPickerModal } from "@/components/MediaPickerModal";

export default function AdminHeroEditorPage() {
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
        alert("Failed to save hero settings.");
      }
    } catch (err) {
      alert("Error saving hero settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-400">
        <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
        <span className="text-xs">Loading hero content...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between sticky top-16 z-20 bg-slate-950/90 backdrop-blur-md py-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-light" />
            <span>Hero Section Editor</span>
          </h1>
          <p className="text-xs text-slate-400">
            Customize primary headline, introduction, profile photo, and CTAs.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-royal/20 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving Changes..." : "Save Hero Section"}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Hero section saved and updated live!</span>
        </div>
      )}

      {/* Visual / Profile Image Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          Profile Photo &amp; Visuals
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700 shrink-0 flex items-center justify-center">
            {formData.heroPhotoUrl ? (
              <Image
                src={formData.heroPhotoUrl}
                alt="Ahmed Hamada"
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-center p-2 text-slate-500 text-[10px]">
                Monogram Avatar Active
              </div>
            )}
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="px-4 py-2 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Upload / Select Profile Photo</span>
              </button>
              {formData.heroPhotoUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, heroPhotoUrl: null })}
                  className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-semibold"
                >
                  Use Monogram Wordmark
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Recommended aspect ratio: 1:1 square or 4:5 portrait. High resolution PNG or WebP.
            </p>
          </div>
        </div>
      </div>

      {/* Name and Professional Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          Name &amp; Professional Title
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Display Name (English)
            </label>
            <input
              type="text"
              value={formData.heroTitleEn || ""}
              onChange={(e) => setFormData({ ...formData, heroTitleEn: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              الاسم المعروض (بالعربية)
            </label>
            <input
              type="text"
              value={formData.heroTitleAr || ""}
              onChange={(e) => setFormData({ ...formData, heroTitleAr: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Professional Subheadline / Roles (English)
            </label>
            <input
              type="text"
              value={formData.heroSubheadlineEn || ""}
              onChange={(e) =>
                setFormData({ ...formData, heroSubheadlineEn: e.target.value })
              }
              placeholder="Data Analyst | BI Developer | Technical Instructor"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              المسمى المهني (بالعربية)
            </label>
            <input
              type="text"
              value={formData.heroSubheadlineAr || ""}
              onChange={(e) =>
                setFormData({ ...formData, heroSubheadlineAr: e.target.value })
              }
              placeholder="محلل بيانات | مطور ذكاء الأعمال | مدرب تقني"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Main Headline & Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          Main Headline &amp; Introduction
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Main Punchy Headline (English)
            </label>
            <textarea
              rows={2}
              value={formData.heroHeadlineEn || ""}
              onChange={(e) => setFormData({ ...formData, heroHeadlineEn: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              العنوان الرئيسي الملهم (بالعربية)
            </label>
            <textarea
              rows={2}
              value={formData.heroHeadlineAr || ""}
              onChange={(e) => setFormData({ ...formData, heroHeadlineAr: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Hero Short Description (English)
            </label>
            <textarea
              rows={3}
              value={formData.heroDescEn || ""}
              onChange={(e) => setFormData({ ...formData, heroDescEn: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              الوصف المختصر (بالعربية)
            </label>
            <textarea
              rows={3}
              value={formData.heroDescAr || ""}
              onChange={(e) => setFormData({ ...formData, heroDescAr: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Availability & CV Downloads */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          Availability Badge &amp; Downloadable CV
        </h2>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <input
            type="checkbox"
            id="heroAvailable"
            checked={formData.heroAvailable ?? true}
            onChange={(e) =>
              setFormData({ ...formData, heroAvailable: e.target.checked })
            }
            className="w-4 h-4 rounded text-brand-royal bg-slate-800 border-slate-700"
          />
          <label htmlFor="heroAvailable" className="text-xs font-bold text-white cursor-pointer">
            Show Green &quot;Available for Projects&quot; Pulse Indicator
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Availability Text (English)
            </label>
            <input
              type="text"
              value={formData.availabilityTextEn || ""}
              onChange={(e) =>
                setFormData({ ...formData, availabilityTextEn: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              نص التوفر (بالعربية)
            </label>
            <input
              type="text"
              value={formData.availabilityTextAr || ""}
              onChange={(e) =>
                setFormData({ ...formData, availabilityTextAr: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Downloadable CV File URL (PDF or Doc)
          </label>
          <input
            type="text"
            value={formData.heroCvUrl || ""}
            onChange={(e) => setFormData({ ...formData, heroCvUrl: e.target.value })}
            placeholder="/cv-ahmed-hamada.pdf or link to PDF"
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
          />
        </div>
      </div>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setFormData({ ...formData, heroPhotoUrl: url })}
        title="Select Hero Profile Picture"
        folder="profile"
      />
    </form>
  );
}
