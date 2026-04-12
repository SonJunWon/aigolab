import { useEffect, useRef, useState } from "react";
import MarkdownIt from "markdown-it";
import type { Cell } from "../../types/notebook";
import { useNotebookStore } from "../../store/notebookStore";

interface Props {
  cell: Cell;
  isSelected: boolean;
}

const md = new MarkdownIt({ html: true, linkify: true, breaks: true });

export function MarkdownCell({ cell, isSelected }: Props) {
  const updateSource = useNotebookStore((s) => s.updateSource);
  const [editing, setEditing] = useState(cell.source.trim() === "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // textarea 자동 높이 조절
  useEffect(() => {
    if (editing && textareaRef.current) {
      const ta = textareaRef.current;
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
      ta.focus();
    }
  }, [editing, cell.source]);

  const exitEdit = () => {
    if (cell.source.trim() !== "") setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl+Enter 또는 Shift+Enter로 편집 모드 종료 (렌더링)
    if ((e.metaKey || e.ctrlKey || e.shiftKey) && e.key === "Enter") {
      e.preventDefault();
      exitEdit();
    }
    // Esc로 편집 종료
    if (e.key === "Escape") {
      e.preventDefault();
      exitEdit();
    }
  };

  // 더블클릭 시 편집 모드 진입
  if (editing) {
    return (
      <div className="px-4 py-3">
        <textarea
          ref={textareaRef}
          value={cell.source}
          onChange={(e) => updateSource(cell.id, e.target.value)}
          onBlur={exitEdit}
          onKeyDown={handleKeyDown}
          placeholder="마크다운을 입력하세요..."
          className="w-full bg-colab-bg border border-colab-subtle rounded px-3 py-2 font-mono text-sm text-colab-text resize-none focus:outline-none focus:border-colab-accent"
          style={{ minHeight: "60px" }}
          spellCheck={false}
        />
        <div className="mt-1 text-[11px] text-colab-textDim">
          편집 종료: <kbd>Esc</kbd> 또는 <kbd>Shift+Enter</kbd>
        </div>
      </div>
    );
  }

  // 렌더 모드
  const html = md.render(cell.source || "*(빈 마크다운 셀 — 더블클릭하여 편집)*");

  return (
    <div
      className="md-prose px-4 py-3 cursor-text"
      onDoubleClick={() => setEditing(true)}
      // 선택된 빈 셀이거나 키보드로 진입할 수 있게 tabIndex
      tabIndex={isSelected ? 0 : -1}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
