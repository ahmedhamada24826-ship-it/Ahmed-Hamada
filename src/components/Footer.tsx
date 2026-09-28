"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import {
  ArrowUp,
  Mail,
  MessageCircle,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/SocialIcons";

interface FooterProps {
  settings?: any;
}

export function Footer({ settings }: FooterProps) {
  const { language, t, isRtl } = useLanguage();

  const logoText = settings?.logoText || "Ahmed Hamada";
  const footerText =
    language === "ar"
      ? (settings?.footerTextAr || "© 2026 أحمد حمادة. جميع الحقوق محفوظة. محلل بيانات ومطور ذكاء الأعمال.")
      : (settings?.footerTextEn || "© 2026 Ahmed Hamada. All rights reserved. Data Analyst & BI Developer.");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070D1E] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Typographic Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-royal to-brand-navy flex items-center justify-center text-white font-bold text-lg shadow-md border border-brand-light/20">
              AH
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                {logoText}
              </span>
              <span className="text-[11px] font-medium text-brand-royal dark:text-brand-light uppercase">
                {language === "ar" ? "محلل بيانات وذكاء أعمال" : "Data Analyst & BI Developer"}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#home" className="hover:text-brand-royal dark:hover:text-brand-light transition-colors">{t.nav.home}</a>
            <a href="#about" className="hover:text-brand-royal dark:hover:text-brand-light transition-colors">{t.nav.about}</a>
            <a href="#skills" className="hover:text-brand-royal dark:hover:text-brand-light transition-colors">{t.nav.skills}</a>
            <a href="#services" className="hover:text-brand-royal dark:hover:text-brand-light transition-colors">{t.nav.services}</a>
            <a href="#projects" className="hover:text-brand-royal dark:hover:text-brand-light transition-colors">{t.nav.projects}</a>
            <a href="#experience" className="hover:text-brand-royal dark:hover:text-brand-light transition-colors">{t.nav.experience}</a>
            <a href="#certificates" className="hover:text-brand-royal dark:hover:text-brand-light transition-colors">{t.nav.certificates}</a>
            <a href="#contact" className="hover:text-brand-royal dark:hover:text-brand-light transition-colors">{t.nav.contact}</a>
          </div>

          {/* Socials & Back to Top */}
          <div className="flex items-center gap-3">
            {settings?.linkedinUrl && (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-brand-royal dark:hover:text-brand-light hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {settings?.githubUrl && (
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-brand-royal dark:hover:text-brand-light hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={scrollToTop}
              title="Back to top"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-royal dark:hover:text-brand-light hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ml-2"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>{footerText}</p>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 hover:text-brand-royal dark:hover:text-brand-light transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === "ar" ? "إدارة الموقع" : "Admin CMS"}</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
