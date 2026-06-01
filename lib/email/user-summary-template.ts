interface UserSummaryParams {
  userName: string;
  partnerName: string;
  partnerEmail: string;
  score: number;
  personalityLabel: string;
  personalityEmoji: string;
  characterComment: string;
  shareUrl?: string;
}

export function buildUserSummaryHtml(params: UserSummaryParams): string {
  const shareBlock = params.shareUrl
    ? `<p style="color:#fbcfe8;font-size:14px;">Partner link (if they did not get email):<br/><a href="${escapeHtml(params.shareUrl)}" style="color:#f9a8d4;">${escapeHtml(params.shareUrl)}</a></p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:24px;background:#1a0a2e;font-family:Georgia,serif;">
  <div style="max-width:520px;margin:0 auto;background:rgba(255,255,255,0.08);border-radius:20px;padding:28px;border:1px solid rgba(255,255,255,0.12);">
    <h1 style="color:#fdf2f8;font-size:22px;margin:0 0 12px;">You finished LoveQuest! 🎉</h1>
    <p style="color:#fce7f3;font-size:15px;line-height:1.6;">
      Hi ${escapeHtml(params.userName)},<br/><br/>
      Your compatibility score is <strong style="color:#fff;">${params.score}/100</strong>
      — ${params.personalityEmoji} <strong>${escapeHtml(params.personalityLabel)}</strong>.
    </p>
    <p style="color:#fce7f3;font-size:14px;font-style:italic;">&ldquo;${escapeHtml(params.characterComment)}&rdquo;</p>
    <p style="color:#fbcfe8;font-size:14px;margin-top:20px;">
      We also emailed <strong>${escapeHtml(params.partnerName)}</strong> at
      ${escapeHtml(params.partnerEmail)} with their version of the results.
    </p>
    ${shareBlock}
    <p style="color:#f9a8d4;font-size:12px;margin-top:24px;">— LoveQuest</p>
  </div>
</body>
</html>`;
}

export function buildUserSummaryText(params: UserSummaryParams): string {
  return `You finished LoveQuest!

Hi ${params.userName},

Your score: ${params.score}/100 — ${params.personalityLabel} ${params.personalityEmoji}

Lumi says: "${params.characterComment}"

We emailed ${params.partnerName} (${params.partnerEmail}) with their results.
${params.shareUrl ? `\nPartner link: ${params.shareUrl}` : ""}

— LoveQuest`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
