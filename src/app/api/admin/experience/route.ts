import { NextRequest, NextResponse } from "next/server";
import { verifyRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ experience });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyRequestSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const exp = await prisma.experience.create({
      data: {
        organizationEn: body.organizationEn,
        organizationAr: body.organizationAr,
        positionEn: body.positionEn,
        positionAr: body.positionAr,
        type: body.type || "work",
        descriptionEn: body.descriptionEn || "",
        descriptionAr: body.descriptionAr || "",
        startDate: body.startDate || "",
        endDate: body.endDate || null,
        isCurrent: Boolean(body.isCurrent),
        locationEn: body.locationEn || null,
        locationAr: body.locationAr || null,
        logoUrl: body.logoUrl || null,
        order: Number(body.order) || 0,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : true,
      },
    });

    return NextResponse.json({ success: true, experience: exp });
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

    const exp = await prisma.experience.update({
      where: { id },
      data: {
        ...data,
        isCurrent: data.isCurrent !== undefined ? Boolean(data.isCurrent) : undefined,
        isVisible: data.isVisible !== undefined ? Boolean(data.isVisible) : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
    });

    return NextResponse.json({ success: true, experience: exp });
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

    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
