/**
 * KeySetupModal — BYOK (Bring Your Own Key) 키 등록 모달.
 *
 * 3단계 캐러셀:
 *   1. Gemini 키 발급 + 입력 + 검증
 *   2. Groq 키 발급 + 입력 + 검증 (보안 경고 포함)
 *   3. 완료 — 등록된 키 요약
 *
 * 트리거 시나리오:
 *   A. 학습자가 레슨 내 버튼으로 명시적 열기
 *   B. chat() 가 LlmError("missing-key") 던진 경우 상위 컴포넌트에서 열기
 *      → initialProvider 로 실패한 provider 단계부터 시작
 *
 * 탈출구: "키 없이 시뮬레이션 모드로" 버튼으로 녹화본 재생 경로 (T10) 유도.
 */

import { useEffect, useRef, useState } from "react";
import {
  chat,
  getKey,
  LlmError,
  removeKey,
  setKey,
  type Provider,
} from "../../lib/llm";

/** 키 패턴 — 저장 전 모양만 빠르게 거르는 용도 (실제 유효성은 테스트 호출로) */
const KEY_PATTERNS: Record<"gemini" | "groq", RegExp> = {
  gemini: /^AIza[A-Za-z0-9_-]{20,}$/,
  groq: /^gsk_[A-Za-z0-9]{30,}$/,
};

const KEY_ISSUE_LINKS: Record<"gemini" | "groq", string> = {
  gemini: "https://aistudio.google.com/apikey",
  groq: "https://console.groq.com/keys",
};

type Step = "gemini" | "groq" | "done";
const STEP_ORDER: Step[] = ["gemini", "groq", "done"];

interface Props {
  onClose: () => void;
  /** 선택적 — 학생이 "시뮬레이션 모드로" 버튼 누르면 상위 상태를 전환 */
  onSimulationMode?: () => void;
  /** 특정 provider 단계부터 시작하고 싶을 때 (예: chat 실패 후 자동 열기) */
  initialProvider?: "gemini" | "groq";
}

type SaveStatus = "idle" | "validating" | "saved" | "error";

