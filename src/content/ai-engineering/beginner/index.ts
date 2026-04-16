import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-webllm-intro";
import { lesson02 } from "./02-gemini-prompting";
import { lesson03 } from "./03-structured-output";
import { lesson04 } from "./04-chain-of-thought";
import { lesson05 } from "./05-tool-calling";
import { lesson06 } from "./06-single-agent";
import { lesson07 } from "./07-multi-agent";
import { lesson08 } from "./08-embeddings";
import { lesson09 } from "./09-rag-basics";
import { lesson10 } from "./10-hybrid-rag";
import { lesson11 } from "./11-llm-comparison";
import { lesson12 } from "./12-capstone-project";
import { WORKSHOP_LESSONS } from "../workshops";

/**
 * AI 엔지니어링 트랙 (beginner) — 12강 + 바이브 코딩 워크샵.
 *   Phase 1~5: Ch01~12 커리큘럼
 *   Workshops: W00~ 실전 프로젝트 빌드 가이드
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
  lesson12,
  ...WORKSHOP_LESSONS,
];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));
