import type { Lesson, LessonSummary } from "../../../types/lesson";
// ── Ch00~13: 친화 하이브리드 버전으로 대체 ─────────────────────────────
// 친화 파일(../friendly-intro/NN)은 원본 코드 셀(llm-code)·퀴즈를 그대로 재사용하고
// 설명만 친화 카드로 감싼 "하이브리드"(코드 유지 + 친화 톤). 기존 코드판 파일
// (./NN-*.ts)은 그대로 보존되며, 친화 파일이 그 코드 셀을 import 해 재사용한다.
// (친화 파일이 ./NN-*.ts 를 직접 참조하므로 index 를 통한 순환 import 는 없다.)
import { lesson00 } from "../friendly-intro/00-getting-started";
import { lesson01 } from "../friendly-intro/01-first-chat";
import { lesson02 } from "../friendly-intro/02-ai-writing";
import { lesson03 } from "../friendly-intro/03-ai-drawing";
import { lesson04 } from "../friendly-intro/04-ai-principles";
import { lesson05 } from "../friendly-intro/05-prompt-engineering";
import { lesson06 } from "../friendly-intro/06-markdown";
import { lesson07 } from "../friendly-intro/07-ai-types";
import { lesson08 } from "../friendly-intro/08-file-extensions";
import { lesson09 } from "../friendly-intro/09-internet-api";
import { lesson10 } from "../friendly-intro/10-coding-basics";
import { lesson11 } from "../friendly-intro/11-dev-tools";
import { lesson12 } from "../friendly-intro/12-vibe-coding";
import { lesson13 } from "../friendly-intro/13-next-steps";

/**
 * AI 입문 준비 과정 (intro) — Ch00~Ch13 (14강), 친화 하이브리드.
 * 대상: AI/코딩 경험 없는 초보자. 친화 설명 카드 + 기존 코드 셀(실행 실습) 유지.
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
