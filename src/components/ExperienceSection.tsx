"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageContext";
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface ExperienceSectionProps {
  experience: any[];
}

export function ExperienceSection({ experience = [] }: ExperienceSectionProps) {
  const { language, t, isRtl } = useLanguage();

  const visibleExp = experience.filter((e) => e.isVisible);

  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-royal/10 text-brand-royal dark:text-brand-light text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t.sections.experienceTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === "ar" ? "المسار والخبرات المهنية" : "Professional Career & Milestones"}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {t.sections.experienceSubtitle}
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-32 space-y-10 pl-6 md:pl-8">
          {visibleExp.map((item, idx) => {
            const org = language === "ar" ? item.organizationAr : item.organizationEn;
            const pos = language === "ar" ? item.positionAr : item.positionEn;
            const desc = language === "ar" ? item.descriptionAr : item.descriptionEn;
            const loc = language === "ar" ? item.locationAr : item.locationEn;
            const dateStr = item.isCurrent
              ? `${item.startDate} - ${t.common.present}`
              : `${item.startDate} - ${item.endDate || ""}`;

            return (
              <div key={item.id || idx} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-brand-navy border-4 border-brand-royal dark:border-brand-light shadow-md group-hover:scale-125 transition-transform" />

                {/* Timeline Card */}
                <div className="rounded-2xl glass-card p-6 md:p-7 hover:border-brand-royal/40 dark:hover:border-brand-light/30 transition-all shadow-sm group-hover:shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-royal dark:text-brand-light px-3 py-1 rounded-full bg-brand-royal/10 dark:bg-brand-royal/20">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </span>

                    {item.isCurrent && (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        {language === "ar" ? "الدور الحالي" : "Current Role"}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {pos}
                  </h3>

                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-brand-royal dark:text-brand-light mt-1 mb-4">
                    <span>{org}</span>
                    {loc && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-500 font-normal">
                          <MapPin className="w-3.5 h-3.5" />
                          {loc}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
