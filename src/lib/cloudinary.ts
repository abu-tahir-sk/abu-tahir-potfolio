import { v2 as cloudinary } from "cloudinary";

/**
 * Checks whether Cloudinary has valid credentials configured in the environment.
 * Supports both individual keys (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
 * and the complete CLOUDINARY_URL string format.
 */
export function checkCloudinaryConfigured(): boolean {
  const url = process.env.CLOUDINARY_URL?.trim();
  if (url && url.startsWith("cloudinary://")) {
    return true;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  return Boolean(cloudName && apiKey && apiSecret);
}

export const isCloudinaryConfigured = checkCloudinaryConfigured();

/**
 * Initializes and returns the configured Cloudinary client instance,
 * or null if credentials are not configured.
 */
export function getCloudinaryClient() {
  if (!checkCloudinaryConfigured()) {
    return null;
  }

  const url = process.env.CLOUDINARY_URL?.trim();
  if (url && url.startsWith("cloudinary://")) {
    cloudinary.config({ url });
    return cloudinary;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true,
  });

  return cloudinary;
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

/**
 * Uploads an image/media buffer to Cloudinary with automatic optimization.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = "portfolio"
): Promise<CloudinaryUploadResult> {
  const client = getCloudinaryClient();
  if (!client) {
    throw new Error(
      "Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env"
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        transformation: [
          { quality: "auto:best" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deletes an asset from Cloudinary by its public ID.
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  const client = getCloudinaryClient();
  if (!client || !publicId) return false;

  try {
    const res = await client.uploader.destroy(publicId);
    return res.result === "ok";
  } catch (err) {
    console.error("Failed to delete asset from Cloudinary:", err);
    return false;
  }
}

/**
 * Tests connection to Cloudinary and returns health status.
 */
export async function testCloudinaryConnection(): Promise<{
  success: boolean;
  message: string;
  cloudName?: string;
}> {
  const client = getCloudinaryClient();
  if (!client) {
    return {
      success: false,
      message: "Cloudinary credentials are not configured in environment.",
    };
  }

  try {
    const ping = await client.api.ping();
    const isOk = ping.status === "ok";
    return {
      success: isOk,
      message: isOk
        ? "Cloudinary API connection is active and healthy!"
        : "Unexpected response from Cloudinary API.",
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || "configured",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to connect to Cloudinary.",
    };
  }
}

export default cloudinary;
