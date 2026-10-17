"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendContactNotification, sendDirectEmailReply } from "@/lib/email";

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

export async function markAllMessagesRead() {
  await requireAuth();

  try {
    await prisma.contactMessage.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to mark all as read" };
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

export async function sendTestNotification() {
  await requireAuth();

  try {
    const testResult = await sendContactNotification({
      name: "Portfolio Diagnostic Test",
      email: "abutahir2626@gmail.com",
      subject: "Test Notification: Portfolio Email System Check",
      message:
        "Hello Abu Tahir! This is an automated test message from your portfolio admin console to verify that email delivery (Resend / SMTP) is working properly.",
      id: "diag-test-" + Date.now(),
    });

    return {
      success: true,
      provider: testResult.provider,
      notificationSent: testResult.notificationSent,
      confirmationSent: testResult.confirmationSent,
      error: testResult.error,
    };
  } catch (error: any) {
    return { error: error.message || "Failed to dispatch test notification" };
  }
}

export async function sendDirectReplyMessage({
  toEmail,
  toName,
  subject,
  replyMessage,
  originalMessage,
}: {
  toEmail: string;
  toName: string;
  subject: string;
  replyMessage: string;
  originalMessage?: string;
}) {
  await requireAuth();

  if (!replyMessage || !replyMessage.trim()) {
    return { error: "Reply message cannot be empty." };
  }

  try {
    const result = await sendDirectEmailReply({
      toEmail,
      toName,
      subject,
      replyMessage: replyMessage.trim(),
      originalMessage,
    });

    if (!result.success) {
      return { error: result.error || "Failed to send email." };
    }

    return { success: true, provider: result.provider };
  } catch (error: any) {
    return { error: error.message || "Failed to dispatch email reply." };
  }
}

