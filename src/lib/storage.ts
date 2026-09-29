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
  const mimeType = file.type || "image/png";

  // 1. Cloudinary upload if credentials are provided
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    try {
      const base64Str = `data:${mimeType};base64,${buffer.toString("base64")}`;
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
      
      const formData = new FormData();
      formData.append("file", base64Str);
      formData.append("folder", folder);
      if (uploadPreset) {
        formData.append("upload_preset", uploadPreset);
      }

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        await recordMediaAsset({
          fileName: data.public_id || fileName,
          originalName: file.name,
          mimeType,
          size: file.size,
          url: data.secure_url,
          folder,
        });

        return {
          url: data.secure_url,
          fileName,
          originalName: file.name,
          mimeType,
          size: file.size,
        };
      }
    } catch (cErr) {
      console.error("Cloudinary upload failed, falling back:", cErr);
    }
  }

  // 2. ImgBB upload if key is provided
  if (process.env.IMGBB_API_KEY) {
    try {
      const base64Data = buffer.toString("base64");
      const form = new URLSearchParams();
      form.append("image", base64Data);
      form.append("name", fileName);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        const publicUrl = data.data.url;
        await recordMediaAsset({
          fileName,
          originalName: file.name,
          mimeType,
          size: file.size,
          url: publicUrl,
          folder,
        });

        return {
          url: publicUrl,
          fileName,
          originalName: file.name,
          mimeType,
          size: file.size,
        };
      }
    } catch (imgbbErr) {
      console.error("ImgBB upload failed, falling back:", imgbbErr);
    }
  }

  // 3. Local filesystem attempt (works in local dev / standard server)
  let publicUrl: string | null = null;
  const isVercelOrServerless = Boolean(
    process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY
  );

  if (!isVercelOrServerless) {
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      publicUrl = `/uploads/${folder}/${fileName}`;
    } catch (fsErr) {
      console.warn("Local filesystem write failed, using data URL fallback:", fsErr);
    }
  }

  // 4. Serverless / Vercel fallback: store as Base64 Data URL in DB
  if (!publicUrl) {
    publicUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
  }

  // Record asset in database
  await recordMediaAsset({
    fileName,
    originalName: file.name,
    mimeType,
    size: file.size,
    url: publicUrl,
    folder,
  });

  return {
    url: publicUrl,
    fileName,
    originalName: file.name,
    mimeType,
    size: file.size,
  };
}

async function recordMediaAsset(data: {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  folder: string;
}) {
  try {
    await prisma.mediaAsset.create({
      data,
    });
  } catch (err) {
    console.error("Failed to record media asset in DB:", err);
  }
}

