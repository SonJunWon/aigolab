import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lessonA01 } from "./story/01-what-is-harness";
import { lessonA02 } from "./story/02-the-loop";
import { lessonA03 } from "./story/03-tools";
import { lessonA04 } from "./story/04-desk-and-notebook";
import { lessonA05 } from "./story/05-seatbelt";
import { lessonA06 } from "./story/06-failure-clinic";

/**
 * AI 엔지니어링 — 고급1 "AI 에이전트 엔지니어링 ① 하네스 엔지니어링".
 *
 * 척추 개념: "같은 뇌, 다른 몸" — 에이전트 = 모델(뇌) + 하네스(몸).
 * 5대 기관(루프·도구·컨텍스트·기억·가드레일) 지도를 3개 깊이로 확대해 가는 3중 시리즈:
 *   시리즈 A "하네스 이야기"  (story/,    A1~A6, 누구나·코드 0줄·무료)   ← 현재 배포분
 *   시리즈 B "하네스 다루기"  (handling/, B1~B8, AI 활용 비개발자·PRO)   ← 집필 예정
 *   시리즈 C "하네스 만들기"  (building/, C1~C10, 개발자·PRO)            ← 집필 예정
 *
 * order 대역: A=1~6, B=11~18, C=21~30 (시리즈 간 여유 슬롯).
 * 기획: AI앱개발/AI 엔지니어링 트랙/AI엔지니어링-고급1/01-고급1-하네스엔지니어링-커리큘럼.md
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
