import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  checkCloudinaryConfigured,
  testCloudinaryConnection,
} from "@/lib/cloudinary";
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

/**
 * GET /api/uploads
 * Checks active storage provider and health status.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isConfigured = checkCloudinaryConfigured();
    if (isConfigured) {
      const health = await testCloudinaryConnection();
      return NextResponse.json({
        provider: "cloudinary",
        isCloudinaryConfigured: true,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "configured",
        healthy: health.success,
        message: health.message,
      });
    }

    return NextResponse.json({
      provider: "local",
      isCloudinaryConfigured: false,
      healthy: true,
      message: "Saving media locally to /public/uploads (default)",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to inspect storage status" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/uploads
 * Uploads an image or document to Cloudinary (if configured) or local /public/uploads.
 */
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
        { error: "Invalid file type. Allowed: JPG, PNG, WEBP, SVG, GIF, PDF, DOCX." },
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

    // Strategy 1: If Cloudinary is configured in .env, upload to Cloudinary CDN
    if (checkCloudinaryConfigured()) {
      try {
        const result = await uploadToCloudinary(buffer, folder);
        return NextResponse.json({
          url: result.url,
          publicId: result.publicId,
          source: "cloudinary",
          format: result.format,
          width: result.width,
          height: result.height,
        });
      } catch (cloudErr: any) {
        console.warn(
          "Cloudinary upload failed, falling back to local storage:",
          cloudErr?.message || cloudErr
        );
        // Fall back gracefully to local storage if Cloudinary network fails
      }
    }

    // Strategy 2: Fallback to local public/uploads directory
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

/**
 * DELETE /api/uploads
 * Removes an uploaded asset by publicId.
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { publicId, source } = await req.json();
    if (!publicId) {
      return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
    }

    if (source === "cloudinary" || checkCloudinaryConfigured()) {
      await deleteFromCloudinary(publicId);
    }

    // If local file exists, remove it
    const localPath = path.join(process.cwd(), "public", "uploads", path.basename(publicId));
    try {
      await fs.unlink(localPath);
    } catch {
      // File may have already been removed or is on Cloudinary
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete file" },
      { status: 500 }
    );
  }
}
