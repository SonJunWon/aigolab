/**
 * 학습 콘텐츠 도메인 타입
 */

import type { Quiz } from "./quiz";

/**
 * 지원 언어 — 런타임/콘텐츠 둘 다 이 타입을 사용.
 * 새 언어 추가 시: 이 유니온 + content/languages.ts + runtime/registry.ts 동시에.
 */
export type Language = "python" | "javascript" | "sql";
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

/** 레슨 셀 — Notebook 의 Cell 과 비슷하지만 초기값만 갖는 경량 형태 */
export interface LessonCell {
  type: "markdown" | "code";
  source: string;
  /** 학습자에게 단계적으로 공개할 힌트 (코드 셀에만 의미 있음) */
  hints?: string[];
  /** 최종 정답 코드 — 사용자가 "정답 보기" 클릭 시 source에 주입 */
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
