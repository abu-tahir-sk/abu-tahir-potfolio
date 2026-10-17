"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markMessageRead(id: string, isRead: boolean) {
  await requireAuth();

  try {
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin");

    return { success: true, message };
  } catch (error: any) {
    return { error: error.message || "Failed to update message" };
  }
}

export async function deleteMessage(id: string) {
  await requireAuth();

  try {
    await prisma.contactMessage.delete({
      where: { id },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete message" };
  }
}
