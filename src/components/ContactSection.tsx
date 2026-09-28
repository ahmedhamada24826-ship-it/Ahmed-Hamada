"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/SocialIcons";

interface ContactSectionProps {
  settings?: any;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const { language, t, isRtl } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "", // anti-spam
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const email = settings?.contactEmail || "ahmed.hamada@example.com";
  const phone = settings?.contactPhone || "+20 100 000 0000";
  const whatsapp = settings?.whatsapp || "+20 100 000 0000";
  const location = language === "ar" ? (settings?.locationAr || "مصر") : (settings?.locationEn || "Egypt");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // bot detected

    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setErrorMessage(
        language === "ar"
          ? "يرجى ملء جميع الحقول المطلوبة."
          : "Please fill in all required fields."
      );
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", honeypot: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || t.contact.errorDesc);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50/50 dark:bg-slate-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-royal/10 text-brand-royal dark:text-brand-light text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.sections.contactTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === "ar" ? "تواصل معي لمناقشة مشروعك القادم" : "Let's Connect & Turn Data Into Impact"}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {t.sections.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details Card */}
          <div className={`lg:col-span-5 space-y-6 ${isRtl ? "text-right" : "text-left"}`}>
            <div className="rounded-2xl glass-card p-8 space-y-6 border border-slate-200/60 dark:border-brand-light/15">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.contact.infoTitle}
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-royal/15 dark:bg-brand-royal/25 text-brand-royal dark:text-brand-light flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.contact.emailLabel}</div>
                    <a href={`mailto:${email}`} className="font-semibold text-slate-900 dark:text-white hover:text-brand-royal dark:hover:text-brand-light transition-colors">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-royal/15 dark:bg-brand-royal/25 text-brand-royal dark:text-brand-light flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.contact.phoneLabel}</div>
                    <a href={`tel:${phone}`} className="font-semibold text-slate-900 dark:text-white hover:text-brand-royal dark:hover:text-brand-light transition-colors font-mono">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-royal/15 dark:bg-brand-royal/25 text-brand-royal dark:text-brand-light flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.contact.location}</div>
                    <div className="font-semibold text-slate-900 dark:text-white">{location}</div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {language === "ar" ? "الشبكات المهنية:" : "Professional Channels:"}
                </div>
                <div className="flex items-center gap-3">
                  {settings?.linkedinUrl && (
                    <a
                      href={settings.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-royal hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <LinkedinIcon className="w-5 h-5" />
                    </a>
                  )}
                  {settings?.githubUrl && (
                    <a
                      href={settings.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-royal hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <GithubIcon className="w-5 h-5" />
                    </a>
                  )}
                  {whatsapp && (
                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl glass-card p-8 border border-slate-200/60 dark:border-brand-light/15 shadow-xl">
              
              {status === "success" ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {t.contact.successTitle}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
                    {t.contact.successDesc}
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 px-6 py-2.5 text-xs font-semibold bg-brand-royal text-white rounded-xl"
                  >
                    {language === "ar" ? "إرسال رسالة أخرى" : "Send Another Message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {status === "error" && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t.contact.name} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === "ar" ? "مثال: محمد علي" : "e.g. John Doe"}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-royal/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t.contact.email} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-royal/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.contact.subject}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={language === "ar" ? "استفسار بخصوص مشروع تحليلي" : "Project Inquiry / Consultation"}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-royal/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.contact.message} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={
                        language === "ar"
                          ? "اكتب تفاصيل استفسارك أو مشروعك هنا..."
                          : "Describe your project or inquiry..."
                      }
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-royal/40 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-royal to-brand-navy hover:from-blue-600 hover:to-brand-navy shadow-lg shadow-brand-royal/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{status === "loading" ? t.contact.sending : t.contact.send}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
