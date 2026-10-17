import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import fs from "fs/promises";
import path from "path";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "portfolio";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileType = file.type;
    const isImage = ALLOWED_IMAGE_TYPES.includes(fileType);
    const isDoc = ALLOWED_DOC_TYPES.includes(fileType);

    if (!isImage && !isDoc) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, PNG, WEBP, SVG, PDF, DOCX." },
        { status: 400 }
      );
    }

    // 10MB max size
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File exceeds 10MB size limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If Cloudinary is configured, upload to Cloudinary
    if (isCloudinaryConfigured) {
      const result = await uploadToCloudinary(buffer, folder);
      return NextResponse.json({
        url: result.url,
        publicId: result.publicId,
        source: "cloudinary",
      });
    }

    // Fallback: Save to local public/uploads directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}-${sanitizedName}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);
    const publicUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      url: publicUrl,
      publicId: uniqueFileName,
      source: "local",
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
