import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-robust-agent";
import { lesson02 } from "./02-orchestration";
import { lesson03 } from "./03-memory-context";
import { lesson04 } from "./04-real-tools-hitl";
import { lesson05 } from "./05-evaluation-observability";
import { lesson06 } from "./06-cost-speed-security";
import { lesson07 } from "./07-capstone-deployable-agent";

/**
 * AI 엔지니어링 — 중급2 "에이전틱" 트랙.
 * 척추 개념: 지식 트윈(중급1)에 손발을 단다 — 도구·오케스트레이션·HITL·평가·운영.
 * 6강 + Capstone = 7강.
 */
export const LESSONS: Lesson[] = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
  lesson07,
];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));
