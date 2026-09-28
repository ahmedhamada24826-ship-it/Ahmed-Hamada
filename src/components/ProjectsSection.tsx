"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import {
  FolderGit2,
  ExternalLink,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Layers,
  ChevronRight,
} from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";

interface ProjectsSectionProps {
  projects: any[];
  categories: any[];
}

export function ProjectsSection({
  projects = [],
  categories = [],
}: ProjectsSectionProps) {
  const { language, t, isRtl } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const publishedProjects = projects.filter((p) => p.isPublished);

  const categoryList = [
    { id: "all", name: t.projects.allCategories },
    ...categories.map((c) => ({
      id: c.slug || c.nameEn,
      name: language === "ar" ? c.nameAr : c.nameEn,
    })),
  ];

  const filteredProjects = publishedProjects.filter((project) => {
    const title = language === "ar" ? project.titleAr : project.titleEn;
    const desc = language === "ar" ? project.shortDescAr : project.shortDescEn;
    const tags = project.tags || "";

    const matchesSearch =
      searchQuery.trim() === "" ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tags.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" ||
      project.categoryName === activeCategory ||
      (project.category && project.category.slug === activeCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="projects" className="py-20 bg-slate-50/50 dark:bg-slate-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-royal/10 text-brand-royal dark:text-brand-light text-xs font-semibold uppercase tracking-wider">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>{t.sections.projectsTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === "ar" ? "دراسات حالة ومشاريع تحليلية" : "Analytical Projects & Case Studies"}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {t.sections.projectsSubtitle}
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categoryList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? "bg-brand-royal text-white shadow-md shadow-brand-royal/20"
                    : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-3" : "left-3"}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "ar" ? "بحث في المشاريع أو التقنيات..." : "Search projects or tools..."}
              className={`w-full py-2 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/40 ${isRtl ? "pr-9 pl-3" : "pl-9 pr-3"}`}
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {language === "ar" ? "لم يتم العثور على مشاريع مطابقة للبحث." : "No projects found matching the criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProjects.map((project) => {
              const title = language === "ar" ? project.titleAr : project.titleEn;
              const shortDesc = language === "ar" ? project.shortDescAr : project.shortDescEn;
              const tagsArray = (project.tags || "")
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean);

              return (
                <div
                  key={project.id}
                  className="group relative rounded-2xl glass-card overflow-hidden hover:border-brand-royal/50 dark:hover:border-brand-light/40 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-brand-royal/10 flex flex-col justify-between"
                >
                  <div>
                    {/* Project Cover Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-800">
                      {project.coverImage ? (
                        <Image
                          src={project.coverImage}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-navy to-brand-dark text-slate-500">
                          <FolderGit2 className="w-12 h-12 text-brand-light/30" />
                        </div>
                      )}

                      {/* Featured Tag Badge */}
                      {project.isFeatured && (
                        <div className="absolute top-3 left-3 bg-brand-royal/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-md">
                          <Sparkles className="w-3 h-3" />
                          <span>{language === "ar" ? "مميز" : "Featured"}</span>
                        </div>
                      )}

                      {/* Category Label */}
                      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                        {project.categoryName || "Analytics"}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      {/* Tech Tag Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {tagsArray.slice(0, 3).map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-brand-royal/10 dark:bg-brand-royal/20 text-brand-royal dark:text-brand-light text-[11px] font-mono font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {tagsArray.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-mono">
                            +{tagsArray.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-royal dark:group-hover:text-brand-light transition-colors line-clamp-1 mb-2">
                        {title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    {/* View Details Link */}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-royal dark:text-brand-light hover:text-blue-700 dark:hover:text-white transition-colors"
                    >
                      <span>{t.projects.viewDetails}</span>
                      {isRtl ? (
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      ) : (
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      )}
                    </Link>

                    {/* Quick External Icons */}
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="GitHub Repository"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-royal dark:hover:text-brand-light hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Live Demo / Report"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-royal dark:hover:text-brand-light hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
