interface LQEmailParams {
  userName: string;
  partnerName: string;
  score: number;
  personalityLabel: string;
  personalityEmoji: string;
  characterComment: string;
}

export function buildLQResultEmailHtml(params: LQEmailParams): string {
  const {
    userName,
    partnerName,
    score,
    personalityLabel,
    personalityEmoji,
    characterComment,
  } = params;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#0f0618;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f0618,#2d1b4e,#4a1942);padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:24px;">
          <tr>
            <td style="padding:36px 28px;text-align:center;">
              <div style="font-size:40px;">♥</div>
              <h1 style="color:#fdf2f8;font-size:24px;margin:16px 0 8px;">Someone just completed LoveQuest for you ❤️</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;">
              <p style="color:#fce7f3;font-size:16px;line-height:1.6;">
                Hey ${escapeHtml(partnerName)},<br/><br/>
                <strong style="color:#fff;">${escapeHtml(userName)}</strong> just completed LoveQuest — a fun relationship adventure about you two.
              </p>
              <div style="background:linear-gradient(135deg,#ec4899,#a855f7);border-radius:20px;padding:28px;text-align:center;margin:24px 0;">
                <p style="margin:0 0 4px;color:rgba(255,255,255,0.85);font-size:12px;text-transform:uppercase;letter-spacing:2px;">Compatibility Score</p>
                <p style="margin:0;color:#fff;font-size:48px;font-weight:700;">${score}/100</p>
              </div>
              <p style="color:#fff;font-size:20px;text-align:center;margin:0 0 8px;">
                ${personalityEmoji} <strong>Relationship Type:</strong> ${escapeHtml(personalityLabel)}
              </p>
              <div style="background:rgba(255,255,255,0.08);border-radius:16px;padding:20px;margin-top:24px;border:1px solid rgba(255,255,255,0.12);">
                <p style="margin:0 0 8px;color:#f9a8d4;font-size:12px;text-transform:uppercase;">Lumi&apos;s comment</p>
                <p style="margin:0;color:#fce7f3;font-size:15px;font-style:italic;">&ldquo;${escapeHtml(characterComment)}&rdquo;</p>
              </div>
              <p style="color:#fbcfe8;font-size:14px;text-align:center;margin-top:28px;">
                Maybe send them a sweet message today ❤️
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);">
              <p style="margin:0;color:#f9a8d4;font-size:12px;">Made with ♥ on LoveQuest</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildLQResultEmailText(params: LQEmailParams): string {
  return `Someone just completed LoveQuest for you ❤️

Hey ${params.partnerName},

${params.userName} just completed LoveQuest.

Compatibility Score: ${params.score}/100

Relationship Type: ${params.personalityLabel} ${params.personalityEmoji}

Lumi says: "${params.characterComment}"

Maybe send them a sweet message today ❤️

— LoveQuest`;
}
