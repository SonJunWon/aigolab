/**
 * Gemini Provider — Google 의 `@google/genai` SDK 를 사용.
 *
 * 주의: 구 SDK (`@google/generative-ai`) 는 2025-11-30 DEPRECATED.
 * 반드시 신 SDK (`@google/genai`) 를 사용해야 함.
 *
 * Phase 2 지원:
 *   - 구조화 출력 (responseSchema + responseMimeType)
 *   - 스트리밍 (generateContentStream + onToken chunk 방출)
 *   - Tool calling (config.tools functionDeclarations + response.functionCalls)
 *
 * 메시지 변환:
 *   - role "system"    → config.systemInstruction 으로 분리
 *   - role "user"      → Content { role:"user",  parts:[text] }
 *   - role "assistant" → Content { role:"model", parts:[text (+functionCall)] }
 *   - role "tool"      → Content { role:"user",  parts:[functionResponse] }
 *     (Gemini 는 "tool" 역할이 없고 functionResponse 를 user 메시지의 part 로 보냄)
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

// type-only import
import type { Content, FunctionDeclaration, Part } from "@google/genai";

/**
 * Message[] → Gemini Content[] 변환.
 * system 은 분리. tool 역할은 functionResponse part 로 매핑.
 */
function toContents(messages: Message[]): {
  contents: Content[];
  system?: string;
} {
  let system: string | undefined;
  const contents: Content[] = [];

  for (const m of messages) {
    if (m.role === "system") {
      system = system ? `${system}\n\n${m.content}` : m.content;
      continue;
    }

    if (m.role === "tool") {
      // tool 결과는 Gemini 가 "user" role 의 functionResponse part 로 받음
      let parsedResponse: unknown;
      try {
        parsedResponse = JSON.parse(m.content);
      } catch {
        parsedResponse = { result: m.content };
      }
      contents.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name: m.toolCallId ?? "unknown",
              response:
                typeof parsedResponse === "object" && parsedResponse !== null
                  ? (parsedResponse as Record<string, unknown>)
                  : { result: parsedResponse },
            },
          },
        ],
      });
      continue;
    }

    if (m.role === "assistant" && m.toolCalls && m.toolCalls.length > 0) {
      // assistant 가 tool 호출을 했던 턴 — functionCall part 로 재구성
      const parts: Part[] = [];
      if (m.content) parts.push({ text: m.content });
      for (const tc of m.toolCalls) {
        parts.push({ functionCall: { name: tc.name, args: tc.args } });
      }
      contents.push({ role: "model", parts });
      continue;
    }

    contents.push({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    });
  }

  return { contents, system };
}

/** ToolDefinition[] → Gemini FunctionDeclaration[] */
function toFunctionDeclarations(
  tools: ToolDefinition[],
): FunctionDeclaration[] {
  return tools.map((t) => ({
    name: t.name,
    description: t.description,
    // Gemini 는 Schema 타입을 기대하지만 JsonSchema 호환 subset 을 받음
    parameters: t.parameters as unknown as FunctionDeclaration["parameters"],
  }));
}

/** ToolChoice → Gemini functionCallingConfig.mode */
function toFunctionCallingMode(
  choice: ToolChoice | undefined,
): { mode: "AUTO" | "ANY" | "NONE"; allowedFunctionNames?: string[] } {
  if (!choice || choice === "auto") return { mode: "AUTO" };
  if (choice === "any") return { mode: "ANY" };
  if (choice === "none") return { mode: "NONE" };
  return { mode: "ANY", allowedFunctionNames: [choice.name] };
}

export class GeminiAdapter implements ProviderAdapter {
  readonly name = "gemini" as const;

  async isAvailable(): Promise<boolean> {
    return Boolean(await getKey("gemini"));
  }

