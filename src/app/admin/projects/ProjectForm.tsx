"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  Trash2,
  Plus,
  Loader2,
  Sparkles,
  ExternalLink,
  Globe,
} from "lucide-react";
import { MediaPickerModal } from "@/components/MediaPickerModal";
import { slugify } from "@/lib/utils";

interface ProjectFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"cover" | "gallery">("cover");

  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    titleEn: initialData?.titleEn || "",
    titleAr: initialData?.titleAr || "",
    categoryName: initialData?.categoryName || "Business Intelligence",
    categoryId: initialData?.categoryId || "",
    tags: initialData?.tags || "Power BI, SQL, DAX",
    shortDescEn: initialData?.shortDescEn || "",
    shortDescAr: initialData?.shortDescAr || "",
    overviewEn: initialData?.overviewEn || "",
    overviewAr: initialData?.overviewAr || "",
    businessProblemEn: initialData?.businessProblemEn || "",
    businessProblemAr: initialData?.businessProblemAr || "",
    objectivesEn: initialData?.objectivesEn || "",
    objectivesAr: initialData?.objectivesAr || "",
    datasetDescEn: initialData?.datasetDescEn || "",
    datasetDescAr: initialData?.datasetDescAr || "",
    dataSourceEn: initialData?.dataSourceEn || "",
    dataSourceAr: initialData?.dataSourceAr || "",
    toolsAndTech: initialData?.toolsAndTech || "",
    methodologyEn: initialData?.methodologyEn || "",
    methodologyAr: initialData?.methodologyAr || "",
    keyFindingsEn: initialData?.keyFindingsEn || "",
    keyFindingsAr: initialData?.keyFindingsAr || "",
    recommendationsEn: initialData?.recommendationsEn || "",
    recommendationsAr: initialData?.recommendationsAr || "",
    coverImage: initialData?.coverImage || "",
    secondaryImages: (() => {
      try {
        if (!initialData?.secondaryImages) return [];
        return typeof initialData.secondaryImages === "string"
          ? JSON.parse(initialData.secondaryImages)
          : initialData.secondaryImages;
      } catch {
        return [];
      }
    })(),
    githubUrl: initialData?.githubUrl || "",
    liveDemoUrl: initialData?.liveDemoUrl || "",
    videoUrl: initialData?.videoUrl || "",
    downloadFileUrl: initialData?.downloadFileUrl || "",
    isFeatured: initialData?.isFeatured ?? false,
    isPublished: initialData?.isPublished ?? true,
    order: initialData?.order ?? 0,
    seoTitleEn: initialData?.seoTitleEn || "",
    seoDescEn: initialData?.seoDescEn || "",
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(console.error);
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      titleEn: val,
      slug: !isEdit && !prev.slug ? slugify(val) : prev.slug,
    }));
  };

  const handleMediaSelect = (url: string) => {
    if (mediaTarget === "cover") {
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } else {
      setFormData((prev) => ({
        ...prev,
        secondaryImages: [...prev.secondaryImages, url],
      }));
    }
  };

  const removeGalleryImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      secondaryImages: prev.secondaryImages.filter((_: any, i: number) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit
        ? `/api/admin/projects/${initialData.id}`
        : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save project");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between sticky top-16 z-20 bg-slate-950/90 backdrop-blur-md py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">
              {isEdit ? "Edit Project Case Study" : "Create New Project"}
            </h1>
            <p className="text-[11px] text-slate-400">
              Manage complete case study content, analytics findings, and media.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-royal/20 transition-all"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isEdit ? "Update Project" : "Save Project"}</span>
        </button>
      </div>

      {/* Basic Info Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          1. Basic Details &amp; Metadata
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Project Title (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.titleEn}
              onChange={handleTitleChange}
              placeholder="e.g. Retail Sales Performance & BI Dashboard"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-royal"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              عنوان المشروع (بالعربية) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.titleAr}
              onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
              placeholder="مثال: لوحة تحكم تنفيذية لأداء مبيعات التجزئة"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-royal font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              URL Slug (Unique shareable path)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
              placeholder="retail-sales-executive-bi"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            >
              <option value="Business Intelligence">Business Intelligence</option>
              <option value="Data Analysis">Data Analysis</option>
              <option value="Data Modeling & ETL">Data Modeling & ETL</option>
              <option value="Python Analytics">Python Analytics</option>
              {categories.map((c) => (
                <option key={c.id} value={c.nameEn}>
                  {c.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Display Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Tools &amp; Technologies (Used in Case Study)
            </label>
            <input
              type="text"
              value={formData.toolsAndTech}
              onChange={(e) => setFormData({ ...formData, toolsAndTech: e.target.value })}
              placeholder="Power BI, DAX, SQL, Power Query, Star Schema"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Tags / Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Power BI, SQL, Dashboard, Forecasting"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Short Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Short Summary Card (English)
            </label>
            <textarea
              rows={3}
              value={formData.shortDescEn}
              onChange={(e) => setFormData({ ...formData, shortDescEn: e.target.value })}
              placeholder="Brief summary appearing on project cards..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              الملخص القصير (بالعربية)
            </label>
            <textarea
              rows={3}
              value={formData.shortDescAr}
              onChange={(e) => setFormData({ ...formData, shortDescAr: e.target.value })}
              placeholder="ملخص موجز يظهر في بطاقة المشروع..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Case Study Details Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          2. Full Case Study Sections
        </h2>

        {/* Full Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Executive Overview (English)
            </label>
            <textarea
              rows={4}
              value={formData.overviewEn}
              onChange={(e) => setFormData({ ...formData, overviewEn: e.target.value })}
              placeholder="Full comprehensive background of the project..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              نظرة عامة على دراسة الحالة (بالعربية)
            </label>
            <textarea
              rows={4}
              value={formData.overviewAr}
              onChange={(e) => setFormData({ ...formData, overviewAr: e.target.value })}
              placeholder="شرح متكامل لخلفية المشروع وسياقه..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Business Problem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Business Problem &amp; Pain Points (English)
            </label>
            <textarea
              rows={4}
              value={formData.businessProblemEn}
              onChange={(e) => setFormData({ ...formData, businessProblemEn: e.target.value })}
              placeholder="What business challenge was this project built to solve?"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              المشكلة التجارية والتحديات (بالعربية)
            </label>
            <textarea
              rows={4}
              value={formData.businessProblemAr}
              onChange={(e) => setFormData({ ...formData, businessProblemAr: e.target.value })}
              placeholder="ما هي المشكلة التجارية التي جاء المشروع لحلها؟"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Project Objectives (Bullet points or lines)
            </label>
            <textarea
              rows={4}
              value={formData.objectivesEn}
              onChange={(e) => setFormData({ ...formData, objectivesEn: e.target.value })}
              placeholder="• Integrate multiple sales data sources&#10;• Build automated DAX KPI measures"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              أهداف المشروع (بالعربية)
            </label>
            <textarea
              rows={4}
              value={formData.objectivesAr}
              onChange={(e) => setFormData({ ...formData, objectivesAr: e.target.value })}
              placeholder="• دمج مصادر البيانات المتعددة&#10;• بناء مؤشرات أداء ذكية عبر DAX"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Methodology */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Analysis Methodology &amp; Steps (English)
            </label>
            <textarea
              rows={4}
              value={formData.methodologyEn}
              onChange={(e) => setFormData({ ...formData, methodologyEn: e.target.value })}
              placeholder="Step 1: Data ETL in Power Query...&#10;Step 2: Star Schema modeling..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              منهجية وخطوات التحليل (بالعربية)
            </label>
            <textarea
              rows={4}
              value={formData.methodologyAr}
              onChange={(e) => setFormData({ ...formData, methodologyAr: e.target.value })}
              placeholder="الخطوة 1: معالجة البيانات عبر Power Query...&#10;الخطوة 2: بناء هيكل البيانات..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Key Findings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Key Findings &amp; Insights (English)
            </label>
            <textarea
              rows={4}
              value={formData.keyFindingsEn}
              onChange={(e) => setFormData({ ...formData, keyFindingsEn: e.target.value })}
              placeholder="• Finding 1: 20% of products produce 80% of revenue..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              أبرز النتائج والرؤى المستخرجة (بالعربية)
            </label>
            <textarea
              rows={4}
              value={formData.keyFindingsAr}
              onChange={(e) => setFormData({ ...formData, keyFindingsAr: e.target.value })}
              placeholder="• النتيجة 1: 20% فقط من المنتجات تحقق 80% من الأرباح..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Strategic Recommendations (English)
            </label>
            <textarea
              rows={4}
              value={formData.recommendationsEn}
              onChange={(e) => setFormData({ ...formData, recommendationsEn: e.target.value })}
              placeholder="• Recommendation 1: Shift marketing spend toward..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-arabic">
              التوصيات الاستراتيجية للأعمال (بالعربية)
            </label>
            <textarea
              rows={4}
              value={formData.recommendationsAr}
              onChange={(e) => setFormData({ ...formData, recommendationsAr: e.target.value })}
              placeholder="• التوصية 1: إعادة توجيه الميزانيات التسويقية نحو..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-arabic text-right"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Media & Gallery Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          3. Cover Image &amp; Dashboard Gallery
        </h2>

        {/* Main Cover Image */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">
            Main Cover Image URL
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-40 aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
              {formData.coverImage ? (
                <Image
                  src={formData.coverImage}
                  alt="Cover Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                  No Cover
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 w-full">
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://... or click Choose from Media"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setMediaTarget("cover");
                  setMediaPickerOpen(true);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-brand-light rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Choose / Upload Cover Image</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Gallery Images */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">
              Additional Screenshots &amp; Gallery Images ({formData.secondaryImages.length})
            </label>
            <button
              type="button"
              onClick={() => {
                setMediaTarget("gallery");
                setMediaPickerOpen(true);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-brand-light rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Image</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {formData.secondaryImages.map((imgUrl: string, idx: number) => (
              <div
                key={idx}
                className="group relative aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700"
              >
                <Image src={imgUrl} alt={`Gallery ${idx}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* External Links & Publication Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-brand-light uppercase tracking-wider">
          4. Links, Featured Status &amp; Publication
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Live Demo / Dashboard URL
            </label>
            <input
              type="url"
              value={formData.liveDemoUrl}
              onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
              placeholder="https://app.powerbi.com/view?r=..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              GitHub Repository URL
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/ahmed-hamada/sales-bi"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 rounded text-brand-royal bg-slate-800 border-slate-700"
            />
            <span className="text-xs font-bold text-white">Publish Immediately</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 rounded text-brand-royal bg-slate-800 border-slate-700"
            />
            <span className="text-xs font-bold text-white">Feature on Home Page</span>
          </label>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        title={mediaTarget === "cover" ? "Select Cover Image" : "Select Gallery Image"}
        folder="projects"
      />
    </form>
  );
}
