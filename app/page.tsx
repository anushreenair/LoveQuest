import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { APP_NAME } from "@/lib/brand";

export default async function HomePage() {
  const session = await auth();

  return (
    <>
      <Navbar user={session?.user} />
      <main className="relative min-h-screen pt-16">
        <HeroSection isLoggedIn={!!session} />

        <footer className="relative z-10 border-t border-white/5 py-8 text-center text-sm text-white/30">
          <p>© {new Date().getFullYear()} {APP_NAME}</p>
        </footer>
      </main>
    </>
  );
}
