import { APP_NAME } from "@/lib/brand";

export function buildShareUrl(baseUrl: string, sessionId: string) {
  return `${baseUrl}/share/${sessionId}`;
}

export function buildMailtoLink({
  partnerEmail,
  partnerName,
  userName,
  score,
  shareUrl,
}: {
  partnerEmail: string;
  partnerName: string;
  userName: string;
  score: number;
  shareUrl: string;
}) {
  const subject = encodeURIComponent(`${userName} sent you a ${APP_NAME} result 💕`);
  const body = encodeURIComponent(
    `Hey ${partnerName}!\n\n${userName} played ${APP_NAME} about you — your compatibility is ${score}%.\n\nSee your result here:\n${shareUrl}\n\n💕`
  );

  return `mailto:${partnerEmail}?subject=${subject}&body=${body}`;
}

export function buildWhatsAppLink(shareUrl: string, partnerName: string, score: number) {
  const text = encodeURIComponent(
    `Hey ${partnerName}! I played ${APP_NAME} about us — we're ${score}% compatible 💕\n\n${shareUrl}`
  );

  return `https://wa.me/?text=${text}`;
}
