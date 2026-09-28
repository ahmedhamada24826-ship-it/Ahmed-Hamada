import { NextRequest, NextResponse } from "next/server";
import { verifyRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ education });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyRequestSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const edu = await prisma.education.create({
      data: {
        institutionEn: body.institutionEn,
        institutionAr: body.institutionAr,
        degreeEn: body.degreeEn,
        degreeAr: body.degreeAr,
        fieldEn: body.fieldEn,
        fieldAr: body.fieldAr,
        startDate: body.startDate,
        endDate: body.endDate,
        gradeEn: body.gradeEn || null,
        gradeAr: body.gradeAr || null,
        descriptionEn: body.descriptionEn || null,
        descriptionAr: body.descriptionAr || null,
        logoUrl: body.logoUrl || null,
        docUrl: body.docUrl || null,
        order: Number(body.order) || 0,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : true,
      },
    });

    return NextResponse.json({ success: true, education: edu });
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

    const edu = await prisma.education.update({
      where: { id },
      data: {
        ...data,
        isVisible: data.isVisible !== undefined ? Boolean(data.isVisible) : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
    });

    return NextResponse.json({ success: true, education: edu });
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

    await prisma.education.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
