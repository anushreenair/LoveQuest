"use client";

import { useState } from "react";

interface PartnerShareBannerProps {
  shareUrl: string;
  partnerName: string;
}

export function PartnerShareBanner({
  shareUrl,
  partnerName,
}: PartnerShareBannerProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt(`Copy this link for ${partnerName}:`, shareUrl);
    }
  }

  return (
    <div className="mb-6 rounded-2xl border border-pink-400/30 bg-pink-500/10 p-4">
      <p className="text-sm font-semibold text-pink-100">
        Send results to {partnerName}
      </p>
      <p className="mt-1 text-xs text-pink-200/70">
        Email may be blocked in test mode — copy this link and text it to them.
      </p>
      <button
        type="button"
        onClick={copyLink}
        className="mt-3 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-2.5 text-sm font-semibold text-white"
      >
        {copied ? "Link copied!" : "Copy partner results link"}
      </button>
    </div>
  );
}
