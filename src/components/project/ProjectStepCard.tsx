import { useState } from "react";
import { Markdown } from "../Markdown";
import type { ProjectStep } from "../../content/projects";

interface Props {
  index: number;
  step: string | ProjectStep;
  completed: boolean;
  onToggleCompleted: () => void;
}

/**
 * 프로젝트 상세 페이지의 단계 카드.
 *
 * - 단순 문자열 step → 헤더만 있는 읽기 전용 카드
 * - 리치 ProjectStep → 펼침 + 설명 + 힌트/정답 토글
 *
 * 완료 여부는 localStorage 에 저장 (부모가 관리, 이 컴포넌트는 callback 만).
 */
export function ProjectStepCard({ index, step, completed, onToggleCompleted }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);

  const isRich = typeof step !== "string";
  const title = isRich ? step.title : step;
  const hasBody = isRich && (step.description || step.hint || step.solution || step.checkpoint);

  return (
    <div
      className={`rounded-lg border overflow-hidden transition-colors ${
        completed
          ? "border-brand-green/40 bg-brand-green/5"
          : "border-brand-subtle bg-brand-panel"
      }`}
    >
      {/* 헤더 — 번호 + 체크박스 + 제목 + 펼침 버튼 */}
      <div className="flex items-start gap-3 p-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompleted();
          }}
          title={completed ? "완료 취소" : "완료 표시"}
          className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${
            completed
              ? "bg-brand-green/20 border-brand-green text-brand-green"
              : "bg-brand-bg border-brand-subtle text-brand-textDim hover:border-brand-primary hover:text-brand-primary"
          }`}
        >
          {completed ? "✓" : index + 1}
        </button>

        <div
          className={`flex-1 min-w-0 ${hasBody ? "cursor-pointer" : ""}`}
          onClick={() => hasBody && setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                completed ? "text-brand-textDim line-through" : "text-brand-text"
              }`}
            >
              {title}
            </span>
          </div>
        </div>

        {hasBody && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 text-brand-textDim hover:text-brand-primary text-xs px-2 py-1 rounded"
            aria-label={expanded ? "접기" : "펼치기"}
          >
            {expanded ? "▲" : "▼"}
          </button>
        )}
      </div>

      {/* 펼친 본문 */}
      {isRich && expanded && hasBody && (
        <div className="border-t border-brand-subtle px-4 pb-4 pt-3 space-y-3 bg-brand-bg/40">
          {step.description && (
            <div className="text-sm text-brand-text prose prose-invert max-w-none">
              <Markdown content={step.description} />
            </div>
          )}

          {step.checkpoint && (
            <div className="text-xs text-brand-textDim border-l-2 border-brand-accent/50 pl-3 py-1">
              ✅ <span className="font-medium text-brand-text">체크포인트</span>{" "}
              — {step.checkpoint}
            </div>
          )}

          {/* 힌트 & 정답 버튼 줄 */}
          {(step.hint || step.solution) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {step.hint && (
                <button
                  onClick={() => setHintOpen(!hintOpen)}
                  className="text-xs px-3 py-1.5 rounded-full border border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow/20 transition-colors"
                >
                  {hintOpen ? "💡 힌트 숨기기" : "💡 힌트 보기"}
                </button>
              )}
              {step.solution && (
                <button
                  onClick={() => setSolutionOpen(!solutionOpen)}
                  className="text-xs px-3 py-1.5 rounded-full border border-brand-primary/40 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors"
                >
                  {solutionOpen ? "👀 정답 숨기기" : "👀 정답 보기"}
                </button>
              )}
            </div>
          )}

          {hintOpen && step.hint && (
            <div className="text-sm text-brand-text bg-brand-yellow/10 border border-brand-yellow/30 rounded px-3 py-2">
              💡 {step.hint}
            </div>
          )}

          {solutionOpen && step.solution && (
            <pre className="text-[12px] font-mono text-brand-text bg-[#1e1e1e] border border-brand-subtle rounded p-3 overflow-x-auto whitespace-pre">
              {step.solution}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
