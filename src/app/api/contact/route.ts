import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactMessageSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-ip";
    const limiter = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000); // 5 messages per 10 minutes

    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot check for bots
    if (body.website_hp && body.website_hp.length > 0) {
      // Fake success for bots
      return NextResponse.json({
        success: true,
        message: "Your message has been sent successfully.",
      });
    }

    const parsed = contactMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // 1. Persist to PostgreSQL database (always happens first so no message is ever lost)
    const savedMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        isRead: false,
      },
    });

    // 2. Dispatch email notifications (supports Resend and SMTP with auto-reply)
    const emailResult = await sendContactNotification({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      id: savedMessage.id,
      ip,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent successfully. Abu Tahir Sk has been notified and will get back to you shortly.",
      id: savedMessage.id,
      emailDelivered: emailResult.notificationSent,
    });
  } catch (error: unknown) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Failed to send your message. Please try again or reach out directly via email." },
      { status: 500 }
    );
  }
}
