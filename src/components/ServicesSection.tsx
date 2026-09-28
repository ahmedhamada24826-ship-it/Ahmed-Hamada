"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageContext";
import { IconRenderer } from "@/components/IconRenderer";
import { ArrowRight, ArrowLeft, Briefcase, CheckCircle } from "lucide-react";

interface ServicesSectionProps {
  services: any[];
}

export function ServicesSection({ services = [] }: ServicesSectionProps) {
  const { language, t, isRtl } = useLanguage();

  const visibleServices = services.filter((s) => s.isVisible);

  return (
    <section id="services" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-royal/10 text-brand-royal dark:text-brand-light text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t.sections.servicesTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === "ar" ? "كيف يمكنني مساعدتك ودعم أعمالك؟" : "Tailored Business Intelligence & Analytics Solutions"}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {t.sections.servicesSubtitle}
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleServices.map((service, index) => {
            const title = language === "ar" ? service.titleAr : service.titleEn;
            const desc = language === "ar" ? service.descriptionAr : service.descriptionEn;
            const ctaText = language === "ar" 
              ? (service.ctaTextAr || "طلب الخدمة") 
              : (service.ctaTextEn || "Request Service");
            const ctaLink = service.ctaLink || "#contact";

            return (
              <div
                key={service.id || index}
                className="group relative rounded-2xl glass-card p-7 hover:border-brand-royal/50 dark:hover:border-brand-light/40 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-brand-royal/10 flex flex-col justify-between"
              >
                <div>
                  {/* Icon Circle */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-navy to-brand-royal text-white flex items-center justify-center mb-6 shadow-md shadow-brand-navy/30 group-hover:scale-105 transition-transform">
                    <IconRenderer name={service.iconName} className="w-7 h-7 text-brand-light" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-royal dark:group-hover:text-brand-light transition-colors mb-3 leading-snug">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {desc}
                  </p>
                </div>

                {/* Card CTA Link */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <a
                    href={ctaLink}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-royal dark:text-brand-light hover:text-blue-700 dark:hover:text-white transition-colors"
                  >
                    <span>{ctaText}</span>
                    {isRtl ? (
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    )}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
