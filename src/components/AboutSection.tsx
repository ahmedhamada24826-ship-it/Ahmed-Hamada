"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";
import {
  GraduationCap,
  Award,
  CheckCircle2,
  FileDown,
  Sparkles,
  BookOpen,
  Briefcase,
  Terminal,
} from "lucide-react";

interface AboutSectionProps {
  settings?: any;
}

export function AboutSection({ settings }: AboutSectionProps) {
  const { language, t, isRtl } = useLanguage();

  const bio = language === "ar" ? settings?.aboutBioAr : settings?.aboutBioEn;
  const highlights = language === "ar" ? settings?.aboutHighlightsAr : settings?.aboutHighlightsEn;
  const cvUrl = settings?.aboutCvUrl || settings?.heroCvUrl || "/cv-ahmed-hamada.pdf";
  const photoUrl = settings?.aboutPhotoUrl || settings?.heroPhotoUrl;

  const highlightLines = (highlights || "")
    .split("\n")
    .map((line: string) => line.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean);

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background visual elements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-royal/10 text-brand-royal dark:text-brand-light text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.sections.aboutTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === "ar" ? "شغف بالبيانات، رؤى تصنع الفارق" : "Passionate About Data & Business Impact"}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {t.sections.aboutSubtitle}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative rounded-2xl glass-card p-6 shadow-xl border border-slate-200/50 dark:border-brand-light/15 overflow-hidden">
                <div className="relative aspect-[4/4.5] rounded-xl overflow-hidden bg-gradient-to-tr from-brand-navy via-slate-900 to-brand-dark flex items-center justify-center border border-slate-700/50">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt="Ahmed Hamada"
                      fill
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <div className="w-20 h-20 rounded-2xl bg-brand-royal/20 border border-brand-royal/40 flex items-center justify-center text-brand-light">
                        <Terminal className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Ahmed Hamada</h4>
                        <p className="text-xs text-brand-light">Data Analyst & BI Developer</p>
                      </div>
                      <div className="p-3 bg-brand-navy/60 rounded-xl border border-brand-royal/20 text-xs text-slate-300 text-left w-full space-y-1 font-mono">
                        <div><span className="text-blue-400">&gt;</span> degree: <span className="text-emerald-400">&apos;Commerce (KFS)&apos;</span></div>
                        <div><span className="text-blue-400">&gt;</span> specialization: <span className="text-emerald-400">&apos;BI &amp; Analytics&apos;</span></div>
                        <div><span className="text-blue-400">&gt;</span> tools: <span className="text-emerald-400">[&apos;Power BI&apos;, &apos;SQL&apos;, &apos;Python&apos;]</span></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <GraduationCap className="w-4 h-4 text-brand-royal dark:text-brand-light" />
                    {language === "ar" ? "جامعة كفر الشيخ" : "Kafr El Sheikh Univ"}
                  </span>
                  <span className="font-semibold text-emerald-500">Verified Credentials</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Key Points Column */}
          <div className={`lg:col-span-7 space-y-6 ${isRtl ? "text-right" : "text-left"}`}>
            
            {/* Rich Bio */}
            <div className="prose dark:prose-invert max-w-none text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
              {bio}
            </div>

            {/* Highlights List */}
            {highlightLines.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-brand-royal dark:text-brand-light">
                  {language === "ar" ? "أبرز المحطات والركائز:" : "Core Pillars & Highlights:"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {highlightLines.map((line: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-brand-royal/30 transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5 text-brand-royal dark:text-brand-light shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Download CV CTA */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-sm font-semibold text-white bg-brand-royal hover:bg-blue-600 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                <span>{t.hero.downloadCv}</span>
              </a>
              <a
                href="#experience"
                className="px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                {language === "ar" ? "استعراض المسار المهني" : "Explore Experience"}
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
