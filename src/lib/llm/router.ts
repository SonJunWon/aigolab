/**
 * 라우터 — task 또는 provider 지정을 받아 적합한 어댑터에 위임.
 *
 * 책임:
 * 1. simulation 존재 시 실제 호출 없이 재생
 * 2. provider 명시되면 그 어댑터만 시도 (실패 시 에러)
 * 3. task 기반이면 DEFAULT_ROUTES 순서대로 페일오버
 */

import type { ChatRequest, ChatResponse, Provider } from "./types";
import { LlmError } from "./types";
import { DEFAULT_ROUTES } from "./routes";
import type { AdapterCallOptions, ProviderAdapter } from "./providers/base";
import { NotImplementedAdapter } from "./providers/base";
import { replayTrace } from "./simulation";

/**
 * Adapter 레지스트리 — T2 단계에서 실제 어댑터를 register() 로 주입.
 * 주입 전엔 NotImplementedAdapter 가 자리를 지킨다.
 */
const adapters: Record<Provider, ProviderAdapter> = {
  gemini: new NotImplementedAdapter("gemini"),
  groq: new NotImplementedAdapter("groq"),
  webllm: new NotImplementedAdapter("webllm"),
};

/** T2 단계에서 각 provider 실제 구현체를 교체 주입 */
export function registerAdapter(name: Provider, adapter: ProviderAdapter): void {
  adapters[name] = adapter;
}

export function getAdapter(name: Provider): ProviderAdapter {
  return adapters[name];
}

/**
 * 주요 공개 함수.
 *
 * 2번째 인자는 **옵션 객체** — Phase 2 이전엔 `ProgressCallback` 하나였으나
 * 스트리밍 `onToken` 이 추가되며 객체로 통일. 하위 호환을 위해 function 을 넘기면
 * `onProgress` 로 해석 (runtime 이 구버전 호출 하고 있어도 동작).
 */
export async function chat(
  req: ChatRequest,
  optsOrLegacyProgress?: AdapterCallOptions | ((evt: Parameters<NonNullable<AdapterCallOptions["onProgress"]>>[0]) => void),
): Promise<ChatResponse> {
  // 함수형 구버전 호출 하위 호환
  const opts: AdapterCallOptions =
    typeof optsOrLegacyProgress === "function"
      ? { onProgress: optsOrLegacyProgress }
      : (optsOrLegacyProgress ?? {});

  // 1. 시뮬레이션 재생 최우선 (Phase 2: onToken 도 forward)
  if (req.simulation) {
    return replayTrace(req.simulation, { onToken: opts.onToken });
  }

  // 2. 호출 대상 provider 결정
  const targets: Provider[] = req.provider
    ? [req.provider]
    : DEFAULT_ROUTES[req.task ?? "fast"];

  if (targets.length === 0) {
    throw new LlmError(
      "unknown",
      `routing 실패: task="${req.task}" 에 연결된 provider 가 없습니다`,
    );
  }

  // 3. 순차 시도 — provider 지정 시 1회, task 기반이면 페일오버
  let lastError: unknown;
  for (const name of targets) {
    const adapter = adapters[name];
    try {
      return await adapter.chat(req, opts);
    } catch (err) {
      lastError = err;
      // provider 강제 지정이었으면 페일오버 금지 — 즉시 던지기
      if (req.provider) throw err;
      // 아니면 다음 provider 시도
      continue;
    }
  }

  throw new LlmError(
    "all-providers-failed",
    `모든 provider 시도 실패 (${targets.join(" → ")}): ${lastError instanceof Error ? lastError.message : String(lastError)}`,
    undefined,
    lastError,
  );
}
