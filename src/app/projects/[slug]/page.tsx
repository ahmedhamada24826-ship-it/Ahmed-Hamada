import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectDetailClient } from "./ProjectDetailClient";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    return { title: "Project Not Found | Ahmed Hamada" };
  }

  return {
    title: `${project.titleEn} | Ahmed Hamada Case Study`,
    description: project.shortDescEn || project.overviewEn,
    openGraph: {
      title: project.titleEn,
      description: project.shortDescEn,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  const [project, settings, navItems, relatedProjects] = await Promise.all([
    prisma.project.findUnique({
      where: { slug },
      include: { category: true },
    }),
    prisma.siteSettings.findUnique({ where: { id: "default_settings" } }),
    prisma.navigationItem.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    prisma.project.findMany({
      where: {
        isPublished: true,
        slug: { not: slug },
      },
      take: 3,
      orderBy: { order: "asc" },
    }),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-royal/30 selection:text-brand-light">
      <Navbar settings={settings} navItems={navItems} />
      
      <div className="pt-24 flex-grow">
        <ProjectDetailClient project={project} relatedProjects={relatedProjects} />
      </div>

      <Footer settings={settings} />
    </main>
  );
}
