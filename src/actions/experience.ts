"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { experienceSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createExperience(formData: unknown) {
  await requireAuth();

  const parsed = experienceSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  try {
    const exp = await prisma.experience.create({
      data: parsed.data,
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/experience");

    return { success: true, experience: exp };
  } catch (error: any) {
    return { error: error.message || "Failed to create experience" };
  }
}

export async function updateExperience(id: string, formData: unknown) {
  await requireAuth();

  const parsed = experienceSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  try {
    const exp = await prisma.experience.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/experience");

    return { success: true, experience: exp };
  } catch (error: any) {
    return { error: error.message || "Failed to update experience" };
  }
}

export async function deleteExperience(id: string) {
  await requireAuth();

  try {
    await prisma.experience.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/experience");

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete experience" };
  }
}
