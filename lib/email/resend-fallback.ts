import {
  buildLQResultEmailHtml,
  buildLQResultEmailText,
} from "@/lib/email/lq-result-template";
import {
  buildUserSummaryHtml,
  buildUserSummaryText,
} from "@/lib/email/user-summary-template";
import type { QuizEmailPayload } from "@/lib/email/send-results-emails";

async function resendSend(
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "Resend not configured" };

  const from =
    process.env.RESEND_FROM_EMAIL ?? "LoveQuest <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });

  const body = (await res.json()) as { message?: string };

  if (!res.ok) {
    return { ok: false, error: body.message ?? "Resend error" };
  }

  return { ok: true };
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function buildPartnerRelayEmail(payload: QuizEmailPayload) {
  const partnerHtml = buildLQResultEmailHtml({
    userName: payload.userName,
    partnerName: payload.partnerName,
    score: payload.score,
    personalityLabel: payload.personalityLabel,
    personalityEmoji: payload.personalityEmoji,
    characterComment: payload.characterComment,
    shareUrl: payload.shareUrl,
  });

  const partnerText = buildLQResultEmailText({
    userName: payload.userName,
    partnerName: payload.partnerName,
    score: payload.score,
    personalityLabel: payload.personalityLabel,
    personalityEmoji: payload.personalityEmoji,
    characterComment: payload.characterComment,
    shareUrl: payload.shareUrl,
  });

  const relayHtml = `<!DOCTYPE html><html><body style="font-family:Georgia,serif;background:#1a0a2e;color:#fce7f3;padding:24px;">
<p>Hi ${payload.userName},</p>
<p>We couldn't deliver directly to <strong>${payload.partnerEmail}</strong> (Resend test mode).</p>
<p><strong>Please forward the email below to ${payload.partnerName}.</strong></p>
<p>Or send them this link: ${payload.shareUrl ?? ""}</p>
<hr style="border:1px solid rgba(255,255,255,0.2);margin:24px 0"/>
${partnerHtml}
</body></html>`;

  const relayText = `Hi ${payload.userName},

Please forward this to ${payload.partnerName} (${payload.partnerEmail}).

${partnerText}`;

  return { relayHtml, relayText, partnerHtml, partnerText };
}

/** Resend test mode only delivers to the account owner email. */
export async function sendViaResendFallback(
  payload: QuizEmailPayload,
): Promise<{
  partnerSent: boolean;
  userSent: boolean;
  error?: string;
}> {
  const { relayHtml, relayText, partnerHtml, partnerText } =
    buildPartnerRelayEmail(payload);

  let partnerSent = false;
  let userSent = false;

  const partnerResult = await resendSend(
    payload.partnerEmail,
    `${payload.userName} completed LoveQuest for you ❤️`,
    partnerHtml,
    partnerText,
  );
  partnerSent = partnerResult.ok;

  if (!partnerSent && payload.userEmail) {
    const relayResult = await resendSend(
      payload.userEmail,
      `Forward to ${payload.partnerName}: LoveQuest results ❤️`,
      relayHtml,
      relayText,
    );

    if (relayResult.ok) {
      userSent = true;
      return {
        partnerSent: false,
        userSent: true,
        error: `Resend can't email ${payload.partnerEmail} directly. We sent you a forwardable copy — please forward it, or use the share link below.`,
      };
    }
  }

  const userResult = await resendSend(
    payload.userEmail,
    `Your LoveQuest results — ${payload.score}/100 ${payload.personalityEmoji}`,
    buildUserSummaryHtml({
      userName: payload.userName,
      partnerName: payload.partnerName,
      partnerEmail: payload.partnerEmail,
      score: payload.score,
      personalityLabel: payload.personalityLabel,
      personalityEmoji: payload.personalityEmoji,
      characterComment: payload.characterComment,
      shareUrl: payload.shareUrl,
    }),
    buildUserSummaryText({
      userName: payload.userName,
      partnerName: payload.partnerName,
      partnerEmail: payload.partnerEmail,
      score: payload.score,
      personalityLabel: payload.personalityLabel,
      personalityEmoji: payload.personalityEmoji,
      characterComment: payload.characterComment,
      shareUrl: payload.shareUrl,
    }),
  );
  userSent = userResult.ok;

  return {
    partnerSent,
    userSent,
    error: partnerSent
      ? undefined
      : `Could not email ${payload.partnerEmail}. Run: npm run email:setup -- your@gmail.com your-app-password`,
  };
}
