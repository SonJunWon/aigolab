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
 * AI 엔지니어링 트랙 (beginner) — 12강 완성.
 *   Phase 1 (v4.0~): Ch01 WebLLM · Ch02 Gemini
 *   Phase 2 (v4.3):  Ch03 구조화 · Ch04 CoT · Ch05 Tool
 *   Phase 3 (v4.4):  Ch06 단일 에이전트 · Ch07 멀티 에이전트
 *   Phase 4 (v4.5):  Ch08 임베딩 · Ch09 RAG · Ch10 Hybrid RAG
 *   Phase 5 (v4.6):  Ch11 생태계 비교 · Ch12 종합 프로젝트
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
