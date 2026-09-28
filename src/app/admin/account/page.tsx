"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, Mail, User, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminAccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setForm((prev) => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
          }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (!form.currentPassword) {
      setMessage({ type: "error", text: "Current password is required to save changes." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update account");
      }

      setMessage({ type: "success", text: "Account credentials updated successfully!" });
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-400">
        <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
        <span className="text-xs">Loading admin account...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto pb-16">
      <div className="flex items-center justify-between sticky top-16 z-20 bg-slate-950/90 backdrop-blur-md py-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-light" />
            <span>Admin Account &amp; Security</span>
          </h1>
          <p className="text-xs text-slate-400">
            Manage your administrative email address, display name, and password.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-royal/20 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Account Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          Profile Information
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Admin Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Admin Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          Change Password
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Current Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              placeholder="Enter current password to verify identity"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              New Password (Leave blank to keep current)
            </label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
