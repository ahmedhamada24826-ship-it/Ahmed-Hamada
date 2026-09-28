"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Loader2, CheckCircle2, Globe, Sparkles } from "lucide-react";

export default function AdminSettingsPage() {
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
        alert("Failed to save settings.");
      }
    } catch (err) {
      alert("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-400">
        <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
        <span className="text-xs">Loading website settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between sticky top-16 z-20 bg-slate-950/90 backdrop-blur-md py-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-light" />
            <span>Website Settings &amp; Branding</span>
          </h1>
          <p className="text-xs text-slate-400">
            Configure site title, logo wordmark, contact information, and section visibility.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-royal/20 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Website settings updated successfully!</span>
        </div>
      )}

      {/* Brand Identity & Wordmark */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          1. Brand Identity &amp; Wordmark
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Personal Wordmark / Logo Text
            </label>
            <input
              type="text"
              value={formData.logoText || ""}
              onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
              placeholder="Ahmed Hamada"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Browser / Tab Title (English)
            </label>
            <input
              type="text"
              value={formData.siteTitleEn || ""}
              onChange={(e) => setFormData({ ...formData, siteTitleEn: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              عنوان تبويب المتصفح (بالعربية)
            </label>
            <input
              type="text"
              value={formData.siteTitleAr || ""}
              onChange={(e) => setFormData({ ...formData, siteTitleAr: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Internal Site Name
            </label>
            <input
              type="text"
              value={formData.siteName || ""}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Social & Contact Channels */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          2. Social Channels &amp; Contact Info
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail || ""}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.contactPhone || ""}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              WhatsApp Number
            </label>
            <input
              type="text"
              value={formData.whatsapp || ""}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={formData.linkedinUrl || ""}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              GitHub Profile URL
            </label>
            <input
              type="url"
              value={formData.githubUrl || ""}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Kaggle / Portfolio Profile URL
            </label>
            <input
              type="url"
              value={formData.kaggleUrl || ""}
              onChange={(e) => setFormData({ ...formData, kaggleUrl: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section Visibility Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          3. Section Visibility Toggles
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            { key: "showHeroStats", label: "Hero Statistics" },
            { key: "showSkills", label: "Skills Section" },
            { key: "showServices", label: "Services Section" },
            { key: "showFeaturedProjects", label: "Projects Section" },
            { key: "showExperience", label: "Experience Section" },
            { key: "showEducation", label: "Education Section" },
            { key: "showCertificates", label: "Certificates Section" },
            { key: "showContact", label: "Contact Section" },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer hover:border-brand-royal/40 transition-colors"
            >
              <input
                type="checkbox"
                checked={formData[item.key] ?? true}
                onChange={(e) =>
                  setFormData({ ...formData, [item.key]: e.target.checked })
                }
                className="w-4 h-4 rounded text-brand-royal bg-slate-800 border-slate-700"
              />
              <span className="text-xs font-semibold text-slate-200">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Footer Text */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          4. Footer Copyright &amp; Notes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Footer Text (English)
            </label>
            <input
              type="text"
              value={formData.footerTextEn || ""}
              onChange={(e) => setFormData({ ...formData, footerTextEn: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              نص التذييل (بالعربية)
            </label>
            <input
              type="text"
              value={formData.footerTextAr || ""}
              onChange={(e) => setFormData({ ...formData, footerTextAr: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
