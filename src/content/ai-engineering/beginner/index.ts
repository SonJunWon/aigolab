import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-webllm-intro";
import { lesson02 } from "./02-gemini-prompting";
import { lesson03 } from "./03-structured-output";
import { lesson04 } from "./04-chain-of-thought";
import { lesson05 } from "./05-tool-calling";
import { lesson06 } from "./06-single-agent";
import { lesson07 } from "./07-multi-agent";

/**
 * AI 엔지니어링 트랙 (beginner).
 *   Phase 1 (v4.0~): Ch01 WebLLM · Ch02 Gemini
 *   Phase 2 (v4.3): Ch03 구조화 출력 · Ch04 CoT · Ch05 Tool Calling
 *   Phase 3 (v4.4): Ch06 단일 에이전트 · Ch07 멀티 에이전트
 *   Phase 4~5 후속
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
