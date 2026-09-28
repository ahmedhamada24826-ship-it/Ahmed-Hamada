"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";
import {
  Award,
  ExternalLink,
  CheckCircle2,
  Eye,
  X,
  FileText,
  Sparkles,
} from "lucide-react";

interface CertificatesSectionProps {
  certificates: any[];
}

export function CertificatesSection({ certificates = [] }: CertificatesSectionProps) {
  const { language, t, isRtl } = useLanguage();
  const [selectedCert, setSelectedCert] = useState<any | null>(null);

  const visibleCerts = certificates.filter((c) => c.isVisible);

  return (
    <section id="certificates" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-royal/10 text-brand-royal dark:text-brand-light text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>{t.sections.certificatesTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === "ar" ? "الشهادات والاعتمادات التخصصية" : "Verified Credentials & Certifications"}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {t.sections.certificatesSubtitle}
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCerts.map((cert) => {
            const title = language === "ar" ? cert.titleAr : cert.titleEn;
            const issuer = language === "ar" ? cert.issuerAr : cert.issuerEn;
            const desc = language === "ar" ? cert.descriptionAr : cert.descriptionEn;
            const skillsArray = (cert.skills || "")
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);

            return (
              <div
                key={cert.id}
                className="group relative rounded-2xl glass-card p-6 hover:border-brand-royal/50 dark:hover:border-brand-light/40 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-brand-royal/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-navy to-brand-royal text-brand-light flex items-center justify-center shadow-md">
                      <Award className="w-6 h-6" />
                    </div>

                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                      {cert.issueDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-royal dark:group-hover:text-brand-light transition-colors mb-1.5">
                    {title}
                  </h3>

                  <div className="text-xs font-semibold text-brand-royal dark:text-brand-light mb-3">
                    {issuer}
                  </div>

                  {desc && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                      {desc}
                    </p>
                  )}

                  {/* Skills tags */}
                  {skillsArray.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {skillsArray.map((skill: string, sIdx: number) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-brand-royal/10 dark:bg-brand-royal/20 text-brand-royal dark:text-brand-light text-[10px] font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer with Modal Preview & Verification */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  {cert.imageUrl ? (
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-royal dark:text-brand-light hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.common.preview}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}

                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-royal dark:hover:text-brand-light transition-colors"
                    >
                      <span>{t.common.verify}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Certificate Preview Modal */}
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  {language === "ar" ? selectedCert.titleAr : selectedCert.titleEn}
                </h3>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedCert.imageUrl && (
                <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden bg-black">
                  <Image
                    src={selectedCert.imageUrl}
                    alt={selectedCert.titleEn}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                {selectedCert.verificationUrl && (
                  <a
                    href={selectedCert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-semibold bg-brand-royal text-white rounded-lg flex items-center gap-2"
                  >
                    <span>{t.common.verify}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  {t.common.close}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
