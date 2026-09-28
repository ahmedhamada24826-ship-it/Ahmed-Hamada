"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { IconRenderer } from "@/components/IconRenderer";
import { Sparkles, Layers, Cpu } from "lucide-react";

interface SkillsSectionProps {
  skills: any[];
  categories: any[];
}

export function SkillsSection({ skills = [], categories = [] }: SkillsSectionProps) {
  const { language, t, isRtl } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const visibleSkills = skills.filter((s) => s.isVisible);

  // Extract unique category names
  const categoryList = [
    { id: "all", name: language === "ar" ? "الكل" : "All Technologies" },
    ...categories.map((c) => ({
      id: c.slug || c.nameEn,
      name: language === "ar" ? c.nameAr : c.nameEn,
      rawNameEn: c.nameEn,
    })),
  ];

  // If no category records exist, infer from skills
  if (categories.length === 0) {
    const rawSet = Array.from(new Set(visibleSkills.map((s) => s.categoryName)));
    rawSet.forEach((cat) => {
      if (cat) {
        categoryList.push({
          id: cat,
          name: cat,
          rawNameEn: cat,
        });
      }
    });
  }

  const filteredSkills =
    activeCategory === "all"
      ? visibleSkills
      : visibleSkills.filter((s) => {
          const matchCat = categories.find((c) => c.slug === activeCategory);
          if (matchCat) {
            return s.categoryName === matchCat.nameEn || s.categoryId === matchCat.id;
          }
          return s.categoryName === activeCategory;
        });

  return (
    <section id="skills" className="py-20 bg-slate-50/50 dark:bg-slate-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-royal/10 text-brand-royal dark:text-brand-light text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>{t.sections.skillsTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === "ar" ? "التقنيات والأدوات التحليلية" : "Technical Stack & Analytics Toolkit"}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {t.sections.skillsSubtitle}
          </p>
        </div>

        {/* Category Tabs */}
        {categoryList.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categoryList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? "bg-brand-royal text-white shadow-md shadow-brand-royal/20 scale-105"
                    : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredSkills.map((skill) => {
            const skillName = language === "ar" ? skill.nameAr : skill.nameEn;
            const skillDesc = language === "ar" ? skill.descriptionAr : skill.descriptionEn;

            return (
              <div
                key={skill.id}
                className="group relative rounded-2xl glass-card p-5 hover:border-brand-royal/50 dark:hover:border-brand-light/40 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-brand-royal/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-navy/80 to-brand-royal/20 dark:from-brand-royal/20 dark:to-brand-light/10 flex items-center justify-center text-brand-royal dark:text-brand-light border border-brand-royal/20 group-hover:scale-110 transition-transform">
                      <IconRenderer name={skill.iconName} className="w-6 h-6" />
                    </div>
                    {skill.proficiency && (
                      <span className="text-xs font-mono font-bold text-brand-royal dark:text-brand-light px-2.5 py-1 rounded-full bg-brand-royal/10 dark:bg-brand-royal/20">
                        {skill.proficiency}%
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-royal dark:group-hover:text-brand-light transition-colors">
                    {skillName}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {skillDesc || skill.categoryName}
                  </p>
                </div>

                {/* Proficiency Track */}
                {skill.proficiency && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brand-royal to-brand-light h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
