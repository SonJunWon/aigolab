import { useMemo, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { getRuntime } from "../../runtime/registry";
import { useLanguageRuntime } from "../../hooks/useLanguageRuntime";
import type { SupportedLanguage } from "../../runtime/types";
import type { OutputChunk } from "../../types/notebook";
import {
  translateError,
  type TranslatedError,
} from "../../runtime/errorTranslator";

interface Props {
  /** 초기 코드 (사용자가 편집 후 "원본으로" 버튼으로 되돌릴 수 있음) */
  initialCode: string;
  /** 언어 — 기본 python */
  language?: SupportedLanguage;
  /** 선택적 힌트 — 편집기 아래에 작은 회색 텍스트로 */
  hint?: string;
}

/**
 * AI 강의 본문에 삽입할 수 있는 인라인 코드 실행기.
 *
 * - CourseDetailPage의 code 섹션에서 사용.
 * - 앱 전역 Pyodide 싱글톤을 공유하므로 강의 여러 개를 돌아다녀도 런타임이 재로딩되지 않음.
 * - 실행 결과는 컴포넌트 로컬 상태에만 보관 (notebookStore 미사용).
 */
export function InlineCodeRunner({
  initialCode,
  language = "python",
  hint,
}: Props) {
  const { status, version } = useLanguageRuntime(language);
  const runtime = getRuntime(language);

  // 컴포넌트 인스턴스마다 유니크한 cellId — notebook 셀과 충돌 방지
  const cellId = useMemo(
    () => `course-inline-${Math.random().toString(36).slice(2, 10)}`,
    []
  );

  const [code, setCode] = useState(initialCode);
  const [outputs, setOutputs] = useState<OutputChunk[]>([]);
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  const [running, setRunning] = useState(false);
  const [runCount, setRunCount] = useState(0);

  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Cmd/Ctrl+Enter 로 바로 실행
    editor.addAction({
      id: "course-inline.run",
      label: "코드 실행",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => void handleRun(),
    });
  };

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setOutputs([]);
    setExecutionTime(undefined);

    const collected: OutputChunk[] = [];
    const pushChunk = (chunk: OutputChunk) => {
      collected.push(chunk);
      setOutputs([...collected]);
    };

    try {
      const result = await runtime.run(cellId, code, {
        onStdout: (text) => pushChunk({ stream: "stdout", text }),
        onStderr: (text) => pushChunk({ stream: "stderr", text }),
        onTable: (table) => pushChunk({ stream: "table", text: "", table }),
        onFigure: (dataUrl) =>
          pushChunk({ stream: "figure", text: "", dataUrl }),
      });
      if (result.value) {
        pushChunk({ stream: "result", text: result.value });
      }
      setExecutionTime(result.timeMs);
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : String(err);
      const timeMs =
        err && typeof err === "object" && "timeMs" in err
          ? (err as { timeMs?: number }).timeMs
          : undefined;
      pushChunk({ stream: "error", text: message });
      setExecutionTime(timeMs);
    } finally {
      setRunning(false);
      setRunCount((n) => n + 1);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutputs([]);
    setExecutionTime(undefined);
  };

  const handleClear = () => {
    setOutputs([]);
    setExecutionTime(undefined);
  };

  // 에디터 높이 자동 조절
  const lines = Math.max(3, code.split("\n").length);
  const editorHeight = lines * 19 + 16;

  const statusPill = (() => {
    if (status === "loading")
      return {
        cls: "bg-brand-yellow/15 text-brand-yellow",
        label: "🐍 Python 로딩 중…",
      };
    if (status === "error")
      return { cls: "bg-brand-red/15 text-brand-red", label: "런타임 오류" };
    if (status === "ready")
      return {
        cls: "bg-brand-primary/15 text-brand-primary",
        label: `🐍 Python ${version ?? ""} 준비됨`,
      };
    return { cls: "bg-brand-subtle text-brand-textDim", label: "대기" };
  })();

  const disabled = running || status !== "ready";

  return (
    <div className="rounded-xl border border-brand-subtle bg-brand-panel overflow-hidden">
      {/* 상단 툴바 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-brand-subtle bg-brand-panel/60">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusPill.cls}`}>
            {statusPill.label}
          </span>
          {runCount > 0 && (
            <span className="text-[10px] text-brand-textDim">
              실행 {runCount}회
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClear}
            disabled={outputs.length === 0}
            className="text-[11px] px-2 py-1 rounded text-brand-textDim hover:text-brand-text
                       hover:bg-brand-subtle disabled:opacity-40 disabled:hover:bg-transparent
                       disabled:cursor-not-allowed transition-colors"
            title="출력 지우기"
          >
            출력 지우기
          </button>
          <button
            onClick={handleReset}
            className="text-[11px] px-2 py-1 rounded text-brand-textDim hover:text-brand-text
                       hover:bg-brand-subtle transition-colors"
            title="원본 코드로 되돌리기"
          >
            ↺ 원본으로
          </button>
          <button
            onClick={handleRun}
            disabled={disabled}
            className="text-xs px-3 py-1.5 rounded-lg bg-brand-primary text-white font-medium
                       hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors flex items-center gap-1.5"
            title="실행 (Cmd/Ctrl+Enter)"
          >
            {running ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                실행 중
              </>
            ) : (
              <>▶ 실행</>
            )}
          </button>
        </div>
      </div>

      {/* 에디터 */}
      <div className="bg-[#1e1e1e]">
        <Editor
          height={editorHeight}
          language={language === "python" ? "python" : language}
          value={code}
          onChange={(val) => setCode(val ?? "")}
          onMount={handleMount}
          theme="vs-dark"
          options={{
            fontSize: 13,
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
            autoClosingOvertype: "always",
            autoClosingDelete: "always",
          }}
        />
      </div>

      {/* 힌트 */}
      {hint && (
        <div className="px-4 py-2 border-t border-brand-subtle text-[11px] text-brand-textDim bg-brand-panel/40">
          💡 {hint}
        </div>
      )}

      {/* 출력 */}
      {outputs.length > 0 && (
        <InlineCellOutput outputs={outputs} executionTime={executionTime} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 간소화된 출력 렌더 — 강의 본문용 (SQL 테이블 미지원: 필요 시 추후 재사용)
// ─────────────────────────────────────────────────────────

function InlineCellOutput({
  outputs,
  executionTime,
}: {
  outputs: OutputChunk[];
  executionTime?: number;
}) {
  const errorChunks = outputs.filter((c) => c.stream === "error");
  const figureChunks = outputs.filter((c) => c.stream === "figure");
  const textChunks = outputs.filter(
    (c) =>
      c.stream !== "error" && c.stream !== "table" && c.stream !== "figure"
  );
  const errorText = errorChunks.map((c) => c.text).join("\n");
  const translated = errorText ? translateError(errorText) : null;

  const streamColor: Record<OutputChunk["stream"], string> = {
    stdout: "text-brand-text",
    stderr: "text-brand-red",
    error: "text-brand-red",
    result: "text-brand-text",
    warning: "text-brand-yellow",
    table: "text-brand-text",
    figure: "text-brand-text",
    progress: "text-brand-text", // InlineCodeRunner 는 LLM 셀 미사용
    thought: "text-brand-primary", // InlineCodeRunner 는 LLM 셀 미사용
  };

  return (
    <div className="border-t border-brand-subtle bg-[#121212]">
      {textChunks.length > 0 && (
        <div className="px-4 py-3 font-mono text-[12.5px] leading-relaxed">
          {textChunks.map((chunk, i) => (
            <pre
              key={i}
              className={`m-0 whitespace-pre-wrap break-words ${streamColor[chunk.stream]}`}
            >
              {chunk.text}
            </pre>
          ))}
        </div>
      )}

      {/* matplotlib 그래프 */}
      {figureChunks.map((chunk, i) =>
        chunk.dataUrl ? (
          <div
            key={`fig-${i}`}
            className="px-4 py-3 border-t border-brand-subtle/50 first:border-t-0"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10.5px] text-brand-textDim uppercase tracking-wider">
                📊 Figure {i + 1}
              </span>
              <a
                href={chunk.dataUrl}
                download={`figure-${i + 1}.png`}
                className="text-[10.5px] text-brand-textDim hover:text-brand-primary transition-colors"
                title="PNG 다운로드"
              >
                ↓ PNG
              </a>
            </div>
            <div className="rounded border border-brand-subtle bg-white p-2 inline-block max-w-full">
              <img
                src={chunk.dataUrl}
                alt={`matplotlib figure ${i + 1}`}
                className="max-w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        ) : null
      )}

      {errorChunks.length > 0 && (
        translated ? (
          <InlineTranslatedError error={translated} rawText={errorText} />
        ) : (
          <InlineRawError text={errorText} />
        )
      )}

      {executionTime !== undefined && (
        <div className="px-4 pb-2 text-[10.5px] text-brand-textDim">
          실행 시간: {executionTime.toFixed(0)}ms
        </div>
      )}
    </div>
  );
}

function InlineTranslatedError({
  error,
  rawText,
}: {
  error: TranslatedError;
  rawText: string;
}) {
  const [showRaw, setShowRaw] = useState(false);
  return (
    <div className="mx-4 my-3 rounded-lg border border-brand-red/40 bg-brand-red/5 overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-start gap-2.5">
          <span className="text-xl leading-none mt-0.5">{error.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-brand-red text-sm">
              {error.title}
            </div>
            <div className="text-sm text-brand-text mt-1 leading-relaxed">
              {error.explanation}
            </div>
          </div>
        </div>
        {error.hints.length > 0 && (
          <ul className="mt-3 pl-8 space-y-1 text-xs text-brand-text list-disc pl-5 marker:text-brand-textDim">
            {error.hints.map((h, i) => (
              <li key={i} className="leading-relaxed">
                {h}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="mt-3 pl-8 text-[11px] text-brand-textDim hover:text-brand-text transition-colors"
        >
          {showRaw ? "▼ 원본 에러 숨기기" : "▶ 원본 에러 보기"}
        </button>
        {showRaw && (
          <pre className="mt-2 ml-8 p-3 bg-[#1e1e1e] rounded text-[11px] text-brand-red/90 font-mono overflow-x-auto whitespace-pre-wrap break-words">
            {rawText}
          </pre>
        )}
      </div>
    </div>
  );
}

function InlineRawError({ text }: { text: string }) {
  return (
    <div className="mx-4 my-3 rounded-lg border border-brand-red/40 bg-brand-red/5 overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-start gap-2.5 mb-2">
          <span className="text-xl leading-none">⚠️</span>
          <div className="font-medium text-brand-red text-sm">
            에러가 발생했어요
          </div>
        </div>
        <pre className="ml-8 p-3 bg-[#1e1e1e] rounded text-[11px] text-brand-red/90 font-mono overflow-x-auto whitespace-pre-wrap break-words">
          {text}
        </pre>
      </div>
    </div>
  );
}