export function KeySetupModal({
  onClose,
  onSimulationMode,
  initialProvider,
}: Props) {
  const [step, setStep] = useState<Step>(initialProvider ?? "gemini");

  // 각 provider 별 독립 입력 상태 — 단계 이동해도 유지
  const [geminiInput, setGeminiInput] = useState("");
  const [groqInput, setGroqInput] = useState("");
  const [geminiStatus, setGeminiStatus] = useState<SaveStatus>("idle");
  const [groqStatus, setGroqStatus] = useState<SaveStatus>("idle");
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [groqError, setGroqError] = useState<string | null>(null);

  // 저장되어 있는 키 유무 (초기 로드 시 체크 — 값 자체는 읽지 않음)
  const [geminiHasKey, setGeminiHasKey] = useState(false);
  const [groqHasKey, setGroqHasKey] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [g, q] = await Promise.all([getKey("gemini"), getKey("groq")]);
      if (cancelled) return;
      setGeminiHasKey(Boolean(g));
      setGroqHasKey(Boolean(q));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ESC 로 닫기 (검증 중이 아닐 때만)
  const isBusy = geminiStatus === "validating" || groqStatus === "validating";
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isBusy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, isBusy]);

  // 배경 클릭으로 닫기
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current && !isBusy) onClose();
  };

  const goNext = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx >= 0 && idx < STEP_ORDER.length - 1) setStep(STEP_ORDER[idx + 1]);
  };
  const goPrev = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) setStep(STEP_ORDER[idx - 1]);
  };

  /**
   * 키 저장 + 실제 chat() 로 유효성 검증.
   * 검증 실패 시 저장된 키 되돌려 제거.
   */
  const saveAndValidate = async (
    provider: "gemini" | "groq",
    rawInput: string,
  ) => {
    const trimmed = rawInput.trim();
    const pattern = KEY_PATTERNS[provider];
    const setStatus = provider === "gemini" ? setGeminiStatus : setGroqStatus;
    const setError = provider === "gemini" ? setGeminiError : setGroqError;
    const setHasKey = provider === "gemini" ? setGeminiHasKey : setGroqHasKey;

    if (!pattern.test(trimmed)) {
      setStatus("error");
      setError(
        provider === "gemini"
          ? "키 형식이 올바르지 않습니다. (Gemini 키는 AIza 로 시작)"
          : "키 형식이 올바르지 않습니다. (Groq 키는 gsk_ 로 시작)",
      );
      return;
    }

    setStatus("validating");
    setError(null);
    try {
      await setKey(provider, trimmed);
      // 저비용 테스트 호출 — ping 한 마디 + max 10 tokens
      await chat({
        provider,
        messages: [{ role: "user", content: "ping" }],
        maxTokens: 10,
      });
      setStatus("saved");
      setHasKey(true);
    } catch (err) {
      // 테스트 실패 — 키 되돌림
      await removeKey(provider);
      setHasKey(false);
      setStatus("error");
      if (err instanceof LlmError) {
        setError(
          err.reason === "invalid-key"
            ? "키가 유효하지 않습니다. 다시 발급받아 시도해주세요."
            : err.reason === "rate-limited"
              ? "현재 API 가 레이트 리밋 상태입니다. 잠시 후 다시 시도해주세요."
              : err.message,
        );
      } else {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
        );
      }
    }
  };

  const handleRemove = async (provider: "gemini" | "groq") => {
    await removeKey(provider);
    if (provider === "gemini") {
      setGeminiHasKey(false);
      setGeminiInput("");
      setGeminiStatus("idle");
      setGeminiError(null);
    } else {
      setGroqHasKey(false);
      setGroqInput("");
      setGroqStatus("idle");
      setGroqError(null);
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="AI API 키 등록"
    >
      <div className="w-full max-w-lg rounded-2xl bg-brand-panel border border-brand-subtle shadow-2xl">
        {/* 헤더 + 단계 표시 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-subtle">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-brand-text">
              AI API 키 등록
            </h2>
            <StepDots current={step} />
          </div>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-brand-textDim hover:text-brand-text hover:bg-brand-hover disabled:opacity-50 transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div className="px-5 py-5 min-h-[320px]">
          {step === "gemini" && (
            <ProviderStep
              provider="gemini"
              title="1. Google Gemini 키 발급"
              intro={
                <>
                  Google AI Studio 에서 <strong>무료</strong> 로 발급 — 일일 1500 호출 한도.
                  프로젝트 만들 필요 없이 바로 발급됩니다.
                </>
              }
              link={KEY_ISSUE_LINKS.gemini}
              linkLabel="Google AI Studio 열기"
              keyHint="AIza 로 시작하는 문자열"
              input={geminiInput}
              setInput={setGeminiInput}
              status={geminiStatus}
              error={geminiError}
              hasKey={geminiHasKey}
              onSubmit={() => saveAndValidate("gemini", geminiInput)}
              onRemove={() => handleRemove("gemini")}
              footerWarning={null}
            />
          )}

          {step === "groq" && (
            <ProviderStep
              provider="groq"
              title="2. Groq 키 발급"
              intro={
                <>
                  Groq Console 에서 <strong>무료</strong> 로 발급 — 일일 14400 호출.
                  Llama 3.3 70B 를 초고속으로 실행합니다.
                </>
              }
              link={KEY_ISSUE_LINKS.groq}
              linkLabel="Groq Console 열기"
              keyHint="gsk_ 로 시작하는 문자열"
              input={groqInput}
              setInput={setGroqInput}
              status={groqStatus}
              error={groqError}
              hasKey={groqHasKey}
              onSubmit={() => saveAndValidate("groq", groqInput)}
              onRemove={() => handleRemove("groq")}
              footerWarning={
                <>
                  ⚠️ Groq 키는 브라우저에 저장됩니다. 키가 유출되면 타인이 여러분
                  계정으로 호출할 수 있으니, 공용 PC 사용 후엔 삭제해주세요.
                </>
              }
            />
          )}

          {step === "done" && (
            <DoneStep
              geminiHasKey={geminiHasKey}
              groqHasKey={groqHasKey}
              onBackToGemini={() => setStep("gemini")}
              onBackToGroq={() => setStep("groq")}
            />
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-brand-subtle">
          {onSimulationMode ? (
            <button
              onClick={() => {
                onSimulationMode();
                onClose();
              }}
              disabled={isBusy}
              className="text-xs text-brand-textDim hover:text-brand-text underline underline-offset-2 disabled:opacity-50"
            >
              키 없이 시뮬레이션 모드로
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            {step !== "gemini" && (
              <button
                onClick={goPrev}
                disabled={isBusy}
                className="px-3 py-2 text-xs rounded-lg text-brand-textDim hover:text-brand-text hover:bg-brand-hover disabled:opacity-50 transition-colors"
              >
                ← 이전
              </button>
            )}
            {step !== "done" ? (
              <button
                onClick={goNext}
                disabled={isBusy}
                className="px-4 py-2 text-xs rounded-lg bg-brand-primary text-white font-medium hover:bg-brand-primaryDim disabled:opacity-40 transition-colors"
              >
                다음 →
              </button>
            ) : (
              <button
                onClick={onClose}
                disabled={isBusy}
                className="px-4 py-2 text-xs rounded-lg bg-brand-primary text-white font-medium hover:bg-brand-primaryDim disabled:opacity-40 transition-colors"
              >
                완료
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 하위 컴포넌트
// ─────────────────────────────────────────────────────────

function StepDots({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-1.5" aria-label="진행 단계">
      {STEP_ORDER.map((s) => (
        <span
          key={s}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            s === current
              ? "bg-brand-primary w-4"
              : "bg-brand-subtle"
          }`}
        />
      ))}
    </div>
  );
}

interface ProviderStepProps {
  provider: Provider;
  title: string;
  intro: React.ReactNode;
  link: string;
  linkLabel: string;
  keyHint: string;
  input: string;
  setInput: (v: string) => void;
  status: SaveStatus;
  error: string | null;
  hasKey: boolean;
  onSubmit: () => void;
  onRemove: () => void;
  footerWarning: React.ReactNode;
}

function ProviderStep({
  title,
  intro,
  link,
  linkLabel,
  keyHint,
  input,
  setInput,
  status,
  error,
  hasKey,
  onSubmit,
  onRemove,
  footerWarning,
}: ProviderStepProps) {
  const busy = status === "validating";
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-brand-text mb-1">{title}</h3>
        <p className="text-xs text-brand-textDim leading-relaxed">{intro}</p>
      </div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-brand-bg border border-brand-subtle text-brand-text hover:border-brand-primary transition-colors"
      >
        🔗 {linkLabel}
      </a>

      {/* 키 입력 */}
      <div>
        <label className="block text-xs font-medium text-brand-textDim uppercase tracking-wider mb-2">
          API 키 붙여넣기
        </label>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
          placeholder={keyHint}
          className="w-full px-3 py-2 text-sm font-mono rounded-lg bg-brand-bg border border-brand-subtle text-brand-text focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-50"
          autoComplete="off"
          spellCheck={false}
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={onSubmit}
            disabled={busy || !input.trim()}
            className="px-3 py-1.5 text-xs rounded-lg bg-brand-primary text-white font-medium hover:bg-brand-primaryDim disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {busy ? "검증 중..." : "저장 & 테스트"}
          </button>
          {hasKey && !busy && (
            <button
              onClick={onRemove}
              className="px-3 py-1.5 text-xs rounded-lg text-brand-red hover:bg-brand-red/10 transition-colors"
            >
              저장된 키 삭제
            </button>
          )}
          {hasKey && status !== "error" && (
            <span className="text-xs text-brand-primary">✓ 저장됨</span>
          )}
        </div>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-brand-red/15 border border-brand-red/30 text-xs text-brand-red">
          {error}
        </div>
      )}

      {footerWarning && (
        <div className="px-3 py-2 rounded-lg bg-brand-subtle/50 border border-brand-subtle text-[11px] text-brand-textDim leading-relaxed">
          {footerWarning}
        </div>
      )}
    </div>
  );
}

