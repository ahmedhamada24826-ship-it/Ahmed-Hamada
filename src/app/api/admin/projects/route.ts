import { NextRequest, NextResponse } from "next/server";
import { verifyRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await verifyRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
      include: { category: true },
    });

    return NextResponse.json({ projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    let slug = body.slug ? slugify(body.slug) : slugify(body.titleEn || "project");
    if (!slug) slug = `project-${Date.now()}`;

    // Ensure unique slug
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    let resolvedCategoryId: string | null = null;
    if (body.categoryId && typeof body.categoryId === "string" && body.categoryId.trim() !== "") {
      const catExists = await prisma.category.findUnique({
        where: { id: body.categoryId.trim() },
      });
      if (catExists) {
        resolvedCategoryId = catExists.id;
      }
    }

    if (!resolvedCategoryId && body.categoryName) {
      const catByName = await prisma.category.findFirst({
        where: {
          OR: [
            { nameEn: body.categoryName },
            { nameAr: body.categoryName },
            { slug: slugify(body.categoryName) },
          ],
        },
      });
      if (catByName) {
        resolvedCategoryId = catByName.id;
      }
    }

    const project = await prisma.project.create({
      data: {
        slug: uniqueSlug,
        titleEn: body.titleEn || "Untitled Project",
        titleAr: body.titleAr || "مشروع جديد",
        shortDescEn: body.shortDescEn || "",
        shortDescAr: body.shortDescAr || "",
        overviewEn: body.overviewEn || "",
        overviewAr: body.overviewAr || "",
        businessProblemEn: body.businessProblemEn || "",
        businessProblemAr: body.businessProblemAr || "",
        objectivesEn: body.objectivesEn || "",
        objectivesAr: body.objectivesAr || "",
        datasetDescEn: body.datasetDescEn || "",
        datasetDescAr: body.datasetDescAr || "",
        dataSourceEn: body.dataSourceEn || "",
        dataSourceAr: body.dataSourceAr || "",
        toolsAndTech: body.toolsAndTech || "",
        methodologyEn: body.methodologyEn || "",
        methodologyAr: body.methodologyAr || "",
        keyFindingsEn: body.keyFindingsEn || "",
        keyFindingsAr: body.keyFindingsAr || "",
        recommendationsEn: body.recommendationsEn || "",
        recommendationsAr: body.recommendationsAr || "",
        coverImage: body.coverImage || "",
        secondaryImages: body.secondaryImages ? JSON.stringify(body.secondaryImages) : "[]",
        tags: body.tags || "",
        categoryName: body.categoryName || "Data Analysis",
        categoryId: resolvedCategoryId,
        githubUrl: body.githubUrl || null,
        liveDemoUrl: body.liveDemoUrl || null,
        videoUrl: body.videoUrl || null,
        downloadFileUrl: body.downloadFileUrl || null,
        isFeatured: Boolean(body.isFeatured),
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
        order: Number(body.order) || 0,
        seoTitleEn: body.seoTitleEn || null,
        seoTitleAr: body.seoTitleAr || null,
        seoDescEn: body.seoDescEn || null,
        seoDescAr: body.seoDescAr || null,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("Create Project Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
