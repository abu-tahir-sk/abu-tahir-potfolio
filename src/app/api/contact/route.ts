import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactMessageSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const notificationEmail = process.env.CONTACT_EMAIL_NOTIFICATION || "abutahir2626@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-ip";
    const limiter = rateLimit(`contact:${ip}`, 3, 10 * 60 * 1000); // 3 messages per 10 minutes

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

    // Persist to PostgreSQL database
    const savedMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        isRead: false,
      },
    });

    // Optional email notification with Resend
    if (resend) {
      try {
        await resend.emails.send({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: notificationEmail,
          subject: `[Portfolio Inquiry] ${subject}`,
          html: `
            <h2>New Contact Message from Portfolio</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
            <hr />
            <p><small>Received at: ${new Date().toISOString()}</small></p>
          `,
        });
      } catch (emailErr) {
        console.error("Resend notification error (non-fatal):", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent successfully. I will get back to you shortly.",
      id: savedMessage.id,
    });
  } catch (error: unknown) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Failed to send your message. Please try again or reach out directly via email." },
      { status: 500 }
    );
  }
}
