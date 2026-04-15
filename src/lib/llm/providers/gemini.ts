/**
 * Gemini Provider — Google 의 `@google/genai` SDK 를 사용.
 *
 * 주의: 구 SDK (`@google/generative-ai`) 는 2025-11-30 DEPRECATED.
 * 반드시 신 SDK (`@google/genai`) 를 사용해야 함.
 *
 * 메시지 변환:
 * - role "system" → `config.systemInstruction` 로 분리
 * - role "user"/"assistant" → `contents` 배열 (assistant 는 "model" 로 매핑)
 */

import type { ChatRequest, ChatResponse, Message } from "../types";
import { LlmError } from "../types";
import { PROVIDER_MODELS } from "../routes";
import type { AdapterCallOptions, ProviderAdapter } from "./base";
import { getKey, requireKey } from "../keys";

// type-only import — 번들 시 실제 사용처에서 import() 로도 OK
import type { Content } from "@google/genai";

/**
 * Message[] → Gemini Content[] 변환.
 * system 메시지는 따로 systemInstruction 으로 빼내기 때문에 여기선 제외한다.
 */
function toContents(messages: Message[]): { contents: Content[]; system?: string } {
  let system: string | undefined;
  const contents: Content[] = [];

  for (const m of messages) {
    if (m.role === "system") {
      // 여러 system 메시지면 join — 현실에서 드문 케이스지만 안전하게
      system = system ? `${system}\n\n${m.content}` : m.content;
      continue;
    }
    contents.push({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    });
  }

  return { contents, system };
}

export class GeminiAdapter implements ProviderAdapter {
  readonly name = "gemini" as const;

  async isAvailable(): Promise<boolean> {
    return Boolean(await getKey("gemini"));
  }

  async chat(
    req: ChatRequest,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _opts: AdapterCallOptions = {},
  ): Promise<ChatResponse> {
    const apiKey = await requireKey("gemini");

    // Dynamic import 로 번들 sideload — 페이지 초기 로드 시 끌고 오지 않게
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const { contents, system } = toContents(req.messages);
    const model = PROVIDER_MODELS.gemini.default;

    const startedAt = performance.now();
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: system,
          temperature: req.temperature,
          maxOutputTokens: req.maxTokens,
        },
      });

      const latencyMs = Math.round(performance.now() - startedAt);
      const text = response.text ?? "";
      const usage = response.usageMetadata;

      return {
        text,
        provider: "gemini",
        model,
        tokensUsed: usage
          ? {
              input: usage.promptTokenCount ?? 0,
              output: usage.candidatesTokenCount ?? 0,
            }
          : undefined,
        latencyMs,
        raw: response,
      };
    } catch (err) {
      // 흔한 에러 패턴별 분기 — 학습자에게 친절한 메시지
      const msg = err instanceof Error ? err.message : String(err);
      if (/api[\s_-]*key|invalid|unauthorized/i.test(msg)) {
        throw new LlmError(
          "invalid-key",
          "Gemini API 키가 유효하지 않습니다. 키를 다시 발급받아 입력해주세요.",
          "gemini",
          err,
        );
      }
      if (/quota|rate|429/i.test(msg)) {
        throw new LlmError(
          "rate-limited",
          "Gemini 일일 무료 한도(1500 req)를 초과했거나 레이트 리밋에 걸렸습니다.",
          "gemini",
          err,
        );
      }
      throw new LlmError("network", `Gemini 호출 실패: ${msg}`, "gemini", err);
    }
  }
}
