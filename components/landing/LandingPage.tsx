import { FloatingHearts } from "@/components/landing/FloatingHearts";
import { HeroSection } from "@/components/landing/HeroSection";
import { LandingNavbar } from "@/components/landing/LandingNavbar";

/**
 * Full landing page shell — gradient background, hearts, and hero.
 */
export function LandingPage() {
  return (
    <div className="love-gradient love-glow relative min-h-screen overflow-hidden">
      <FloatingHearts />
      <LandingNavbar />
      <main>
        <HeroSection />
      </main>

      <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-center text-xs text-pink-200/40">
        © {new Date().getFullYear()} LoveQuest · Made with ♥ for couples everywhere
      </footer>
    </div>
  );
}
