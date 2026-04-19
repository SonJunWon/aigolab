import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson00 } from "./00-getting-started";

/**
 * AI 입문 준비 과정 (intro) — Ch00~Ch12 (13강)
 * 대상: AI/코딩 경험 없는 초보자 (초등 4~6학년 수준)
 */
export const LESSONS: Lesson[] = [
  lesson00,
];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));
