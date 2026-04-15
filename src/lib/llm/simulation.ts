/**
 * 시뮬레이션 — 강사가 녹화해둔 Trace 를 키 없이 재생.
 *
 * 학생이 Gemini/Groq 키를 발급받지 못한 상황에서도
 * 레슨 진도를 끝까지 체험할 수 있도록 하는 폴백 메커니즘.
 *
 * Trace 포맷:
 *   v1 (Phase 1): 단일 input/output 쌍
 *   v2 (Phase 2): + 스트리밍 토큰 타이밍, tool step 배열
 *
 * 재생 시:
 *   - v1 : latencyMs 만큼 지연 후 output 반환
 *   - v2 : tokens 배열이 있으면 onToken 으로 순차 방출, 아니면 v1 방식으로 fallback
 */

import type {
  ChatRequest,
  ChatResponse,
  Trace,
  TraceV2,
} from "./types";

/** 재생 옵션 — v2 의 스트리밍 토큰을 UI 로 흘리고 싶을 때 */
export interface ReplayOptions {
  /** v2 에서 tokens 있을 때 chunk 단위 호출. 없으면 v1 스타일 전체 지연 후 반환. */
  onToken?: (chunk: string) => void;
}

/** Trace 재생 — 현실감 있는 지연·스트리밍 포함 */
export async function replayTrace(
  trace: Trace,
  opts: ReplayOptions = {},
): Promise<ChatResponse> {
  if (trace.version === 1) {
    return replayV1(trace.output, trace.recordedAt, trace.output.latencyMs);
  }
  if (trace.version === 2) {
    return replayV2(trace, opts);
  }
  // 미래의 새 버전 방어
  throw new Error(
    `Unsupported trace version: ${(trace as { version: number }).version}`,
  );
}

async function replayV1(
  output: ChatResponse,
  recordedAt: string,
  latencyMs: number | undefined,
): Promise<ChatResponse> {
  const delay = Math.min(latencyMs ?? 500, 3000);
  await new Promise<void>((resolve) => setTimeout(resolve, delay));
  return {
    ...output,
    raw: {
      ...(typeof output.raw === "object" && output.raw !== null ? output.raw : {}),
      __replayedFrom: recordedAt,
    },
  };
}

async function replayV2(
  trace: TraceV2,
  opts: ReplayOptions,
): Promise<ChatResponse> {
  // tokens 있으면 실시간 스트리밍 흉내 — 녹화 당시의 delay 그대로 재현
  if (trace.tokens && trace.tokens.length > 0 && opts.onToken) {
    for (const t of trace.tokens) {
      if (t.delay > 0) {
        await new Promise<void>((resolve) =>
          setTimeout(resolve, Math.min(t.delay, 500)),
        );
      }
      opts.onToken(t.chunk);
    }
  } else {
    // tokens 없거나 onToken 미제공 — v1 스타일로 전체 지연 후 반환
    const delay = Math.min(trace.output.latencyMs ?? 500, 3000);
    await new Promise<void>((resolve) => setTimeout(resolve, delay));
  }
  return {
    ...trace.output,
    raw: {
      ...(typeof trace.output.raw === "object" && trace.output.raw !== null
        ? trace.output.raw
        : {}),
      __replayedFrom: trace.recordedAt,
    },
  };
}

/**
 * 현재 진행 중인 호출 결과를 Trace 로 포장.
 * Phase 2: 스트리밍 토큰 타이밍이 있으면 v2, 없으면 v1.
 */
export function exportTrace(
  input: ChatRequest,
  output: ChatResponse,
  extras?: {
    tokens?: TraceV2["tokens"];
    toolSteps?: TraceV2["toolSteps"];
  },
): Trace {
  if (extras?.tokens || extras?.toolSteps) {
    return {
      version: 2,
      input,
      output,
      tokens: extras.tokens,
      toolSteps: extras.toolSteps,
      recordedAt: new Date().toISOString(),
    };
  }
  return {
    version: 1,
    input,
    output,
    recordedAt: new Date().toISOString(),
  };
}
