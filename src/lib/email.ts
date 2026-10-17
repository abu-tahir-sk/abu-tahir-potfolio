import { Resend } from "resend";
import nodemailer from "nodemailer";

interface ContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  id?: string;
  ip?: string;
}

interface SendEmailResult {
  success: boolean;
  provider?: "resend" | "smtp" | "none";
  notificationSent: boolean;
  confirmationSent: boolean;
  error?: string;
}

// 1. Initialize Resend if API key is provided
const resendApiKey = process.env.RESEND_API_KEY;
const resendClient = resendApiKey && resendApiKey.trim().length > 0 ? new Resend(resendApiKey.trim()) : null;

// 2. Target email recipient for inquiries
const adminNotificationEmail = process.env.CONTACT_EMAIL_NOTIFICATION || "abutahir2626@gmail.com";

// 3. Initialize Nodemailer Transporter if SMTP environment variables are provided
function getSmtpTransporter() {
  const host = process.env.SMTP_HOST || (process.env.GMAIL_USER || process.env.SMTP_USER ? "smtp.gmail.com" : null);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  const cleanPass = pass.trim().replace(/\s+/g, "");

  if (host === "smtp.gmail.com") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user.trim(),
        pass: cleanPass,
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: user.trim(),
      pass: cleanPass,
    },
  });
}

/**
 * Builds the HTML template for notifying the portfolio owner (Abu Tahir Sk)
 */
