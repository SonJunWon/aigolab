import { useState } from "react";
import type { QuizQuestion as QuizQuestionType } from "../../types/quiz";

interface Props {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswered: (correct: boolean) => void;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswered,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === question.correctIndex;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
  };

  const handleNext = () => {
    onAnswered(isCorrect);
  };

  return (
    <div>
      {/* 진행 표시 + 버튼 (같은 줄) */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <span className="text-xs text-colab-textDim uppercase tracking-wider shrink-0">
          문제 {questionNumber} / {totalQuestions}
        </span>
        <div className="flex-1 h-1 rounded-full bg-colab-bg overflow-hidden">
          <div
            className="h-full bg-colab-accent transition-all duration-300"
            style={{
              width: `${((questionNumber - 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
        {/* 정답 확인 / 다음 문제 버튼을 헤더 우측에 배치 — 스크롤 없이 바로 접근 */}
        <div className="shrink-0">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className="px-4 py-1.5 text-xs rounded-lg bg-colab-accent text-colab-bg font-medium
                         hover:bg-colab-accentDim disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors"
            >
              정답 확인
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-1.5 text-xs rounded-lg bg-colab-accent text-colab-bg font-medium
                         hover:bg-colab-accentDim transition-colors"
            >
              {questionNumber < totalQuestions ? "다음 문제 →" : "결과 보기"}
            </button>
          )}
        </div>
      </div>

      {/* 질문 */}
      <h3 className="text-base font-medium text-colab-text mb-3">
        {question.question}
      </h3>

      {/* 코드 블록 (predict-output) */}
      {question.code && (
        <pre className="mb-4 p-3 rounded bg-colab-bg border border-colab-subtle font-mono text-sm text-colab-text overflow-x-auto">
          {question.code}
        </pre>
      )}

      {/* 선택지 */}
      <div className="space-y-2 mb-4">
        {question.options.map((option, idx) => {
          let borderClass = "border-colab-subtle hover:border-colab-accent/60";
          let bgClass = "bg-colab-bg";

          if (submitted) {
            if (idx === question.correctIndex) {
              borderClass = "border-colab-green";
              bgClass = "bg-colab-green/10";
            } else if (idx === selected && !isCorrect) {
              borderClass = "border-colab-red";
              bgClass = "bg-colab-red/10";
            } else {
              borderClass = "border-colab-subtle/50";
            }
          } else if (idx === selected) {
            borderClass = "border-colab-accent ring-2 ring-colab-accent/30";
            bgClass = "bg-colab-accent/5";
          }

          return (
            <button
              key={idx}
              onClick={() => !submitted && setSelected(idx)}
              disabled={submitted}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all
                ${borderClass} ${bgClass}
                ${submitted ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs shrink-0
                    ${
                      submitted && idx === question.correctIndex
                        ? "border-colab-green text-colab-green bg-colab-green/20"
                        : submitted && idx === selected && !isCorrect
                        ? "border-colab-red text-colab-red bg-colab-red/20"
                        : idx === selected
                        ? "border-colab-accent text-colab-accent bg-colab-accent/20"
                        : "border-colab-subtle text-colab-textDim"
                    }`}
                >
                  {submitted && idx === question.correctIndex
                    ? "✓"
                    : submitted && idx === selected && !isCorrect
                    ? "✕"
                    : String.fromCharCode(65 + idx)}
                </div>
                <span
                  className={`text-sm font-mono whitespace-pre-line ${
                    submitted && idx === question.correctIndex
                      ? "text-colab-green"
                      : submitted && idx !== selected
                      ? "text-colab-textDim"
                      : "text-colab-text"
                  }`}
                >
                  {option}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 정답 후 해설 */}
      {submitted && (
        <div
          className={`mb-4 p-4 rounded-lg border ${
            isCorrect
              ? "border-colab-green/40 bg-colab-green/5"
              : "border-colab-red/40 bg-colab-red/5"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{isCorrect ? "🎉" : "💡"}</span>
            <span
              className={`font-medium text-sm ${
                isCorrect ? "text-colab-green" : "text-colab-red"
              }`}
            >
              {isCorrect ? "정답!" : "아쉬워요!"}
            </span>
          </div>
          <p className="text-sm text-colab-text leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}

      {/* 하단에도 버튼 유지 — 해설이 길 때 아래에서도 접근 가능 */}
      <div className="flex justify-end gap-2 mt-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="px-5 py-2 text-sm rounded-lg bg-colab-accent text-colab-bg font-medium
                       hover:bg-colab-accentDim disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors"
          >
            정답 확인
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-5 py-2 text-sm rounded-lg bg-colab-accent text-colab-bg font-medium
                       hover:bg-colab-accentDim transition-colors"
          >
            {questionNumber < totalQuestions ? "다음 문제 →" : "결과 보기"}
          </button>
        )}
      </div>
    </div>
  );
}
