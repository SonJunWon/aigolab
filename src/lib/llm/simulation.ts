/**
 * 시뮬레이션 — 강사가 녹화해둔 Trace 를 키 없이 재생.
 *
 * 학생이 Gemini/Groq 키를 발급받지 못한 상황에서도
 * 레슨 진도를 끝까지 체험할 수 있도록 하는 폴백 메커니즘.
 */

import type { ChatResponse, Trace } from "./types";

/** latencyMs 만큼 실제 지연해서 현실감 있는 응답 흉내 */
export async function replayTrace(trace: Trace): Promise<ChatResponse> {
  if (trace.version !== 1) {
    throw new Error(`Unsupported trace version: ${trace.version}`);
  }

  const delay = Math.min(trace.output.latencyMs ?? 500, 3000);
  await new Promise<void>((resolve) => setTimeout(resolve, delay));

  // 재생 표시: raw 에 source 힌트만 남기고 나머지는 원본 그대로
  return {
    ...trace.output,
    raw: { ...(typeof trace.output.raw === "object" ? trace.output.raw : {}), __replayedFrom: trace.recordedAt },
  };
}

/** 현재 진행 중인 호출 결과를 Trace JSON 문자열로 내보내기 (녹화) */
export function exportTrace(input: Trace["input"], output: ChatResponse): Trace {
  return {
    version: 1,
    input,
    output,
    recordedAt: new Date().toISOString(),
  };
}
