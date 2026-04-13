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

/**
 * JavaScript 입문 트랙의 모든 레슨.
 * 1~9 챕터 공개. 마무리(10 에러처리, 11 미니 프로젝트)는 다음 묶음에서.
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
