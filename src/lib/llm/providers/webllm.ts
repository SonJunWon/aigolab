/**
 * WebLLM Provider — 브라우저 내 Llama 3.2 1B 실행.
 *
 * 핵심 특성:
 * - 키 불필요, 네트워크는 "첫 다운로드" 때만
 * - WebGPU 필요 — 미지원 환경에선 isAvailable() 가 false
 * - 모델(약 879MB)은 IndexedDB 캐시 → 재방문 시 즉시 준비
 *
 * 번들 크기 고려: `@mlc-ai/web-llm` 은 WASM 포함 수 MB 라서
 * import 를 dynamic import 로 지연 — Ch01 레슨이 열릴 때만 로드.
 */

import type { ChatRequest, ChatResponse, Message, ProgressCallback } from "../types";
import { LlmError } from "../types";
import { PROVIDER_MODELS } from "../routes";
import type { AdapterCallOptions, ProviderAdapter } from "./base";

/** WebLLM 도 OpenAI 호환 포맷 — Groq 와 동일하게 tool role 은 tool_call_id 필수 */
function toOpenAIMessages(messages: Message[]) {
  return messages.map((m) => {
    if (m.role === "tool") {
      return {
        role: "tool" as const,
        content: m.content,
        tool_call_id: m.toolCallId ?? "",
      };
    }
    return {
      role: m.role,
      content: m.content,
    };
  });
}

// dynamic import 로만 접근하므로 type-only import
import type {
  MLCEngineInterface,
  InitProgressReport,
} from "@mlc-ai/web-llm";

/**
 * 엔진은 모델 단위 싱글턴.
 * 한 번 로드되면 같은 탭 세션 동안 재사용.
 */
const engines = new Map<string, Promise<MLCEngineInterface>>();

async function getEngine(
  modelId: string,
  onProgress?: ProgressCallback,
): Promise<MLCEngineInterface> {
  let cached = engines.get(modelId);
  if (cached) return cached;

  cached = (async () => {
    // 실제 import — 호출 시점에만 WASM 번들 로드
    const webllm = await import("@mlc-ai/web-llm");

    const engine = await webllm.CreateMLCEngine(modelId, {
      initProgressCallback: (report: InitProgressReport) => {
        // WebLLM 의 단계 문구("Fetching.../Loading...") 로 phase 추정
        const phase: "downloading" | "loading" | "ready" =
          report.progress >= 1
            ? "ready"
            : /fetch|download/i.test(report.text)
              ? "downloading"
              : "loading";
        onProgress?.({
          provider: "webllm",
          phase,
          progress: report.progress,
          message: report.text,
        });
      },
    });

    return engine;
  })();

  engines.set(modelId, cached);
  try {
    return await cached;
  } catch (err) {
    // 실패 시 캐시 제거 — 다음 호출에서 재시도 가능
    engines.delete(modelId);
    throw err;
  }
}

export class WebLlmAdapter implements ProviderAdapter {
  readonly name = "webllm" as const;

  async isAvailable(): Promise<boolean> {
    // WebGPU 미지원 환경 (Safari 구버전 등) 즉시 false
    return typeof navigator !== "undefined" && "gpu" in navigator;
  }

  async chat(
    req: ChatRequest,
    opts: AdapterCallOptions = {},
  ): Promise<ChatResponse> {
    if (!(await this.isAvailable())) {
      throw new LlmError(
        "unsupported-env",
        "이 브라우저는 WebGPU 를 지원하지 않아 WebLLM 을 사용할 수 없습니다 (Chrome/Edge 최신 권장)",
        "webllm",
      );
    }

    // Phase 2: WebLLM 은 tool calling 미지원
    if (req.tools && req.tools.length > 0) {
      throw new LlmError(
        "unsupported-env",
        "WebLLM (Llama 3.2 1B) 은 tool calling 을 지원하지 않습니다. Gemini/Groq 로 전환하세요.",
        "webllm",
      );
    }

    const modelId = PROVIDER_MODELS.webllm.default;
    const engine = await getEngine(modelId, opts.onProgress);

    const startedAt = performance.now();
    try {
      const completion = await engine.chat.completions.create({
        messages: toOpenAIMessages(req.messages),
        temperature: req.temperature,
        max_tokens: req.maxTokens,
        stream: false,
      });

      const text = completion.choices[0]?.message?.content ?? "";
      const latencyMs = Math.round(performance.now() - startedAt);

      return {
        text,
        provider: "webllm",
        model: modelId,
        tokensUsed: completion.usage
          ? {
              input: completion.usage.prompt_tokens ?? 0,
              output: completion.usage.completion_tokens ?? 0,
            }
          : undefined,
        latencyMs,
        raw: completion,
      };
    } catch (err) {
      throw new LlmError(
        "network",
        `WebLLM 실행 실패: ${err instanceof Error ? err.message : String(err)}`,
        "webllm",
        err,
      );
    }
  }
}
