"use client";

import React, { useState, useEffect } from "react";
import { Palette, Save, RotateCcw, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminThemePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const defaultPalette = {
    primaryColor: "#0B2D5B",
    royalColor: "#2563EB",
    lightColor: "#60A5FA",
    darkColor: "#0F172A",
    grayColor: "#E5E7EB",
  };

  const [colors, setColors] = useState(defaultPalette);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setColors({
            primaryColor: data.settings.primaryColor || defaultPalette.primaryColor,
            royalColor: data.settings.royalColor || defaultPalette.royalColor,
            lightColor: data.settings.lightColor || defaultPalette.lightColor,
            darkColor: data.settings.darkColor || defaultPalette.darkColor,
            grayColor: data.settings.grayColor || defaultPalette.grayColor,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(colors),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Failed to save theme colors.");
      }
    } catch (err) {
      alert("Error saving theme colors.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset to approved personal palette?")) {
      setColors(defaultPalette);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-400">
        <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
        <span className="text-xs">Loading theme palette...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between sticky top-16 z-20 bg-slate-950/90 backdrop-blur-md py-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Palette className="w-6 h-6 text-brand-light" />
            <span>Theme &amp; Visual Appearance</span>
          </h1>
          <p className="text-xs text-slate-400">
            Customize the approved brand color palette and visual tokens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-royal/20 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Theme</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Brand color palette saved successfully!</span>
        </div>
      )}

      {/* Palette Color Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          Approved Brand Color Palette
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Primary Navy */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div
              className="h-16 rounded-lg shadow-inner border border-white/10"
              style={{ backgroundColor: colors.primaryColor }}
            />
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">
                Primary Navy
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.primaryColor}
                  onChange={(e) =>
                    setColors({ ...colors, primaryColor: e.target.value })
                  }
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={colors.primaryColor}
                  onChange={(e) =>
                    setColors({ ...colors, primaryColor: e.target.value })
                  }
                  className="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>

          {/* Royal Blue */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div
              className="h-16 rounded-lg shadow-inner border border-white/10"
              style={{ backgroundColor: colors.royalColor }}
            />
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">
                Royal Blue
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.royalColor}
                  onChange={(e) =>
                    setColors({ ...colors, royalColor: e.target.value })
                  }
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={colors.royalColor}
                  onChange={(e) =>
                    setColors({ ...colors, royalColor: e.target.value })
                  }
                  className="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>

          {/* Light Blue */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div
              className="h-16 rounded-lg shadow-inner border border-white/10"
              style={{ backgroundColor: colors.lightColor }}
            />
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">
                Light Blue Accent
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.lightColor}
                  onChange={(e) =>
                    setColors({ ...colors, lightColor: e.target.value })
                  }
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={colors.lightColor}
                  onChange={(e) =>
                    setColors({ ...colors, lightColor: e.target.value })
                  }
                  className="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>

          {/* Dark Navy */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div
              className="h-16 rounded-lg shadow-inner border border-white/10"
              style={{ backgroundColor: colors.darkColor }}
            />
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">
                Dark Navy / Surface
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.darkColor}
                  onChange={(e) =>
                    setColors({ ...colors, darkColor: e.target.value })
                  }
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={colors.darkColor}
                  onChange={(e) =>
                    setColors({ ...colors, darkColor: e.target.value })
                  }
                  className="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>

          {/* Light Gray */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div
              className="h-16 rounded-lg shadow-inner border border-white/10"
              style={{ backgroundColor: colors.grayColor }}
            />
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">
                Light Gray
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.grayColor}
                  onChange={(e) =>
                    setColors({ ...colors, grayColor: e.target.value })
                  }
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={colors.grayColor}
                  onChange={(e) =>
                    setColors({ ...colors, grayColor: e.target.value })
                  }
                  className="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
