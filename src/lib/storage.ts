import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export interface UploadResult {
  url: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export async function saveUploadedFile(
  file: File,
  folder: string = "general"
): Promise<UploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const ext = path.extname(cleanOriginalName) || ".png";
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const fileName = `${uniquePrefix}${ext}`;

  // Check if S3 credentials exist
  if (
    process.env.S3_ENDPOINT &&
    process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY
  ) {
    // S3/R2 upload flow can be invoked or fallback to public folder
  }

  // Local storage under public/uploads
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  const publicUrl = `/uploads/${folder}/${fileName}`;

  // Record asset in database
  try {
    await prisma.mediaAsset.create({
      data: {
        fileName,
        originalName: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        url: publicUrl,
        folder,
      },
    });
  } catch (err) {
    console.error("Failed to record media asset in DB:", err);
  }

  return {
    url: publicUrl,
    fileName,
    originalName: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
  };
}
