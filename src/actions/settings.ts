"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { siteSettingsSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function updateSiteSettings(formData: unknown) {
  await requireAuth();

  const parsed = siteSettingsSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "default-settings" },
      update: parsed.data,
      create: {
        id: "default-settings",
        ...parsed.data,
      },
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/resume");
    revalidatePath("/contact");
    revalidatePath("/admin/profile");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/resume");
    revalidatePath("/admin");

    return { success: true, settings };
  } catch (error: any) {
    return { error: error.message || "Failed to update site settings" };
  }
}

export async function updateResumeUrl(resumeUrl: string) {
  await requireAuth();

  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "default-settings" },
      update: { resumeUrl },
      create: {
        id: "default-settings",
        biography: "Full-Stack Web Developer",
        resumeUrl,
      },
    });

    revalidatePath("/");
    revalidatePath("/resume");
    revalidatePath("/admin/resume");

    return { success: true, settings };
  } catch (error: any) {
    return { error: error.message || "Failed to update resume URL" };
  }
}
