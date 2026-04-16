/**
 * @aigolab/llm — 통합 LLM SDK public API
 *
 * 사용 예:
 * ```ts
 * import { chat } from "@/lib/llm";
 *
 * const res = await chat({
 *   messages: [{ role: "user", content: "안녕" }],
 *   task: "fast",
 * });
 * console.log(res.text);
 * ```
 *
 * Provider 를 강제로 지정하거나 시뮬레이션 재생은 ChatRequest 의
 * provider / simulation 필드로 각각 제어한다.
 */

// 어댑터 3종을 여기서 register — SDK import 하는 쪽은 별도 설정 없이 사용 가능
import "./register";

export { chat, registerAdapter, getAdapter } from "./router";
export { DEFAULT_ROUTES, PROVIDER_MODELS } from "./routes";
export { exportTrace, replayTrace } from "./simulation";
export { getKey, setKey, removeKey, listKeys, requireKey } from "./keys";
export { runLlmCode, LlmRuntimeError, serializeTraces } from "./runtime";
export type { LlmRunCallbacks, LlmRunResult } from "./runtime";
export { chatWithTools } from "./toolLoop";
export type { ChatWithToolsOptions, ToolLoopStep } from "./toolLoop";
export type {
  Role,
  Message,
  Provider,
  Task,
  ChatRequest,
  ChatResponse,
  Trace,
  TraceV1,
  TraceV2,
  ProgressEvent,
  ProgressCallback,
  JsonSchema,
  ToolDefinition,
  ToolCall,
  ToolChoice,
  LlmErrorReason,
} from "./types";
export { LlmError } from "./types";
export type { ProviderAdapter } from "./providers/base";
export { embed, cosineSimilarity } from "./embedding";
export { VectorStore } from "./vectorStore";
export type { VectorDoc, SearchResult } from "./vectorStore";
