/**
 * Groq Provider — Llama 3.3 70B 를 고속 추론으로.
 *
 * ⚠️ 보안 경고: `dangerouslyAllowBrowser: true` 가 필수.
 * 키 입력 모달 UI 에서 학생에게 위험성을 분명히 알리고, 유출 시
 * 즉시 Groq 콘솔에서 키를 재발급하도록 안내해야 함.
 *
 * OpenAI 호환 API — Phase 2 기능들도 표준 OpenAI 명세 그대로:
 *   - 구조화 출력: response_format: { type:"json_schema", json_schema:{name, schema} }
 *   - 스트리밍: stream: true + AsyncIterable
 *   - Tool calling: tools: [{type:"function", function:{name, description, parameters}}]
 */

import type {
  ChatRequest,
  ChatResponse,
  Message,
  ToolCall,
  ToolChoice,
  ToolDefinition,
} from "../types";
import { LlmError } from "../types";
import { PROVIDER_MODELS } from "../routes";
import type { AdapterCallOptions, ProviderAdapter } from "./base";
import { getKey, requireKey } from "../keys";

/** Message → OpenAI 호환 포맷. tool role 은 tool_call_id 필수. */
function toOpenAIMessages(messages: Message[]) {
  return messages.map((m) => {
    if (m.role === "tool") {
      return {
        role: "tool" as const,
        content: m.content,
        tool_call_id: m.toolCallId ?? "",
      };
    }
    if (m.role === "assistant" && m.toolCalls && m.toolCalls.length > 0) {
      // assistant 가 tool 호출을 한 턴 — tool_calls 배열 포함
      return {
        role: "assistant" as const,
        content: m.content || null,
        tool_calls: m.toolCalls.map((tc, idx) => ({
          id: tc.id ?? `call_${idx}`,
          type: "function" as const,
          function: {
            name: tc.name,
            arguments: JSON.stringify(tc.args),
          },
        })),
      };
    }
    return {
      role: m.role,
      content: m.content,
    };
  });
}

/** ToolDefinition → OpenAI 호환 tools 배열 */
function toOpenAITools(tools: ToolDefinition[]) {
  return tools.map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }));
}

/** ToolChoice → OpenAI 호환 tool_choice 값 */
function toOpenAIToolChoice(choice: ToolChoice | undefined) {
  if (!choice || choice === "auto") return "auto";
  if (choice === "any") return "required";
  if (choice === "none") return "none";
  return {
    type: "function" as const,
    function: { name: choice.name },
  };
}

/** responseSchema → OpenAI 호환 response_format */
function toResponseFormat(schema: Record<string, unknown>) {
  return {
    type: "json_schema" as const,
    json_schema: {
      name: "structured_response",
      schema,
      strict: true,
    },
  };
}

export class GroqAdapter implements ProviderAdapter {
  readonly name = "groq" as const;

  async isAvailable(): Promise<boolean> {
    return Boolean(await getKey("groq"));
  }

