"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageContext";
import { GraduationCap, Calendar, Award, BookOpen } from "lucide-react";

interface EducationSectionProps {
  education: any[];
}

export function EducationSection({ education = [] }: EducationSectionProps) {
  const { language, t, isRtl } = useLanguage();

  const visibleEdu = education.filter((e) => e.isVisible);

  return (
    <section id="education" className="py-20 bg-slate-50/50 dark:bg-slate-900/30 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-royal/10 text-brand-royal dark:text-brand-light text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t.sections.educationTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === "ar" ? "التعليم والمؤهلات الأكاديمية" : "Academic Background & Foundation"}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {t.sections.educationSubtitle}
          </p>
        </div>

        {/* Education Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleEdu.map((edu, idx) => {
            const inst = language === "ar" ? edu.institutionAr : edu.institutionEn;
            const degree = language === "ar" ? edu.degreeAr : edu.degreeEn;
            const field = language === "ar" ? edu.fieldAr : edu.fieldEn;
            const grade = language === "ar" ? edu.gradeAr : edu.gradeEn;
            const desc = language === "ar" ? edu.descriptionAr : edu.descriptionEn;

            return (
              <div
                key={edu.id || idx}
                className="group rounded-2xl glass-card p-7 hover:border-brand-royal/40 dark:hover:border-brand-light/30 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-royal/15 dark:bg-brand-royal/25 text-brand-royal dark:text-brand-light flex items-center justify-center">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-royal dark:group-hover:text-brand-light transition-colors mb-1">
                    {degree}
                  </h3>

                  <div className="text-sm font-semibold text-brand-royal dark:text-brand-light mb-1">
                    {inst}
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {field} {grade ? `• ${language === "ar" ? "التقدير:" : "Grade:"} ${grade}` : ""}
                  </div>

                  {desc && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
