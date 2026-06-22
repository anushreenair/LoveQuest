"use client";

import { useState, useTransition, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { McqOptions } from "@/components/mcq-options";
import { ProgressBar } from "@/components/progress-bar";
import { PageTransition } from "@/components/page-transition";
import { CupidCatIntro } from "@/components/quest/cupid-cat-intro";
import { FantasyWorldBg } from "@/components/quest/fantasy-world-bg";
import { ConfettiCelebration } from "@/components/confetti-celebration";
import { useQuestFlow } from "@/hooks/use-quest-flow";
import { createGameSession } from "@/actions/game";

export default function QuestPage() {
  return (
    <Suspense>
      <QuestPageContent />
    </Suspense>
  );
}

function QuestPageContent() {
  const router = useRouter();
  const [introComplete, setIntroComplete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [celebrating, setCelebrating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  const {
    step,
    totalSteps,
    partnerName,
    setPartnerName,
    partnerBirthdate,
    setPartnerBirthdate,
    partnerEmail,
    setPartnerEmail,
    currentAnswer,
    selectAnswer,
    nextStep,
    prevStep,
    getFormData,
    isPartnerStepValid,
    isAnswerStepValid,
    isLastQuestion,
    currentMcq,
    questionIndex,
    questionCount,
  } = useQuestFlow();

  const submitQuest = useCallback(
    (includeCurrent: boolean, answerOverride?: string) => {
      setError(null);
      setCelebrating(true);
      startTransition(async () => {
        const result = await createGameSession(
          getFormData(includeCurrent, answerOverride)
        );
        if (result.success) {
          const q = new URLSearchParams();
          if (result.data.emailSent) q.set("sent", "1");
          if (result.data.partnerDelivered) q.set("partner", "1");
          if (result.data.deliveredTo) q.set("to", result.data.deliveredTo);
          if (result.data.emailError) q.set("error", result.data.emailError);
          q.set("celebrate", "1");
          const query = q.toString();
          router.push(
            `/results/${result.data.sessionId}${query ? `?${query}` : ""}`
          );
        } else {
          setCelebrating(false);
          setError(result.error);
        }
      });
    },
    [getFormData, router]
  );

  const handleSelectAnswer = (option: string) => {
    selectAnswer(option);
    if (isLastQuestion) {
      submitQuest(true, option);
    }
  };

  const handleQuestionNext = () => {
    if (isLastQuestion) {
      submitQuest(true);
      return;
    }
    nextStep();
  };

  const slideVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <>
      <ConfettiCelebration active={celebrating || isPending} duration={8000} />

      <AnimatePresence mode="wait">
        {!introComplete && (
          <CupidCatIntro key="intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <div className="relative min-h-screen">
        <FantasyWorldBg visible={introComplete} fullScreen />

        <Navbar />
        <main
          className={`relative z-10 min-h-screen px-4 pb-12 pt-24 transition-opacity duration-500 ${
            introComplete ? "opacity-100" : "invisible pointer-events-none"
          }`}
        >
          <div className="mx-auto max-w-xl">
            <PageTransition>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={introComplete ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="mb-8">
                  <ProgressBar current={step} total={totalSteps} />
                </div>

                <GlassCard glow className="p-6 sm:p-8">
                  <AnimatePresence mode="wait">
                    {step === 0 && (
                      <motion.div
                        key="partner"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="mb-6 text-center">
                          <span className="mb-4 block text-4xl">💕</span>
                          <h2 className="text-2xl font-bold text-white">
                            Who&apos;s your quest for?
                          </h2>
                          <p className="mt-2 text-white/50">
                            We&apos;ll email them the result automatically
                          </p>
                        </div>

                        <Input
                          label="Their Name"
                          placeholder="Enter their name"
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                        />

                        <Input
                          label="Their Birthdate"
                          type="date"
                          value={partnerBirthdate}
                          onChange={(e) =>
                            setPartnerBirthdate(e.target.value)
                          }
                        />

                        <Input
                          label="Their Email"
                          type="email"
                          placeholder="We'll send them the result"
                          value={partnerEmail}
                          onChange={(e) => setPartnerEmail(e.target.value)}
                          required
                        />

                        <Button
                          className="w-full"
                          onClick={nextStep}
                          disabled={!isPartnerStepValid}
                        >
                          Continue
                        </Button>
                      </motion.div>
                    )}

                    {step > 0 &&
                      step <= questionCount &&
                      currentMcq && (
                        <motion.div
                          key={`question-${questionIndex}`}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="mb-6 text-center">
                            <span className="text-sm font-medium text-pink-400">
                              Question {questionIndex + 1} of {questionCount}
                            </span>
                            <h2 className="mt-2 text-xl font-bold text-white">
                              {currentMcq.question}
                            </h2>
                            <p className="mt-2 text-sm text-white/40">
                              About {partnerName} — tap your answer
                            </p>
                          </div>

                          <McqOptions
                            options={[...currentMcq.options]}
                            selected={currentAnswer}
                            onSelect={handleSelectAnswer}
                          />

                          {error && (
                            <p className="text-center text-sm text-red-400">
                              {error}
                            </p>
                          )}

                          {celebrating || isPending ? (
                            <div className="flex flex-col items-center gap-3 py-6 text-center">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="h-10 w-10 rounded-full border-2 border-pink-500/30 border-t-pink-500"
                              />
                              <p className="text-sm text-pink-200">
                                Sending to {partnerEmail}… ✨
                              </p>
                            </div>
                          ) : (
                            <div className="flex gap-3">
                              <Button variant="secondary" onClick={prevStep}>
                                Back
                              </Button>
                              {!isLastQuestion && (
                                <Button
                                  className="flex-1"
                                  onClick={handleQuestionNext}
                                  disabled={!isAnswerStepValid}
                                >
                                  Next
                                </Button>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            </PageTransition>
          </div>
        </main>
      </div>
    </>
  );
}
