"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/button";
import { buildWhatsAppLink } from "@/lib/share-links";

interface PartnerDeliveryProps {
  partnerName: string;
  partnerEmail: string;
  score: number;
  shareUrl: string;
  partnerDelivered: boolean;
  deliveredTo?: string;
  emailError?: string;
}

export function PartnerDelivery({
  partnerName,
  partnerEmail,
  score,
  shareUrl,
  partnerDelivered,
  deliveredTo,
  emailError,
}: PartnerDeliveryProps) {
  const [copied, setCopied] = useState(false);
  const whatsapp = buildWhatsAppLink(shareUrl, partnerName, score);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 space-y-3"
    >
      {partnerDelivered ? (
        <div className="rounded-xl border border-pink-500/30 bg-pink-500/10 px-4 py-3 text-center text-sm text-pink-200">
          Emailed {partnerEmail} automatically 💌
        </div>
      ) : deliveredTo ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-100">
          Could not reach {partnerEmail}. A copy was sent to {deliveredTo} —
          forward the link to {partnerName}.
        </div>
      ) : (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
          {emailError ?? `Could not email ${partnerEmail} automatically.`}
        </div>
      )}

      {!partnerDelivered && (
        <GlassCard className="p-4">
          <p className="mb-3 text-center text-xs text-white/50">
            Backup link for {partnerName}
          </p>
          <p className="mb-4 break-all rounded-lg bg-black/30 px-3 py-2 text-center text-xs text-pink-300">
            {shareUrl}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="flex-1" onClick={copyLink}>
              {copied ? "Copied!" : "Copy link"}
            </Button>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex-1"
            >
              <Button variant="secondary" className="w-full">
                WhatsApp {partnerName}
              </Button>
            </a>
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
}
