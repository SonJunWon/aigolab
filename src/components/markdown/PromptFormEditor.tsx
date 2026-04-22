/**
 * 프롬프트 양식 편집기 — 코드 없이 5칸 입력으로 AI에게 질문
 *
 * 역할/맥락/지시/형식/제약 5칸 + 질문 입력 → chat() 자동 호출 → 결과 표시
 * 입력 내용은 마크다운 형식으로 .md 파일에 자동 저장
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { runLlmCode, listKeys } from "../../lib/llm";
import { useMdFileStore } from "../../store/mdFileStore";
import type { OutputChunk } from "../../types/notebook";

/* ─── AI 모델 옵션 ─── */
type PromptMode = "text" | "image";

interface ModelOption {
  id: string;
  provider: string;
  label: string;
  free: boolean;
  description: string;
}

const MODEL_OPTIONS: ModelOption[] = [
  // 무료 모델
  { id: "auto", provider: "", label: "자동 선택 (무료)", free: true, description: "Groq → Gemini 순서로 자동 선택" },
  { id: "gemini", provider: "gemini", label: "Gemini 2.5 Flash (무료)", free: true, description: "Google AI · 무료 1,500회/일" },
  { id: "groq", provider: "groq", label: "Groq Llama 3.3 70B (무료)", free: true, description: "초고속 · 무료 14,400회/일" },
  // Gemini 상위 모델
  { id: "gemini-2.5-pro", provider: "gemini", label: "Gemini 2.5 Pro (추론 특화)", free: false, description: "복잡한 추론 · 유료 결제 필요" },
  { id: "gemini-2.0-flash", provider: "gemini", label: "Gemini 2.0 Flash", free: false, description: "빠른 응답 · 유료 결제 필요" },
  // 직접 입력
  { id: "custom", provider: "gemini", label: "직접 입력...", free: false, description: "모델명을 직접 입력" },
];

/* ─── 첨부 파일 ─── */
interface Attachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  base64: string;        // data 부분만 (data:...;base64, 이후)
  preview?: string;      // 이미지일 경우 미리보기 URL
}

