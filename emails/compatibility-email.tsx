import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { APP_NAME } from "@/lib/brand";

interface CompatibilityEmailProps {
  userName: string;
  partnerName: string;
  score: number;
  shareUrl?: string;
}

export function CompatibilityEmail({
  userName,
  partnerName,
  score,
  shareUrl,
}: CompatibilityEmailProps) {
  const matchLabel =
    score >= 90
      ? "Soulmates!"
      : score >= 80
        ? "Amazing match!"
        : score >= 70
          ? "Great connection!"
          : score >= 60
            ? "Promising!"
            : "Intriguing!";

  return (
    <Html>
      <Head />
      <Preview>
        {`${userName} got ${score}% compatibility with you on ${APP_NAME}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>💕 {APP_NAME}</Text>
          </Section>

          <Heading style={heading}>
            Hey {partnerName}!
          </Heading>

          <Text style={paragraph}>
            <strong>{userName}</strong> just played {APP_NAME} — and you were
            the one they had in mind.
          </Text>

          <Section style={scoreBox}>
            <Text style={scoreLabel}>Compatibility</Text>
            <Text style={scoreValue}>{score}%</Text>
            <Text style={scoreSub}>{matchLabel}</Text>
          </Section>

          <Hr style={hr} />

          {shareUrl && (
            <Text style={paragraph}>
              <a href={shareUrl} style={{ color: "#ff6b9d", fontWeight: "bold" }}>
                View your {APP_NAME} result →
              </a>
            </Text>
          )}

          <Text style={footer}>
            Someone&apos;s thinking about you. 💕
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#0a0a0f",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#ff6b9d",
  margin: "0",
};

const heading = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 24px",
};

const paragraph = {
  color: "#a1a1aa",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const scoreBox = {
  background: "linear-gradient(135deg, #ff6b9d 0%, #c44dff 100%)",
  borderRadius: "20px",
  padding: "36px",
  textAlign: "center" as const,
  margin: "24px 0",
};

const scoreLabel = {
  color: "rgba(255,255,255,0.85)",
  fontSize: "13px",
  textTransform: "uppercase" as const,
  letterSpacing: "3px",
  margin: "0 0 8px",
};

const scoreValue = {
  color: "#ffffff",
  fontSize: "72px",
  fontWeight: "800",
  margin: "0",
  lineHeight: "1",
};

const scoreSub = {
  color: "rgba(255,255,255,0.9)",
  fontSize: "18px",
  fontWeight: "600",
  margin: "12px 0 0",
};

const hr = {
  borderColor: "#27272a",
  margin: "32px 0",
};

const footer = {
  color: "#71717a",
  fontSize: "14px",
  textAlign: "center" as const,
};

export default CompatibilityEmail;