function buildAdminNotificationHtml({ name, email, subject, message, id }: ContactEmailParams): string {
  const adminUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin/messages`
    : "http://localhost:3000/admin/messages";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Inquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0d19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0d19; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background: #121629; border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%); padding: 24px 30px; text-align: left;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                ⚡ New Portfolio Message Received
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.85);">
                From Abu Tahir Sk's Portfolio Contact Form
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 30px;">
              <!-- Sender Details Card -->
              <table role="presentation" width="100%" style="background-color: #171b33; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; margin-bottom: 24px; padding: 16px 20px;">
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #94a3b8; width: 90px; vertical-align: top;">
                    <strong>Sender:</strong>
                  </td>
                  <td style="padding: 4px 0; font-size: 14px; color: #f8fafc; font-weight: 600;">
                    ${escapeHtml(name)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #94a3b8; vertical-align: top;">
                    <strong>Email:</strong>
                  </td>
                  <td style="padding: 4px 0; font-size: 14px;">
                    <a href="mailto:${escapeHtml(email)}" style="color: #38bdf8; text-decoration: none; font-weight: 500;">
                      ${escapeHtml(email)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #94a3b8; vertical-align: top;">
                    <strong>Subject:</strong>
                  </td>
                  <td style="padding: 4px 0; font-size: 14px; color: #e2e8f0; font-weight: 600;">
                    ${escapeHtml(subject)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #94a3b8; vertical-align: top;">
                    <strong>Received:</strong>
                  </td>
                  <td style="padding: 4px 0; font-size: 12px; color: #cbd5e1; font-family: monospace;">
                    ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "medium" })} IST
                  </td>
                </tr>
              </table>

              <!-- Message Section -->
              <div style="margin-bottom: 24px;">
                <h3 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #a78bfa;">
                  Message Body
                </h3>
                <div style="background-color: #0c0e1c; border-left: 3px solid #7c3aed; border-radius: 0 8px 8px 0; padding: 18px 20px; font-size: 14px; line-height: 1.6; color: #f1f5f9; white-space: pre-wrap;">${escapeHtml(message)}</div>
              </div>

              <!-- Quick Action Buttons -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 28px;">
                <tr>
                  <td align="center" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <a href="mailto:${escapeHtml(email)}?subject=Re:%20${encodeURIComponent(subject)}" 
                       style="background: #7c3aed; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);">
                      ✉️ Reply to ${escapeHtml(name)}
                    </a>
                    <a href="${adminUrl}" 
                       style="background: #1e2442; color: #cbd5e1; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; display: inline-block; border: 1px solid rgba(255,255,255,0.1);">
                      Open in Admin Dashboard →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0d1021; padding: 16px 30px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center; font-size: 11px; color: #64748b;">
              Inquiry ID: ${id || "N/A"} • Automatically processed by Abu Tahir Sk Portfolio CMS
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Builds an automated confirmation acknowledgement HTML email for the sender
 */
function buildSenderConfirmationHtml({ name, subject }: ContactEmailParams): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abutahir.dev";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Received — Abu Tahir Sk</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0d19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0d19; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background: #121629; border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <!-- Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #7C3AED 0%, #38BDF8 100%); padding: 24px 30px; text-align: left;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">
                Thank You for Reaching Out!
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.9);">
                Abu Tahir Sk — Full-Stack Web Developer
              </p>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 28px 30px; font-size: 14px; line-height: 1.7; color: #cbd5e1;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #f8fafc;">
                Hi <strong>${escapeHtml(name)}</strong>,
              </p>
              <p style="margin: 0 0 16px 0;">
                Thank you for contacting me regarding <em>"${escapeHtml(subject)}"</em>. I have received your message and will review it as soon as possible.
              </p>
              <p style="margin: 0 0 24px 0;">
                I typically respond within 24 to 48 hours. In the meantime, feel free to explore my latest open-source projects or connect on social networks:
              </p>

              <!-- Social Links -->
              <table role="presentation" width="100%" style="background-color: #171b33; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <div style="font-size: 13px; margin-bottom: 8px;">
                      💼 <strong>LinkedIn:</strong> 
                      <a href="https://www.linkedin.com/in/abu-tahir-sk-739036352" target="_blank" style="color: #38bdf8; text-decoration: none; margin-left: 6px;">
                        linkedin.com/in/abu-tahir-sk-739036352
                      </a>
                    </div>
                    <div style="font-size: 13px; margin-bottom: 8px;">
                      🐙 <strong>GitHub:</strong> 
                      <a href="https://github.com/abu-tahir-sk" target="_blank" style="color: #38bdf8; text-decoration: none; margin-left: 6px;">
                        github.com/abu-tahir-sk
                      </a>
                    </div>
                    <div style="font-size: 13px;">
                      🌐 <strong>Portfolio:</strong> 
                      <a href="${siteUrl}" target="_blank" style="color: #a78bfa; text-decoration: none; margin-left: 6px;">
                        ${siteUrl}
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                Warm regards,<br />
                <strong style="color: #f1f5f9;">Abu Tahir Sk</strong><br />
                <span style="font-size: 12px;">Full-Stack Web Developer • abutahir2626@gmail.com</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0d1021; padding: 14px 30px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center; font-size: 11px; color: #64748b;">
              This is an automated confirmation sent because a message was submitted on my portfolio website.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Dispatches the contact notification email to Abu Tahir Sk, and auto-reply to sender if configured.
 * Safely falls back if keys are absent, ensuring database saves never fail.
 */
export async function sendContactNotification(params: ContactEmailParams): Promise<SendEmailResult> {
  const result: SendEmailResult = {
    success: true,
    notificationSent: false,
    confirmationSent: false,
    provider: "none",
  };

  const adminHtml = buildAdminNotificationHtml(params);
  const confirmationHtml = buildSenderConfirmationHtml(params);

  // Strategy A: Try Resend if RESEND_API_KEY is present
  if (resendClient) {
    try {
      // 1. Send notification to admin
      const fromAddress = process.env.RESEND_FROM || "Abu Tahir Sk Portfolio <onboarding@resend.dev>";
      const notifyRes = await resendClient.emails.send({
        from: fromAddress,
        to: adminNotificationEmail,
        replyTo: params.email,
        subject: `[Portfolio Inquiry] ${params.subject} - from ${params.name}`,
        html: adminHtml,
      });

      if (!notifyRes.error) {
        result.notificationSent = true;
        result.provider = "resend";
        console.log(`[Email] Admin notification delivered via Resend to ${adminNotificationEmail}`);
      } else {
        console.warn("[Email] Resend notification error:", notifyRes.error);
      }

      // 2. Try sending confirmation to sender
      // Note: On free onboarding@resend.dev, sending to unverified external emails is restricted by Resend.
      // We attempt it safely inside try/catch so it never disrupts.
      try {
        const confirmRes = await resendClient.emails.send({
          from: fromAddress,
          to: params.email,
          subject: `Thank you for contacting Abu Tahir Sk: ${params.subject}`,
          html: confirmationHtml,
        });
        if (!confirmRes.error) {
          result.confirmationSent = true;
        }
      } catch (confirmErr) {
        // Expected on unverified Resend test domain
        console.log("[Email] Resend sender auto-reply skipped (requires custom verified domain on Resend)");
      }

      return result;
    } catch (err: any) {
      console.error("[Email] Resend dispatch exception:", err?.message || err);
      // Fall through to SMTP check
    }
  }

  // Strategy B: Try Nodemailer SMTP if configured
  const smtp = getSmtpTransporter();
  if (smtp) {
    try {
      const fromHeader = process.env.SMTP_FROM || `"Abu Tahir Sk" <${process.env.SMTP_USER || "abutahir2626@gmail.com"}>`;

      // 1. Send notification to admin
      await smtp.sendMail({
        from: fromHeader,
        to: adminNotificationEmail,
        replyTo: `"${params.name}" <${params.email}>`,
        subject: `[Portfolio Inquiry] ${params.subject} - from ${params.name}`,
        html: adminHtml,
      });

      result.notificationSent = true;
      result.provider = "smtp";
      console.log(`[Email] Admin notification delivered via SMTP to ${adminNotificationEmail}`);

      // 2. Send confirmation to sender
      try {
        await smtp.sendMail({
          from: fromHeader,
          to: params.email,
          subject: `Thank you for contacting Abu Tahir Sk: ${params.subject}`,
          html: confirmationHtml,
        });
        result.confirmationSent = true;
        console.log(`[Email] Confirmation delivered via SMTP to ${params.email}`);
      } catch (confirmErr: any) {
        console.warn("[Email] SMTP confirmation auto-reply error:", confirmErr?.message || confirmErr);
      }

      return result;
    } catch (err: any) {
      console.error("[Email] SMTP delivery failed:", err?.message || err);
      result.error = err?.message || "SMTP sending failed";
    }
  }

  // If neither provider is active, log cleanly that the message was persisted to DB
  console.log(
    `[Email] No active email provider configured (RESEND_API_KEY or SMTP_USER). Message #${params.id || "new"} persisted to database.`
  );
  return result;
}

