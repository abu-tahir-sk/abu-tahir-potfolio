"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { skillSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createSkill(formData: unknown) {
  await requireAuth();

  const parsed = skillSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  try {
    const skill = await prisma.skill.create({
      data: parsed.data,
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");

    return { success: true, skill };
  } catch (error: any) {
    return { error: error.message || "Failed to create skill" };
  }
}

export async function updateSkill(id: string, formData: unknown) {
  await requireAuth();

  const parsed = skillSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  try {
    const skill = await prisma.skill.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");

    return { success: true, skill };
  } catch (error: any) {
    return { error: error.message || "Failed to update skill" };
  }
}

export async function deleteSkill(id: string) {
  await requireAuth();

  try {
    await prisma.skill.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete skill" };
  }
}
