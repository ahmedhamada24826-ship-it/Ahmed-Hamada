import { NextRequest, NextResponse } from "next/server";
import { verifyRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ certificates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyRequestSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const cert = await prisma.certificate.create({
      data: {
        titleEn: body.titleEn,
        titleAr: body.titleAr,
        issuerEn: body.issuerEn,
        issuerAr: body.issuerAr,
        issueDate: body.issueDate,
        credentialId: body.credentialId || null,
        verificationUrl: body.verificationUrl || null,
        imageUrl: body.imageUrl || null,
        pdfUrl: body.pdfUrl || null,
        descriptionEn: body.descriptionEn || null,
        descriptionAr: body.descriptionAr || null,
        skills: body.skills || null,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : true,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : true,
        order: Number(body.order) || 0,
      },
    });

    return NextResponse.json({ success: true, certificate: cert });
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

    const cert = await prisma.certificate.update({
      where: { id },
      data: {
        ...data,
        isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : undefined,
        isVisible: data.isVisible !== undefined ? Boolean(data.isVisible) : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
    });

    return NextResponse.json({ success: true, certificate: cert });
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

    await prisma.certificate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