export interface DirectReplyParams {
  toEmail: string;
  toName: string;
  subject: string;
  replyMessage: string;
  originalMessage?: string;
}

/**
 * Sends a direct email reply to an inquiry sender using the configured provider (Resend / SMTP).
 */
export async function sendDirectEmailReply(params: DirectReplyParams): Promise<{
  success: boolean;
  provider?: "resend" | "smtp";
  error?: string;
}> {
  const replySubject = params.subject.startsWith("Re:") ? params.subject : `Re: ${params.subject}`;

  const replyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(replySubject)}</title>
</head>
<body style="margin: 0; padding: 24px 16px; background-color: #0b0d19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #121629; border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 14px; padding: 28px; box-shadow: 0 8px 24px rgba(0,0,0,0.5);">
    <div style="font-size: 15px; line-height: 1.7; color: #f8fafc; white-space: pre-wrap; margin-bottom: 24px;">${escapeHtml(params.replyMessage)}</div>

    <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 18px; margin-top: 24px; font-size: 13px; color: #94a3b8;">
      <p style="margin: 0 0 6px 0; color: #f1f5f9; font-weight: 600;">Abu Tahir Sk</p>
      <p style="margin: 0 0 12px 0; color: #a78bfa; font-size: 12px;">Full-Stack Web Developer • <a href="https://abutahir.dev" style="color: #38bdf8; text-decoration: none;">abutahir.dev</a></p>
      <div style="font-size: 12px; color: #64748b;">
        <a href="https://www.linkedin.com/in/abu-tahir-sk-739036352" style="color: #38bdf8; text-decoration: none; margin-right: 12px;">LinkedIn</a>
        <a href="https://github.com/abu-tahir-sk" style="color: #38bdf8; text-decoration: none;">GitHub</a>
      </div>
    </div>

    ${
      params.originalMessage
        ? `
    <div style="margin-top: 24px; padding: 16px; background-color: #0c0e1c; border-left: 3px solid #7c3aed; border-radius: 0 8px 8px 0; font-size: 12px; color: #94a3b8;">
      <p style="margin: 0 0 8px 0; font-weight: 600; color: #cbd5e1;">On original message from ${escapeHtml(params.toName)}:</p>
      <div style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(params.originalMessage)}</div>
    </div>
    `
        : ""
    }
  </div>
</body>
</html>
  `.trim();

  // Strategy A: Try Resend if configured
  if (resendClient) {
    try {
      const fromAddress = process.env.RESEND_FROM || "Abu Tahir Sk <onboarding@resend.dev>";
      const res = await resendClient.emails.send({
        from: fromAddress,
        to: params.toEmail,
        replyTo: adminNotificationEmail,
        subject: replySubject,
        html: replyHtml,
      });

      if (!res.error) {
        return { success: true, provider: "resend" };
      }
      return { success: false, error: res.error.message || "Resend error occurred" };
    } catch (err: any) {
      console.error("[Email] Resend direct reply exception:", err?.message || err);
      // Fall through to SMTP
    }
  }

  // Strategy B: Try SMTP if configured
  const smtp = getSmtpTransporter();
  if (smtp) {
    try {
      const fromHeader = process.env.SMTP_FROM || `"Abu Tahir Sk" <${process.env.SMTP_USER || "abutahir2626@gmail.com"}>`;
      await smtp.sendMail({
        from: fromHeader,
        to: params.toEmail,
        replyTo: adminNotificationEmail,
        subject: replySubject,
        html: replyHtml,
      });
      return { success: true, provider: "smtp" };
    } catch (err: any) {
      console.error("[Email] SMTP direct reply failed:", err?.message || err);
      return { success: false, error: err?.message || "SMTP delivery failed" };
    }
  }

  return {
    success: false,
    error: "No active email provider detected. Set RESEND_API_KEY or SMTP credentials in .env to send directly from dashboard, or click 'Open in Gmail' to reply instantly in your browser.",
  };
}
