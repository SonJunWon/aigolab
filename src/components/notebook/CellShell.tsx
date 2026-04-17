import { useRef } from "react";
import type { Cell } from "../../types/notebook";
import { useNotebookStore } from "../../store/notebookStore";
import { runCell } from "../../runtime/runCell";
import { CodeCell } from "./CodeCell";
import { LlmCodeCell } from "./LlmCodeCell";
import { MarkdownCell } from "./MarkdownCell";

interface Props {
  cell: Cell;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * 모든 셀(코드/마크다운)을 감싸는 외곽 컨테이너.
 * - 선택 상태 표시 (좌측 파란 보더)
 * - 호버 시 상단에 셀 액션 메뉴 (셀 바깥 위쪽)
 */
export function CellShell({ cell, isSelected, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const insertCellBelow = useNotebookStore((s) => s.insertCellBelow);
  const insertCellAbove = useNotebookStore((s) => s.insertCellAbove);
  const deleteCell = useNotebookStore((s) => s.deleteCell);
  const moveCellUp = useNotebookStore((s) => s.moveCellUp);
  const moveCellDown = useNotebookStore((s) => s.moveCellDown);
  const changeCellType = useNotebookStore((s) => s.changeCellType);

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className="group relative"
    >
      {/* 호버/선택 시 표시되는 상단 액션 메뉴 — 셀 바깥 위쪽 */}
      <div
        className={`flex justify-end mb-1 transition-opacity
          ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-0.5 rounded bg-colab-bg/90 backdrop-blur-sm border border-colab-subtle">
          {(cell.type === "code" || cell.type === "llm-code") && (
            <ActionButton
              title="실행 (Cmd/Ctrl+Enter)"
              onClick={() => runCell(cell.id)}
              icon={<PlayIcon />}
            />
          )}
          <ActionButton
            title="위로 이동"
            onClick={() => moveCellUp(cell.id)}
            icon="↑"
          />
          <ActionButton
            title="아래로 이동"
            onClick={() => moveCellDown(cell.id)}
            icon="↓"
          />
          <ActionButton
            title="위에 코드 셀 추가"
            onClick={() => insertCellAbove(cell.id, "code")}
            icon="+↑"
          />
          <ActionButton
            title="아래에 코드 셀 추가"
            onClick={() => insertCellBelow(cell.id, "code")}
            icon="+↓"
          />
          {cell.type !== "llm-code" && (
            <ActionButton
              title={cell.type === "code" ? "텍스트 셀로 변환 (Ctrl+M, M)" : "코드 셀로 변환 (Ctrl+M, Y)"}
              onClick={() =>
                changeCellType(cell.id, cell.type === "code" ? "markdown" : "code")
              }
              icon={cell.type === "code" ? "T" : "{ }"}
            />
          )}
          <ActionButton
            title="셀 삭제 (Ctrl+M, D, D)"
            onClick={() => deleteCell(cell.id)}
            icon="🗑"
            danger
          />
        </div>
      </div>

      {/* 셀 본문 */}
      <div
        className={`relative rounded-md border bg-colab-panel transition-colors overflow-hidden
          ${
            isSelected
              ? "border-colab-subtle"
              : "border-transparent hover:border-colab-subtle"
          }`}
      >
        {/* 선택 시 좌측 파란 막대 */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-[3px] z-20 pointer-events-none transition-colors
            ${isSelected ? "bg-colab-accent" : "bg-transparent"}`}
          aria-hidden="true"
        />

        {cell.type === "code" ? (
          <CodeCell cell={cell} isSelected={isSelected} />
        ) : cell.type === "llm-code" ? (
          <LlmCodeCell cell={cell} isSelected={isSelected} />
        ) : (
          <MarkdownCell cell={cell} isSelected={isSelected} />
        )}
      </div>
    </div>
  );
}

// ─── 작은 액션 버튼 ─────────────────────────────────────────
function ActionButton({
  title,
  onClick,
  icon,
  danger,
}: {
  title: string;
  onClick: () => void;
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`px-2 py-1 text-xs text-colab-textDim hover:bg-colab-hover transition-colors
        ${danger ? "hover:text-colab-red" : "hover:text-colab-text"}`}
    >
      {icon}
    </button>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