  async chat(
    req: ChatRequest,
    opts: AdapterCallOptions = {},
  ): Promise<ChatResponse> {
    const apiKey = await requireKey("groq");

    const { default: Groq } = await import("groq-sdk");
    const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });

    const model = PROVIDER_MODELS.groq.default;
    const startedAt = performance.now();

    // 요청 파라미터 공통 부분
    const baseParams = {
      model,
      messages: toOpenAIMessages(req.messages),
      temperature: req.temperature,
      max_tokens: req.maxTokens,
      ...(req.responseSchema ? { response_format: toResponseFormat(req.responseSchema) } : {}),
      ...(req.tools && req.tools.length > 0
        ? {
            tools: toOpenAITools(req.tools),
            tool_choice: toOpenAIToolChoice(req.toolChoice),
          }
        : {}),
    };

    try {
      if (req.stream) {
        return await this.runStreaming(client, baseParams, opts, model, startedAt);
      }
      return await this.runOnce(client, baseParams, model, startedAt);
    } catch (err) {
      throw this.mapError(err);
    }
  }

  // ── 일반 호출 ────────────────────────────────────
  private async runOnce(
    client: import("groq-sdk").default,
    params: Record<string, unknown>,
    model: string,
    startedAt: number,
  ): Promise<ChatResponse> {
    // groq-sdk 타입을 fully annotate 하면 장황 — unknown 으로 받아 안전하게
    const completion = (await client.chat.completions.create({
      ...params,
      stream: false,
    } as Parameters<typeof client.chat.completions.create>[0])) as {
      choices: Array<{
        message: {
          content: string | null;
          tool_calls?: Array<{
            id: string;
            function: { name: string; arguments: string };
          }>;
        };
      }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };

    const latencyMs = Math.round(performance.now() - startedAt);
    const choice = completion.choices[0];
    const text = choice?.message?.content ?? "";

    return this.buildResponse(
      text,
      choice?.message?.tool_calls,
      completion.usage,
      completion,
      latencyMs,
      model,
    );
  }

  // ── 스트리밍 호출 ─────────────────────────────────
  private async runStreaming(
    client: import("groq-sdk").default,
    params: Record<string, unknown>,
    opts: AdapterCallOptions,
    model: string,
    startedAt: number,
  ): Promise<ChatResponse> {
    const stream = (await client.chat.completions.create({
      ...params,
      stream: true,
    } as Parameters<typeof client.chat.completions.create>[0])) as AsyncIterable<{
      choices: Array<{
        delta: {
          content?: string;
          tool_calls?: Array<{
            index: number;
            id?: string;
            function?: { name?: string; arguments?: string };
          }>;
        };
      }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    }>;

    let accumulated = "";
    let lastUsage: { prompt_tokens?: number; completion_tokens?: number } | undefined;
    const toolCallAccum = new Map<
      number,
      { id?: string; name?: string; arguments: string }
    >();

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      if (delta?.content) {
        accumulated += delta.content;
        opts.onToken?.(delta.content);
      }
      if (delta?.tool_calls) {
        for (const tc of delta.tool_calls) {
          const existing = toolCallAccum.get(tc.index) ?? {
            id: undefined,
            name: undefined,
            arguments: "",
          };
          if (tc.id) existing.id = tc.id;
          if (tc.function?.name) existing.name = tc.function.name;
          if (tc.function?.arguments) existing.arguments += tc.function.arguments;
          toolCallAccum.set(tc.index, existing);
        }
      }
      if (chunk.usage) lastUsage = chunk.usage;
    }

    const latencyMs = Math.round(performance.now() - startedAt);

    // 스트림 누적된 tool call 을 OpenAI 표준 shape 로 재구성
    const toolCalls =
      toolCallAccum.size > 0
        ? Array.from(toolCallAccum.values())
            .filter((t) => t.name)
            .map((t) => ({
              id: t.id ?? "",
              function: { name: t.name!, arguments: t.arguments || "{}" },
            }))
        : undefined;

    return this.buildResponse(
      accumulated,
      toolCalls,
      lastUsage,
      { choices: [{ message: { content: accumulated, tool_calls: toolCalls } }] },
      latencyMs,
      model,
    );
  }

  // ── 공통 응답 조립 ───────────────────────────────
  private buildResponse(
    text: string,
    rawToolCalls:
      | Array<{ id: string; function: { name: string; arguments: string } }>
      | undefined,
    usage: { prompt_tokens?: number; completion_tokens?: number } | undefined,
    raw: unknown,
    latencyMs: number,
    model: string,
  ): ChatResponse {
    const toolCalls: ToolCall[] | undefined =
      rawToolCalls && rawToolCalls.length > 0
        ? rawToolCalls.map((tc) => {
            let args: Record<string, unknown> = {};
            try {
              args = JSON.parse(tc.function.arguments || "{}");
            } catch {
              args = { _raw: tc.function.arguments };
            }
            return {
              name: tc.function.name,
              args,
              id: tc.id,
            };
          })
        : undefined;

    let json: unknown;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = undefined;
      }
    }

    return {
      text,
      provider: "groq",
      model,
      tokensUsed: usage
        ? {
            input: usage.prompt_tokens ?? 0,
            output: usage.completion_tokens ?? 0,
          }
        : undefined,
      latencyMs,
      json,
      toolCalls,
      raw,
    };
  }

  // ── 에러 매핑 ─────────────────────────────────────
  private mapError(err: unknown): LlmError {
    const msg = err instanceof Error ? err.message : String(err);
    if (/api[\s_-]*key|invalid_api_key|unauthorized|401/i.test(msg)) {
      return new LlmError(
        "invalid-key",
        "Groq API 키가 유효하지 않습니다. 키를 다시 발급받아 입력해주세요.",
        "groq",
        err,
      );
    }
    if (/rate|quota|429/i.test(msg)) {
      return new LlmError(
        "rate-limited",
        "Groq 일일 무료 한도(14400 req)를 초과했거나 레이트 리밋에 걸렸습니다.",
        "groq",
        err,
      );
    }
    return new LlmError("network", `Groq 호출 실패: ${msg}`, "groq", err);
  }
}
