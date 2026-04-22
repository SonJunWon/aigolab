/**
 * 프롬프트 양식 편집기 — 코드 없이 5칸 입력으로 AI에게 질문
 *
 * 역할/맥락/지시/형식/제약 5칸 + 질문 입력 → chat() 자동 호출 → 결과 표시
 * 입력 내용은 마크다운 형식으로 .md 파일에 자동 저장
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { runLlmCode } from "../../lib/llm";
import type { OutputChunk } from "../../types/notebook";

/* ─── 프롬프트 데이터 구조 ─── */
interface PromptData {
  name: string;
  role: string;
  context: string;
  instruction: string;
  format: string;
  constraints: string;
}

/* ─── 마크다운 ↔ 프롬프트 변환 ─── */
function parsePromptMd(content: string): PromptData & { lastQuery?: string } {
  const data: PromptData & { lastQuery?: string } = {
    name: "",
    role: "",
    context: "",
    instruction: "",
    format: "",
    constraints: "",
    lastQuery: "",
  };

  const sections = content.split(/^## /gm);
  for (const section of sections) {
    const lines = section.trim();
    if (lines.startsWith("프롬프트 이름")) {
      data.name = lines.replace(/^프롬프트 이름\s*\n/, "").trim();
    } else if (lines.startsWith("역할")) {
      data.role = lines.replace(/^역할\s*\n/, "").trim();
    } else if (lines.startsWith("맥락")) {
      data.context = lines.replace(/^맥락\s*\n/, "").trim();
    } else if (lines.startsWith("지시")) {
      data.instruction = lines.replace(/^지시\s*\n/, "").trim();
    } else if (lines.startsWith("형식")) {
      data.format = lines.replace(/^형식\s*\n/, "").trim();
    } else if (lines.startsWith("제약")) {
      data.constraints = lines.replace(/^제약\s*\n/, "").trim();
    } else if (lines.startsWith("마지막 질문")) {
      data.lastQuery = lines.replace(/^마지막 질문\s*\n/, "").trim();
    }
  }

  return data;
}

function toPromptMd(data: PromptData, lastQuery?: string): string {
  const parts = [`# 프롬프트\n`];
  if (data.name) parts.push(`## 프롬프트 이름\n${data.name}\n`);
  if (data.role) parts.push(`## 역할\n${data.role}\n`);
  if (data.context) parts.push(`## 맥락\n${data.context}\n`);
  if (data.instruction) parts.push(`## 지시\n${data.instruction}\n`);
  if (data.format) parts.push(`## 형식\n${data.format}\n`);
  if (data.constraints) parts.push(`## 제약\n${data.constraints}\n`);
  if (lastQuery) parts.push(`## 마지막 질문\n${lastQuery}\n`);
  return parts.join("\n");
}

/* ─── 5칸 입력 필드 ─── */
const FIELDS: { key: keyof PromptData; label: string; number: number; placeholder: string }[] = [
  { key: "role", label: "역할", number: 1, placeholder: "예: 너는 초등학교 국어 교사야. 학생들이 이해하기 쉬운 말로 설명해줘." },
  { key: "context", label: "맥락", number: 2, placeholder: "예: 초등학교 5학년 학생이 독후감을 써야 하는 상황이야." },
  { key: "instruction", label: "지시", number: 3, placeholder: "예: 독후감을 3단락으로 구성해줘. (책 소개 → 인상 깊은 장면 → 느낀 점)" },
  { key: "format", label: "형식", number: 4, placeholder: "예: 각 단락 100자 내외. 존댓말 사용." },
  { key: "constraints", label: "제약", number: 5, placeholder: "예: 어려운 한자어 사용 금지. 스포일러 포함하지 않기." },
];

/* ─── 컴포넌트 ─── */
export function PromptFormEditor({
  content,
  onContentChange,
}: {
  content: string;
  onContentChange: (content: string) => void;
}) {
  const [data, setData] = useState<PromptData>({ name: "", role: "", context: "", instruction: "", format: "", constraints: "" });
  const [query, setQuery] = useState("");
  const [outputs, setOutputs] = useState<OutputChunk[]>([]);
  const [running, setRunning] = useState(false);
  const initialized = useRef(false);
  const composing = useRef(false);

  // 파일 내용에서 프롬프트 파싱 (최초 1회)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (content.includes("## ")) {
      const parsed = parsePromptMd(content);
      setData({ name: parsed.name, role: parsed.role, context: parsed.context, instruction: parsed.instruction, format: parsed.format, constraints: parsed.constraints });
      if (parsed.lastQuery) setQuery(parsed.lastQuery);
    }
  }, [content]);

  // 필드 변경 → 마크다운으로 변환 → 상위에 전달 (디바운스)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncToFile = useCallback((newData: PromptData, newQuery: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onContentChange(toPromptMd(newData, newQuery));
    }, 1000);
  }, [onContentChange]);

  const updateField = (key: keyof PromptData, value: string) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    syncToFile(newData, query);
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    syncToFile(data, value);
  };

  // ─── AI 실행 ───
  const handleRun = async () => {
    if (running) return;
    if (!query.trim()) { alert("질문을 입력해주세요."); return; }

    // system 메시지 조합
    const systemParts: string[] = [];
    if (data.role) systemParts.push(`[역할] ${data.role}`);
    if (data.context) systemParts.push(`[맥락] ${data.context}`);
    if (data.instruction) systemParts.push(`[지시] ${data.instruction}`);
    if (data.format) systemParts.push(`[형식] ${data.format}`);
    if (data.constraints) systemParts.push(`[제약] ${data.constraints}`);

    const systemMessage = systemParts.join("\n");

    // 타입스크립트 코드 자동 생성
    const code = `
const response = await chat({
  messages: [
    ${systemMessage ? `{ role: "system", content: ${JSON.stringify(systemMessage)} },` : ""}
    { role: "user", content: ${JSON.stringify(query.trim())} },
  ],
});
console.log(response.text);
console.log("\\n---");
console.log("⏱ " + response.latencyMs + "ms · " + response.model);
`;

    setOutputs([]);
    setRunning(true);
    const start = Date.now();

    try {
      const result = await runLlmCode(code, {
        onStdout: (text) => setOutputs((prev) => [...prev, { stream: "stdout", text }]),
        onStderr: (text) => setOutputs((prev) => [...prev, { stream: "stderr", text }]),
        onFigure: (dataUrl) => setOutputs((prev) => [...prev, { stream: "figure", text: "", dataUrl }]),
      });

      if (result.value !== undefined) {
        setOutputs((prev) => [...prev, { stream: "result", text: result.value! }]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setOutputs((prev) => [...prev, { stream: "error", text: msg }]);
    } finally {
      setRunning(false);
      void (Date.now() - start);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="flex-1 p-5 space-y-4 max-w-3xl mx-auto w-full">

        {/* 프롬프트 이름 */}
        <div>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="프롬프트 이름 (예: 독후감 작성 도우미)"
            className="w-full px-3 py-2 rounded-lg bg-brand-bg border border-brand-subtle text-base font-semibold text-brand-text
                       placeholder:text-brand-textDim/40 focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        {/* 5칸 입력 필드 */}
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="flex items-center gap-2 text-xs font-medium text-brand-textDim mb-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-accent/15 flex items-center justify-center text-[10px] font-bold text-brand-accent">
                {field.number}
              </span>
              {field.label}
              {field.key === "role" || field.key === "instruction" ? (
                <span className="text-[9px] text-red-400/60">필수</span>
              ) : (
                <span className="text-[9px] text-brand-textDim/40">선택</span>
              )}
            </label>
            <textarea
              value={data[field.key]}
              onChange={(e) => updateField(field.key, e.target.value)}
              onCompositionStart={() => { composing.current = true; }}
              onCompositionEnd={() => { composing.current = false; }}
              placeholder={field.placeholder}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-brand-panel/60 border border-brand-subtle text-sm text-brand-text
                         placeholder:text-brand-textDim/30 focus:outline-none focus:border-brand-accent/60
                         resize-y min-h-[44px] transition-colors"
            />
          </div>
        ))}

        {/* 구분선 */}
        <div className="border-t border-brand-subtle/50 pt-4">
          {/* 질문 입력 */}
          <label className="flex items-center gap-2 text-xs font-medium text-brand-textDim mb-1.5">
            <span className="text-base">💬</span>
            질문 입력
          </label>
          <textarea
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            onCompositionStart={() => { composing.current = true; }}
            onCompositionEnd={() => { composing.current = false; }}
            onKeyDown={(e) => {
              if (composing.current) return;
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleRun();
              }
            }}
            placeholder="AI에게 보낼 질문을 입력하세요... (Ctrl+Enter로 실행)"
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-brand-bg border border-brand-accent/30 text-sm text-brand-text
                       placeholder:text-brand-textDim/40 focus:outline-none focus:border-brand-accent
                       resize-y min-h-[60px] transition-colors"
          />

          {/* 실행 버튼 */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-[10px] text-brand-textDim/50">
              Ctrl+Enter로 실행 · 5칸은 모두 채울 필요 없어요
            </div>
            <button
              onClick={handleRun}
              disabled={running}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
                ${running
                  ? "bg-brand-subtle text-brand-textDim cursor-not-allowed"
                  : "bg-brand-accent text-white hover:brightness-110"}`}
            >
              {running ? "⏳ 실행 중..." : "▶ AI에게 보내기"}
            </button>
          </div>
        </div>

        {/* 실행 결과 */}
        {outputs.length > 0 && (
          <div className="border-t border-brand-subtle/50 pt-4">
            <div className="text-xs font-medium text-brand-textDim mb-2">AI 응답</div>
            <div className="rounded-xl border border-brand-subtle bg-brand-panel/40 p-4 space-y-2">
              {outputs.map((output, i) => {
                if (output.stream === "stdout") {
                  return (
                    <div key={i} className="text-sm text-brand-text whitespace-pre-wrap leading-relaxed">
                      {output.text}
                    </div>
                  );
                }
                if (output.stream === "figure" && output.dataUrl) {
                  return (
                    <div key={i} className="my-2">
                      <img src={output.dataUrl} alt="생성된 이미지" className="max-w-full rounded-lg" />
                    </div>
                  );
                }
                if (output.stream === "error") {
                  return (
                    <div key={i} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="text-xs font-medium text-red-400 mb-1">에러 발생</div>
                      <div className="text-xs text-red-300">{output.text}</div>
                    </div>
                  );
                }
                if (output.stream === "stderr") {
                  return (
                    <div key={i} className="text-xs text-amber-400">{output.text}</div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* 실행 중 프로그레시브 */}
        {running && (
          <div className="pt-2">
            <div className="w-full h-1.5 bg-brand-subtle/30 rounded-full overflow-hidden">
              <div className="h-full bg-brand-accent rounded-full animate-pulse" style={{ width: "60%" }} />
            </div>
            <div className="text-[10px] text-brand-textDim text-center mt-1">AI가 답변을 생성하고 있습니다...</div>
          </div>
        )}
      </div>
    </div>
  );
}
