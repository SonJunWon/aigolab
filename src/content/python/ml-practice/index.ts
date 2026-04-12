import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-regression";
import { lesson02 } from "./02-classification";
import { lesson03 } from "./03-evaluation";
import { lesson04 } from "./04-clustering";
import { lesson05 } from "./05-pipeline";

/**
 * Python ML 실습 트랙의 모든 레슨.
 */
export const LESSONS: Lesson[] = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
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
