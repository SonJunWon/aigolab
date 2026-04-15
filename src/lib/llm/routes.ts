/**
 * Task → Provider 라우팅 테이블.
 *
 * 각 task 에 여러 provider 를 순서대로 나열한다.
 * 첫 번째가 실패 (키 없음·레이트 리밋·네트워크 등) 하면 다음으로 자동 페일오버.
 *
 * 향후 yaml 외부화 가능성이 있어 상수로 분리.
 */

import type { Provider, Task } from "./types";

export const DEFAULT_ROUTES: Record<Task, Provider[]> = {
  // 빠른 응답 — 무료 티어 한도 큰 Groq 를 먼저, 실패 시 Gemini
  fast: ["groq", "gemini"],
  // 긴 추론 — Llama 3.3 70B 를 우선
  reasoning: ["groq", "gemini"],
  // 이미지·오디오 — Gemini 전용
  multimodal: ["gemini"],
  // 오프라인 — WebLLM 고정 (네트워크·키 불필요)
  offline: ["webllm"],
};

/** 지원 모델 메타데이터 — UI 표시·비교 실습용 */
export const PROVIDER_MODELS: Record<Provider, { default: string; label: string }> = {
  gemini: {
    // 2026-04-15 시점: 2.0-flash 는 신규 사용자에게 차단됨 → 2.5-flash 로 이행
    default: "gemini-2.5-flash",
    label: "Google Gemini 2.5 Flash",
  },
  groq: {
    default: "llama-3.3-70b-versatile",
    label: "Groq Llama 3.3 70B",
  },
  webllm: {
    default: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
    label: "WebLLM Llama 3.2 1B (브라우저 내 실행)",
  },
};
