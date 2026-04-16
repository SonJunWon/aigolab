/**
 * LLM 셀 런타임 — 학생이 작성한 TypeScript 코드를 브라우저에서 실행.
 *
 * 설계 선택:
 * - 트랜스파일러: **sucrase** (PLAN 초안의 esbuild-wasm 대신).
 *   근거: 순수 JS, WASM 초기화 불필요, 학생 코드 규모에 충분히 빠름,
 *   번들 영향 작음. esbuild-wasm 은 DX/번들 비용이 이 수준의 코드엔 과함.
 * - 실행 방식: `new AsyncFunction(...)` — top-level await 를 자연스럽게 허용.
 *   샌드박싱은 하지 않음 (학생 본인 코드라 격리 필요성 낮음).
 * - SDK 주입: import 없이 `chat` 이 글로벌처럼 보이도록 AsyncFunction 파라미터로 주입.
 *   학생이 실수로 import 문 작성해도 실행 전 정규식으로 제거 → 혼동 최소화.
 */

import { transform } from "sucrase";
import { z, toJSONSchema } from "zod";
import { chat } from "./router";
import { exportTrace, replayTrace } from "./simulation";
import { LlmError } from "./types";
import { chatWithTools as baseChatWithTools } from "./toolLoop";
import type {
  ChatRequest,
  ChatResponse,
  ProgressCallback,
  Trace,
} from "./types";
import type { ChatWithToolsOptions } from "./toolLoop";

export interface LlmRunCallbacks {
  onStdout?: (text: string) => void;
  onStderr?: (text: string) => void;
  /**
   * WebLLM 모델 다운로드·로딩 진행률 콜백.
   * 제공자 초기화 단계 (첫 chat 호출) 에만 의미 있음.
   */
  onProgress?: ProgressCallback;
  /**
   * Phase 2 스트리밍 콜백 — `chat({ stream: true })` 호출 시 토큰 단위 chunk 가 흘러옴.
   * Ch04 Thought Stream UI 가 이걸 구독해 토큰 단위로 화면 갱신.
   */
  onToken?: (chunk: string) => void;
  /**
   * Phase 3 에이전트 단계 콜백 — chatWithTools 의 onStep 이벤트를 UI 로 전달.
   * AgentTraceViewer 가 이걸 구독해 타임라인으로 렌더.
   */
  onAgentStep?: (step: {
    type: "think" | "tool-call" | "tool-result" | "answer";
    agentName?: string;
    content: string;
    meta?: Record<string, unknown>;
  }) => void;
  /**
   * T10 재생 — 학생이 키 없이도 진도 나갈 수 있게, 녹화본을 순서대로 주입.
   * 셀 내 chat() 호출마다 하나씩 소비.
   */
  replayTraces?: Trace[];
}

export interface LlmRunResult {
  /** 코드 끝 표현식의 반환값 (있을 경우 문자열 직렬화) */
  value?: string;
  timeMs: number;
  /**
   * T10 녹화 — 이번 실행에서 일어난 chat 호출의 trace 모음.
   * 강사가 관리자 모드에서 다운로드해 lesson 에 첨부하면 재생 가능.
   */
  traces: Trace[];
  /** 재생 모드로 실행되었는지 (UI 에 📼 배지 노출용) */
  replayed: boolean;
}

export class LlmRuntimeError extends Error {
  readonly phase: "compile" | "runtime";
  readonly timeMs: number;

  constructor(message: string, phase: "compile" | "runtime", timeMs: number) {
    super(message);
    this.name = "LlmRuntimeError";
    this.phase = phase;
    this.timeMs = timeMs;
  }
}

/**
 * 학생 TS 코드 → JS 로 트랜스파일 + 주입 스코프에서 실행.
 * 외부 콜백을 통해 console 출력을 실시간 스트리밍.
 */
