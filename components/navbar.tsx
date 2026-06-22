"use client";

import { APP_NAME } from "@/lib/brand";
import Link from "next/link";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-2xl">💕</span>
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-xl font-bold text-transparent">
            {APP_NAME}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden text-sm text-white/60 transition-colors hover:text-white sm:block"
              >
                Dashboard
              </Link>
              <Link
                href="/quest"
                className="hidden text-sm text-white/60 transition-colors hover:text-white sm:block"
              >
                New
              </Link>
              <div className="flex items-center gap-3">
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-pink-500/30"
                  />
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
