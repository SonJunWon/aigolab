import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-knowledge-vs-twin";
import { lesson02 } from "./02-context-engineering";
import { lesson03 } from "./03-persistent-knowledge-base";
import { lesson04 } from "./04-chunking-indexing";
import { lesson05 } from "./05-advanced-retrieval-rerank";
import { lesson06 } from "./06-accurate-citation";
import { lesson07 } from "./07-multiturn-knowledge-update";
import { lesson08 } from "./08-capstone-domain-twin";

/**
 * AI 엔지니어링 — 중급1 "지식과 컨텍스트" 트랙.
 * 척추 개념: 런타임 지식 트윈 (학습된 뇌 ↔ 컨텍스트 트윈).
 * 7강 + Capstone = 8강 완성.
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
];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));
