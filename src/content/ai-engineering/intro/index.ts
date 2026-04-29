import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson00 } from "./00-getting-started";
import { lesson01 } from "./01-first-chat";
import { lesson02 } from "./02-ai-writing";
import { lesson03 } from "./03-ai-drawing";
import { lesson04 } from "./04-ai-principles";
import { lesson05 } from "./05-prompt-engineering";
import { lesson06 } from "./06-markdown";
import { lesson07 } from "./07-ai-types";
import { lesson08 } from "./08-file-extensions";
import { lesson09 } from "./09-internet-api";
import { lesson10 } from "./10-coding-basics";
import { lesson11 } from "./11-dev-tools";
import { lesson12 } from "./12-vibe-coding";
import { lesson13 } from "./13-next-steps";

/**
 * AI 입문 준비 과정 (intro) — Ch00~Ch13 (14강)
 * 대상: AI/코딩 경험 없는 초보자 (초등 4~6학년 수준)
 */
export const LESSONS: Lesson[] = [
  lesson00,
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
  lesson13,
];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));
