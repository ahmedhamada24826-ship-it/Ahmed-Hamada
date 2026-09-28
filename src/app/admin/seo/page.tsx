"use client";

import React, { useState, useEffect } from "react";
import { Search, Save, Loader2, CheckCircle2, Globe } from "lucide-react";

export default function AdminSeoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<any>({});

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
        alert("Failed to save SEO settings.");
      }
    } catch (err) {
      alert("Error saving SEO settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-400">
        <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
        <span className="text-xs">Loading SEO configuration...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between sticky top-16 z-20 bg-slate-950/90 backdrop-blur-md py-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Search className="w-6 h-6 text-brand-light" />
            <span>Search Engine Optimization (SEO) &amp; Social Sharing</span>
          </h1>
          <p className="text-xs text-slate-400">
            Configure meta keywords, search descriptions, and OpenGraph social preview tags.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-royal/20 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving Changes..." : "Save SEO Settings"}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>SEO settings updated successfully!</span>
        </div>
      )}

      {/* Meta Descriptions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          Search Engine Descriptions (Meta Description)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Meta Description (English)
            </label>
            <textarea
              rows={4}
              value={formData.seoDescEn || ""}
              onChange={(e) => setFormData({ ...formData, seoDescEn: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              الوصف لمحركات البحث (بالعربية)
            </label>
            <textarea
              rows={4}
              value={formData.seoDescAr || ""}
              onChange={(e) => setFormData({ ...formData, seoDescAr: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-arabic text-right focus:outline-none"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Meta Keywords */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          Meta Keywords &amp; Search Tags
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Keywords (English, comma-separated)
            </label>
            <textarea
              rows={3}
              value={formData.seoKeywordsEn || ""}
              onChange={(e) => setFormData({ ...formData, seoKeywordsEn: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              الكلمات الدلالية (بالعربية، مفصولة بفواصل)
            </label>
            <textarea
              rows={3}
              value={formData.seoKeywordsAr || ""}
              onChange={(e) => setFormData({ ...formData, seoKeywordsAr: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-arabic text-right focus:outline-none"
              dir="rtl"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
