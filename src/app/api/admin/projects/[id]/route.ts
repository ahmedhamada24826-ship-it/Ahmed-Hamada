import { NextRequest, NextResponse } from "next/server";
import { verifyRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await verifyRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await verifyRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    let newSlug = body.slug ? slugify(body.slug) : undefined;
    if (newSlug) {
      const existing = await prisma.project.findFirst({
        where: { slug: newSlug, id: { not: id } },
      });
      if (existing) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(newSlug ? { slug: newSlug } : {}),
        titleEn: body.titleEn,
        titleAr: body.titleAr,
        shortDescEn: body.shortDescEn,
        shortDescAr: body.shortDescAr,
        overviewEn: body.overviewEn,
        overviewAr: body.overviewAr,
        businessProblemEn: body.businessProblemEn,
        businessProblemAr: body.businessProblemAr,
        objectivesEn: body.objectivesEn,
        objectivesAr: body.objectivesAr,
        datasetDescEn: body.datasetDescEn,
        datasetDescAr: body.datasetDescAr,
        dataSourceEn: body.dataSourceEn,
        dataSourceAr: body.dataSourceAr,
        toolsAndTech: body.toolsAndTech,
        methodologyEn: body.methodologyEn,
        methodologyAr: body.methodologyAr,
        keyFindingsEn: body.keyFindingsEn,
        keyFindingsAr: body.keyFindingsAr,
        recommendationsEn: body.recommendationsEn,
        recommendationsAr: body.recommendationsAr,
        coverImage: body.coverImage,
        secondaryImages: Array.isArray(body.secondaryImages)
          ? JSON.stringify(body.secondaryImages)
          : body.secondaryImages,
        tags: body.tags,
        categoryName: body.categoryName,
        categoryId: body.categoryId,
        githubUrl: body.githubUrl,
        liveDemoUrl: body.liveDemoUrl,
        videoUrl: body.videoUrl,
        downloadFileUrl: body.downloadFileUrl,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        order: body.order !== undefined ? Number(body.order) : undefined,
        seoTitleEn: body.seoTitleEn,
        seoTitleAr: body.seoTitleAr,
        seoDescEn: body.seoDescEn,
        seoDescAr: body.seoDescAr,
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await verifyRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
