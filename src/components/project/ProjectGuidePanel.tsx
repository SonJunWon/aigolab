import { useEffect, useState } from "react";
import { Markdown } from "../Markdown";
import type { Project } from "../../content/projects";

interface Props {
  project: Project;
  /** 단계 클릭 시 에디터를 해당 STEP 앵커로 스크롤 시킬 콜백 */
  onStepClick?: (stepMarker: string | undefined, index: number) => void;
  /** 진행도 localStorage 키 (프로젝트별) */
  progressKey: string;
}

function loadProgress(key: string): Set<number> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}
function saveProgress(key: string, done: Set<number>) {
  try {
    localStorage.setItem(key, JSON.stringify([...done]));
  } catch {
    // ignore
  }
}

/**
 * 프로젝트 모드 IDE 의 우측 가이드 패널.
 *
 * - 상단: 접이식 프로젝트 소개 + 진행률 바 + 재시작
 * - 본문: 아코디언 단계 카드 (한 번에 하나 펼침)
 * - 각 카드: 설명 마크다운 + 💡 힌트 + 📋 스니펫 복사 + 👀 정답 복사
 * - 완료 체크 시 다음 단계 자동 펼침
 */
export function ProjectGuidePanel({ project, onStepClick, progressKey }: Props) {
  const total = project.steps.length;

  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [expandedIdx, setExpandedIdx] = useState<number>(0); // 초기엔 첫 단계 펼침
  const [introOpen, setIntroOpen] = useState<boolean>(false);

  useEffect(() => {
    const initial = loadProgress(progressKey);
    setCompleted(initial);
    // 체크 안 된 첫 단계를 자동 펼침
    for (let i = 0; i < total; i++) {
      if (!initial.has(i)) {
        setExpandedIdx(i);
        break;
      }
    }
  }, [progressKey, total]);

  const toggleComplete = (i: number) => {
    const next = new Set(completed);
    if (next.has(i)) {
      next.delete(i);
    } else {
      next.add(i);
      // 완료 시 다음 미완료 단계 자동 펼침
      for (let k = i + 1; k < total; k++) {
        if (!next.has(k)) {
          setExpandedIdx(k);
          break;
        }
      }
    }
    setCompleted(next);
    saveProgress(progressKey, next);
  };

  const resetProgress = () => {
    if (!confirm("진행도를 초기화하시겠어요?")) return;
    setCompleted(new Set());
    saveProgress(progressKey, new Set());
    setExpandedIdx(0);
  };

  const doneCount = completed.size;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="h-full flex flex-col bg-brand-panel text-brand-text text-sm">
      {/* ── 헤더: 진행률 + 액션 ── */}
      <div className="shrink-0 px-3 py-2.5 border-b border-brand-subtle bg-brand-panel/90">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[11px] uppercase tracking-wider text-brand-textDim">
            진행도
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-brand-textDim">
              {doneCount} / {total}
            </span>
            <button
              onClick={resetProgress}
              className="text-[10px] text-brand-textDim hover:text-brand-primary"
              title="진행도 초기화"
              disabled={doneCount === 0}
            >
              ↺
            </button>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-brand-subtle overflow-hidden">
          <div
            className="h-full bg-brand-primary transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* ── 본문 스크롤 영역 ── */}
      <div className="flex-1 overflow-y-auto">
        {/* 프로젝트 소개 — 접이식 */}
        <div className="border-b border-brand-subtle">
          <button
            onClick={() => setIntroOpen(!introOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-brand-hover/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">📖</span>
              <span className="text-[13px] font-medium">프로젝트 소개</span>
            </div>
            <span className="text-brand-textDim text-xs">
              {introOpen ? "▲" : "▼"}
            </span>
          </button>
          {introOpen && (
            <div className="px-3 pb-3 text-[12.5px] leading-relaxed">
              <Markdown content={project.description} />
            </div>
          )}
        </div>

        {/* 단계 아코디언 */}
        <div className="divide-y divide-brand-subtle">
          {project.steps.map((step, i) => {
            const isRich = typeof step !== "string";
            const title = isRich ? step.title : step;
            const done = completed.has(i);
            const expanded = expandedIdx === i;

            const stepMarker = isRich ? step.stepMarker : undefined;
            const description = isRich ? step.description : undefined;
            const hint = isRich ? step.hint : undefined;
            const snippet = isRich ? step.snippet : undefined;
            const solution = isRich ? step.solution : undefined;
            const checkpoint = isRich ? step.checkpoint : undefined;

            return (
              <div key={i} className={done ? "bg-brand-green/5" : ""}>
                {/* 헤더 */}
                <div className="flex items-start gap-2 px-3 py-2">
                  <button
                    onClick={() => toggleComplete(i)}
                    title={done ? "완료 취소" : "완료 표시"}
                    className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold transition-colors ${
                      done
                        ? "bg-brand-green/20 border-brand-green text-brand-green"
                        : "bg-brand-bg border-brand-subtle text-brand-textDim hover:border-brand-primary hover:text-brand-primary"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </button>
                  <button
                    onClick={() => {
                      setExpandedIdx(expanded ? -1 : i);
                      onStepClick?.(stepMarker, i);
                    }}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div
                      className={`text-[12.5px] leading-snug ${
                        done ? "text-brand-textDim line-through" : "text-brand-text"
                      }`}
                    >
                      {title}
                    </div>
                  </button>
                </div>

                {/* 펼친 본문 */}
                {expanded && isRich && (
                  <div className="px-3 pb-3 space-y-2.5 bg-brand-bg/40">
                    {description && (
                      <div className="text-[12px] leading-relaxed pt-1">
                        <Markdown content={description} />
                      </div>
                    )}

                    {checkpoint && (
                      <div className="text-[11px] text-brand-textDim border-l-2 border-brand-accent/50 pl-2 py-0.5 leading-snug">
                        ✅ <span className="text-brand-text font-medium">체크포인트</span>{" "}
                        — {checkpoint}
                      </div>
                    )}

                    {/* 힌트 / 스니펫 / 정답 */}
                    <div className="space-y-2">
                      {hint && <RevealButton label="💡 힌트" content={hint} copyable={false} />}
                      {snippet && (
                        <RevealButton
                          label="📋 스니펫"
                          content={snippet}
                          copyable={true}
                          isCode={true}
                        />
                      )}
                      {solution && (
                        <RevealButton
                          label="👀 정답 (전체)"
                          content={solution}
                          copyable={true}
                          isCode={true}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {percent === 100 && (
          <div className="m-3 p-3 rounded-lg border border-brand-green/40 bg-brand-green/5 text-center">
            <div className="text-2xl mb-1">🎉</div>
            <div className="text-[12px] font-semibold text-brand-green">
              프로젝트 완주!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 작은 공개형 버튼 — 클릭 시 펼치고, 코드면 복사 버튼까지
// ─────────────────────────────────────────────────────────
function RevealButton({
  label,
  content,
  copyable,
  isCode,
}: {
  label: string;
  content: string;
  copyable: boolean;
  isCode?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
          label.startsWith("💡")
            ? "border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow/20"
            : label.startsWith("📋")
            ? "border-brand-accent/40 bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20"
            : "border-brand-primary/40 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20"
        }`}
      >
        {open ? `▲ ${label} 숨기기` : label}
      </button>
      {open && (
        <div className="mt-1.5">
          {isCode ? (
            <div className="relative">
              <pre className="text-[11.5px] font-mono text-brand-text bg-[#1e1e1e] border border-brand-subtle rounded p-2.5 pr-14 overflow-x-auto whitespace-pre leading-snug">
                {content}
              </pre>
              {copyable && (
                <button
                  onClick={copy}
                  className="absolute top-1.5 right-1.5 text-[10px] px-1.5 py-0.5 rounded bg-brand-subtle text-brand-text hover:bg-brand-primary/40 transition-colors"
                >
                  {copied ? "✓ 복사됨" : "📋 복사"}
                </button>
              )}
            </div>
          ) : (
            <div className="text-[12px] text-brand-text bg-brand-yellow/10 border border-brand-yellow/30 rounded px-2.5 py-1.5 leading-snug">
              {content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
