"use client";

import { useState, useCallback } from "react";
import { QUEST_MCQ } from "@/lib/quest-questions";

export function useQuestFlow() {
  const [step, setStep] = useState(0);
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthdate, setPartnerBirthdate] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");

  const questionCount = QUEST_MCQ.length;
  const totalSteps = questionCount + 1;

  const nextStep = useCallback(() => {
    if (step > 0 && step <= questionCount) {
      setAnswers((prev) => ({ ...prev, [step - 1]: currentAnswer }));
      setCurrentAnswer("");
    }
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }, [step, currentAnswer, questionCount, totalSteps]);

  const prevStep = useCallback(() => {
    if (step > 1 && step <= questionCount) {
      const prevAnswer = answers[step - 2] ?? "";
      setCurrentAnswer(prevAnswer);
    }
    setStep((s) => Math.max(s - 1, 0));
  }, [step, answers, questionCount]);

  const selectAnswer = useCallback((option: string) => {
    setCurrentAnswer(option);
  }, []);

  const getFormData = useCallback(
    (includeCurrent = false, answerOverride?: string) => {
      const mergedAnswers = { ...answers };
      if (includeCurrent && step > 0 && step <= questionCount) {
        mergedAnswers[step - 1] = answerOverride ?? currentAnswer;
      }

      const formData = new FormData();
      formData.set("partnerName", partnerName);
      formData.set("partnerBirthdate", partnerBirthdate);
      formData.set("partnerEmail", partnerEmail);
      formData.set(
        "answers",
        JSON.stringify(
          QUEST_MCQ.map((q, i) => ({
            question: q.question,
            answer: mergedAnswers[i] ?? "",
          }))
        )
      );
      return formData;
    },
    [partnerName, partnerBirthdate, partnerEmail, answers, step, questionCount, currentAnswer]
  );

  const isPartnerStepValid =
    partnerName.length >= 2 &&
    partnerBirthdate.length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerEmail);
  const isAnswerStepValid = currentAnswer.length > 0;
  const isLastQuestion = step === questionCount;

  const questionIndex = step - 1;
  const currentMcq =
    step > 0 && step <= questionCount ? QUEST_MCQ[questionIndex] : null;

  return {
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
    answers,
    nextStep,
    prevStep,
    getFormData,
    isPartnerStepValid,
    isAnswerStepValid,
    isLastQuestion,
    currentMcq,
    questionIndex,
    questionCount,
  };
}
