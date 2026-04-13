import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-hello";
import { lesson02 } from "./02-where";
import { lesson03 } from "./03-order-limit";

/**
 * SQL 입문 트랙의 모든 레슨.
 * 첫 묶음(1~3챕터) 공개. 후속 챕터(4~10)는 점진적으로 추가될 예정.
 */
export const LESSONS: Lesson[] = [
  lesson01,
  lesson02,
  lesson03,
];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
