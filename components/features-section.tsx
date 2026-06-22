"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";

const features = [
  {
    icon: "✨",
    title: "Cosmic Compatibility",
    description:
      "Our AI analyzes zodiac alignments and your answers to reveal your true connection score.",
  },
  {
    icon: "💬",
    title: "Deep Questions",
    description:
      "Thoughtfully crafted questions that uncover what really matters in a relationship.",
  },
  {
    icon: "📧",
    title: "Share the Magic",
    description:
      "Send beautiful compatibility results directly to your partner's inbox.",
  },
];

export function FeaturesSection() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
        {features.map((feature, i) => (
          <GlassCard key={feature.title} glow className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="mb-4 block text-3xl">{feature.icon}</span>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-white/50">{feature.description}</p>
            </motion.div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
