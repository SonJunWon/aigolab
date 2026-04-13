import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-hello";
import { lesson02 } from "./02-where";
import { lesson03 } from "./03-order-limit";
import { lesson04 } from "./04-expressions";
import { lesson05 } from "./05-like-null";
import { lesson06 } from "./06-aggregates";

/**
 * SQL 입문 트랙의 모든 레슨. 1~6 공개. 후속(7~10)은 다음 묶음에서.
 */
export const LESSONS: Lesson[] = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
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
