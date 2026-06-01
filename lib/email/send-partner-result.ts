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
      }),
      text: buildLQResultEmailText({
        userName: payload.userName,
        partnerName: payload.partnerName,
        score: payload.score,
        personalityLabel: payload.personalityLabel,
        personalityEmoji: payload.personalityEmoji,
        characterComment: payload.characterComment,
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      const msg = error.message ?? "Email could not be sent.";

      if (msg.includes("only send testing emails to your own")) {
        return {
          sent: false,
          error:
            "Resend test mode: use your Resend account email as partner email, or verify a domain at resend.com/domains.",
        };
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
