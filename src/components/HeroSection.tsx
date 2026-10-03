"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";
import {
  ArrowDown,
  FileDown,
  Sparkles,
  Mail,
  MessageCircle,
  Database,
  BarChart3,
  TrendingUp,
  FolderGit2,
  CheckCircle2,
} from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/SocialIcons";

interface HeroSectionProps {
  settings?: any;
  stats?: any[];
}

export function HeroSection({ settings, stats }: HeroSectionProps) {
  const { language, t, isRtl } = useLanguage();

  const title = language === "ar" ? (settings?.heroTitleAr || "أحمد حمادة") : (settings?.heroTitleEn || "Ahmed Hamada");
  const subheadline = language === "ar" 
    ? (settings?.heroSubheadlineAr || "محلل بيانات | مطور ذكاء الأعمال (BI) | مدرب تقني") 
    : (settings?.heroSubheadlineEn || "Data Analyst | BI Developer | Technical Instructor");
  const headline = language === "ar"
    ? (settings?.heroHeadlineAr || "تحويل البيانات إلى رؤى والرؤى إلى قرارات أعمال استراتيجية.")
    : (settings?.heroHeadlineEn || "Turning Data into Insights and Insights into Decisions.");
  const desc = language === "ar"
    ? (settings?.heroDescAr || "أقوم بتحويل البيانات الأولية المعقدة إلى رؤى قيّمة ولوحات تحكم تفاعلية تدعم اتخاذ قرارات دقيقة للأعمال.")
    : (settings?.heroDescEn || "I transform raw data into meaningful insights and interactive dashboards that support better business decisions.");
  
  const availabilityText = language === "ar"
    ? (settings?.availabilityTextAr || "متاح للمشاريع والخدمات الاستشارية والتدريب")
    : (settings?.availabilityTextEn || "Available for Projects & Consulting");

  const cvUrl = settings?.heroCvUrl || "/cv-ahmed-hamada.pdf";
  const photoUrl =
    settings?.heroPhotoUrl ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80";

  const defaultStats = [
    { label: language === "ar" ? "مشروع مكتمل" : "Completed Projects", value: "15+", icon: "FolderGit2" },
    { label: language === "ar" ? "أدوات وتقنيات متقنة" : "Technologies Mastered", value: "8+", icon: "Database" },
    { label: language === "ar" ? "ساعات تدريب وتحليل" : "Training & Analytics Hrs", value: "500+", icon: "BarChart3" },
  ];

  const displayStats = stats && stats.length > 0
    ? stats.filter(s => s.isVisible).map(s => ({
        label: language === "ar" ? s.labelAr : s.labelEn,
        value: s.value,
        icon: s.iconName || "Award",
      }))
    : defaultStats;

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Deep Navy to Dark Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-brand-royal/15 via-brand-navy/10 to-transparent blur-3xl opacity-70 rounded-full" />
        <div className="absolute -top-32 right-[-10%] w-[500px] h-[500px] bg-brand-light/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 left-[-10%] w-[450px] h-[450px] bg-brand-royal/10 blur-[100px] rounded-full" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content Column */}
          <div className={`lg:col-span-7 space-y-6 ${isRtl ? "text-right" : "text-left"}`}>
            
            {/* Availability Badge */}
            {settings?.heroAvailable !== false && (
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-medium">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>{availabilityText}</span>
              </div>
            )}

            {/* Professional Title & Name */}
            <div className="space-y-2">
              <div className="text-xs sm:text-sm md:text-base font-semibold tracking-wider uppercase text-brand-royal dark:text-brand-light flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-royal dark:text-brand-light" />
                <span>{subheadline}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {language === "ar" ? "أنا " : "I'm "}
                <span className="gradient-text">{title}</span>
              </h1>
            </div>

            {/* Main Headline */}
            <p className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-200 leading-snug">
              &ldquo;{headline}&rdquo;
            </p>

            {/* Short Introduction */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-brand-royal to-brand-navy hover:from-blue-600 hover:to-brand-navy rounded-xl shadow-lg shadow-brand-royal/25 hover:shadow-brand-royal/40 hover:-translate-y-0.5 transition-all flex items-center gap-2.5"
              >
                <BarChart3 className="w-5 h-5" />
                <span>{t.hero.viewProjects}</span>
              </a>

              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow hover:-translate-y-0.5 transition-all flex items-center gap-2.5"
              >
                <FileDown className="w-5 h-5 text-brand-royal dark:text-brand-light" />
                <span>{t.hero.downloadCv}</span>
              </a>

              <a
                href="#contact"
                className="px-5 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-royal dark:hover:text-brand-light rounded-xl transition-colors"
              >
                {t.hero.getInTouch}
              </a>
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-3 pt-3">
              {settings?.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-brand-royal hover:text-white dark:hover:bg-brand-royal text-slate-600 dark:text-slate-400 transition-colors shadow-sm"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              )}
              {settings?.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-brand-royal hover:text-white dark:hover:bg-brand-royal text-slate-600 dark:text-slate-400 transition-colors shadow-sm"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
              )}
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-600 dark:text-slate-400 transition-colors shadow-sm"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-brand-royal hover:text-white dark:hover:bg-brand-royal text-slate-600 dark:text-slate-400 transition-colors shadow-sm"
                  aria-label="Send Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Visual Showcase / Profile Card Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-royal via-brand-light to-brand-navy rounded-3xl blur-lg opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative rounded-2xl glass-card p-6 sm:p-8 overflow-hidden shadow-2xl border border-slate-200/50 dark:border-brand-light/15">
                <div className="relative aspect-[4/4.2] w-full rounded-xl overflow-hidden bg-gradient-to-b from-brand-navy to-brand-dark flex items-center justify-center border border-slate-700/40">
                  <Image
                    src={photoUrl}
                    alt={title}
                    fill
                    className="object-cover object-top"
                    priority
                  />

                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-brand-light/30 shadow-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-light" />
                    <span className="text-[11px] font-semibold text-white">BI & Analytics</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-royal dark:text-brand-light" />
                    {language === "ar" ? "خريج تجارة - كفر الشيخ" : "Faculty of Commerce, KFS"}
                  </span>
                  <span className="font-mono text-brand-royal dark:text-brand-light font-bold">
                    100% Data-Driven
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {settings?.showHeroStats !== false && (
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {displayStats.map((item, index) => (
                <div
                  key={index}
                  className="glass-card rounded-xl p-5 text-center flex flex-col items-center justify-center hover:border-brand-royal/40 transition-colors shadow-sm"
                >
                  <span className="text-3xl sm:text-4xl font-black text-brand-royal dark:text-brand-light tracking-tight font-mono">
                    {item.value}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
