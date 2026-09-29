import { NextRequest, NextResponse } from "next/server";
import { verifyRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
      include: { category: true },
    });
    return NextResponse.json({ skills });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyRequestSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

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
          ],
        },
      });
      if (catByName) {
        resolvedCategoryId = catByName.id;
      }
    }

    const skill = await prisma.skill.create({
      data: {
        nameEn: body.nameEn || "New Skill",
        nameAr: body.nameAr || "مهارة جديدة",
        categoryName: body.categoryName || "Data Analysis",
        categoryId: resolvedCategoryId,
        iconName: body.iconName || "BarChart3",
        iconImageUrl: body.iconImageUrl || null,
        proficiency: body.proficiency !== undefined ? Number(body.proficiency) : 85,
        descriptionEn: body.descriptionEn || null,
        descriptionAr: body.descriptionAr || null,
        order: Number(body.order) || 0,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : true,
      },
    });

    return NextResponse.json({ success: true, skill });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyRequestSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, ...data } = body;

    let resolvedCategoryId: string | null | undefined = undefined;
    if (data.categoryId !== undefined) {
      if (data.categoryId && typeof data.categoryId === "string" && data.categoryId.trim() !== "") {
        const catExists = await prisma.category.findUnique({
          where: { id: data.categoryId.trim() },
        });
        resolvedCategoryId = catExists ? catExists.id : null;
      } else {
        resolvedCategoryId = null;
      }
    }

    if (resolvedCategoryId === null && data.categoryName) {
      const catByName = await prisma.category.findFirst({
        where: {
          OR: [
            { nameEn: data.categoryName },
            { nameAr: data.categoryName },
          ],
        },
      });
      if (catByName) {
        resolvedCategoryId = catByName.id;
      }
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        ...data,
        ...(resolvedCategoryId !== undefined ? { categoryId: resolvedCategoryId } : {}),
        proficiency: data.proficiency !== undefined ? Number(data.proficiency) : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
    });

    return NextResponse.json({ success: true, skill });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await verifyRequestSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
