import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { GradientBackground } from "@/components/gradient-background";
import { APP_NAME } from "@/lib/brand";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Find out how compatible you are with someone special.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen`}>
        <Providers>
          <GradientBackground />
          {children}
        </Providers>
      </body>
    </html>
  );
}
