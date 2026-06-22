import { APP_NAME } from "@/lib/brand";

function clean(value: string | undefined) {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/^["']|["']$/g, "");
  return trimmed || undefined;
}

export async function sendViaBrevo({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = clean(process.env.BREVO_API_KEY);
  const senderEmail =
    clean(process.env.BREVO_SENDER_EMAIL) ||
    clean(process.env.GMAIL_USER) ||
    "anushreenair15@gmail.com";
  const senderName = clean(process.env.BREVO_SENDER_NAME) || APP_NAME;

  if (!apiKey) {
    return { success: false as const, error: "Brevo API key not configured" };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      messageId?: string;
      message?: string;
      code?: string;
    };

    if (!response.ok) {
      return {
        success: false as const,
        error: data.message ?? `Brevo error (${response.status})`,
      };
    }

    return { success: true as const, data: { id: data.messageId } };
  } catch (error) {
    console.error("Brevo send failed:", error);
    return { success: false as const, error: "Failed to send email via Brevo" };
  }
}
