"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/button";

interface QuestEntryButtonProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children?: React.ReactNode;
}

export function QuestEntryButton({
  size = "lg",
  variant = "primary",
  className = "",
  children = "Start",
}: QuestEntryButtonProps) {
  const router = useRouter();

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={() => router.push("/quest")}
    >
      {children}
    </Button>
  );
}
