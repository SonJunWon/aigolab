import { useEffect, useState } from "react";
import type { Quiz } from "../../types/quiz";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResult } from "./QuizResult";
import { useAuthStore } from "../../store/authStore";
import { saveQuizResult } from "../../storage/supabaseQuizRepo";
import { incrementCompletedToday } from "../../storage/supabaseActivityRepo";

interface Props {
  quiz: Quiz;
  /** 퀴즈 ID (서버 저장용) */
  quizId?: string;
  onNext?: () => void;
  /** 퀴즈 완료 시 콜백 (점수, 총점) */
  onComplete?: (score: number, total: number) => void;
}

type Phase = "intro" | "questions" | "result";

export function QuizPanel({ quiz, quizId, onNext, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const user = useAuthStore((s) => s.user);

  // 결과 단계에 도달하면 서버에 저장 + 콜백
  useEffect(() => {
    if (phase === "result") {
      if (user && quizId) {
        void saveQuizResult(user.id, quizId, correctCount, quiz.questions.length);
        void incrementCompletedToday(user.id); // 오늘 활동 카운트
      }
      onComplete?.(correctCount, quiz.questions.length);
    }
  }, [phase, user, quizId, correctCount, quiz.questions.length, onComplete]);

  const handleStart = () => {
    setPhase("questions");
    setCurrentQ(0);
    setCorrectCount(0);
  };

  const handleAnswered = (correct: boolean) => {
    if (correct) setCorrectCount((c) => c + 1);
    if (currentQ + 1 < quiz.questions.length) {
      setCurrentQ((q) => q + 1);
    } else {
      setPhase("result");
    }
  };

  const handleRetry = () => {
    setPhase("questions");
    setCurrentQ(0);
    setCorrectCount(0);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 pb-10">
      <div className="rounded-xl border border-colab-subtle bg-colab-panel overflow-hidden">
        <div className="px-6 py-5">
          {phase === "intro" && (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-lg font-semibold text-colab-text mb-2">{quiz.title}</h3>
              <p className="text-sm text-colab-textDim mb-5">
                {quiz.questions.length}개의 문제로 이 챕터에서 배운 것을 확인해봐요.
              </p>
              <button onClick={handleStart}
                className="px-6 py-2.5 text-sm rounded-lg bg-colab-accent text-colab-bg font-medium hover:bg-colab-accentDim transition-colors">
                퀴즈 시작
              </button>
            </div>
          )}
          {phase === "questions" && (
            <QuizQuestion key={currentQ} question={quiz.questions[currentQ]}
              questionNumber={currentQ + 1} totalQuestions={quiz.questions.length}
              onAnswered={handleAnswered} />
          )}
          {phase === "result" && (
            <QuizResult title={quiz.title} total={quiz.questions.length}
              correct={correctCount} onRetry={handleRetry} onNext={onNext} />
          )}
        </div>
      </div>
    </div>
  );
}
