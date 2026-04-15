/**
 * 학습 콘텐츠 도메인 타입
 */

import type { Quiz } from "./quiz";
import type { Trace } from "../lib/llm/types";

/**
 * 지원 언어 — 런타임/콘텐츠 둘 다 이 타입을 사용.
 * 새 언어 추가 시: 이 유니온 + content/languages.ts + runtime/registry.ts 동시에.
 *
 * "ai-engineering" 은 코드 런타임이 TypeScript(LLM 셀 전용)이라
 * registry 에는 별도 런타임 등록 없이 동작 — T9 LLM 셀 런타임 참조.
 */
export type Language = "python" | "javascript" | "sql" | "ai-engineering";
export type Track = "beginner" | "intermediate" | "data-science" | "ml-practice";

/** 콘텐츠의 언어 메타데이터 */
export interface LanguageInfo {
  id: Language;
  name: string;       // "Python"
  icon: string;       // 이모지
  description: string;
  status: "available" | "coming-soon";
  color: string;      // Tailwind 색상 클래스 (gradient)
}

/** 트랙 메타데이터 */
export interface TrackInfo {
  id: Track;
  name: string;       // "입문자"
  description: string;
  estimatedHours?: number;
}

/**
 * 레슨 = 미리 짜여진 노트북 셀들의 묶음.
 *
 * 사용자가 이 레슨을 열면 notebookStore에 cells가 주입되고,
 * 기존 Colab 스타일 노트북 UI가 그대로 동작한다.
 */
export interface Lesson {
  id: string;                 // "python-beginner-01"
  language: Language;
  track: Track;
  order: number;              // 1, 2, 3...
  title: string;              // "첫 번째 Python 코드"
  subtitle?: string;          // 한 줄 요약
  estimatedMinutes: number;
  /** 노트북에 주입할 초기 셀들 */
  cells: LessonCell[];
  /** 챕터 끝 이해도 퀴즈 (선택적) */
  quiz?: Quiz;
}

/**
 * 레슨 셀 — Notebook 의 Cell 과 비슷하지만 초기값만 갖는 경량 형태.
 * Discriminated union — `type` 으로 분기해서 `source` 외 필드 안전 접근.
 */
export type LessonCell =
  | LessonMarkdownCell
  | LessonCodeCell
  | LessonLlmCodeCell;

export interface LessonMarkdownCell {
  type: "markdown";
  source: string;
  /** 마크다운 셀엔 보통 사용 안 하지만 구조 통일 위해 허용 */
  hints?: string[];
  solution?: string;
}

export interface LessonCodeCell {
  type: "code";
  source: string;
  hints?: string[];
  /** 최종 정답 코드 — "정답 보기" 클릭 시 source 로 주입 */
  solution?: string;
}

/**
 * LLM 셀 — TypeScript 런타임 (T9) 에서 `@/lib/llm` API 를 호출하는 셀.
 * 기존 code 셀과 분리한 이유:
 *   - 언어가 다르다 (TS vs Python/JS/SQL)
 *   - 키 없는 학생을 위한 simulation 녹화본이 셀 단위로 첨부됨
 */
export interface LessonLlmCodeCell {
  type: "llm-code";
  source: string;
  /** 현재는 "typescript" 고정 — 미래 확장 여지 유지 */
  language: "typescript";
  /**
   * 키 없을 때 재생용 녹화본 (T10). 셀 내 `chat()` 호출 수만큼 Trace 를 배열로 준비.
   * notebook Cell / store 의 simulation 과 같은 shape 를 공유한다.
   */
  simulation?: {
    traces: Trace[];
    /** 학생에게 보여줄 안내 (예: "시뮬레이션 재생 중") */
    note?: string;
  };
  hints?: string[];
  solution?: string;
}

/** 레슨 요약 정보 (커리큘럼 페이지에서 사용) */
export interface LessonSummary {
  id: string;
  order: number;
  title: string;
  subtitle?: string;
  estimatedMinutes: number;
}
