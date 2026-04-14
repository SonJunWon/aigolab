import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-numpy";
import { lesson02 } from "./02-pandas-basics";
import { lesson03 } from "./03-pandas-advanced";
import { lesson04 } from "./04-matplotlib";
import { lesson05 } from "./05-data-pipeline";
import { lesson06 } from "./06-data-cleaning";
import { lesson07 } from "./07-strings-dates";
import { lesson08 } from "./08-joining";
import { lesson09 } from "./09-groupby-advanced";
import { lesson10 } from "./10-mini-project";

/**
 * Python 데이터 과학 트랙의 모든 레슨 (10강 완주 코스).
 * 1~5강 기초 편 → 6~10강 실전 편(정제/날짜·문자열/결합/그룹심화/미니 프로젝트).
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
