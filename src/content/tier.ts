/**
 * 콘텐츠 티어 분류 — 무료(free) vs 유료(pro).
 *
 * Phase 1: UI 배지 + paywall 모달만 노출. 결제 연동 없음 — 누구나 URL 직접 접근은 가능.
 *
 * 분류 규칙 (2026-04-14, v3.15.0 Phase 1):
 * ─────────────────────────────────────────────────────────
 *  FREE:
 *   - Python 입문 (beginner) 트랙 전체
 *   - JavaScript 입문 / SQL 입문 전체
 *   - AI 강의 01~06 (생성형 AI / LLM 원리까지)
 *   - AI 프로젝트 2개: iris-classification, titanic-survival
 *   - 마이페이지 / 플레이그라운드 / 홈 / 약관 / 로그인
 *
 *  PRO (곧 오픈 예정):
 *   - Python 중급 · 데이터 과학 · ML 실습 트랙 전체
 *   - AI 강의 07~10 (프롬프트/비전/윤리/에이전트)
 *   - AI 프로젝트 11개 (iris/titanic 제외)
 * ─────────────────────────────────────────────────────────
 */

import type { Language, Track } from "../types/lesson";

/** 무료 AI 강의 ID — 나머지는 모두 pro */
export const FREE_COURSE_IDS: ReadonlySet<string> = new Set([
  "what-is-ai",
  "ml-basics",
  "data-and-ai",
  "deep-learning-basics",
  "nlp-basics",
  "generative-ai",
]);

/** 무료 AI 프로젝트 ID — 나머지는 모두 pro */
export const FREE_PROJECT_IDS: ReadonlySet<string> = new Set([
  "iris-classification",
  "titanic-survival",
]);

/**
 * 레슨(코딩 실습)이 pro 인지 판단.
 *
 * 규칙: Python 의 beginner 트랙만 무료. 중급·데이터 과학·ML 실습은 pro.
 * JavaScript / SQL 은 현재 beginner 만 있어 모두 무료.
 */
export function isLessonPro(lang: Language, track: Track): boolean {
  if (lang === "python" && track !== "beginner") return true;
  return false;
}

/** 트랙 자체가 pro 인지 (커리큘럼 페이지에서 트랙 카드에 배지 노출) */
export function isTrackPro(lang: Language, track: Track): boolean {
  return isLessonPro(lang, track);
}

/** AI 강의가 pro 인지 */
export function isCoursePro(courseId: string): boolean {
  return !FREE_COURSE_IDS.has(courseId);
}

/** AI 프로젝트가 pro 인지 */
export function isProjectPro(projectId: string): boolean {
  return !FREE_PROJECT_IDS.has(projectId);
}
