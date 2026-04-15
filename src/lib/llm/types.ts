/**
 * @aigolab/llm — 통합 LLM SDK 타입 정의
 *
 * 학생 코드가 provider (Gemini/Groq/WebLLM) 이름에 직접 의존하지 않도록
 * 모든 호출은 task 기반 추상 API 로 통일한다.
 *
 * Phase 2 추가:
 *   - 구조화 출력 (responseSchema → response.json)
 *   - 스트리밍 (stream + onToken)
 *   - Tool calling (tools + toolChoice → response.toolCalls)
 */

// ─────────────────────────────────────────────────────────
// 메시지 / role
// ─────────────────────────────────────────────────────────

/** 모델에 보내는 메시지 역할. Phase 2 에서 "tool" 역할 추가 (tool 실행 결과를 다시 모델에 주입). */
export type Role = "system" | "user" | "assistant" | "tool";

/** 단일 대화 턴 */
export interface Message {
  role: Role;
  content: string;
  /**
   * assistant 메시지에 모델이 호출하려 한 tool 목록 (Phase 2).
   * 학생이 `chatWithTools` 헬퍼를 쓰거나 직접 루프를 돌릴 때 append 함.
   */
  toolCalls?: ToolCall[];
  /**
   * role="tool" 일 때 — 어느 ToolCall 의 결과인지 연결.
   * Groq/OpenAI 호환 포맷은 이 id 로 호출·결과를 매칭함.
   */
  toolCallId?: string;
}

// ─────────────────────────────────────────────────────────
// Provider / Task
// ─────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────
// Phase 2: 구조화 출력 · Tool calling 타입
// ─────────────────────────────────────────────────────────

/**
 * JSON Schema — Gemini responseSchema / Groq response_format 양쪽이 받는 공통 포맷.
 * 학생은 보통 `zod` 로 작성 후 변환하거나 직접 객체로 작성.
 * 표준 draft-07 subset 을 기대 (`type`, `properties`, `required`, `items`, `enum` 등).
 */
export type JsonSchema = Record<string, unknown>;

/**
 * Tool calling 정의 — 학생이 chat() 에 건네는 사용 가능한 함수 명세.
 * `execute` 는 실제 실행 함수. Gemini/Groq 모두 스펙은 같고, 어댑터가 자기 포맷으로 번역.
 */
export interface ToolDefinition {
  /** 스네이크·카멜 모두 허용. 고유해야 함. */
  name: string;
  /** 모델이 "언제 호출할지" 판단하는 핵심 — 목적·타이밍을 명확히 서술. */
  description: string;
  /** 함수 인자 스키마 (JSON Schema). object 타입 권장. */
  parameters: JsonSchema;
  /** 실제 실행 함수. chatWithTools 루프가 모델의 toolCall 을 받아 이걸 호출. */
  execute: (args: Record<string, unknown>) => unknown | Promise<unknown>;
}

/** 모델이 호출하려 한 tool 한 건 */
export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  /**
   * 제공자별 고유 id (Gemini function-call id, Groq tool_call id).
   * Groq 루프에서는 후속 tool 결과 메시지에 이 id 를 담아야 함.
   */
  id?: string;
}

/**
 * 모델이 tool 을 호출할지 말지 제어:
 *   - "auto" : 모델이 판단 (기본)
 *   - "any"  : 반드시 어떤 tool 이든 호출
 *   - "none" : tool 정보는 참고, 호출은 금지
 *   - { name } : 특정 tool 만 호출 강제
 */
export type ToolChoice = "auto" | "any" | "none" | { name: string };

// ─────────────────────────────────────────────────────────
// ChatRequest / ChatResponse
// ─────────────────────────────────────────────────────────

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

  // ─── Phase 2 ─────────────────────────────────────
  /**
   * JSON Schema — 지정 시 모델은 이 스키마를 준수하는 JSON 을 반환해야 함.
   * response.text 엔 JSON 문자열, response.json 엔 파싱된 객체가 들어감.
   * Gemini / Groq 지원. WebLLM 은 best-effort (프롬프트 힌트로만).
   */
  responseSchema?: JsonSchema;

  /**
   * true 면 어댑터의 스트리밍 경로로 호출. LlmRunCallbacks.onToken 으로 chunk 전달.
   * 최종 결과는 평소처럼 ChatResponse 로 resolved (전체 텍스트 합쳐서).
   * WebLLM 지원, Gemini/Groq 지원.
   */
  stream?: boolean;

  /**
   * 사용 가능한 tool 목록 (Ch05).
   * 지정 시 response.toolCalls 가 채워질 수 있음.
   * WebLLM 은 미지원 — tools 지정 시 LlmError("unsupported-env") 던짐.
   */
  tools?: ToolDefinition[];

  /** tool 호출 강도 제어. tools 없으면 무시. */
  toolChoice?: ToolChoice;
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

  // ─── Phase 2 ─────────────────────────────────────
  /**
   * responseSchema 요청 시 파싱된 객체.
   * 스키마 없이 호출했거나 파싱 실패 시 undefined (text 는 그대로 있음).
   */
  json?: unknown;

  /**
   * 모델이 호출하려는 tool 목록.
   * chatWithTools 헬퍼는 이걸 읽어 ToolDefinition.execute 를 돌리고 루프 지속.
   * 없으면 undefined (빈 배열 아님 — 명시적 구분).
   */
  toolCalls?: ToolCall[];
}

// ─────────────────────────────────────────────────────────
// Trace (녹화/재생)
// ─────────────────────────────────────────────────────────

/**
 * 녹화본 — 강사가 키로 실행해서 결과를 녹화한 뒤
 * lesson 에 첨부하면 학생이 키 없이 재생 가능.
 *
 * version 1: Phase 1 (단일 input/output)
 * version 2: Phase 2 (+ 스트리밍 토큰 타이밍 + tool step)
 */
export type Trace = TraceV1 | TraceV2;

export interface TraceV1 {
  version: 1;
  input: ChatRequest;
  output: ChatResponse;
  /** ISO8601 */
  recordedAt: string;
}

export interface TraceV2 {
  version: 2;
  input: ChatRequest;
  output: ChatResponse;
  /** 스트리밍 녹화 — onToken 재현용 (옵션) */
  tokens?: Array<{
    /** 이전 chunk 이후 경과 ms */
    delay: number;
    chunk: string;
  }>;
  /** Tool 루프 녹화 — 각 호출/결과 쌍 */
  toolSteps?: Array<{
    call: ToolCall;
    result: unknown;
  }>;
  /** ISO8601 */
  recordedAt: string;
}

// ─────────────────────────────────────────────────────────
// 진행률 콜백 (WebLLM)
// ─────────────────────────────────────────────────────────

/** 모델 다운로드·초기화 진행률 (주로 WebLLM) */
export interface ProgressEvent {
  provider: Provider;
  phase: "downloading" | "loading" | "ready";
  progress: number; // 0..1
  message?: string;
}

export type ProgressCallback = (event: ProgressEvent) => void;

// ─────────────────────────────────────────────────────────
// 에러
// ─────────────────────────────────────────────────────────

export type LlmErrorReason =
  | "missing-key"
  | "invalid-key"
  | "rate-limited"
  | "network"
  | "unsupported-env"
  | "all-providers-failed"
  | "not-implemented"
  | "schema-violation"   // Phase 2: responseSchema 파싱 실패
  | "tool-loop-exceeded" // Phase 2: chatWithTools maxIterations 초과
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
