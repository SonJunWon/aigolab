import { useState } from "react";
import { useNotebookStore } from "../../store/notebookStore";

interface Props {
  cellId: string;
  hints: string[];
  solution?: string;
}

/**
 * 단계별 힌트 + 정답 보기 패널.
 *
 * UX:
 *   1. 처음: "💡 힌트 보기" 버튼만
 *   2. 클릭: 힌트 1 노출, "다음 힌트 →" 버튼
 *   3. 마지막 힌트: "🔑 정답 보기" 버튼 (solution 있을 때만)
 *   4. 정답 보기 클릭 → 확인 후 셀 source를 solution으로 교체
 */
export function HintPanel({ cellId, hints, solution }: Props) {
  const [shownCount, setShownCount] = useState(0);
  const updateSource = useNotebookStore((s) => s.updateSource);

  const hasMoreHints = shownCount < hints.length;
  const allHintsShown = shownCount === hints.length;

  const showNextHint = () => {
    setShownCount((c) => Math.min(c + 1, hints.length));
  };

  const hideAll = () => {
    setShownCount(0);
  };

  const revealSolution = () => {
    if (!solution) return;
    const ok = confirm(
      "정답 코드로 교체하시겠습니까?\n현재 작성한 코드는 사라집니다."
    );
    if (ok) {
      updateSource(cellId, solution);
    }
  };

  // 아직 첫 힌트도 안 열었으면 버튼 한 줄만
  if (shownCount === 0) {
    return (
      <div className="border-t border-colab-subtle/60 bg-colab-bg/40 px-4 py-2">
        <button
          onClick={showNextHint}
          className="text-xs text-colab-textDim hover:text-colab-accent transition-colors"
        >
          💡 힌트 보기 ({hints.length}개)
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-colab-subtle/60 bg-colab-bg/40">
      <div className="px-4 py-3">
        {/* 지금까지 열린 힌트들 */}
        <div className="space-y-2">
          {hints.slice(0, shownCount).map((hint, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-sm text-colab-text"
            >
              <span className="shrink-0 text-xs text-colab-accent font-medium mt-0.5">
                힌트 {i + 1}
              </span>
              <span
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderInlineCode(hint) }}
              />
            </div>
          ))}
        </div>

        {/* 액션 버튼 */}
        <div className="mt-3 flex items-center gap-2">
          {hasMoreHints && (
            <button
              onClick={showNextHint}
              className="px-3 py-1 text-xs rounded border border-colab-subtle text-colab-text
                         hover:border-colab-accent hover:text-colab-accent transition-colors"
            >
              다음 힌트 →
            </button>
          )}
          {allHintsShown && solution && (
            <button
              onClick={revealSolution}
              className="px-3 py-1 text-xs rounded border border-colab-subtle text-colab-textDim
                         hover:border-colab-yellow hover:text-colab-yellow transition-colors"
            >
              🔑 정답 보기
            </button>
          )}
          <button
            onClick={hideAll}
            className="ml-auto text-xs text-colab-textDim hover:text-colab-text transition-colors"
          >
            힌트 닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 간단한 인라인 코드 렌더링 (백틱 → <code>)
// ─────────────────────────────────────────────────────────
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderInlineCode(text: string): string {
  const parts = text.split(/(`[^`]+`)/g);
  return parts
    .map((part) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        const code = part.slice(1, -1);
        return `<code class="px-1 py-0.5 rounded bg-colab-panel border border-colab-subtle text-colab-accent font-mono text-[12px]">${escapeHtml(
          code
        )}</code>`;
      }
      return escapeHtml(part);
    })
    .join("");
}