function DoneStep({
  geminiHasKey,
  groqHasKey,
  onBackToGemini,
  onBackToGroq,
}: {
  geminiHasKey: boolean;
  groqHasKey: boolean;
  onBackToGemini: () => void;
  onBackToGroq: () => void;
}) {
  const hasAny = geminiHasKey || groqHasKey;
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-brand-text">등록 상태</h3>

      <div className="space-y-2">
        <StatusRow
          label="Google Gemini"
          hasKey={geminiHasKey}
          onFix={onBackToGemini}
        />
        <StatusRow label="Groq" hasKey={groqHasKey} onFix={onBackToGroq} />
      </div>

      {hasAny ? (
        <p className="text-xs text-brand-textDim leading-relaxed">
          완료! 이제 레슨으로 돌아가 실습을 진행할 수 있습니다. 키는 여러분 브라우저에만
          암호화 저장되며 네트워크로 전송되지 않습니다.
        </p>
      ) : (
        <p className="text-xs text-brand-textDim leading-relaxed">
          아직 등록된 키가 없습니다. "이전" 을 눌러 돌아가거나, "키 없이 시뮬레이션
          모드로" 를 눌러 녹화본 재생으로 진도를 이어갈 수 있습니다.
        </p>
      )}
    </div>
  );
}

function StatusRow({
  label,
  hasKey,
  onFix,
}: {
  label: string;
  hasKey: boolean;
  onFix: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-brand-bg border border-brand-subtle">
      <span className="text-sm text-brand-text">{label}</span>
      {hasKey ? (
        <span className="text-xs text-brand-primary">✓ 등록됨</span>
      ) : (
        <button
          onClick={onFix}
          className="text-xs text-brand-textDim hover:text-brand-text underline underline-offset-2"
        >
          지금 등록
        </button>
      )}
    </div>
  );
}
