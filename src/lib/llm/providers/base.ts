/**
 * ProviderAdapter — 모든 LLM Provider 어댑터가 구현해야 할 최소 계약.
 *
 * 각 어댑터는 "요청을 받아 text 응답을 돌려준다" 는 단일 책임을 갖는다.
 * 키 관리·라우팅·재시도는 상위 router 가 담당한다.
 */

import type {
  ChatRequest,
  ChatResponse,
  Provider,
  ProgressCallback,
} from "../types";
import { LlmError } from "../types";

export interface ProviderAdapter {
  readonly name: Provider;
  /** 이 어댑터가 현재 환경에서 사용 가능한지 (키 존재·WebGPU 등) */
  isAvailable(): Promise<boolean>;
  /** 본 호출 */
  chat(req: ChatRequest, onProgress?: ProgressCallback): Promise<ChatResponse>;
}

/**
 * 아직 구현되지 않은 Provider 용 스텁.
 * T2 단계에서 실제 Gemini/Groq/WebLLM 어댑터로 교체된다.
 */
export class NotImplementedAdapter implements ProviderAdapter {
  readonly name: Provider;

  constructor(name: Provider) {
    this.name = name;
  }

  async isAvailable(): Promise<boolean> {
    return false;
  }

  async chat(): Promise<ChatResponse> {
    throw new LlmError(
      "not-implemented",
      `${this.name} 어댑터는 아직 구현되지 않았습니다 (T2 에서 추가 예정)`,
      this.name,
    );
  }
}
