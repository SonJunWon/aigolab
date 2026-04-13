import { useState } from "react";
import type { OutputChunk } from "../../types/notebook";
import {
  translateError,
  type TranslatedError,
} from "../../runtime/errorTranslator";

interface Props {
  outputs: OutputChunk[];
  executionTime?: number;
}

const streamColor: Record<OutputChunk["stream"], string> = {
  stdout: "text-colab-text",
  stderr: "text-colab-red",
  error:  "text-colab-red",
  result: "text-colab-text",
  warning: "text-colab-yellow",
  table: "text-colab-text",  // table은 SqlTable 컴포넌트로 따로 렌더, 색은 사용 안 함
};

export function CellOutput({ outputs, executionTime }: Props) {
  if (outputs.length === 0) return null;

  // 종류별 분리
  const tableChunks = outputs.filter((c) => c.stream === "table");
  const errorChunks = outputs.filter((c) => c.stream === "error");
  const textChunks = outputs.filter(
    (c) => c.stream !== "error" && c.stream !== "table"
  );
  const errorText = errorChunks.map((c) => c.text).join("\n");
  const translated = errorText ? translateError(errorText) : null;

  return (
    <div className="border-t border-colab-subtle bg-colab-bg">
      {/* 일반 텍스트 출력 (print, console.log, 경고 등) */}
      {textChunks.length > 0 && (
        <div className="px-4 py-3 font-mono text-[13px] leading-relaxed">
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

      {/* SQL 표 결과 */}
      {tableChunks.map((chunk, i) =>
        chunk.table ? <SqlTable key={`table-${i}`} table={chunk.table} /> : null
      )}

      {/* 에러 */}
      {errorChunks.length > 0 && (
        translated ? (
          <TranslatedErrorBox error={translated} rawText={errorText} />
        ) : (
          <RawErrorBox text={errorText} />
        )
      )}

      {executionTime !== undefined && (
        <div className="px-4 pb-2 text-[11px] text-colab-textDim">
          실행 시간: {executionTime.toFixed(0)}ms
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SQL 표 렌더링
// ─────────────────────────────────────────────────────────
import type { TableData } from "../../types/notebook";

const MAX_VISIBLE_ROWS = 100;

function SqlTable({ table }: { table: TableData }) {
  const truncated = table.rows.length > MAX_VISIBLE_ROWS;
  const visibleRows = truncated
    ? table.rows.slice(0, MAX_VISIBLE_ROWS)
    : table.rows;

  return (
    <div className="px-4 py-3">
      <div className="text-[11px] text-colab-textDim mb-2">
        {table.rowCount}행 × {table.columns.length}열
        {truncated && ` (앞 ${MAX_VISIBLE_ROWS}행만 표시)`}
      </div>
      <div className="overflow-x-auto rounded border border-colab-subtle">
        <table className="min-w-full text-[12px] font-mono">
          <thead className="bg-colab-panel border-b border-colab-subtle">
            <tr>
              {table.columns.map((col) => (
                <th
                  key={col}
                  className="text-left px-3 py-2 font-medium text-colab-accent whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, ri) => (
              <tr
                key={ri}
                className={`border-b border-colab-subtle/50 hover:bg-colab-hover/40 transition-colors ${
                  ri % 2 === 0 ? "bg-colab-bg" : "bg-colab-panel/30"
                }`}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-3 py-1.5 whitespace-nowrap ${
                      cell === null
                        ? "text-colab-textDim/60 italic"
                        : "text-colab-text"
                    }`}
                  >
                    {cell === null ? "NULL" : String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 친절하게 번역된 에러 박스
// ─────────────────────────────────────────────────────────

function TranslatedErrorBox({
  error,
  rawText,
}: {
  error: TranslatedError;
  rawText: string;
}) {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className="mx-4 my-3 rounded-lg border border-colab-red/40 bg-colab-red/5 overflow-hidden">
      <div className="px-4 py-3">
        {/* 제목 + 설명 */}
        <div className="flex items-start gap-2.5">
          <span className="text-xl leading-none mt-0.5">{error.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-colab-red text-sm">
              {error.title}
            </div>
            <div
              className="text-sm text-colab-text mt-1 leading-relaxed"
              // 간단한 인라인 코드 하이라이트 (backtick → <code>)
              dangerouslySetInnerHTML={{
                __html: renderInlineCode(error.explanation),
              }}
            />
          </div>
        </div>

        {/* 힌트 */}
        {error.hints.length > 0 && (
          <div className="mt-3 pl-8">
            <div className="text-xs text-colab-textDim font-medium mb-1">
              💡 시도해볼 것:
            </div>
            <ul className="space-y-1 text-xs text-colab-text list-disc pl-5 marker:text-colab-textDim">
              {error.hints.map((hint, i) => (
                <li
                  key={i}
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderInlineCode(hint) }}
                />
              ))}
            </ul>
          </div>
        )}

        {/* 원본 에러 보기 토글 */}
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="mt-3 pl-8 text-[11px] text-colab-textDim hover:text-colab-text transition-colors"
        >
          {showRaw ? "▼ 원본 에러 숨기기" : "▶ 원본 에러 보기 (개발자용)"}
        </button>

        {showRaw && (
          <pre
            className="mt-2 ml-8 p-3 bg-colab-bg rounded text-[11px] text-colab-red/90 font-mono
                       overflow-x-auto whitespace-pre-wrap break-words"
          >
            {rawText}
          </pre>
        )}

        <RecoveryHint />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 회복 안내 — 모든 에러 박스 하단에 작게 노출
// ─────────────────────────────────────────────────────────
function RecoveryHint() {
  return (
    <div className="mt-3 pl-8 pr-2">
      <div className="px-3 py-2 rounded bg-colab-bg/60 border border-colab-subtle text-[11px] text-colab-textDim leading-relaxed">
        <span className="text-colab-yellow">💡 막혔으면?</span>{" "}
        헤더의 <span className="text-colab-text font-medium">🔄 런타임</span> 버튼을
        누르면 변수·함수가 깨끗하게 초기화돼요. 이름을 바꿔도 에러가 계속 나면 이걸로
        해결됩니다.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 번역 못 한 에러 — fallback
// ─────────────────────────────────────────────────────────

function RawErrorBox({ text }: { text: string }) {
  return (
    <div className="mx-4 my-3 rounded-lg border border-colab-red/40 bg-colab-red/5 overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-start gap-2.5 mb-2">
          <span className="text-xl leading-none">⚠️</span>
          <div className="font-medium text-colab-red text-sm">
            에러가 발생했어요
          </div>
        </div>
        <pre className="ml-8 p-3 bg-colab-bg rounded text-[11px] text-colab-red/90 font-mono overflow-x-auto whitespace-pre-wrap break-words">
          {text}
        </pre>
        <RecoveryHint />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 간단한 인라인 코드 렌더링 (backtick → <code>)
// ─────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderInlineCode(text: string): string {
  // 백틱으로 감싼 부분을 <code>로. 나머지는 이스케이프.
  const parts = text.split(/(`[^`]+`)/g);
  return parts
    .map((part) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        const code = part.slice(1, -1);
        return `<code class="px-1 py-0.5 rounded bg-colab-bg border border-colab-subtle text-colab-accent font-mono text-[12px]">${escapeHtml(
          code
        )}</code>`;
      }
      return escapeHtml(part);
    })
    .join("");
}
