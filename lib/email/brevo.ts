export function isBrevoConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.GMAIL_SENDER);
}

export async function sendViaBrevo(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.GMAIL_SENDER;

  if (!apiKey || !senderEmail) {
    throw new Error("Brevo is not configured");
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "LoveQuest", email: senderEmail },
      to: [{ email: options.to }],
      subject: options.subject,
      htmlContent: options.html,
      textContent: options.text,
    }),
  });

  const body = (await res.json().catch(() => ({}))) as { message?: string };

  if (!res.ok) {
    throw new Error(body.message ?? "Brevo send failed");
  }
}
