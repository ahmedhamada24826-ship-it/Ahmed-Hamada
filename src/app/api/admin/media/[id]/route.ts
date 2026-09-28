import { NextRequest, NextResponse } from "next/server";
import { verifyRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await verifyRequestSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Try deleting physical file if local
    if (asset.url.startsWith("/uploads/")) {
      try {
        const fullPath = path.join(process.cwd(), "public", asset.url);
        await unlink(fullPath);
      } catch (err) {
        // file might have already been removed
      }
    }

    await prisma.mediaAsset.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await verifyRequestSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const updated = await prisma.mediaAsset.update({
      where: { id },
      data: {
        altTextEn: body.altTextEn,
        altTextAr: body.altTextAr,
        folder: body.folder,
      },
    });

    return NextResponse.json({ success: true, asset: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
