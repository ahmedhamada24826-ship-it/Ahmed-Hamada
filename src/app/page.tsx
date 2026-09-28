import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { EducationSection } from "@/components/EducationSection";
import { CertificatesSection } from "@/components/CertificatesSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch database records
  const [
    settings,
    categories,
    skills,
    services,
    projects,
    experience,
    education,
    certificates,
    statistics,
    navItems,
  ] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default_settings" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
      include: { category: true },
    }),
    prisma.service.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      include: { category: true },
    }),
    prisma.experience.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    prisma.education.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    prisma.certificate.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    prisma.statistic.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    prisma.navigationItem.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-royal/30 selection:text-brand-light">
      <Navbar settings={settings} navItems={navItems} />

      <HeroSection settings={settings} stats={statistics} />

      {settings?.showSkills !== false && (
        <SkillsSection skills={skills} categories={categories} />
      )}

      {settings?.showServices !== false && (
        <ServicesSection services={services} />
      )}

      {settings?.showFeaturedProjects !== false && (
        <ProjectsSection projects={projects} categories={categories} />
      )}

      {settings?.showExperience !== false && (
        <ExperienceSection experience={experience} />
      )}

      <AboutSection settings={settings} />

      {settings?.showEducation !== false && (
        <EducationSection education={education} />
      )}

      {settings?.showCertificates !== false && (
        <CertificatesSection certificates={certificates} />
      )}

      {settings?.showContact !== false && (
        <ContactSection settings={settings} />
      )}

      <Footer settings={settings} />
    </main>
  );
}
