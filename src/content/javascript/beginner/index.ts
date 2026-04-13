import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-hello";
import { lesson02 } from "./02-variables";
import { lesson03 } from "./03-operators";
import { lesson04 } from "./04-conditions";
import { lesson05 } from "./05-loops";
import { lesson06 } from "./06-arrays";

/**
 * JavaScript 입문 트랙의 모든 레슨.
 * 첫·두 번째 묶음(1~6챕터) 공개. 후속(7~11)은 점진적으로 추가될 예정.
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
