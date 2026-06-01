/**
 * QuizInputCell — 친화 강의용 "직접 답해보기" (클릭형 객관식).
 *
 * 타이핑 없이 선택지 카드를 클릭 → 정답/오답 즉시 표시 + 해설 공개.
 * cell.source 는 JSON: { question: string, options: string[], correctIndex: number, explanation?: string }
 */

import { useMemo, useState } from "react";
import type { Cell } from "../../types/notebook";

interface Props {
  cell: Cell;
  isSelected: boolean;
}

interface Config {
  question?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
}

export function QuizInputCell({ cell }: Props) {
  const cfg = useMemo<Config>(() => {
    try {
      return JSON.parse(cell.source || "{}");
    } catch {
      return {};
    }
  }, [cell.source]);

  const [picked, setPicked] = useState<number | null>(null);
  const options = cfg.options ?? [];
  const answered = picked !== null;
  const correct = picked === cfg.correctIndex;

  return (
    <div className="my-2 rounded-xl border-l-4 border-amber-400/70 border border-amber-400/20 bg-amber-400/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">📝</span>
        <span className="font-semibold text-sm text-amber-200">직접 답해보기</span>
      </div>

      {cfg.question && (
        <p className="text-sm text-brand-text mb-3 whitespace-pre-line">{cfg.question}</p>
      )}

      <div className="grid gap-2">
        {options.map((opt, i) => {
          const isCorrect = i === cfg.correctIndex;
          const isPicked = i === picked;
          // 색상: 답하기 전 = 기본 / 답한 후 = 정답(초록), 내가 고른 오답(빨강)
          let cls = "border-brand-subtle bg-brand-bg/40 hover:border-amber-400/60 hover:bg-amber-400/10";
          if (answered) {
            if (isCorrect) cls = "border-emerald-400/70 bg-emerald-500/15";
            else if (isPicked) cls = "border-red-400/70 bg-red-500/15";
            else cls = "border-brand-subtle bg-brand-bg/40 opacity-60";
          }
          return (
            <button
              key={i}
              onClick={() => !answered && setPicked(i)}
              disabled={answered}
              className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all
                         flex items-center gap-2 ${cls} ${answered ? "cursor-default" : "cursor-pointer"}`}
            >
              <span className="shrink-0 w-5 h-5 rounded-full border border-current grid place-items-center text-[11px] opacity-80">
                {answered && isCorrect ? "✓" : answered && isPicked ? "✕" : String.fromCharCode(65 + i)}
              </span>
              <span className="text-brand-text">{opt}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-3 rounded-lg bg-brand-bg/50 border border-amber-400/30 px-3 py-2">
          <div className={`text-xs mb-1 font-medium ${correct ? "text-emerald-300" : "text-amber-300"}`}>
            {correct ? "✅ 정답이에요!" : "🤔 다시 볼까요?"}
          </div>
          {cfg.explanation && (
            <div className="text-sm whitespace-pre-wrap text-brand-text">{cfg.explanation}</div>
          )}
          <button
            onClick={() => setPicked(null)}
            className="mt-2 text-[11px] text-brand-textDim underline hover:text-brand-text"
          >
            다시 풀어보기
          </button>
        </div>
      )}
    </div>
  );
}
