"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { useTheme } from "@/components/ThemeContext";
import {
  Menu,
  X,
  Moon,
  Sun,
  Globe,
  FileDown,
  ShieldCheck,
  ChevronRight,
  BarChart2,
} from "lucide-react";

interface NavbarProps {
  settings?: any;
  navItems?: any[];
}

export function Navbar({ settings, navItems }: NavbarProps) {
  const { language, toggleLanguage, t, isRtl } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoText = settings?.logoText || "Ahmed Hamada";
  const cvUrl = settings?.heroCvUrl || "/cv-ahmed-hamada.pdf";

  const defaultNavLinks = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.skills, href: "#skills" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.certificates, href: "#certificates" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const links =
    navItems && navItems.length > 0
      ? navItems
          .filter((item) => item.isVisible)
          .map((item) => ({
            label: language === "ar" ? item.labelAr : item.labelEn,
            href: item.href,
            isExternal: item.isExternal,
          }))
      : defaultNavLinks;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-header shadow-lg shadow-black/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Personal Typographic Wordmark */}
        <Link
          href="/#home"
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-royal to-brand-navy flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform border border-brand-light/20">
            AH
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg md:text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-brand-royal dark:group-hover:text-brand-light transition-colors">
              {logoText}
            </span>
            <span className="text-[11px] font-medium tracking-wider text-brand-royal dark:text-brand-light uppercase">
              {language === "ar" ? "محلل بيانات وذكاء أعمال" : "Data Analyst & BI Developer"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-royal dark:hover:text-brand-light hover:bg-brand-royal/5 dark:hover:bg-brand-royal/10 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls & Utilities */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Download CV CTA */}
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-brand-royal to-brand-navy hover:from-blue-600 hover:to-brand-navy rounded-lg shadow-sm hover:shadow transition-all"
          >
            <FileDown className="w-4 h-4" />
            <span>{t.nav.downloadCv}</span>
          </a>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            title={language === "en" ? "تبديل إلى العربية" : "Switch to English"}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-royal dark:hover:text-brand-light bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <Globe className="w-4 h-4" />
            <span>{language === "en" ? "عربي" : "EN"}</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-royal dark:hover:text-brand-light bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Admin Login Link */}
          <Link
            href="/admin"
            title="Admin Dashboard"
            className="p-2 text-slate-500 hover:text-brand-royal dark:text-slate-400 dark:hover:text-brand-light rounded-lg transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleLanguage}
            className="p-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg"
          >
            {language === "en" ? "عربي" : "EN"}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden glass-header border-t border-slate-200 dark:border-slate-800 px-4 pt-4 pb-6 mt-3 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-brand-royal/10 hover:text-brand-royal dark:hover:text-brand-light rounded-lg transition-colors"
            >
              <span>{link.label}</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </a>
          ))}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-brand-royal hover:bg-blue-600 rounded-lg shadow-sm"
            >
              <FileDown className="w-4 h-4" />
              <span>{t.nav.downloadCv}</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 rounded-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.nav.admin}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
