"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useState, useTransition } from "react";
import { submitLoveQuotient } from "@/app/game/actions";
import { CinematicIntro } from "@/components/game/CinematicIntro";
import { GameProgress } from "@/components/game/GameProgress";
import { QuestionGuideBeat } from "@/components/game/QuestionGuideBeat";
import { QuestionStage } from "@/components/game/questions/QuestionStage";
import { ResultsScreen } from "@/components/game/ResultsScreen";
import { getGuideLineForQuestion, getReactionLine } from "@/lib/lq/guide";
import { LQ_QUESTIONS } from "@/lib/lq/questions";

type Phase = "cinematic" | "playing" | "results";

interface AdventureGameProps {
  partnerName?: string;
  partnerEmail?: string;
}

export function AdventureGame({
  partnerName,
  partnerEmail,
}: AdventureGameProps) {
  const [phase, setPhase] = useState<Phase>("cinematic");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [answerIndices, setAnswerIndices] = useState<(number | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    score: number;
    personalityLabel: string;
    personalityEmoji: string;
    personalityTagline: string;
    personalityGradient: string;
    characterComment: string;
    emailSent: boolean;
    userEmailSent: boolean;
    emailError?: string;
    partnerEmail: string;
    shareUrl: string;
  } | null>(null);

  const question = LQ_QUESTIONS[questionIndex];
  const guideLine = getGuideLineForQuestion(questionIndex);

  const restoreSelectionForQuestion = useCallback((index: number) => {
    const savedOptionIndex = answerIndices[index];
    if (savedOptionIndex !== null && savedOptionIndex !== undefined) {
      setSelectedIndex(savedOptionIndex);
      setShowReaction(true);
    } else {
      setSelectedIndex(null);
      setShowReaction(false);
    }
  }, [answerIndices]);

  function handleSelect(index: number, score: number) {
    setSelectedIndex(index);
    const nextIndices = [...answerIndices];
    nextIndices[questionIndex] = index;
    setAnswerIndices(nextIndices);
    const nextScores = [...answers];
    nextScores[questionIndex] = score;
    setAnswers(nextScores);
    setShowReaction(true);
    setError(null);
  }

  function handleBack() {
    if (questionIndex <= 0 || isPending) return;
    const prev = questionIndex - 1;
    setQuestionIndex(prev);
    restoreSelectionForQuestion(prev);
    setError(null);
  }

  function handleContinue() {
    if (selectedIndex === null) return;

    if (questionIndex < LQ_QUESTIONS.length - 1) {
      setQuestionIndex((i) => i + 1);
      restoreSelectionForQuestion(questionIndex + 1);
      return;
    }

    startTransition(async () => {
      const final = [...answers];
      final[questionIndex] =
        question.options[selectedIndex]?.score ?? 0;

      const result = await submitLoveQuotient(final);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setResults({
        score: result.score,
        personalityLabel: result.personalityLabel,
        personalityEmoji: result.personalityEmoji,
        personalityTagline: result.personalityTagline,
        personalityGradient: result.personalityGradient,
        characterComment: result.characterComment,
        emailSent: result.emailSent,
        userEmailSent: result.userEmailSent,
        emailError: result.emailError,
        partnerEmail: result.partnerEmail,
        shareUrl: result.shareUrl,
      });
      setPhase("results");
    });
  }

  if (phase === "cinematic") {
    return <CinematicIntro onComplete={() => setPhase("playing")} />;
  }

  if (phase === "results" && results) {
    return (
      <ResultsScreen
        score={results.score}
        personalityLabel={results.personalityLabel}
        personalityEmoji={results.personalityEmoji}
        personalityTagline={results.personalityTagline}
        personalityGradient={results.personalityGradient}
        characterComment={results.characterComment}
        emailSent={results.emailSent}
        userEmailSent={results.userEmailSent}
        emailError={results.emailError}
        partnerName={partnerName}
        partnerEmail={results.partnerEmail}
        shareUrl={results.shareUrl}
        onEmailResent={(sent, err) => {
          setResults((r) =>
            r ? { ...r, emailSent: sent, emailError: err } : r,
          );
        }}
      />
    );
  }

  return (
    <div className="pb-8">
      <GameProgress
        current={questionIndex + 1}
        total={LQ_QUESTIONS.length}
      />

      {error && (
        <p className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <AnimatePresence mode="wait">
        <div key={questionIndex}>
          <QuestionGuideBeat message={guideLine} category={question.category} />

          {showReaction && selectedIndex !== null && (
            <p className="-mt-2 mb-4 text-center text-xs italic text-pink-200/50">
              {getReactionLine(questionIndex + selectedIndex)}
            </p>
          )}

          <QuestionStage
            question={question}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
            onContinue={handleContinue}
            onBack={handleBack}
            canGoBack={questionIndex > 0}
            isLast={questionIndex === LQ_QUESTIONS.length - 1}
            isLoading={isPending}
          />
        </div>
      </AnimatePresence>
    </div>
  );
}
