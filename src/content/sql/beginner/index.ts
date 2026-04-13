import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-hello";
import { lesson02 } from "./02-where";
import { lesson03 } from "./03-order-limit";
import { lesson04 } from "./04-expressions";
import { lesson05 } from "./05-like-null";
import { lesson06 } from "./06-aggregates";
import { lesson07 } from "./07-group-by";
import { lesson08 } from "./08-joins";
import { lesson09 } from "./09-subqueries";

/**
 * SQL 입문 트랙의 모든 레슨. 1~9 공개. 미니 프로젝트(10)는 마지막 묶음에서.
 */
export const LESSONS: Lesson[] = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
  lesson07,
  lesson08,
  lesson09,
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
