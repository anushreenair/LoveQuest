import {
  buildLQResultEmailHtml,
  buildLQResultEmailText,
} from "@/lib/email/lq-result-template";
import { getResend, getResendFromEmail } from "@/lib/resend";

export interface PartnerEmailPayload {
  userName: string;
  partnerName: string;
  partnerEmail: string;
  score: number;
  personalityLabel: string;
  personalityEmoji: string;
  characterComment: string;
  shareUrl?: string;
}

export async function sendPartnerResultEmail(
  payload: PartnerEmailPayload,
): Promise<{ sent: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return {
      sent: false,
      error:
        "RESEND_API_KEY is missing. Add it to .env.local to email your partner.",
    };
  }

  try {
    const resend = getResend();

    const { error } = await resend.emails.send({
      from: getResendFromEmail(),
      to: payload.partnerEmail,
      subject: `Someone just completed LoveQuest for you ❤️`,
      html: buildLQResultEmailHtml({
        userName: payload.userName,
        partnerName: payload.partnerName,
        score: payload.score,
        personalityLabel: payload.personalityLabel,
        personalityEmoji: payload.personalityEmoji,
        characterComment: payload.characterComment,
        shareUrl: payload.shareUrl,
      }),
      text: buildLQResultEmailText({
        userName: payload.userName,
        partnerName: payload.partnerName,
        score: payload.score,
        personalityLabel: payload.personalityLabel,
        personalityEmoji: payload.personalityEmoji,
        characterComment: payload.characterComment,
        shareUrl: payload.shareUrl,
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      const msg = error.message ?? "Email could not be sent.";

      if (
        msg.includes("only send testing emails") ||
        msg.includes("only send emails to your own")
      ) {
        const allowedMatch = msg.match(
          /your own email address \(([^)]+)\)/i,
        );
        const allowed = allowedMatch?.[1];
        const hint = allowed
          ? `Right now Resend only allows sending to ${allowed}. Use the share link below for ${payload.partnerEmail}, or verify a domain at resend.com/domains.`
          : "Resend test mode blocks email to this address. Use the share link below, or verify a domain at resend.com/domains.";

        return { sent: false, error: hint };
      }

      return { sent: false, error: msg };
    }

    return { sent: true };
  } catch (err) {
    console.error("sendPartnerResultEmail:", err);
    const message =
      err instanceof Error ? err.message : "Email service unavailable.";
    return { sent: false, error: message };
  }
}
