/**
 * LLM 셀 — TypeScript 런타임에서 `@/lib/llm` API 를 호출하는 실습 셀.
 *
 * Python/JS/SQL CodeCell 과 UI 패턴은 동일하되:
 *   - Monaco 에디터 언어가 "typescript"
 *   - 실행 경로가 runCell → runLlmCell (TS→JS 트랜스파일 + chat 주입)
 *   - 좌측 거터에 🤖 배지 노출로 일반 코드셀과 구별
 */

import { useEffect, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { Cell } from "../../types/notebook";
import { CellOutput } from "./CellOutput";
import { HintPanel } from "./HintPanel";
import { useNotebookStore } from "../../store/notebookStore";
import { runCell } from "../../runtime/runCell";
import { activateCommandMode } from "../../runtime/commandMode";

interface Props {
  cell: Cell;
  isSelected: boolean;
}

const statusIcon: Record<Cell["status"], { label: string; cls: string }> = {
  idle: { label: "[ ]", cls: "text-colab-textDim" },
  queued: { label: "[*]", cls: "text-colab-yellow" },
  running: { label: "[*]", cls: "text-colab-yellow animate-pulse" },
  success: { label: "[✓]", cls: "text-colab-textDim" },
  error: { label: "[!]", cls: "text-colab-red" },
};

export function LlmCodeCell({ cell, isSelected }: Props) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const updateSource = useNotebookStore((s) => s.updateSource);

  useEffect(() => {
    if (isSelected && editorRef.current) {
      const t = setTimeout(() => {
        editorRef.current?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [isSelected]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    if (isSelected) editor.focus();

    // Cmd/Ctrl+Enter → 실행
    editor.addAction({
      id: "notebook.runLlmCell",
      label: "LLM 셀 실행",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        runCell(cell.id);
      },
    });

    // Shift+Enter → 실행 + 다음 셀로
    editor.addAction({
      id: "notebook.runLlmCellAndNext",
      label: "LLM 셀 실행 후 다음 셀로",
      keybindings: [monaco.KeyMod.Shift | monaco.KeyCode.Enter],
      run: () => {
        runCell(cell.id);
        const state = useNotebookStore.getState();
        const idx = state.cells.findIndex((c) => c.id === cell.id);
        if (idx === state.cells.length - 1) {
          state.insertCellBelow(cell.id, "code");
        } else {
          state.selectNextCell();
        }
      },
    });

    // Esc → 커맨드 모드
    editor.addAction({
      id: "notebook.enterCommandMode",
      label: "Command mode 진입",
      keybindings: [monaco.KeyCode.Escape],
      run: () => {
        const dom = editor.getDomNode();
        if (dom) {
          const textarea = dom.querySelector(
            "textarea",
          ) as HTMLTextAreaElement | null;
          textarea?.blur();
        }
        activateCommandMode();
      },
    });
  };

  const status = statusIcon[cell.status];
  const execLabel = cell.executionCount ? `[${cell.executionCount}]` : status.label;
  const isRunning = cell.status === "running";

  const lineHeight = 19;
  const padding = 16;
  const minLines = 1;
  const lines = Math.max(minLines, cell.source.split("\n").length);
  const editorHeight = lines * lineHeight + padding;

  return (
    <div className="flex border-l-2 border-brand-primary/40">
      {/* 좌측 거터 */}
      <div className="flex flex-col items-center pt-2 w-12 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            runCell(cell.id);
          }}
          disabled={isRunning}
          title="LLM 셀 실행 (Cmd/Ctrl+Enter)"
          className="w-8 h-8 rounded-full flex items-center justify-center
                     text-colab-textDim hover:bg-colab-hover hover:text-brand-primary
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? (
            <span className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <span
          className="mt-1 text-[10px]"
          title="LLM 셀 (TypeScript + chat API)"
        >
          🤖
        </span>
        {cell.simulation && (
          <span
            className="mt-0.5 text-[10px]"
            title={
              cell.simulation.note ??
              "시뮬레이션 녹화본 첨부됨 — 키 없이도 실행 가능"
            }
          >
            📼
          </span>
        )}
        <span className={`mt-0.5 text-[10px] font-mono ${status.cls}`}>
          {execLabel}
        </span>
      </div>

      {/* 셀 본문 */}
      <div className="flex-1 min-w-0">
        <div className="overflow-hidden">
          <Editor
            height={editorHeight}
            defaultLanguage="typescript"
            value={cell.source}
            onChange={(val) => updateSource(cell.id, val ?? "")}
            onMount={handleMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily:
                '"Roboto Mono", "SF Mono", Monaco, Menlo, monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "off",
              folding: false,
              automaticLayout: true,
              tabSize: 2,
              renderLineHighlight: "none",
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              scrollbar: {
                vertical: "hidden",
                horizontalScrollbarSize: 6,
                useShadows: false,
              },
              padding: { top: 8, bottom: 8 },
              lineDecorationsWidth: 8,
              glyphMargin: false,
              wordWrap: "on",
              autoClosingOvertype: "always",
              autoClosingDelete: "always",
            }}
          />
        </div>

        <CellOutput outputs={cell.outputs} executionTime={cell.executionTime} />

        {cell.hints && cell.hints.length > 0 && (
          <HintPanel
            cellId={cell.id}
            hints={cell.hints}
            solution={cell.solution}
          />
        )}
      </div>
    </div>
  );
}
