import { useCallback, useEffect, useRef, useState } from "react";
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
  idle:    { label: "[ ]", cls: "text-colab-textDim" },
  queued:  { label: "[*]", cls: "text-colab-yellow" },
  running: { label: "[*]", cls: "text-colab-yellow animate-pulse" },
  success: { label: "[✓]", cls: "text-colab-textDim" },
  error:   { label: "[!]", cls: "text-colab-red" },
};

export function CodeCell({ cell, isSelected }: Props) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const updateSource = useNotebookStore((s) => s.updateSource);

  // ─── 셀이 선택되면 자동으로 Monaco editor에 focus ───
  // (Shift+Enter로 새 셀 생성 시 자동으로 거기서 입력 가능하게)
  useEffect(() => {
    if (isSelected && editorRef.current) {
      // 약간 딜레이 — Monaco가 마운트 직후일 수 있어서
      const t = setTimeout(() => {
        editorRef.current?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [isSelected]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // 콘텐츠 높이 변경 감지 → 에디터 높이 자동 조절
    editor.onDidContentSizeChange(() => {
      try { updateEditorHeight(); } catch { /* disposed */ }
    });
    updateEditorHeight();

    // 마운트 시점에 이 셀이 이미 선택돼 있으면 즉시 focus
    if (isSelected) {
      editor.focus();
    }

    // ──────────────────────────────────────────────
    // ⚠️ Monaco 키바인딩은 addAction()을 사용한다.
    //   addCommand()는 Shift+Enter 같이 Monaco가 이미 기본 바인딩
    //   ("type" → 개행)을 갖고 있는 키에 대해 우선순위가 낮아서
    //   덮어쓰기에 실패할 수 있다.
    // ──────────────────────────────────────────────

    // Cmd/Ctrl + Enter → 셀 실행만
    editor.addAction({
      id: "notebook.runCell",
      label: "셀 실행",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        runCell(cell.id);
      },
    });

    // Shift + Enter → 셀 실행 + 다음 셀로 (없으면 새로 만듦)
    editor.addAction({
      id: "notebook.runCellAndNext",
      label: "셀 실행 후 다음 셀로",
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

    // Alt/Option + Enter → 셀 실행 + 아래에 새 셀 삽입
    editor.addAction({
      id: "notebook.runCellAndInsertBelow",
      label: "셀 실행 후 아래에 새 셀 삽입",
      keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.Enter],
      run: () => {
        runCell(cell.id);
        useNotebookStore.getState().insertCellBelow(cell.id, "code");
      },
    });

    // Esc → command mode 진입 (에디터에서 빠져나가기)
    // 누른 후 B/A/M/Y/D D 같은 단일 키로 셀 액션 가능
    editor.addAction({
      id: "notebook.enterCommandMode",
      label: "Command mode 진입",
      keybindings: [monaco.KeyCode.Escape],
      run: () => {
        // 에디터에서 키보드 포커스 제거 → 글로벌 핸들러가 다음 키를 받게 됨
        const dom = editor.getDomNode();
        if (dom) {
          // textarea가 실제 포커스를 갖고 있으니 그걸 blur
          const textarea = dom.querySelector("textarea") as HTMLTextAreaElement | null;
          textarea?.blur();
        }
        activateCommandMode();
      },
    });
  };

  const status = statusIcon[cell.status];
  const execLabel = cell.executionCount ? `[${cell.executionCount}]` : status.label;
  const isRunning = cell.status === "running";

  // 에디터 높이: 초기값은 줄 수 기반, 마운트 후 실제 콘텐츠 높이로 갱신
  const lineHeight = 19;
  const fallbackPadding = 28;
  const minLines = 1;
  const lines = Math.max(minLines, cell.source.split("\n").length);
  const fallbackHeight = lines * lineHeight + fallbackPadding;
  const [editorHeight, setEditorHeight] = useState(fallbackHeight);

  // Monaco 콘텐츠 높이가 바뀔 때마다 자동 조절 (wordWrap으로 줄 수 증가 대응)
  const updateEditorHeight = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    try {
      const contentHeight = editor.getContentHeight();
      if (contentHeight > 0) {
        setEditorHeight(contentHeight);
      }
    } catch {
      // 에디터가 dispose된 경우 무시
    }
  }, []);

  // source 변경 시 높이 재계산
  useEffect(() => {
    updateEditorHeight();
  }, [cell.source, updateEditorHeight]);

  return (
    <div className="flex">
      {/* ─── 좌측 거터: 실행 버튼 + 카운터 ─── */}
      <div className="flex flex-col items-center pt-2 w-12 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            runCell(cell.id);
          }}
          disabled={isRunning}
          title="셀 실행 (Cmd/Ctrl+Enter)"
          className="w-8 h-8 rounded-full flex items-center justify-center
                     text-colab-textDim hover:bg-colab-hover hover:text-colab-accent
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? (
            <span className="w-4 h-4 border-2 border-colab-accent border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <span className={`mt-1 text-[10px] font-mono ${status.cls}`}>
          {execLabel}
        </span>
      </div>

      {/* ─── 셀 본문 ─── */}
      <div className="flex-1 min-w-0">
        <div className="overflow-hidden">
          <Editor
            height={editorHeight}
            defaultLanguage="python"
            value={cell.source}
            onChange={(val) => updateSource(cell.id, val ?? "")}
            onMount={handleMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: '"Roboto Mono", "SF Mono", Monaco, Menlo, monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "off",
              folding: false,
              automaticLayout: true,
              tabSize: 4,
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
              // 한글 IME에서 자동 닫는 따옴표/괄호의 overtype 정상 작동
              autoClosingOvertype: "always",
              autoClosingDelete: "always",
            }}
          />
        </div>

        <CellOutput outputs={cell.outputs} executionTime={cell.executionTime} />

        {/* 힌트 패널 — 레슨에서 주입된 힌트가 있을 때만 표시 */}
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
