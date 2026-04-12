import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-numpy";
import { lesson02 } from "./02-pandas-basics";
import { lesson03 } from "./03-pandas-advanced";
import { lesson04 } from "./04-matplotlib";
import { lesson05 } from "./05-data-pipeline";

/**
 * Python 데이터 과학 트랙의 모든 레슨.
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
