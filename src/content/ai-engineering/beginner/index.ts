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

/**
 * AI 엔지니어링 트랙 (beginner) — 12강만.
 * 바이브코딩 워크샵은 workshops/index.ts 에서 별도 관리 → /ai-dev/workshop 라우트.
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
];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));