const ACCEPTED_TYPES = [
  "image/png", "image/jpeg", "image/gif", "image/webp",
  "application/pdf",
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + "B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + "KB";
  return (bytes / (1024 * 1024)).toFixed(1) + "MB";
}

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
  fileId,
}: {
  fileId: string;
}) {
  // 파일 ID를 ref에 고정 — 언마운트 시에도 올바른 파일에 저장
  const fileIdRef = useRef(fileId);
  fileIdRef.current = fileId;
  const updateFileContent = useMdFileStore((s) => s.updateFileContent);
  // store에서 직접 파일 내용을 읽음 — localContent 경유하지 않음
  const fileContent = useMdFileStore((s) => s.files.find((f) => f.id === fileId)?.content ?? "");
  const [data, setData] = useState<PromptData>({ name: "", role: "", context: "", instruction: "", format: "", constraints: "" });
  const [query, setQuery] = useState("");
  const [outputs, setOutputs] = useState<OutputChunk[]>([]);
  const [running, setRunning] = useState(false);
  const [selectedModel, setSelectedModel] = useState("auto");
  const [customModelName, setCustomModelName] = useState("");
  const [promptMode, setPromptMode] = useState<PromptMode>("text");
  const [registeredKeys, setRegisteredKeys] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const initialized = useRef(false);
  const composing = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 등록된 API 키 확인
  useEffect(() => {
    setRegisteredKeys(listKeys());
  }, []);

  // 현재 데이터를 ref로 유지 (언마운트 시 접근용)
  const dataRef = useRef(data);
  const queryRef = useRef(query);
  dataRef.current = data;
  queryRef.current = query;

  // 파일 내용에서 프롬프트 파싱 (최초 1회, store에서 직접 읽은 내용 사용)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (fileContent.includes("## ")) {
      const parsed = parsePromptMd(fileContent);
      const newData = { name: parsed.name, role: parsed.role, context: parsed.context, instruction: parsed.instruction, format: parsed.format, constraints: parsed.constraints };
      setData(newData);
      dataRef.current = newData;
      if (parsed.lastQuery) {
        setQuery(parsed.lastQuery);
        queryRef.current = parsed.lastQuery;
      }
    }
  }, [fileContent]);

  // 필드 변경 → 마크다운으로 변환 → 파일에 직접 저장 (디바운스)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveToFile = useCallback((newData: PromptData, newQuery: string) => {
    const id = fileIdRef.current;
    const md = toPromptMd(newData, newQuery);
    updateFileContent(id, md);
  }, [updateFileContent]);

  const syncToFile = useCallback((newData: PromptData, newQuery: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveToFile(newData, newQuery);
    }, 1000);
  }, [saveToFile]);

  // 언마운트 시: 타이머 취소 + 현재 내용 즉시 저장
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      const md = toPromptMd(dataRef.current, queryRef.current);
      if (md.trim() !== "# 프롬프트\n") {
        // fileIdRef에 고정된 ID로 저장 — 절대 다른 파일에 저장 안 됨
        updateFileContent(fileIdRef.current, md);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (key: keyof PromptData, value: string) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    syncToFile(newData, query);
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    syncToFile(data, value);
  };

  // ─── 첨부 파일 처리 ───
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        alert(`지원하지 않는 파일 형식입니다: ${file.name}\n지원 형식: 이미지(PNG, JPG, GIF, WebP), PDF`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`파일이 너무 큽니다: ${file.name} (${formatFileSize(file.size)})\n최대 20MB까지 가능합니다.`);
        continue;
      }

      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // "data:image/png;base64,..." 에서 base64 부분만 추출
          resolve(result.split(",")[1]);
        };
        reader.readAsDataURL(file);
      });

      const attachment: Attachment = {
        id: crypto.randomUUID(),
        name: file.name,
        mimeType: file.type,
        size: file.size,
        base64,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      };

      setAttachments((prev) => [...prev, attachment]);
    }

    // 입력 초기화 (같은 파일 재선택 허용)
    e.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const att = prev.find((a) => a.id === id);
      if (att?.preview) URL.revokeObjectURL(att.preview);
      return prev.filter((a) => a.id !== id);
    });
  };

  // ─── AI 실행 ───
  const handleRun = async () => {
    if (running) return;

    // 질문이 비어있으면 지시 내용을 질문으로 사용
    const actualQuery = query.trim() || data.instruction.trim();
    if (!actualQuery) { alert("질문 또는 지시 중 하나는 입력해주세요."); return; }

    // system 메시지 조합
    const systemParts: string[] = [];
    if (data.role) systemParts.push(`[역할] ${data.role}`);
    if (data.context) systemParts.push(`[맥락] ${data.context}`);
    if (data.instruction) systemParts.push(`[지시] ${data.instruction}`);
    if (data.format) systemParts.push(`[형식] ${data.format}`);
    if (data.constraints) systemParts.push(`[제약] ${data.constraints}`);

    const systemMessage = systemParts.join("\n");

    // provider + model 옵션
    const selectedOpt = MODEL_OPTIONS.find((o) => o.id === selectedModel);
    let providerCode = "";
    let modelOverride = "";

    if (selectedModel === "custom") {
      // 직접 입력 모델
      if (!customModelName.trim()) { alert("모델명을 입력해주세요."); return; }
      providerCode = `provider: "gemini",`;
      modelOverride = customModelName.trim();
    } else if (selectedModel !== "auto" && selectedOpt) {
      if (selectedOpt.free) {
        providerCode = `provider: ${JSON.stringify(selectedOpt.provider)},`;
      } else {
        providerCode = `provider: "gemini",`;
        modelOverride = selectedModel;
      }
    }

    // 첨부 파일이 있으면 반드시 Gemini 사용 (멀티모달)
    const hasAttachments = attachments.length > 0;
    if (hasAttachments && !registeredKeys.includes("gemini")) {
      alert("첨부 파일 분석은 Gemini API 키가 필요합니다.\n마이페이지 > API 키 관리에서 등록해주세요.");
      return;
    }

    // 첨부 파일 parts 코드 생성
    const attachmentPartsCode = attachments.map((att) =>
      `{ inlineData: { mimeType: ${JSON.stringify(att.mimeType)}, data: ${JSON.stringify(att.base64)} } }`
    ).join(",\n      ");

    let code: string;

    if (promptMode === "image") {
      // 이미지 생성 모드
      const imagePromptParts = [];
      if (data.context) imagePromptParts.push(data.context);
      imagePromptParts.push(actualQuery);
      if (data.format) imagePromptParts.push(data.format);
      if (data.constraints) imagePromptParts.push(data.constraints);
      const imagePrompt = imagePromptParts.join(". ");

      code = `
const result = await generateImage(${JSON.stringify(imagePrompt)});
console.log("[이미지 생성 완료]");
console.log("프로바이더: " + result.provider);
console.log("소요시간: " + result.latencyMs + "ms");
`;
    } else if (modelOverride) {
      // 유료 모델: 직접 SDK 호출 (chat() 라우터 우회)
      code = `
const apiKey = await requireKey("gemini");
const ai = new GoogleGenAI({ apiKey });
const model = ${JSON.stringify(modelOverride)};

const config = {};
${systemMessage ? `config.systemInstruction = ${JSON.stringify(systemMessage)};` : ""}

const startedAt = performance.now();
const response = await ai.models.generateContent({
  model,
  contents: [{ role: "user", parts: [
      { text: ${JSON.stringify(actualQuery)} },
      ${attachmentPartsCode}
    ] }],
  config,
});

const text = response.text ?? "";
const latencyMs = Math.round(performance.now() - startedAt);
console.log(text);
console.log("\\n---");
console.log("⏱ " + latencyMs + "ms · " + model);
`;
    } else if (hasAttachments) {
      // 첨부 파일 있으면 Gemini 직접 호출 (멀티모달)
      code = `
const apiKey = await requireKey("gemini");
const ai = new GoogleGenAI({ apiKey });
const model = "gemini-2.5-flash";

const config = {};
${systemMessage ? `config.systemInstruction = ${JSON.stringify(systemMessage)};` : ""}

const startedAt = performance.now();
const response = await ai.models.generateContent({
  model,
  contents: [{ role: "user", parts: [
      { text: ${JSON.stringify(actualQuery)} },
      ${attachmentPartsCode}
    ] }],
  config,
});

const text = response.text ?? "";
const latencyMs = Math.round(performance.now() - startedAt);
console.log(text);
console.log("\\n---");
console.log("⏱ " + latencyMs + "ms · " + model + " (첨부 " + ${attachments.length} + "개 포함)");
`;
    } else {
      // 무료 모델: chat() 라우터 사용
      code = `
const response = await chat({
  messages: [
    ${systemMessage ? `{ role: "system", content: ${JSON.stringify(systemMessage)} },` : ""}
    { role: "user", content: ${JSON.stringify(actualQuery)} },
  ],
  ${providerCode}
});
console.log(response.text);
console.log("\\n---");
console.log("⏱ " + response.latencyMs + "ms · " + response.model);
`;
    }

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

        {/* 첨부 파일 영역 */}
        <div className="border-t border-brand-subtle/50 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-brand-textDim">📎 첨부 자료</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 rounded-md text-[11px] border border-brand-subtle text-brand-textDim
                         hover:text-brand-text hover:border-brand-accent/40 transition-colors"
            >
              + 이미지/PDF 추가
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.gif,.webp,.pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <span className="text-[10px] text-brand-textDim/40">Gemini 전용 · 최대 20MB</span>
          </div>

          {/* 첨부 파일 목록 */}
          {attachments.length > 0 && (
            <div className="space-y-1.5 mb-3">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-panel/60 border border-brand-subtle"
                >
                  {/* 미리보기 */}
                  {att.preview ? (
                    <img src={att.preview} alt={att.name} className="w-10 h-10 rounded object-cover shrink-0" />
                  ) : (
                    <span className="w-10 h-10 rounded bg-brand-subtle/50 flex items-center justify-center text-lg shrink-0">📄</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-brand-text truncate">{att.name}</div>
                    <div className="text-[10px] text-brand-textDim">
                      {formatFileSize(att.size)} · {att.mimeType.startsWith("image/") ? "이미지" : "PDF"}
                    </div>
                  </div>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="text-[10px] text-red-400/60 hover:text-red-400 px-1 transition-colors"
                  >삭제</button>
                </div>
              ))}
            </div>
          )}

          {attachments.length === 0 && (
            <div className="text-[10px] text-brand-textDim/30 mb-3">
              이미지나 PDF를 첨부하면 AI가 내용을 분석합니다
            </div>
          )}
        </div>

        {/* 설정 영역 */}
        <div className="border-t border-brand-subtle/50 pt-4 space-y-3">

          {/* 모드 + 모델 선택 */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* 텍스트/이미지 모드 토글 */}
            <div className="flex rounded-lg border border-brand-subtle overflow-hidden">
              <button
                onClick={() => setPromptMode("text")}
                className={`px-3 py-1.5 text-[11px] transition-colors ${promptMode === "text" ? "bg-brand-accent text-white" : "text-brand-textDim hover:text-brand-text"}`}
              >💬 텍스트</button>
              <button
                onClick={() => setPromptMode("image")}
                className={`px-3 py-1.5 text-[11px] transition-colors ${promptMode === "image" ? "bg-violet-500 text-white" : "text-brand-textDim hover:text-brand-text"}`}
              >🖼️ 이미지</button>
            </div>

            {/* AI 모델 선택 */}
            {promptMode === "text" && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-brand-textDim">AI 모델:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    const modelId = e.target.value;
                    const opt = MODEL_OPTIONS.find((o) => o.id === modelId);
                    setSelectedModel(modelId);

                    if (!opt) return;

                    // 키 미등록 시 경고
                    if (opt.provider && !registeredKeys.includes(opt.provider)) {
                      alert(`${opt.provider} API 키가 등록되어 있지 않습니다.\n마이페이지 > API 키 관리에서 등록해주세요.`);
                      return;
                    }

                    // 유료 모델 선택 시 안내
                    if (!opt.free) {
                      alert(
                        `${opt.label}은 유료 모델입니다.\n\n` +
                        `Google AI Studio에서 유료 결제(Billing)가 활성화되어 있어야 사용할 수 있습니다.\n` +
                        `유료 결제가 되어 있지 않으면 실행 시 오류가 발생합니다.\n\n` +
                        `유료 결제 설정: https://aistudio.google.com → Settings → Billing`
                      );
                    }
                  }}
                  className="px-2 py-1 rounded-lg bg-brand-panel border border-brand-subtle text-[11px] text-brand-text
                             focus:outline-none focus:border-brand-accent transition-colors"
                >
                  <optgroup label="무료 모델">
                    {MODEL_OPTIONS.filter((o) => o.free).map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} {opt.provider && registeredKeys.includes(opt.provider) ? "✓" : opt.id === "auto" ? "" : "(미등록)"}
                      </option>
                    ))}
                  </optgroup>
                  {registeredKeys.includes("gemini") && (
                    <optgroup label="Gemini 유료 모델 (결제 필요)">
                      {MODEL_OPTIONS.filter((o) => !o.free).map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            )}

            {/* 커스텀 모델명 입력 */}
            {promptMode === "text" && selectedModel === "custom" && (
              <input
                type="text"
                value={customModelName}
                onChange={(e) => setCustomModelName(e.target.value)}
                placeholder="모델명 입력 (예: gemini-3.1-flash)"
                className="px-2 py-1 rounded-lg bg-brand-panel border border-brand-accent/40 text-[11px] text-brand-text
                           placeholder:text-brand-textDim/40 focus:outline-none focus:border-brand-accent transition-colors w-48"
              />
            )}

            {/* 이미지 모드 안내 */}
            {promptMode === "image" && (
              <span className="text-[10px] text-violet-400">
                한국어 → 영어 자동 번역 · Gemini Imagen 사용
              </span>
            )}
          </div>

          {/* 질문 입력 */}
          <label className="flex items-center gap-2 text-xs font-medium text-brand-textDim mb-1.5">
            <span className="text-base">{promptMode === "image" ? "🖼️" : "💬"}</span>
            {promptMode === "image" ? "이미지 설명" : "질문 입력"}
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
            placeholder={promptMode === "image"
              ? "이미지를 설명하세요... (예: 벚꽃 나무 아래 고양이, 수채화 스타일)"
              : "AI에게 보낼 질문을 입력하세요... (Ctrl+Enter로 실행)"}
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
              {running
                ? "⏳ 실행 중..."
                : promptMode === "image"
                  ? "🖼️ 이미지 생성"
                  : "▶ AI에게 보내기"}
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
