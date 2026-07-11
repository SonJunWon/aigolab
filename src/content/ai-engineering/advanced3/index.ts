import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lessonA01 } from "./story/01-launch-is-the-start";
import { lessonA02 } from "./story/02-dashboard";
import { lessonA03 } from "./story/03-two-report-cards";
import { lessonA04 } from "./story/04-postmortem";
import { lessonA05 } from "./story/05-discipline-of-change";
import { lessonA06 } from "./story/06-ops-failure-clinic";

/**
 * AI 엔지니어링 — 고급3 "AI 에이전트 엔지니어링 ③ 평가·운영".
 *
 * 척추 개념: "달리게 만드는 것과 계속 달리게 하는 것은 다른 기술이다" —
 * 출시는 완성이 아니라 관측의 시작. 운영 루프 5국면(관측·평가·진단·개선·통제)을
 * 3개 깊이로 확대해 가는 3중 시리즈 (고급1 하네스·고급2 멀티에이전트의 완결편):
 *   시리즈 A "운영의 탄생"    (story/,    A1~A6, 누구나·코드 0줄·무료)   ← 완성
 *   시리즈 B "운영 지휘하기"  (handling/, B1~B8, AI 활용 비개발자·PRO)   ← 집필 예정
 *   시리즈 C "운영 만들기"    (building/, C1~C10, 개발자·PRO,
 *                              C7~C10 = 실전 아크 '코드리뷰 회사 운영 30일') ← 집필 예정
 *
 * order 대역: A=1~6, B=11~18, C=21~30.
 * 기획: AI앱개발/AI 엔지니어링 트랙/AI엔지니어링-고급3/01-고급3-평가운영-커리큘럼.md
 */
export const LESSONS: Lesson[] = [
  lessonA01,
  lessonA02,
  lessonA03,
  lessonA04,
  lessonA05,
  lessonA06,
];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));
