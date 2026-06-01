import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function getMailFrom(): string {
  const from = process.env.MAIL_FROM?.trim();
  if (from) return from;

  const user = process.env.SMTP_USER?.trim();
  if (user) return `LoveQuest <${user}>`;

  return "LoveQuest";
}

export function getSmtpTransport(): Transporter {
  if (!isSmtpConfigured()) {
    throw new Error(
      "SMTP is not configured. Run: npm run email:setup (Gmail app password)",
    );
  }

  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? "587");
    const secure = process.env.SMTP_SECURE === "true";

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const transport = getSmtpTransport();

  await transport.sendMail({
    from: getMailFrom(),
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}
