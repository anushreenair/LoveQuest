"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useTransition } from "react";
import { resendPartnerEmail } from "@/app/game/actions";
import { ConfettiCelebration } from "@/components/game/ConfettiCelebration";
import { LumiCharacter } from "@/components/game/mascot/LumiCharacter";
import { GuideBubble } from "@/components/game/mascot/GuideBubble";

interface ResultsScreenProps {
  score: number;
  personalityLabel: string;
  personalityEmoji: string;
  personalityTagline: string;
  personalityGradient: string;
  characterComment: string;
  emailSent: boolean;
  userEmailSent?: boolean;
  emailError?: string;
  partnerName?: string;
  partnerEmail?: string;
  shareUrl: string;
  onEmailResent?: (sent: boolean, error?: string) => void;
}

export function ResultsScreen({
  score,
  personalityLabel,
  personalityEmoji,
  personalityTagline,
  personalityGradient,
  characterComment,
  emailSent: initialEmailSent,
  userEmailSent: initialUserEmailSent = false,
  emailError: initialEmailError,
  partnerName,
  partnerEmail,
  shareUrl: initialShareUrl,
  onEmailResent,
}: ResultsScreenProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [emailSent, setEmailSent] = useState(initialEmailSent);
  const [userEmailSent, setUserEmailSent] = useState(initialUserEmailSent);
  const [emailError, setEmailError] = useState(initialEmailError);
  const [shareUrl, setShareUrl] = useState(initialShareUrl);
  const [copied, setCopied] = useState(false);
  const [isResending, startResend] = useTransition();

  useEffect(() => {
    const start = performance.now();
    const duration = 1800;

    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      setDisplayScore(Math.round(score * p));
      if (p < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [score]);

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link for your partner:", shareUrl);
    }
  }

  function handleResendEmail() {
    startResend(async () => {
      const result = await resendPartnerEmail(
        score,
        personalityLabel,
        personalityEmoji,
        characterComment,
      );

      if (result.shareUrl) {
        setShareUrl(result.shareUrl);
      }

      if (result.success) {
        setEmailSent(true);
        setUserEmailSent(result.userEmailSent ?? false);
        setEmailError(undefined);
        onEmailResent?.(true);
      } else {
        setEmailError(result.error);
        onEmailResent?.(false, result.error);
      }
    });
  }

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#4a1942]">
      <ConfettiCelebration />

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, delay: 0.2 }}
        >
          <LumiCharacter pose="celebrate" size={180} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-pink-300"
        >
          Couple Compatibility Score
        </motion.p>

        <motion.p
          className={`mt-2 bg-gradient-to-r bg-clip-text font-display text-8xl font-bold text-transparent ${personalityGradient}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {displayScore}
          <span className="text-4xl text-pink-200/50">/100</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 w-full rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl"
        >
          <p className="text-center text-xs font-bold uppercase tracking-widest text-pink-300">
            Relationship Type
          </p>
          <p className="mt-2 text-center font-display text-3xl font-bold text-white">
            {personalityEmoji} {personalityLabel}
          </p>
          <p className="mt-3 text-center text-sm text-pink-100/70">
            {personalityTagline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mt-6 w-full"
        >
          <GuideBubble message={characterComment} large />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-pink-300/80">
            Share with your partner
          </p>
          {partnerEmail && (
            <p className="mt-1 text-center text-sm text-pink-100/80">
              {partnerEmail}
            </p>
          )}

          {emailSent ? (
            <div className="mt-3 space-y-1 text-center text-sm text-emerald-300/90">
              <p>
                💌 Results emailed to {partnerName ?? "your partner"}!
              </p>
              {userEmailSent && (
                <p className="text-emerald-300/70">
                  A copy was sent to your inbox too.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-center text-sm text-amber-200/90">
              {emailError ??
                "Email could not be delivered. Send the link below instead."}
            </p>
          )}

          <div className="mt-4 space-y-2">
            <p className="text-center text-xs text-pink-200/60">
              Works for any email — text, WhatsApp, or DM this link:
            </p>
            <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
              <p className="break-all text-center text-xs text-pink-100/90">
                {shareUrl}
              </p>
            </div>
            <button
              type="button"
              onClick={copyShareLink}
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-sm font-semibold text-white"
            >
              {copied ? "Link copied!" : "Copy link for partner ♥"}
            </button>
          </div>

          {!emailSent && (
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={isResending}
              className="mt-3 w-full rounded-xl border border-white/20 py-2.5 text-sm text-pink-100/90 disabled:opacity-60"
            >
              {isResending ? "Sending…" : "Try sending email again"}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
