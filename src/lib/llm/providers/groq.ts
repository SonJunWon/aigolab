/**
 * Groq Provider — Llama 3.3 70B 를 고속 추론으로.
 *
 * ⚠️ 보안 경고: `dangerouslyAllowBrowser: true` 가 필수.
 * 이는 SDK 공식 경고대로 "브라우저에 비밀 키 노출" 을 의미한다.
 * 키 입력 모달 UI 에서 학생에게 위험성을 분명히 알리고, 유출 시
 * 즉시 Groq 콘솔에서 키를 재발급하도록 안내해야 함.
 *
 * OpenAI 호환 API 라 변환 부담이 가장 적다.
 */

import type { ChatRequest, ChatResponse, Message } from "../types";
import { LlmError } from "../types";
import { PROVIDER_MODELS } from "../routes";
import type { AdapterCallOptions, ProviderAdapter } from "./base";
import { getKey, requireKey } from "../keys";

/**
 * OpenAI 호환 메시지 포맷으로 변환 — tool role 은 tool_call_id 가 필수.
 * Phase 2 tool loop 구현 시 assistant 의 tool_calls 도 여기서 매핑 확장.
 */
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

export class GroqAdapter implements ProviderAdapter {
  readonly name = "groq" as const;

  async isAvailable(): Promise<boolean> {
    return Boolean(await getKey("groq"));
  }

  async chat(
    req: ChatRequest,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _opts: AdapterCallOptions = {},
  ): Promise<ChatResponse> {
    const apiKey = await requireKey("groq");

    // Dynamic import — 번들 크기 관리
    const { default: Groq } = await import("groq-sdk");
    const client = new Groq({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    const model = PROVIDER_MODELS.groq.default;
    const startedAt = performance.now();

    try {
      const completion = await client.chat.completions.create({
        model,
        messages: toOpenAIMessages(req.messages),
        temperature: req.temperature,
        max_tokens: req.maxTokens,
        stream: false,
      });

      const latencyMs = Math.round(performance.now() - startedAt);
      const text = completion.choices[0]?.message?.content ?? "";

      return {
        text,
        provider: "groq",
        model,
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
      const msg = err instanceof Error ? err.message : String(err);
      if (/api[\s_-]*key|invalid_api_key|unauthorized|401/i.test(msg)) {
        throw new LlmError(
          "invalid-key",
          "Groq API 키가 유효하지 않습니다. 키를 다시 발급받아 입력해주세요.",
          "groq",
          err,
        );
      }
      if (/rate|quota|429/i.test(msg)) {
        throw new LlmError(
          "rate-limited",
          "Groq 일일 무료 한도(14400 req)를 초과했거나 레이트 리밋에 걸렸습니다.",
          "groq",
          err,
        );
      }
      throw new LlmError("network", `Groq 호출 실패: ${msg}`, "groq", err);
    }
  }
}
