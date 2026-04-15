import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-webllm-intro";
import { lesson02 } from "./02-gemini-prompting";

/**
 * AI 엔지니어링 트랙 (beginner) — v4.0 Phase 1 범위 (Ch01~02).
 * 이후 Ch03~12 는 후속 Phase 에서 추가.
 */
export const LESSONS: Lesson[] = [lesson01, lesson02];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));
