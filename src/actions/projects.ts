"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createProject(formData: unknown) {
  await requireAuth();

  const parsed = projectSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  const data = parsed.data;

  // Check unique slug
  const existing = await prisma.project.findUnique({
    where: { slug: data.slug },
  });

  if (existing) {
    return { error: `Project slug "${data.slug}" is already in use. Please use a unique slug.` };
  }

  try {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        coverImagePublicId: data.coverImagePublicId,
        screenshots: data.screenshots,
        technologies: data.technologies,
        features: data.features,
        category: data.category,
        githubUrl: data.githubUrl || null,
        liveDemoUrl: data.liveDemoUrl || null,
        featured: data.featured,
        status: data.status,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
        displayOrder: data.displayOrder,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");
    revalidatePath("/admin");

    return { success: true, project };
  } catch (error: any) {
    console.error("Failed to create project:", error);
    return { error: error.message || "Failed to create project" };
  }
}

export async function updateProject(id: string, formData: unknown) {
  await requireAuth();

  const parsed = projectSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  const data = parsed.data;

  // Check unique slug conflict with other projects
  const existing = await prisma.project.findFirst({
    where: {
      slug: data.slug,
      NOT: { id },
    },
  });

  if (existing) {
    return { error: `Project slug "${data.slug}" is already in use by another project.` };
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        coverImagePublicId: data.coverImagePublicId,
        screenshots: data.screenshots,
        technologies: data.technologies,
        features: data.features,
        category: data.category,
        githubUrl: data.githubUrl || null,
        liveDemoUrl: data.liveDemoUrl || null,
        featured: data.featured,
        status: data.status,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
        displayOrder: data.displayOrder,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");
    revalidatePath("/admin");

    return { success: true, project };
  } catch (error: any) {
    console.error("Failed to update project:", error);
    return { error: error.message || "Failed to update project" };
  }
}

export async function deleteProject(id: string) {
  await requireAuth();

  try {
    const project = await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete project:", error);
    return { error: error.message || "Failed to delete project" };
  }
}

export async function toggleProjectFeatured(id: string, featured: boolean) {
  await requireAuth();

  try {
    await prisma.project.update({
      where: { id },
      data: { featured },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle featured status" };
  }
}

export async function toggleProjectStatus(id: string, status: "DRAFT" | "PUBLISHED") {
  await requireAuth();

  try {
    const project = await prisma.project.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update status" };
  }
}
