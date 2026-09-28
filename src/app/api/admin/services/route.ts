import { NextRequest, NextResponse } from "next/server";
import { verifyRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ services });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyRequestSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const service = await prisma.service.create({
      data: {
        titleEn: body.titleEn,
        titleAr: body.titleAr,
        descriptionEn: body.descriptionEn,
        descriptionAr: body.descriptionAr,
        iconName: body.iconName || "TrendingUp",
        imageUrl: body.imageUrl || null,
        ctaTextEn: body.ctaTextEn || "Request Service",
        ctaTextAr: body.ctaTextAr || "طلب الخدمة",
        ctaLink: body.ctaLink || "#contact",
        order: Number(body.order) || 0,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : true,
      },
    });

    return NextResponse.json({ success: true, service });
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

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...data,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
    });

    return NextResponse.json({ success: true, service });
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

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
