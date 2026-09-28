import { NextRequest, NextResponse } from "next/server";
import { verifyRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "default_settings" },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: "default_settings" },
      });
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Prevent overwriting ID
    delete data.id;
    delete data.updatedAt;

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default_settings" },
      update: data,
      create: { id: "default_settings", ...data },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
