"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Calendar,
  Layers,
  Database,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Workflow,
  Sparkles,
  Eye,
  X,
  Share2,
} from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";

interface ProjectDetailClientProps {
  project: any;
  relatedProjects: any[];
}

export function ProjectDetailClient({ project, relatedProjects }: ProjectDetailClientProps) {
  const { language, t, isRtl } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const title = language === "ar" ? project.titleAr : project.titleEn;
  const overview = language === "ar" ? project.overviewAr : project.overviewEn;
  const businessProblem = language === "ar" ? project.businessProblemAr : project.businessProblemEn;
  const objectives = language === "ar" ? project.objectivesAr : project.objectivesEn;
  const datasetDesc = language === "ar" ? project.datasetDescAr : project.datasetDescEn;
  const dataSource = language === "ar" ? project.dataSourceAr : project.dataSourceEn;
  const methodology = language === "ar" ? project.methodologyAr : project.methodologyEn;
  const keyFindings = language === "ar" ? project.keyFindingsAr : project.keyFindingsEn;
  const recommendations = language === "ar" ? project.recommendationsAr : project.recommendationsEn;

  const toolsArray = (project.toolsAndTech || "")
    .split(",")
    .map((item: string) => item.trim())
    .filter(Boolean);

  let secondaryImagesList: string[] = [];
  try {
    if (project.secondaryImages) {
      secondaryImagesList = JSON.parse(project.secondaryImages);
    }
  } catch {
    secondaryImagesList = [];
  }

  const allImages = [project.coverImage, ...secondaryImagesList].filter(Boolean);

  const objectiveItems = (objectives || "")
    .split("\n")
    .map((line: string) => line.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean);

  const findingItems = (keyFindings || "")
    .split("\n")
    .map((line: string) => line.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean);

  const recommendationItems = (recommendations || "")
    .split("\n")
    .map((line: string) => line.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean);

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-royal dark:text-brand-light hover:underline"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t.projects.backToProjects}</span>
        </Link>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-royal/10 dark:bg-brand-royal/20 text-brand-royal dark:text-brand-light font-mono">
          {project.categoryName || "Case Study"}
        </span>
      </div>

      {/* Project Title Header */}
      <div className="space-y-4 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.2]">
          {title}
        </h1>

        {/* Tools and Technologies Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {toolsArray.map((tool: string, idx: number) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium shadow-sm"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {project.liveDemoUrl && (
          <a
            href={project.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-brand-royal hover:bg-blue-600 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{t.projects.liveDemo}</span>
          </a>
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <GithubIcon className="w-4 h-4" />
            <span>{t.projects.sourceCode}</span>
          </a>
        )}
      </div>

      {/* Hero Cover Image Showcase */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden glass-card border border-slate-200/60 dark:border-slate-700/60 shadow-2xl">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={title}
            fill
            className="object-cover cursor-pointer"
            onClick={() => setSelectedImage(project.coverImage)}
            priority
          />
        )}
        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-1.5 cursor-pointer" onClick={() => setSelectedImage(project.coverImage)}>
          <Eye className="w-3.5 h-3.5" />
          <span>{t.common.openModal}</span>
        </div>
      </div>

      {/* Main Case Study Layout: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left / Main Content Body */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Executive Overview */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-royal dark:text-brand-light" />
              <span>{language === "ar" ? "نظرة عامة على المشروع" : "Project Overview"}</span>
            </h2>
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {overview}
            </div>
          </section>

          {/* Business Problem & Challenge */}
          <section className="rounded-2xl p-6 sm:p-7 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-3">
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>{t.projects.businessProblem}</span>
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {businessProblem}
            </p>
          </section>

          {/* Project Objectives */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-royal dark:text-brand-light" />
              <span>{t.projects.objectives}</span>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {objectiveItems.map((obj: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                >
                  <span className="w-5 h-5 rounded-full bg-brand-royal/20 text-brand-royal dark:text-brand-light flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                    {obj}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Analysis Methodology */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-brand-royal dark:text-brand-light" />
              <span>{t.projects.methodology}</span>
            </h3>
            <div className="rounded-2xl glass-card p-6 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {methodology}
            </div>
          </section>

          {/* Key Findings & Insights */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-brand-royal dark:text-brand-light" />
              <span>{t.projects.keyFindings}</span>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {findingItems.map((finding: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20"
                >
                  <CheckCircle2 className="w-5 h-5 text-brand-royal dark:text-brand-light shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                    {finding}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Strategic Business Recommendations */}
          <section className="rounded-2xl p-6 sm:p-7 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-4">
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <span>{t.projects.recommendations}</span>
            </h3>
            <div className="space-y-2.5">
              {recommendationItems.map((rec: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Image Gallery */}
          {allImages.length > 1 && (
            <section className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.projects.gallery}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allImages.map((imgUrl: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer group hover:scale-[1.02] transition-transform"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Screenshot ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-6 h-6" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Right Sticky Sidebar: Dataset info & specs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-28 space-y-6">
            
            {/* Metadata Card */}
            <div className="rounded-2xl glass-card p-6 border border-slate-200 dark:border-slate-700 space-y-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {language === "ar" ? "تفاصيل دراسة الحالة" : "Case Study Summary"}
              </h4>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-xs">
                    {language === "ar" ? "التصنيف" : "Category"}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {project.categoryName || "Business Intelligence"}
                  </span>
                </div>

                {dataSource && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">
                      {language === "ar" ? "مصدر البيانات" : "Data Source"}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {dataSource}
                    </span>
                  </div>
                )}

                {datasetDesc && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">
                      {language === "ar" ? "حجم وطبيعة البيانات" : "Dataset Scope"}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 text-xs">
                      {datasetDesc}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Related Projects Card */}
            {relatedProjects.length > 0 && (
              <div className="rounded-2xl glass-card p-6 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.projects.relatedProjects}
                </h4>

                <div className="space-y-3">
                  {relatedProjects.map((rel: any) => (
                    <Link
                      key={rel.id}
                      href={`/projects/${rel.slug}`}
                      className="block p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 hover:bg-brand-royal/10 dark:hover:bg-brand-royal/20 transition-colors border border-transparent hover:border-brand-royal/30"
                    >
                      <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                        {language === "ar" ? rel.titleAr : rel.titleEn}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                        {rel.categoryName}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Lightbox Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-5xl w-full h-[85vh] flex flex-col justify-center items-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Enlarged screenshot"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </article>
  );
}
