import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-ai-in-browser";
import { lesson02 } from "./02-how-to-ask";

/**
 * AI 엔지니어링 — 친화 버전 미리보기 트랙 (검토용).
 * 일반 사용자 친화 스타일(카드·비유·입력창·샘플 사례) 2강 미리보기.
 */
export const LESSONS: Lesson[] = [lesson01, lesson02];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));
