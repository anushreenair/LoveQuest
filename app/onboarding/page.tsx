import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata = {
  title: "Welcome — LoveQuest",
  description: "Set up your LoveQuest profile",
};

/**
 * Protected onboarding page — only accessible after Google sign-in.
 * Middleware + server-side auth check provide defense in depth.
 */
export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { user } = session;

  return (
    <div className="love-gradient love-glow relative flex min-h-screen items-center justify-center px-6 py-16">
      <div className="relative z-10 w-full max-w-lg">
        <GlassCard className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-2xl shadow-lg shadow-pink-500/30">
            ♥
          </div>

          <h1 className="font-display text-3xl font-bold text-white">
            Welcome{user.name ? `, ${user.name.split(" ")[0]}` : ""}!
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-pink-100/70">
            You&apos;re signed in with Google. Next we&apos;ll help you set up
            your first LoveQuest — a romantic journey made just for your
            partner.
          </p>

          {user.image && (
            <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.image}
                alt={user.name ?? "Profile"}
                className="h-10 w-10 rounded-full border border-white/20"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-pink-200/60">{user.email}</p>
              </div>
            </div>
          )}

          <p className="mt-8 text-xs text-pink-200/40">
            Onboarding steps coming in the next build phase.
          </p>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="mt-6"
          >
            <button
              type="submit"
              className="text-sm text-pink-200/50 transition-colors hover:text-pink-200"
            >
              Sign out
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
