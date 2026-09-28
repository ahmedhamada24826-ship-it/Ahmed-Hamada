import { NextRequest, NextResponse } from "next/server";
import { verifyRequestSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const session = await verifyRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate size (< 25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds maximum allowed (25MB)" },
        { status: 400 }
      );
    }

    const result = await saveUploadedFile(file, folder);

    return NextResponse.json({
      success: true,
      file: result,
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
