"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { educationSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createEducation(formData: unknown) {
  await requireAuth();

  const parsed = educationSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  try {
    const edu = await prisma.education.create({
      data: parsed.data,
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/education");

    return { success: true, education: edu };
  } catch (error: any) {
    return { error: error.message || "Failed to create education" };
  }
}

export async function updateEducation(id: string, formData: unknown) {
  await requireAuth();

  const parsed = educationSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  try {
    const edu = await prisma.education.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/education");

    return { success: true, education: edu };
  } catch (error: any) {
    return { error: error.message || "Failed to update education" };
  }
}

export async function deleteEducation(id: string) {
  await requireAuth();

  try {
    await prisma.education.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/education");

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete education" };
  }
}
