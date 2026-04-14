import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-regression";
import { lesson02 } from "./02-classification";
import { lesson03 } from "./03-evaluation";
import { lesson04 } from "./04-clustering";
import { lesson05 } from "./05-pipeline";
import { lesson06 } from "./06-preprocessing";
import { lesson07 } from "./07-trees-ensembles";
import { lesson08 } from "./08-boosting-regularization";
import { lesson09 } from "./09-interpretation-imbalanced";
import { lesson10 } from "./10-mini-project";

/**
 * Python ML 실습 트랙의 모든 레슨 (10강 완주 코스).
 * 1~5강 기초(회귀/분류/평가/클러스터/파이프라인) → 6~10강 실전
 * (전처리·앙상블·부스팅·해석·미니프로젝트).
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
