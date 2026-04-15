/**
 * @aigolab/llm — 통합 LLM SDK 타입 정의
 *
 * 학생 코드가 provider (Gemini/Groq/WebLLM) 이름에 직접 의존하지 않도록
 * 모든 호출은 task 기반 추상 API 로 통일한다.
 */

/** 모델에 보내는 메시지 역할 */
export type Role = "system" | "user" | "assistant";

/** 단일 대화 턴 */
export interface Message {
  role: Role;
  content: string;
}

/** 지원 Provider 이름 */
export type Provider = "gemini" | "groq" | "webllm";

/**
 * 추상 task — 학생은 provider 를 몰라도 된다.
 * - fast: 빠른 응답 (Groq → Gemini 페일오버)
 * - reasoning: 긴 추론 (Groq 70B 우선)
 * - multimodal: 이미지/오디오 포함 (Gemini 전용)
 * - offline: 로컬 실행 (WebLLM, 키 불필요)
 */
export type Task = "fast" | "reasoning" | "multimodal" | "offline";

/** chat() 요청 */
export interface ChatRequest {
  messages: Message[];
  /** task 미지정 시 "fast" 로 기본값 */
  task?: Task;
  /** provider 강제 지정 (비교 실습용). task 와 같이 있으면 provider 가 우선. */
  provider?: Provider;
  temperature?: number;
  maxTokens?: number;
  /** 키 없이 녹화본으로 재생하고 싶을 때 */
  simulation?: Trace;
}

/** chat() 응답 */
export interface ChatResponse {
  text: string;
  provider: Provider;
  model: string;
  tokensUsed?: {
    input: number;
    output: number;
  };
  latencyMs: number;
  /** 디버깅/검증용 원본 응답 (provider 별로 형식 다름) */
  raw?: unknown;
}

/**
 * 녹화본 — 강사가 키로 실행해서 결과를 녹화한 뒤
 * lesson 에 첨부하면 학생이 키 없이 재생 가능.
 */
export interface Trace {
  version: 1;
  input: ChatRequest;
  output: ChatResponse;
  /** ISO8601 */
  recordedAt: string;
}

/** 모델 다운로드·초기화 진행률 (주로 WebLLM) */
export interface ProgressEvent {
  provider: Provider;
  phase: "downloading" | "loading" | "ready";
  progress: number; // 0..1
  message?: string;
}

export type ProgressCallback = (event: ProgressEvent) => void;

export type LlmErrorReason =
  | "missing-key"
  | "invalid-key"
  | "rate-limited"
  | "network"
  | "unsupported-env"
  | "all-providers-failed"
  | "not-implemented"
  | "unknown";

/** SDK 에러 — Provider 에 따라 reason 이 다름 */
export class LlmError extends Error {
  readonly reason: LlmErrorReason;
  readonly provider?: Provider;
  readonly cause?: unknown;

  constructor(
    reason: LlmErrorReason,
    message: string,
    provider?: Provider,
    cause?: unknown,
  ) {
    super(message);
    this.name = "LlmError";
    this.reason = reason;
    this.provider = provider;
    this.cause = cause;
  }
}
