import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-hello";
import { lesson02 } from "./02-variables";
import { lesson03 } from "./03-operators";
import { lesson04 } from "./04-conditions";
import { lesson05 } from "./05-loops";
import { lesson06 } from "./06-arrays";
import { lesson07 } from "./07-objects";
import { lesson08 } from "./08-functions";
import { lesson09 } from "./09-strings";
import { lesson10 } from "./10-errors";
import { lesson11 } from "./11-mini-project";

/**
 * JavaScript 입문 트랙의 모든 레슨 (1~11 전체 완성).
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
  lesson10,
  lesson11,
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
