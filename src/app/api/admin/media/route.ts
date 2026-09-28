import { NextRequest, NextResponse } from "next/server";
import { verifyRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await verifyRequestSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    const media = await prisma.mediaAsset.findMany({
      where: folder ? { folder } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ media });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
