/**
 * Tool 호출 루프 헬퍼 — 학생이 Ch05 중반에 사용.
 *
 * 한 번의 chat() 호출이 아니라 "tool call → execute → continue" 사이클을 자동 반복.
 * 학생은 레슨 초반엔 이 로직을 **직접 손으로 짜보고**, 중반부에 이 헬퍼로 단순화.
 *
 * 전형적인 흐름:
 *   1. 사용자 메시지 → 모델이 tool 호출 의도 반환
 *   2. 해당 tool 의 execute() 실행 → 결과 얻음
 *   3. 결과를 tool 메시지로 append → 다시 chat() 호출
 *   4. 모델이 tool 호출 안 하면 최종 답변 반환, 호출하면 루프 지속
 *   5. maxIterations 초과 시 LlmError("tool-loop-exceeded")
 */

import { chat } from "./router";
import type {
  ChatRequest,
  ChatResponse,
  Message,
  ToolCall,
} from "./types";
import { LlmError } from "./types";

export interface ToolLoopStep {
  /** 이 반복에서 모델이 호출한 tool */
  call: ToolCall;
  /** 실행 결과 (execute 반환값) */
  result: unknown;
  /** 몇 번째 iteration 인지 (1-based) */
  iteration: number;
}

export interface ChatWithToolsOptions {
  /** 무한 루프 방지 — 기본 5 */
  maxIterations?: number;
  /** 각 tool 실행 후 호출. UI 에 중간 과정 흘릴 때 사용. */
  onStep?: (step: ToolLoopStep) => void;
}

/**
 * tool 호출을 자동 반복해 최종 답변까지 가는 헬퍼.
 *
 * 제약:
 *   - req.tools 가 반드시 있어야 함 (없으면 그냥 chat() 쓰면 됨)
 *   - req.stream 은 무시 — 내부적으로 여러 번 호출하므로 스트리밍 의미가 흐려짐
 *
 * @example
 * const res = await chatWithTools({
 *   provider: "gemini",
 *   messages: [{ role: "user", content: "서울 날씨 알려줘" }],
 *   tools: [{
 *     name: "getWeather",
 *     description: "도시 이름으로 현재 날씨를 가져온다",
 *     parameters: { type: "object", properties: { city: { type: "string" } }, required: ["city"] },
 *     execute: async ({ city }) => ({ temp: 22, sky: "맑음", city }),
 *   }],
 * });
 * console.log(res.text);  // "서울은 현재 22도, 맑음입니다."
 */
export async function chatWithTools(
  req: ChatRequest,
  opts: ChatWithToolsOptions = {},
): Promise<ChatResponse> {
  if (!req.tools || req.tools.length === 0) {
    throw new LlmError(
      "unknown",
      "chatWithTools: req.tools 가 비어있습니다. 일반 chat() 을 사용하세요.",
    );
  }

  const maxIter = opts.maxIterations ?? 5;
  // 입력 messages 복사 — 원본 배열 오염 방지
  const messages: Message[] = [...req.messages];

  for (let iteration = 1; iteration <= maxIter; iteration++) {
    // 매 반복마다 stream 을 꺼서 한 번의 일반 호출로 (tool 결정이 주 목적)
    const res = await chat({ ...req, messages, stream: false });

    const toolCalls = res.toolCalls;
    if (!toolCalls || toolCalls.length === 0) {
      // tool 호출 없음 = 최종 답변
      return res;
    }

    // assistant 가 호출 의도를 낸 턴을 히스토리에 반영
    messages.push({
      role: "assistant",
      content: res.text,
      toolCalls,
    });

    // 각 tool 을 실제 실행 + 결과를 tool 메시지로 append
    for (const call of toolCalls) {
      const tool = req.tools.find((t) => t.name === call.name);
      if (!tool) {
        throw new LlmError(
          "unknown",
          `모델이 등록되지 않은 tool "${call.name}" 를 호출하려 했습니다.`,
        );
      }
      const result = await tool.execute(call.args);
      opts.onStep?.({ call, result, iteration });

      messages.push({
        role: "tool",
        content: typeof result === "string" ? result : JSON.stringify(result),
        toolCallId: call.id,
      });
    }
  }

  throw new LlmError(
    "tool-loop-exceeded",
    `chatWithTools: ${maxIter} 회 반복 후에도 tool 호출이 끝나지 않았습니다. maxIterations 를 늘리거나 tool 설계를 단순화하세요.`,
  );
}
