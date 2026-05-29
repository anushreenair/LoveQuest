import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "LoveQuest — Turn Your Love Story Into an Unforgettable Quest",
  description:
    "Create personalized, interactive romantic experiences for your partner. Puzzles, surprises, and moments they'll never forget.",
  keywords: ["love", "romantic", "couples", "interactive", "quest", "surprise"],
  openGraph: {
    title: "LoveQuest",
    description: "Turn your love story into an unforgettable quest.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