export async function runLlmCode(
  source: string,
  callbacks: LlmRunCallbacks = {},
): Promise<LlmRunResult> {
  // ─── 1. import 문 제거 ────────────────────────────
  // 학생이 `import { chat } from "@aigolab/llm"` 같은 걸 작성하면
  // runtime 에선 import resolver 가 없어 ReferenceError 로 이어진다.
  // 주입 방식이라 import 는 불필요 — 조용히 제거해서 친숙한 코드도 돌게.
  const stripped = stripImports(source);

  // ─── 2. TypeScript → JavaScript ─────────────────
  let compiled: string;
  try {
    const result = transform(stripped, {
      transforms: ["typescript"],
      disableESTransforms: true, // async/await 등 native 유지
    });
    compiled = result.code;
  } catch (err) {
    throw new LlmRuntimeError(
      `TypeScript 컴파일 에러: ${err instanceof Error ? err.message : String(err)}`,
      "compile",
      0,
    );
  }

  // ─── 3. chat 래핑 (녹화/재생) ──────────────────────
  const recordedTraces: Trace[] = [];
  const replayQueue: Trace[] = [...(callbacks.replayTraces ?? [])];
  const hasReplay = replayQueue.length > 0;

  /**
   * 주입할 chat — 호출 시점에 재생/녹화 결정:
   *   1. replay 큐에 남은 Trace 있으면 그걸로 재생 (네트워크 안 탐)
   *   2. 아니면 실제 chat, 결과를 recordedTraces 에 쌓음
   */
  const wrappedChat = async (req: ChatRequest): Promise<ChatResponse> => {
    if (replayQueue.length > 0) {
      const trace = replayQueue.shift() as Trace;
      return replayTrace(trace, { onToken: callbacks.onToken });
    }
    // 어댑터에 onProgress + onToken 옵션 함께 전달
    const res = await chat(req, {
      onProgress: callbacks.onProgress,
      onToken: callbacks.onToken,
    });
    recordedTraces.push(exportTrace(req, res));
    return res;
  };

  // ─── 4. 실행 ────────────────────────────────────
  const capturedConsole = createCapturedConsole(callbacks);
  const startedAt = performance.now();

  try {
    // AsyncFunction 은 전역에 직접 노출되어 있지 않으므로 prototype 으로 얻는다
    const AsyncFunction = Object.getPrototypeOf(
      async function () {},
    ).constructor as new (...args: string[]) => (
      ...params: unknown[]
    ) => Promise<unknown>;

    // Ch03 구조화 + Ch06~07 에이전트 실습 지원:
    //   - z / toJsonSchema : zod 스키마 빌더 + JSON Schema 변환
    //   - __emitAgentStep  : onStep 을 OutputChunk "agent-step" 로 흘리는 내부 함수
    //     chatWithTools 에 onStep 을 안 넘겨도 __emitAgentStep 이 자동 배선되어 있음
    const wrappedChatWithToolsWithTrace = (
      req: ChatRequest,
      toolOpts?: ChatWithToolsOptions,
    ) => {
      // onStep 미지정 시 자동으로 에이전트 트레이스 UI 로 방출
      const mergedOpts: ChatWithToolsOptions = {
        ...toolOpts,
        onStep: (step) => {
          // 원래 콜백 있으면 먼저 호출
          toolOpts?.onStep?.(step);
          // UI 자동 방출
          callbacks.onAgentStep?.({
            type: "tool-call",
            content: `${step.call.name}(${JSON.stringify(step.call.args)})`,
            meta: { result: step.result, iteration: step.iteration },
          });
          callbacks.onAgentStep?.({
            type: "tool-result",
            content: typeof step.result === "string" ? step.result : JSON.stringify(step.result),
          });
        },
      };
      return baseChatWithTools(req, mergedOpts);
    };

    const fn = new AsyncFunction(
      "chat",
      "chatWithTools",
      "z",
      "toJsonSchema",
      "console",
      compiled,
    );
    const value = await fn(
      wrappedChat,
      wrappedChatWithToolsWithTrace,
      z,
      toJSONSchema,
      capturedConsole,
    );
    const timeMs = Math.round(performance.now() - startedAt);
    return {
      value: value === undefined ? undefined : stringify(value),
      timeMs,
      traces: recordedTraces,
      replayed: hasReplay,
    };
  } catch (err) {
    const timeMs = Math.round(performance.now() - startedAt);
    // LlmError 는 타입 정보를 그대로 보존해서 상위(runCell)가 provider/reason 으로 UI 분기 가능하게
    if (err instanceof LlmError) throw err;
    const message =
      err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    throw new LlmRuntimeError(message, "runtime", timeMs);
  }
}

/**
 * 녹화본 묶음을 다운로드 가능한 JSON 문자열로 직렬화.
 * 강사가 "Record" 하고 이 결과를 lesson 파일에 첨부하면 재생 준비 완료.
 */
export function serializeTraces(traces: Trace[]): string {
  return JSON.stringify(traces, null, 2);
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

/**
 * 모든 import 라인을 제거. 과하게 엄격한 제거 대신 안전한 휴리스틱:
 *   - 라인이 `import` 로 시작하고 `from "..."` 또는 `;` 로 끝나는 패턴
 *   - 여러 줄 import 는 드물지만 `;` 까지 연속 제거
 */
function stripImports(source: string): string {
  return source
    // 한 줄 짜리: `import x from "y";` 또는 `import "y";`
    .replace(/^[ \t]*import\b[^\n;]*;?\s*$/gm, "")
    // 여러 줄: `import {\n  a,\n  b\n} from "y";` (최소 매칭)
    .replace(/^[ \t]*import\s*\{[\s\S]*?\}\s*from\s*["'][^"']+["']\s*;?/gm, "");
}

/** console.log/info/warn/error/debug/dir 을 콜백 스트림으로 라우팅 */
function createCapturedConsole(opts: LlmRunCallbacks) {
  const toText = (args: unknown[]) => args.map(stringify).join(" ") + "\n";
  return {
    log: (...args: unknown[]) => opts.onStdout?.(toText(args)),
    info: (...args: unknown[]) => opts.onStdout?.(toText(args)),
    debug: (...args: unknown[]) => opts.onStdout?.(toText(args)),
    warn: (...args: unknown[]) => opts.onStderr?.(toText(args)),
    error: (...args: unknown[]) => opts.onStderr?.(toText(args)),
    dir: (v: unknown) => opts.onStdout?.(stringify(v) + "\n"),
  };
}

/** 임의 값 → 사람 읽기 좋은 문자열 (JSON 순환 참조 대응 포함) */
function stringify(v: unknown): string {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean" || typeof v === "bigint") {
    return String(v);
  }
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  try {
    return JSON.stringify(v, replaceCircular(), 2);
  } catch {
    return String(v);
  }
}

/** JSON.stringify 순환 참조 대응 */
function replaceCircular() {
  const seen = new WeakSet();
  return (_k: string, val: unknown) => {
    if (typeof val === "object" && val !== null) {
      if (seen.has(val)) return "[Circular]";
      seen.add(val);
    }
    return val;
  };
}
