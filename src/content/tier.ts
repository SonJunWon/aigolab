/**
 * 콘텐츠 티어 분류 — 무료(free) vs 유료(pro).
 *
 * 모든 콘텐츠는 로그인 필수. 로그인 후 FREE/PRO 구분.
 *
 * 분류 규칙 (2026-04-18, v4.10+):
 * ─────────────────────────────────────────────────────────
 *  FREE (로그인만 하면 이용 가능):
 *   - Python 입문 (beginner) 트랙 전체
 *   - JavaScript 입문 / SQL 입문 전체
 *   - AI 강의 01~06 (생성형 AI / LLM 원리까지)
 *   - AI 프로젝트 2개: iris-classification, titanic-survival
 *   - AI 엔지니어링 12강 중 Ch01~02
 *   - 바이브코딩 워크샵 W00(환경설정) + Phase 1(W01~W06, 기초)
 *
 *  PRO (구독/구매 필요):
 *   - Python 중급 · 데이터 과학 · ML 실습 트랙 전체
 *   - AI 강의 07~10 (프롬프트/비전/윤리/에이전트)
 *   - AI 프로젝트 11개 (iris/titanic 제외)
 *   - AI 엔지니어링 12강 중 Ch03~12
 *   - 바이브코딩 워크샵 Phase 2~8 (W07~W40, 실전 도구 이상)
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
 * AI 엔지니어링 트랙 내 무료 레슨 ID — 나머지 Ch03~12 는 모두 pro.
 */
export const FREE_AI_ENG_LESSON_IDS: ReadonlySet<string> = new Set([
  "ai-eng-01-webllm-intro",
  "ai-eng-02-gemini-prompting",
]);

/**
 * 바이브코딩 워크샵 무료 범위.
 * W00(환경설정, order 99~100) + Phase 1(W01~W06, order 101~106) = FREE
 * Phase 2 이상(W07~W40, order 107+) = PRO
 */
export function isWorkshopPro(lessonOrder: number): boolean {
  return lessonOrder >= 107;
}

/**
 * 레슨(코딩 실습)이 pro 인지 판단.
 *
 * 규칙:
 *   - Python beginner: 무료. 중급 이상: pro.
 *   - JavaScript / SQL: 현재 beginner만 있어 모두 무료.
 *   - ai-engineering: Ch01~02 무료, Ch03~12 pro.
 *     워크샵 레슨(order>=99)은 isWorkshopPro()로 별도 판단.
 */
export function isLessonPro(
  lang: Language,
  track: Track,
  lessonId?: string,
  lessonOrder?: number,
): boolean {
  if (lang === "python" && track !== "beginner") return true;
  if (lang === "ai-engineering") {
    // 워크샵 레슨 (order >= 99)
    if (lessonOrder !== undefined && lessonOrder >= 99) {
      return isWorkshopPro(lessonOrder);
    }
    // 일반 AI 엔지니어링 레슨
    if (!lessonId) return true;
    return !FREE_AI_ENG_LESSON_IDS.has(lessonId);
  }
  return false;
}

/** 트랙 자체가 pro 인지 (커리큘럼 페이지에서 트랙 카드에 배지 노출) */
export function isTrackPro(lang: Language, track: Track): boolean {
  if (lang === "ai-engineering") return false;
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
