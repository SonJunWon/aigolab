import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-ai-in-browser";
import { lesson02 } from "./02-how-to-ask";
import { lesson03 } from "./03-structured-output";
import { lesson04 } from "./04-step-by-step";
import { lesson05 } from "./05-tools";
import { lesson06 } from "./06-single-agent";
import { lesson07 } from "./07-multi-agent";
import { lesson08 } from "./08-embeddings";
import { lesson09 } from "./09-rag-basics";
import { lesson10 } from "./10-hybrid-rag";
import { lesson11 } from "./11-llm-comparison";
import { lesson12 } from "./12-capstone";

/**
 * AI 엔지니어링 — 친화 버전 미리보기 트랙 (검토용).
 * 일반 사용자 친화 스타일(카드·비유·입력창·샘플 사례) 미리보기. 입문자 12강 완성.
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