  async chat(
    req: ChatRequest,
    opts: AdapterCallOptions = {},
  ): Promise<ChatResponse> {
    const apiKey = await requireKey("gemini");

    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const { contents, system } = toContents(req.messages);
    const model = PROVIDER_MODELS.gemini.default;

    // config 조립 — Phase 2 옵션들을 지원 유무에 따라 포함
    const config: Record<string, unknown> = {
      systemInstruction: system,
      temperature: req.temperature,
      maxOutputTokens: req.maxTokens,
    };

    // 구조화 출력
    if (req.responseSchema) {
      config.responseMimeType = "application/json";
      config.responseSchema = req.responseSchema;
    }

    // Tool calling
    if (req.tools && req.tools.length > 0) {
      config.tools = [
        { functionDeclarations: toFunctionDeclarations(req.tools) },
      ];
      config.toolConfig = {
        functionCallingConfig: toFunctionCallingMode(req.toolChoice),
      };
    }

    const startedAt = performance.now();
    try {
      // 스트리밍 vs 일반 분기
      if (req.stream) {
        return await this.runStreaming(ai, model, contents, config, opts, startedAt);
      }
      return await this.runOnce(ai, model, contents, config, startedAt);
    } catch (err) {
      throw this.mapError(err);
    }
  }

  // ── 일반 호출 ────────────────────────────────────
  private async runOnce(
    ai: InstanceType<typeof import("@google/genai").GoogleGenAI>,
    model: string,
    contents: Content[],
    config: Record<string, unknown>,
    startedAt: number,
  ): Promise<ChatResponse> {
    const response = await ai.models.generateContent({ model, contents, config });
    const latencyMs = Math.round(performance.now() - startedAt);
    const text = response.text ?? "";
    return this.buildResponse(text, response, latencyMs, model);
  }

  // ── 스트리밍 호출 ─────────────────────────────────
  private async runStreaming(
    ai: InstanceType<typeof import("@google/genai").GoogleGenAI>,
    model: string,
    contents: Content[],
    config: Record<string, unknown>,
    opts: AdapterCallOptions,
    startedAt: number,
  ): Promise<ChatResponse> {
    const stream = await ai.models.generateContentStream({ model, contents, config });

    let accumulated = "";
    let lastChunk: import("@google/genai").GenerateContentResponse | undefined;
    for await (const chunk of stream) {
      const delta = chunk.text ?? "";
      if (delta) {
        accumulated += delta;
        opts.onToken?.(delta);
      }
      lastChunk = chunk;
    }

    const latencyMs = Math.round(performance.now() - startedAt);
    return this.buildResponse(accumulated, lastChunk, latencyMs, model);
  }

  // ── 공통 응답 조립 ───────────────────────────────
  private buildResponse(
    text: string,
    response: import("@google/genai").GenerateContentResponse | undefined,
    latencyMs: number,
    model: string,
  ): ChatResponse {
    const usage = response?.usageMetadata;

    // Tool call 추출
    const functionCalls = response?.functionCalls;
    const toolCalls: ToolCall[] | undefined =
      functionCalls && functionCalls.length > 0
        ? functionCalls.map((fc) => ({
            name: fc.name ?? "",
            args: (fc.args ?? {}) as Record<string, unknown>,
            id: fc.id,
          }))
        : undefined;

    // JSON 파싱 (responseSchema 호출 시 text 는 JSON 문자열)
    let json: unknown;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        // 구조화 출력 요청 안 했으면 정상 — 그대로 undefined
        json = undefined;
      }
    }

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
      json,
      toolCalls,
      raw: response,
    };
  }

  // ── 에러 매핑 ─────────────────────────────────────
  private mapError(err: unknown): LlmError {
    const msg = err instanceof Error ? err.message : String(err);
    if (/api[\s_-]*key|invalid|unauthorized/i.test(msg)) {
      return new LlmError(
        "invalid-key",
        "Gemini API 키가 유효하지 않습니다. 키를 다시 발급받아 입력해주세요.",
        "gemini",
        err,
      );
    }
    if (/quota|rate|429/i.test(msg)) {
      return new LlmError(
        "rate-limited",
        "Gemini 일일 무료 한도(1500 req)를 초과했거나 레이트 리밋에 걸렸습니다.",
        "gemini",
        err,
      );
    }
    return new LlmError("network", `Gemini 호출 실패: ${msg}`, "gemini", err);
  }
}
